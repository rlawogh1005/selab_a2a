import { Module } from '@nestjs/common';
import { WeatherAgentService } from './weather-agent.service';
import { WeatherAgentController } from './weather-agent.controller';

@Module({
  controllers: [WeatherAgentController],
  providers: [WeatherAgentService],
})
export class WeatherAgentModule {}
