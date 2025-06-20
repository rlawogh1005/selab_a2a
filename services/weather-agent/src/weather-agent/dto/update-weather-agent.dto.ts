import { PartialType } from '@nestjs/mapped-types';
import { CreateWeatherAgentDto } from './create-weather-agent.dto';

export class UpdateWeatherAgentDto extends PartialType(CreateWeatherAgentDto) {}
