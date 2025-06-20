import { Module } from '@nestjs/common';
import { WeatherAgentModule } from './weather-agent/weather-agent.module';
import { WeatherAgentController } from './weather-agent/weather-agent.controller';
import { WeatherAgentExecutorProvider } from './weather-agent/providers/weather-agent-executor.provider';

@Module({
  imports: [WeatherAgentModule],
  controllers: [WeatherAgentController],
  providers: [WeatherAgentExecutorProvider],
})
export class AppModule {}
