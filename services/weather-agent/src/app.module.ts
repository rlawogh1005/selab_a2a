import { Module } from '@nestjs/common';
import { WeatherAgentModule } from './weather-agent/weather-agent.module';

@Module({
  imports: [WeatherAgentModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
