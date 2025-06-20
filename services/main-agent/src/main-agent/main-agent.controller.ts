import { Controller, Get, Post, Body } from '@nestjs/common';
import { MainAgentExecutorProvider } from './providers/main-agent-executor.provider';
import { MainAgentCardProvider } from './providers/main-agent-card.provider';
import { AgentCard, Task } from '@a2a-js/sdk';
import { RequestContextDto } from './dto/main-agent-request-context.dto';

@Controller()
export class MainAgentController {
  constructor(
    private readonly mainAgentExecutor: MainAgentExecutorProvider,
    private readonly mainAgentCardProvider: MainAgentCardProvider,
  ) {}

  @Get('.well-known/agent.json')
  getAgentCard(): AgentCard {
    return this.mainAgentCardProvider.getCard();
  }

  @Post('execute')
  executeTask(@Body() requestContextDto: RequestContextDto): Promise<Task> {
    return this.mainAgentExecutor.executeTask(requestContextDto);
  }
}
