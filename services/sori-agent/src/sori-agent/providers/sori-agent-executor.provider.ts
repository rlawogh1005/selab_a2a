import { Injectable, Logger } from '@nestjs/common';
import { Task } from '@a2a-js/sdk';
import { HttpService } from '@nestjs/axios';
import { firstValueFrom } from 'rxjs';
import { createCompletedTask, createFailedTask } from '../dto/sori-agent-response-task.dto';
import { SoriAgentRequestContextDto } from '../dto/sori-agent-request-context.dto';

@Injectable()
export class SoriAgentExecutorProvider {
  private readonly logger = new Logger(SoriAgentExecutorProvider.name);

  constructor(private readonly httpService: HttpService) {
    // 필수 환경 변수 확인
    const requiredEnvs = ['LAAS_PROJECT', 'LAAS_API_KEY', 'LAAS_HASH'];
    requiredEnvs.forEach(key => {
      if (!process.env[key]) {
        throw new Error(`${key} is not set in the environment variables.`);
      }
    });
  }

  async executeTask(
    requestContextDto: SoriAgentRequestContextDto,
  ): Promise<Task> {
    const userPrompt =
      (
        requestContextDto.userMessage.parts.find(p => 'text' in p) as {
          text: string;
        }
      )?.text || '';
    this.logger.log(`Sori agent started for prompt: "${userPrompt}"`);

    try {
      // 히스토리를 기반으로 Wanted LaaS messages 구성
      const previousMessages = (requestContextDto.history || []).map(msg => {
        const text = (msg.parts.find(p => 'text' in p) as { text: string })?.text || '';
        return {
          role: msg.role === 'agent' ? 'assistant' : 'user',
          content: text,
        } as { role: 'user' | 'assistant'; content: string };
      });

      const currentConversation = [
        ...previousMessages,
        { role: 'user', content: userPrompt },
      ];

      // Wanted LAAS 호출
      const headers = {
        project: process.env.LAAS_PROJECT,
        apiKey: process.env.LAAS_API_KEY,
        'Content-Type': 'application/json; charset=utf-8',
      } as Record<string, string>;

      const payload = {
        hash: process.env.LAAS_HASH,
        messages: currentConversation,
      };

      const result = await firstValueFrom(
        this.httpService.post(
          'https://api-laas.wanted.co.kr/api/preset/v2/chat/completions',
          payload,
          { headers },
        ),
      );

      const responseData = result.data;
      const responseText =
        responseData?.choices?.[0]?.message?.content ||
        responseData?.result?.parts?.[0]?.text ||
        JSON.stringify(responseData);

      return createCompletedTask(responseText, {
        ...requestContextDto,
        history: [
          ...(requestContextDto.history || []),
          requestContextDto.userMessage,
          {
            kind: 'message',
            role: 'agent',
            parts: [{ kind: 'text', text: responseText }],
          } as any,
        ],
      });
    } catch (error) {
      this.logger.error(`Sori agent failed: ${error.message}`, error.stack);
      return createFailedTask(
        `Sori agent processing error: ${error.message}`,
        requestContextDto,
      );
    }
  }
}
