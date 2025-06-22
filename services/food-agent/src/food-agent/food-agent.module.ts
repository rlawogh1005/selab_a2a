import { Module } from '@nestjs/common';
import { FoodAgentController } from './food-agent.controller';
import { FoodAgentExecutorProvider } from './providers/food-agent-executor.provider';
import { ConfigModule } from '@nestjs/config';
import { HttpModule } from '@nestjs/axios';

@Module({
  imports: [HttpModule, ConfigModule.forRoot()],
  controllers: [FoodAgentController],
  providers: [FoodAgentExecutorProvider],
})
export class FoodAgentModule {}
