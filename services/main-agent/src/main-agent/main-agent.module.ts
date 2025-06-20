import { Module } from '@nestjs/common';
import { MainAgentService } from './main-agent.service';
import { MainAgentController } from './main-agent.controller';

@Module({
  controllers: [MainAgentController],
  providers: [MainAgentService],
})
export class MainAgentModule {}
