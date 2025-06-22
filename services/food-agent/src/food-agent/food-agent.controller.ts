import { Controller, Post, Body } from '@nestjs/common';
import { FoodAgentRequestContextDto } from './dto/food-agent-request-context.dto';
import { Task } from '@a2a-js/sdk';
import { FoodAgentExecutorProvider } from './providers/food-agent-executor.provider';

@Controller()
export class FoodAgentController {
  constructor(private readonly foodAgentExecutor: FoodAgentExecutorProvider) {}

  @Post('tasks')
  executeTask(
    @Body() requestContextDto: FoodAgentRequestContextDto,
  ): Promise<Task> {
    return this.foodAgentExecutor.executeTask(requestContextDto);
  }
}
