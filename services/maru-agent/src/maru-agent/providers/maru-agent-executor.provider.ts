import { Injectable, Logger } from '@nestjs/common';
import { Task } from '@a2a-js/sdk';
import { HttpService } from '@nestjs/axios';
import { firstValueFrom } from 'rxjs';
import { createCompletedTask, createFailedTask } from '../dto/maru-agent-response-task.dto';
import { MaruAgentRequestContextDto } from '../dto/maru-agent-request-context.dto';

@Injectable()
export class MaruAgentExecutorProvider {
  private readonly logger = new Logger(MaruAgentExecutorProvider.name);

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
    requestContextDto: MaruAgentRequestContextDto,
  ): Promise<Task> {
    const userPrompt =
      (
        requestContextDto.userMessage.parts.find(p => 'text' in p) as {
          text: string;
        }
      )?.text || '';
    this.logger.log(`Maru agent started for prompt: "${userPrompt}"`);

    try {
      // Wanted LAAS 호출
      const headers = {
        project: process.env.LAAS_PROJECT,
        apiKey: process.env.LAAS_API_KEY,
        'Content-Type': 'application/json; charset=utf-8',
      } as Record<string, string>;

      const payload = {
        hash: process.env.LAAS_HASH,
        params: {
          userPrompt,
        },
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

      return createCompletedTask(responseText, requestContextDto);
    } catch (error) {
      this.logger.error(`Maru agent failed: ${error.message}`, error.stack);
      return createFailedTask(
        `Maru agent processing error: ${error.message}`,
        requestContextDto,
      );
    }
  }
}
