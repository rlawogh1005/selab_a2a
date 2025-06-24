import { Injectable, Logger } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { firstValueFrom } from 'rxjs';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { specialistAgentTools } from '../tools/main-agent-tools';
import { MainAgentRequestContextDto } from '../dto/main-agent-request-context.dto';
import { Task } from '@a2a-js/sdk';
import { createCompletedTask, createFailedTask } from '../dto/main-agent-response-task.dto';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class MainAgentExecutorProvider {
  private readonly logger = new Logger(MainAgentExecutorProvider.name);
  private readonly model: any; // Gemini Model
  private readonly agentEndpoints: Record<string, string>; // env에 따라 동적으로 결정

  /**
   * contextId 별 대화 히스토리를 저장 (In-memory)
   * - Message 배열과 lastUsed 타임스탬프를 보존
   * - TTL이 지나면 자동 만료
   */
  private readonly conversations = new Map<
    string,
    { messages: any[]; lastUsed: number }
  >();

  // 기본 30분, 환경변수 MAIN_CONV_TTL_MS 로 재정의 가능
  private readonly CONV_TTL_MS = Number(process.env.MAIN_CONV_TTL_MS || 30 * 60 * 1000);

  constructor(
    private readonly httpService: HttpService,
    private readonly configService: ConfigService,
  ) {
    const apiKey = this.configService.get<string>('GEMINI_API_KEY');
    if (!apiKey) {
      throw new Error('GEMINI_API_KEY is not set in the environment variables.');
    }
    const genAI = new GoogleGenerativeAI(apiKey);
    this.model = genAI.getGenerativeModel({
      model: 'gemini-1.5-flash-latest',
      tools: specialistAgentTools,
    });
    this.agentEndpoints = {
      maru_agent: this.configService.get<string>('AGENT_MARU_ENDPOINT', ''),
      sodam_agent: this.configService.get<string>('AGENT_SODAM_ENDPOINT', ''),
    };
  }

  async executeTask(requestContextDto: MainAgentRequestContextDto): Promise<Task> {
    const userPrompt =
      (
        requestContextDto.userMessage.parts.find(p => 'text' in p) as {
          text: string;
        }
      )?.text || '';
    this.logger.log(`Orchestration started for prompt: "${userPrompt}"`);

    try {
      const contextId = requestContextDto.contextId || 'default';

      // 기존 히스토리 가져오기 + TTL 체크
      let entry = this.conversations.get(contextId);
      if (entry && Date.now() - entry.lastUsed > this.CONV_TTL_MS) {
        this.conversations.delete(contextId);
        entry = undefined;
      }

      let conversationHistory: any[] = entry?.messages || [];

      // 이번 사용자 메시지 추가
      conversationHistory = [...conversationHistory, requestContextDto.userMessage];

      // Gemini 대화 히스토리 포맷으로 변환
      const geminiHistory = conversationHistory.map(msg => {
        const text = (msg.parts.find((p: any) => 'text' in p) as { text: string })?.text || '';
        return {
          role: msg.role === 'agent' ? 'model' : 'user',
          parts: [{ text }],
        } as { role: 'user' | 'model'; parts: { text: string }[] };
      });

      // 1. LLM에게 계획 수립 요청 (의도 분석) - 어떤 에이전트를 호출해야 하는지 결정
      const chat = this.model.startChat({
        history: geminiHistory,
        systemInstruction: {
          role: 'system',
          parts: [{ text:
            // Main-agent의 시스템 메시지
`
## 0. Important Instructions
- You must always call maru_agent first.
- Never, ever, answer the user's question directly.

## 1. Identity and Core Mission
- You are the central routing agent in an Agent-to-Agent (A2A) system.
- Your **exclusive mission** is to analyze the user's request and select the single most appropriate Sub-Agent to handle it.

## 2. Available Sub-Agents (Tool List)
This is the list of Sub-Agents you can dispatch tasks to. Analyze the user's query and choose **only one** from this list.

- **'maru_agent' (Highest Priority)**
  - **Role:** Primary Travel Planner.
  - **Description:** This is the main, highest-priority agent for handling all comprehensive travel-related tasks. This includes creating itineraries, coordinating schedules, and providing information on flights or accommodations. If a user's request is framed within a travel context, you must choose this agent, even if it also mentions specific activities like dining or shopping.
  - **Keywords:** "trip", "travel", "itinerary", "plan my vacation", "schedule for 2 days", "visit", "tour", "holiday", "getaway", "여행", "여행지", "여행 계획", "일정", "스케줄", "휴가", "관광", "여행 코스".

- **'sodam_agent' (Standard Priority)**
  - **Role:** Restaurant and Food Specialist.
  - **Description:** Use this agent only when the user's request is exclusively about finding restaurants, cafes, or specific food recommendations, and is not part of a broader travel planning request.
  - **Keywords:** "restaurant", "food", "eat", "dining", "cafe", "tasty", "recommend a place to eat", "맛집", "식당", "음식", "밥집", "카페", "레스토랑", "추천", "먹거리".
` }],
        },
      });
      const result = await chat.sendMessage(userPrompt);
      const llmResponse = result.response;
      const functionCalls = llmResponse.functionCalls();

      // sub-agent 없이 응답해도 되겠다.
      if (!functionCalls || functionCalls.length === 0) {
        // LLM이 에이전트 호출 없이 직접 답변하기로 결정했지만 시스템 정책상 허용되지 않음 -> maru_agent 로 포워딩
        this.logger.warn('LLM returned no function call. Falling back to maru_agent.');

        const fallbackAgentName = 'maru_agent';
        const agentUrl = this.agentEndpoints[fallbackAgentName];

        if (!agentUrl) {
          this.logger.error('maru_agent endpoint is not configured.');
          return createFailedTask('maru_agent endpoint not configured', requestContextDto);
        }

        const subUserMessage = {
          kind: 'message',
          role: 'user',
          parts: [{ kind: 'text', text: userPrompt }],
        } as any;

        const subtaskPayload = {
          contextId,
          history: conversationHistory, // 이전까지의 히스토리
          userMessage: subUserMessage,
        };

        try {
          const agentResponse = await firstValueFrom(this.httpService.post(agentUrl, subtaskPayload));
          const agentAnswer = this.extractTextFromResponse(agentResponse, `[${fallbackAgentName} 응답 실패]`);

          const agentMessage = {
            kind: 'message',
            role: 'agent',
            parts: [{ kind: 'text', text: agentAnswer }],
          } as any;

          const updatedHistory = [...conversationHistory, subUserMessage, agentMessage];

          // 히스토리 저장
          this.conversations.set(contextId, {
            messages: updatedHistory,
            lastUsed: Date.now(),
          });

          // 사용자에게 반환할 응답에는 직전 sub-agent 의 응답만 포함하도록, history 를 제거한 컨텍스트를 전달
          return createCompletedTask(
            agentAnswer,
            {
              userMessage: requestContextDto.userMessage,
              contextId: requestContextDto.contextId,
              task: requestContextDto.task,
            },
            'maru',
          );
        } catch (error) {
          this.logger.error(`Fallback agent call failed: ${error.message}`, error.stack);
          return createFailedTask(`Fallback agent call failed: ${error.message}`, requestContextDto, 'maru');
        }
      }

      this.logger.log(`LLM planned to call: ${functionCalls.map(c => c.name).join(', ')}`);

      const firstCall = functionCalls[0];
      const agentName = firstCall.name;
      const agentUrl = this.agentEndpoints[agentName];

      if (!agentUrl) {
        this.logger.warn(`Unknown agent requested by LLM: ${agentName}`);
        return createFailedTask('Unknown Agent selected', requestContextDto);
      }

      // sub-agent 호출용 페이로드 구성 (현재 히스토리 + 새 userMessage)
      const subUserMessage = {
        kind: 'message',
        role: 'user',
        parts: [{ kind: 'text', text: firstCall.args?.query || userPrompt }],
      } as any;

      const subtaskPayload = {
        contextId,
        history: conversationHistory, // 이전까지의 히스토리
        userMessage: subUserMessage,
      };

      const agentResponse = await firstValueFrom(this.httpService.post(agentUrl, subtaskPayload));

      const agentAnswer = this.extractTextFromResponse(agentResponse, `[${agentName} 응답 실패]`);

      const personaMap: Record<string, string> = {
        maru_agent: 'maru',
        sodam_agent: 'sodam',
      };

      const personaId = personaMap[agentName] || 'maru';

      const agentMessage = {
        kind: 'message',
        role: 'agent',
        parts: [{ kind: 'text', text: agentAnswer }],
      } as any;

      const updatedHistory = [...conversationHistory, subUserMessage, agentMessage];

      // 히스토리 저장
      this.conversations.set(contextId, {
        messages: updatedHistory,
        lastUsed: Date.now(),
      });

      // 사용자에게 반환할 응답에는 직전 sub-agent 의 응답만 포함하도록, history 를 제거한 컨텍스트를 전달
      return createCompletedTask(
        agentAnswer,
        {
          userMessage: requestContextDto.userMessage,
          contextId: requestContextDto.contextId,
          task: requestContextDto.task,
        },
        personaId,
      );
    } catch (error) {
      this.logger.error(`Orchestration failed: ${error.message}`, error.stack);
      return createFailedTask(
        `오케스트레이션 중 오류 발생: ${error.message}`,
        requestContextDto,
        'maru', // 기본 페르소나
      );
    }
  }

  private extractTextFromResponse(response: any, fallbackText: string): string {
    // 다양한 응답 구조에 대응
    return (
      response?.data?.status?.message?.parts?.[0]?.text ||
      response?.data?.result?.parts?.[0]?.text ||
      fallbackText
    );
  }
}