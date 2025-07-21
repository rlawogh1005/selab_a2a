import { Module } from '@nestjs/common';
import { MainAgentController } from './main-agent.controller';
import { MainAgentExecutorProvider } from './providers/main-agent-executor.provider';
import { MainAgentCardProvider } from './providers/main-agent-card.provider';
import { HttpModule } from '@nestjs/axios';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Requirement } from './entities/requirement.entity';
import { ConversationHistory } from './entities/conversation-history.entity';

@Module({
  imports: [
    HttpModule,
    ConfigModule.forRoot(),
    TypeOrmModule.forFeature([Requirement, ConversationHistory]),
  ],
  controllers: [MainAgentController],
  providers: [MainAgentExecutorProvider, MainAgentCardProvider],
})
export class MainAgentModule {}
