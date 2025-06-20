import { Module } from '@nestjs/common';
import { MainAgentModule } from './main-agent/main-agent.module';

@Module({
  imports: [MainAgentModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
