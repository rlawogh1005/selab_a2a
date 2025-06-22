import { Module } from '@nestjs/common';
import { WeatherAgentController } from './weather-agent.controller';
import { WeatherAgentExecutorProvider } from './providers/weather-agent-executor.provider';
import { ConfigModule } from '@nestjs/config';
import { WeatherAgentCardProvider } from './providers/weather-agent-card.provider';
import { HttpModule } from '@nestjs/axios';

@Module({
  imports: [HttpModule, ConfigModule.forRoot()],
  controllers: [WeatherAgentController],
  providers: [WeatherAgentExecutorProvider, WeatherAgentCardProvider],
})
export class WeatherAgentModule {}
