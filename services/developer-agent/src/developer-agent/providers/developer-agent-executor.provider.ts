import { Injectable, Logger } from '@nestjs/common';
import { Task } from '@a2a-js/sdk';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { DeveloperAgentRequestContextDto } from '../dto/developer-agent-request-context.dto';
import {
  createCompletedTask,
  createFailedTask,
} from '../dto/developer-agent-response-task.dto';
import { ConfigService } from '@nestjs/config';

// 에이전트 이름과 URL을 매핑
const AGENT_ENDPOINTS: Record<string, string> = {
  weather_agent: 'http://localhost:3001/api/tasks',
  tourism_agent: 'http://localhost:3002/api/tasks',
  photo_agent: 'http://localhost:3003/api/tasks',
};

@Injectable()
export class DeveloperAgentExecutorProvider {
  private readonly logger = new Logger(DeveloperAgentExecutorProvider.name);
  private readonly model: any; // Gemini Model

  constructor(private readonly configService: ConfigService) {
    const apiKey = this.configService.get<string>('GEMINI_API_KEY');
    if (!apiKey) {
      throw new Error('GEMINI_API_KEY is not set in the environment variables.');
    }
    const genAI = new GoogleGenerativeAI(apiKey);
    this.model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });
  }

  async executeTask(
    requestContextDto: DeveloperAgentRequestContextDto,
  ): Promise<Task> {
    const userPrompt =
      (
        requestContextDto.userMessage.parts.find(p => 'text' in p) as {
          text: string;
        }
      )?.text || '';
    this.logger.log(`Developer agent started for prompt: "${userPrompt}"`);

    try {
      const prompt = `You are a Developer. Answer the following user query about Development: ${userPrompt}`;
      const result = await this.model.generateContent(prompt);
      const response = result.response;
      const responseText = response.text();

      return createCompletedTask(responseText, requestContextDto);
    } catch (error) {
      this.logger.error(`Developer agent failed: ${error.message}`, error.stack);
      return createFailedTask(
        `Developer agent processing error: ${error.message}`,
        requestContextDto,
      );
    }
  }
}