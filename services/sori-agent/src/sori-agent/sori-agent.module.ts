import { Module } from '@nestjs/common';
import { SoriAgentController } from './sori-agent.controller';
import { SoriAgentExecutorProvider } from './providers/sori-agent-executor.provider';
import { ConfigModule } from '@nestjs/config';
import { SoriAgentCardProvider } from './providers/sori-agent-card.provider';
import { HttpModule } from '@nestjs/axios';

@Module({
  imports: [HttpModule, ConfigModule.forRoot()],
  controllers: [SoriAgentController],
  providers: [SoriAgentExecutorProvider, SoriAgentCardProvider],
})
export class SoriAgentModule {}
