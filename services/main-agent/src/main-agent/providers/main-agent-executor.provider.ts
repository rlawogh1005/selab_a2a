import { Injectable, Logger } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { firstValueFrom } from 'rxjs';
import { GoogleGenerativeAI, Part } from '@google/generative-ai';
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
      weather_agent: this.configService.get<string>('AGENT_WEATHER_ENDPOINT', ''),
      food_agent: this.configService.get<string>('AGENT_FOOD_ENDPOINT', ''),
      maru_agent: this.configService.get<string>('AGENT_MARU_ENDPOINT', ''),
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
      // 1. LLM에게 계획 수립 요청 (의도 분석) - 'sub-agent가 필요하다'
      const chat = this.model.startChat({
        systemInstruction: {
          role: 'system',
          parts: [{ text:
`넌 오케스트레이터다. 넌 weather-agent와 food-agent, maru-agent를 호출할 수 있다.

각 에이전트를 호출할 때 반드시 적절한 personaId를 포함해야 한다:
- weather_agent: personaId는 "sodam" (전문적이고 정확한 날씨 정보 제공)
- food_agent: personaId는 "sori" (편안하고 친근한 음식 정보 제공)  
- maru_agent: personaId는 "maru" (따뜻하고 친근한 일상 대화)

예시:
- 날씨 관련 질문 → weather_agent 호출 시 personaId: "sodam"
- 음식 관련 질문 → food_agent 호출 시 personaId: "sori"
- 일반 대화 → maru_agent 호출 시 personaId: "maru"` }],
        },
      });
      const result = await chat.sendMessage(userPrompt);
      const llmResponse = result.response;
      const functionCalls = llmResponse.functionCalls();

      // sub-agent 없이 응답해도 되겠다.
      if (!functionCalls || functionCalls.length === 0) {
        // LLM이 에이전트 호출 없이 직접 답변하기로 결정한 경우
        this.logger.log('LLM decided to answer directly.');
        return createCompletedTask(llmResponse.text(), requestContextDto, 'maru'); // 기본 페르소나
      }

      this.logger.log(`LLM planned to call: ${functionCalls.map(c => c.name).join(', ')}`);

      // 2. LLM의 계획에 따라 '선택적'으로 A2A 요청 프로미스 생성
      const agentPromises = functionCalls.map(call => {
        const agentName = call.name;
        const agentUrl = this.agentEndpoints[agentName];
        if (!agentUrl) {
          this.logger.warn(`Unknown agent requested by LLM: ${agentName}`);
          return Promise.resolve({ error: 'Unknown Agent', agentName });
        }

        const subtaskPayload = {
      ...requestContextDto, // Pass context first
          userMessage: {
            kind: 'message',
            role: 'user',
            parts: [{ kind: 'text', text: JSON.stringify(call.args) }],
          },
        };

        return firstValueFrom(this.httpService.post(agentUrl, subtaskPayload));
      });

      // 3. 선택된 에이전트들에게만 병렬로 요청 전송
      const agentResponses = await Promise.all(agentPromises);

      // 4. 각 전문가의 응답을 LLM이 이해할 수 있는 형태로 가공
      const toolResponses: Part[] = agentResponses.map((response, index) => {
        const functionName = functionCalls[index].name;
        const agentResult = this.extractTextFromResponse(response, `[${functionName} 응답 실패]`);
        return {
          functionResponse: {
            name: functionName,
            response: { content: agentResult },
          },
        };
      });

      // 5. 전문가들의 응답을 다시 LLM에게 보내 최종 답변 종합
      this.logger.log('Synthesizing final response from agent results...');
      const finalResult = await chat.sendMessage(toolResponses);
      const finalResponseText = finalResult.response.text();

      // personaId 추출 (첫 번째 function call에서)
      const personaId = functionCalls[0]?.args?.personaId || null;
      this.logger.log(`Using personaId: ${personaId}`);

      return createCompletedTask(finalResponseText, requestContextDto, personaId);
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