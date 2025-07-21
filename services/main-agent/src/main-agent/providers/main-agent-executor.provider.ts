import { Injectable, Logger, Inject } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { firstValueFrom } from 'rxjs';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { specialistAgentTools } from '../tools/main-agent-tools';
import { MainAgentRequestContextDto } from '../dto/main-agent-request-context.dto';
import { Task } from '@a2a-js/sdk';
import { createCompletedTask, createFailedTask } from '../dto/main-agent-response-task.dto';
import { ConfigService } from '@nestjs/config';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Cache } from 'cache-manager';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Requirement } from '../entities/requirement.entity';
import { ConversationHistory } from '../entities/conversation-history.entity';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class MainAgentExecutorProvider {
    private readonly logger = new Logger(MainAgentExecutorProvider.name);
    private readonly model: any; // Gemini Model
    private readonly agentEndpoints: Record<string, string>; // env에 따라 동적으로 결정

    // 기본 30분, 환경변수 MAIN_CONV_TTL_MS 로 재정의 가능
    private readonly CONV_TTL_MS = Number(process.env.MAIN_CONV_TTL_MS || 30 * 60 * 1000);

    constructor(
        private readonly httpService: HttpService,
        private readonly configService: ConfigService,
        @Inject(CACHE_MANAGER) private readonly cache: Cache,
        @InjectRepository(Requirement)
        @InjectRepository(ConversationHistory)
        private readonly requirementRepo: Repository<Requirement>,
        private readonly convHistoryRepo: Repository<ConversationHistory>,
    ) {
        // 제미나이 키설정
        const apiKey = this.configService.get<string>('GEMINI_API_KEY');
        if (!apiKey) {
            throw new Error('GEMINI_API_KEY is not set in the environment variables.');
        }
        const genAI = new GoogleGenerativeAI(apiKey);
        // 제미나이 모델 설정
        this.model = genAI.getGenerativeModel({
            model: 'gemini-2.5-flash',
            tools: specialistAgentTools,
        });
        // 서브-에이전트 엔드포인트 설정
        this.agentEndpoints = {
            developer_agent: this.configService.get<string>('AGENT_DEVELOPER_ENDPOINT', ''),
            // designer_agent: this.configService.get<string>('AGENT_DESIGNER_ENDPOINT', ''),
            // tester_agent: this.configService.get<string>('AGENT_TESTER_ENDPOINT', ''),
            // project_manager_agent: this.configService.get<string>('AGENT_PROJECT_MANAGER_ENDPOINT', ''),
            // user_agent: this.configService.get<string>('AGENT_USER_ENDPOINT', ''),
            // client_agent: this.configService.get<string>('AGENT_CLIENT_ENDPOINT', ''),
            // product_owner_agent: this.configService.get<string>('AGENT_PRODUCT_OWNER_ENDPOINT', ''),
            // sales_agent: this.configService.get<string>('AGENT_SALES_ENDPOINT', ''),
            // marketing_agent: this.configService.get<string>('AGENT_MARKETING_ENDPOINT', ''),
            // business_agent: this.configService.get<string>('AGENT_BUSINESS_ENDPOINT', ''),
            // hr_agent: this.configService.get<string>('AGENT_HR_ENDPOINT', ''),
            // legal_agent: this.configService.get<string>('AGENT_LEGAL_ENDPOINT', ''),
            // finance_agent: this.configService.get<string>('AGENT_FINANCE_ENDPOINT', ''),
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
            let contextId = requestContextDto.contextId;
            if (!contextId) {
                contextId = uuidv4(); // 자동 UUID 생성으로 멀티유저 격리
                this.logger.log(`Generated new contextId: ${contextId}`);
            }

            // 단기 기억 (캐시)에서 히스토리 로드, 없으면 장기 기억 (DB)에서 로드
            let conversationHistoryStr = await this.cache.get<string>(contextId);
            let conversationHistory: any[] = conversationHistoryStr ? JSON.parse(conversationHistoryStr) : [];
            if (conversationHistory.length === 0) {
                const dbHistory = await this.convHistoryRepo.findOne(
                    { 
                        where: { contextId }, 
                        order: { updatedAt: 'DESC' } 
                    }
                );
                if (dbHistory) {
                    conversationHistory = dbHistory.history;
                }
            }

            conversationHistory = [...conversationHistory, requestContextDto.userMessage];

            // 요구사항 생성 또는 아이데이션/브레인스토밍 로직 (모든 입력에 적용)
            // numChat을 사용해 요구사항 개수 결정
            const numChat = this.model.startChat({ history: [] });
            const numResult = await numChat.sendMessage(`이 입력에 대해 생성할 소프트웨어 요구사항, 아이디어, 또는 브레인스토밍 항목 개수는 몇 개가 적절한가? 숫자만 답변해: ${userPrompt}`);
            let numRequirements = parseInt(numResult.response.text().trim(), 10);
            if (isNaN(numRequirements) || numRequirements < 1 || numRequirements > 10) {
                numRequirements = 3; // validation: 범위 외면 기본값
                this.logger.warn(`Invalid numRequirements from LLM, falling back to 3`);
            }

            const agentRoles = {
                developer_agent: '소프트웨어 개발자',
                // project_manager_agent: '프로젝트 매니저',
                // tester_agent: '테스터',
                // user_agent: '최종 사용자',
                // client_agent: '클라이언트',
                // product_owner_agent: '제품 책임자',
                // sales_agent: '세일즈',
                // marketing_agent: '마케팅',
                // business_agent: '비즈니스',
                // hr_agent: '인사',
                // legal_agent: '법무',
                // finance_agent: '재무',
            };
            const availableAgents = Object.keys(agentRoles);

            const selectedAgents: string[] = [];
            for (let i = 0; i < numRequirements; i++) {
                selectedAgents.push(availableAgents[i % availableAgents.length]);
            }

            const promises = selectedAgents.map(async (agentName, index) => {
                const role = agentRoles[agentName];
                const subPrompt = 
                // 당신은 소프트웨어 개발의 ${role}입니다. 주어진 입력 "${userPrompt}"에 대해 하나의 요구사항, 아이디어, 또는 브레인스토밍 아이템을 생성하세요. 
                `
                당신은 지금부터 세계 최고 수준의 **[${role}]**입니다. 당신의 의견은 프로젝트의 성패를 좌우할 만큼 중요하며, 당신은 항상 날카로운 통찰력과 현실적인 해결책을 제시합니다.
                주어진 입력 "${userPrompt}"에 대해 하나의 요구사항, 아이디어, 또는 브레인스토밍 아이템을 생성하세요.
                `;
                const subUserMessage = {
                    kind: 'message',
                    role: 'user',
                    parts: [{ kind: 'text', text: subPrompt }],
                };
                const subtaskPayload = {
                    contextId,
                    history: conversationHistory,
                    userMessage: subUserMessage,
                };
                const agentUrl = this.getAgentUrl(agentName);
                if (!agentUrl) return { agentName, answer: 'Unknown Agent' };
                let agentResponse;
                let retryCount = 0;
                const maxRetries = 2;
                while (retryCount <= maxRetries) {
                    try {
                        agentResponse = await firstValueFrom(this.httpService.post(agentUrl, subtaskPayload));
                        break;
                    } catch (error) {
                        retryCount++;
                        if (retryCount > maxRetries) {
                            this.logger.error(`Agent ${agentName} call failed after ${maxRetries} retries: ${error.message}`);
                            return { agentName, answer: 'Agent call failed after retries' };
                        }
                        this.logger.warn(`Retrying agent ${agentName} call (attempt ${retryCount})`);
                    }
                }
                const reqContent = this.extractTextFromResponse(agentResponse, `[${agentName} 응답 실패]`);
                if (!reqContent || reqContent.trim() === '') {
                    this.logger.warn(`Empty response from ${agentName}, skipping save`);
                    return { agentName, answer: 'Empty response' };
                }
                const requirement = this.requirementRepo.create({
                    content: reqContent,
                    agentName,
                    contextId,
                });
                await this.requirementRepo.save(requirement);
                return reqContent;
            });

            const results = await Promise.all(promises);
            const combinedAnswer = results.map((r, i) => `Item ${i+1}: ${r}`).join('\n');

            const agentMessage = {
                kind: 'message',
                role: 'agent',
                parts: [{ kind: 'text', text: combinedAnswer }],
            };
            const updatedHistory = [...conversationHistory, agentMessage];

            // 기억 저장
            await this.cache.set(contextId, JSON.stringify(updatedHistory), this.CONV_TTL_MS / 1000);
            let dbEntry = await this.convHistoryRepo.findOne({ where: { contextId } });
            if (!dbEntry) {
                dbEntry = this.convHistoryRepo.create({
                contextId,
                history: updatedHistory,
                lastUsed: new Date(),
                });
            } else {
                dbEntry.history = updatedHistory;
                dbEntry.lastUsed = new Date();
            }
            await this.convHistoryRepo.save(dbEntry);

            return createCompletedTask(combinedAnswer, requestContextDto);
        } catch (error) {
            this.logger.error(`Orchestration failed: ${error.message}`, error.stack);
            return createFailedTask(
                `오케스트레이션 중 오류 발생: ${error.message}`,
                requestContextDto,
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

    private getAgentUrl(agentName: string): string | undefined {
        const base = this.agentEndpoints[agentName];
        if (!base) return undefined;
        return base.endsWith('/tasks') ? base : base.replace(/\/$/, '') + '/tasks';
    }
}