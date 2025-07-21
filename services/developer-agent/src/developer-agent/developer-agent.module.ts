import { Module } from '@nestjs/common';
import { DeveloperAgentController } from './developer-agent.controller';
import { DeveloperAgentExecutorProvider } from './providers/developer-agent-executor.provider';
import { ConfigModule } from '@nestjs/config';
import { HttpModule } from '@nestjs/axios';

@Module({
  imports: [HttpModule, ConfigModule.forRoot()],
  controllers: [DeveloperAgentController],
  providers: [DeveloperAgentExecutorProvider],
})
export class DeveloperAgentModule {}
