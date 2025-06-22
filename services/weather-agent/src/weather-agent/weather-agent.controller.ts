import { Controller, Post, Body } from '@nestjs/common';
import { WeatherAgentRequestContextDto } from './dto/weather-agent-request-context.dto';
import { Task } from '@a2a-js/sdk';
import { WeatherAgentExecutorProvider } from './providers/weather-agent-executor.provider';
import { Logger } from '@nestjs/common';

@Controller()
export class WeatherAgentController {
  private readonly logger = new Logger(WeatherAgentController.name);

  constructor(
    private readonly weatherAgentExecutor: WeatherAgentExecutorProvider,
  ) {}

  @Post('tasks')
  executeTask(
    @Body() requestContextDto: WeatherAgentRequestContextDto,
  ): Promise<Task> {
    this.logger.log('Weather agent task requested');
    return this.weatherAgentExecutor.executeTask(requestContextDto);
  }
}
