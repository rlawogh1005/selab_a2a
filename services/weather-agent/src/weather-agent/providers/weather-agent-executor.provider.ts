import { Injectable, Logger } from '@nestjs/common';
import { Task } from '@a2a-js/sdk';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { WeatherAgentRequestContextDto } from '../dto/weather-agent-request-context.dto';
import {
  createCompletedTask,
  createFailedTask,
} from '../dto/weather-agent-response-task.dto';

@Injectable()
export class WeatherAgentExecutorProvider {
  private readonly logger = new Logger(WeatherAgentExecutorProvider.name);
  private readonly model: any; // Gemini Model

  constructor() {
    if (!process.env.GEMINI_API_KEY) {
      throw new Error('GEMINI_API_KEY is not set in the environment variables.');
    }
    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
    this.model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });
  }

  async executeTask(
    requestContextDto: WeatherAgentRequestContextDto,
  ): Promise<Task> {
    const userPrompt =
      (
        requestContextDto.userMessage.parts.find(p => 'text' in p) as {
          text: string;
        }
      )?.text || '';
    this.logger.log(`Weather agent started for prompt: "${userPrompt}"`);

    try {
      const prompt = `You are a helpful assistant specializing in weather forecasts. Answer the following user query about weather: ${userPrompt}`;
      const result = await this.model.generateContent(prompt);
      const response = result.response;
      const responseText = response.text();

      return createCompletedTask(responseText, requestContextDto);
    } catch (error) {
      this.logger.error(`Weather agent failed: ${error.message}`, error.stack);
      return createFailedTask(
        `Weather agent processing error: ${error.message}`,
        requestContextDto,
      );
    }
  }
}
