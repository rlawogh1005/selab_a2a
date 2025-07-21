import { Module } from '@nestjs/common';
import { DeveloperAgentModule } from './developer-agent/developer-agent.module';
import { ConfigModule } from '@nestjs/config';
import { DeveloperAgentExecutorProvider } from './developer-agent/providers/developer-agent-executor.provider';
import { DeveloperAgentController } from './developer-agent/developer-agent.controller';

@Module({
  imports: [ConfigModule.forRoot({ isGlobal: true }), DeveloperAgentModule],
  controllers: [DeveloperAgentController],
  providers: [DeveloperAgentExecutorProvider],
})
export class AppModule {}
