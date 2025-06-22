import { Module } from '@nestjs/common';
import { MaruAgentController } from './maru-agent.controller';
import { MaruAgentExecutorProvider } from './providers/maru-agent-executor.provider';
import { ConfigModule } from '@nestjs/config';
import { MaruAgentCardProvider } from './providers/maru-agent-card.provider';
import { HttpModule } from '@nestjs/axios';

@Module({
  imports: [HttpModule, ConfigModule.forRoot()],
  controllers: [MaruAgentController],
  providers: [MaruAgentExecutorProvider, MaruAgentCardProvider],
})
export class MaruAgentModule {}
