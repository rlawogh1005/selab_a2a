import { Injectable } from '@nestjs/common';
import { CreateWeatherAgentDto } from './dto/create-weather-agent.dto';
import { UpdateWeatherAgentDto } from './dto/update-weather-agent.dto';

@Injectable()
export class WeatherAgentService {
  create(createWeatherAgentDto: CreateWeatherAgentDto) {
    return 'This action adds a new weatherAgent';
  }

  findAll() {
    return `This action returns all weatherAgent`;
  }

  findOne(id: number) {
    return `This action returns a #${id} weatherAgent`;
  }

  update(id: number, updateWeatherAgentDto: UpdateWeatherAgentDto) {
    return `This action updates a #${id} weatherAgent`;
  }

  remove(id: number) {
    return `This action removes a #${id} weatherAgent`;
  }
}
