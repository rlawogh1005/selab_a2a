import { Module } from '@nestjs/common';
import { MainAgentController } from './main-agent.controller';
import { MainAgentExecutorProvider } from './providers/main-agent-executor.provider';
import { MainAgentCardProvider } from './providers/main-agent-card.provider';
import { HttpModule } from '@nestjs/axios';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [HttpModule, ConfigModule.forRoot()],
  controllers: [MainAgentController],
  providers: [MainAgentExecutorProvider, MainAgentCardProvider],
})
export class MainAgentModule {}
