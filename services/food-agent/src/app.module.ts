import { Module } from '@nestjs/common';
import { FoodAgentModule } from './food-agent/food-agent.module';
import { ConfigModule } from '@nestjs/config';
import { FoodAgentExecutorProvider } from './food-agent/providers/food-agent-executor.provider';
import { FoodAgentController } from './food-agent/food-agent.controller';

@Module({
  imports: [ConfigModule.forRoot({ isGlobal: true }), FoodAgentModule],
  controllers: [FoodAgentController],
  providers: [FoodAgentExecutorProvider],
})
export class AppModule {}
