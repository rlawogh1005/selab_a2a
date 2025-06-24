import { Controller, Post, Body } from '@nestjs/common';
import { SoriAgentRequestContextDto } from './dto/sori-agent-request-context.dto';
import { Task } from '@a2a-js/sdk';
import { SoriAgentExecutorProvider } from './providers/sori-agent-executor.provider';
import { Logger } from '@nestjs/common';

@Controller()
export class SoriAgentController {
  private readonly logger = new Logger(SoriAgentController.name);

  constructor(
    private readonly soriAgentExecutor: SoriAgentExecutorProvider,
  ) {}

  @Post('tasks')
  executeTask(
    @Body() requestContextDto: SoriAgentRequestContextDto,
  ): Promise<Task> {
    this.logger.log('Sori agent task requested');
    return this.soriAgentExecutor.executeTask(requestContextDto);
  }
}
