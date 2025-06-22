import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { MaruAgentModule } from './maru-agent/maru-agent.module';
import { MaruAgentExecutorProvider } from './maru-agent/providers/maru-agent-executor.provider';
import { MaruAgentController } from './maru-agent/maru-agent.controller';
import { HttpModule } from '@nestjs/axios';

@Module({
  imports: [ConfigModule.forRoot({ isGlobal: true }), HttpModule, MaruAgentModule],
  controllers: [MaruAgentController],
  providers: [MaruAgentExecutorProvider],
})
export class AppModule {}
