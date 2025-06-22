import { Controller, Post, Body } from '@nestjs/common';
import { MaruAgentRequestContextDto } from './dto/maru-agent-request-context.dto';
import { Task } from '@a2a-js/sdk';
import { MaruAgentExecutorProvider } from './providers/maru-agent-executor.provider';
import { Logger } from '@nestjs/common';

@Controller()
export class MaruAgentController {
  private readonly logger = new Logger(MaruAgentController.name);

  constructor(
    private readonly maruAgentExecutor: MaruAgentExecutorProvider,
  ) {}

  @Post('tasks')
  executeTask(
    @Body() requestContextDto: MaruAgentRequestContextDto,
  ): Promise<Task> {
    this.logger.log('Maru agent task requested');
    return this.maruAgentExecutor.executeTask(requestContextDto);
  }
}
