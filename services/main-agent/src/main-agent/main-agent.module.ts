import { Module } from '@nestjs/common';
import { MainAgentController } from './main-agent.controller';
import { MainAgentCardProvider } from './providers/main-agent-card.provider';
import { MainAgentExecutorProvider } from './providers/main-agent-executor.provider';
import { HttpModule } from '@nestjs/axios';

@Module({
  imports: [HttpModule],
  controllers: [MainAgentController],
  providers: [MainAgentExecutorProvider, MainAgentCardProvider],
})
export class MainAgentModule {}
