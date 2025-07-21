import { Controller, Post, Body } from '@nestjs/common';
import { DeveloperAgentRequestContextDto } from './dto/developer-agent-request-context.dto';
import { Task } from '@a2a-js/sdk';
import { DeveloperAgentExecutorProvider } from './providers/developer-agent-executor.provider';

@Controller()
export class DeveloperAgentController {
  constructor(private readonly developerAgentExecutor: DeveloperAgentExecutorProvider) {}

  @Post('tasks')
  executeTask(
    @Body() requestContextDto: DeveloperAgentRequestContextDto,
  ): Promise<Task> {
    return this.developerAgentExecutor.executeTask(requestContextDto);
  }
}
