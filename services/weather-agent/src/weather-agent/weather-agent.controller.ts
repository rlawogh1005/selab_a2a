import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { WeatherAgentService } from './weather-agent.service';
import { CreateWeatherAgentDto } from './dto/create-weather-agent.dto';
import { UpdateWeatherAgentDto } from './dto/update-weather-agent.dto';

@Controller('weather-agent')
export class WeatherAgentController {
  constructor(private readonly weatherAgentService: WeatherAgentService) {}

  @Post()
  create(@Body() createWeatherAgentDto: CreateWeatherAgentDto) {
    return this.weatherAgentService.create(createWeatherAgentDto);
  }

  @Get()
  findAll() {
    return this.weatherAgentService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.weatherAgentService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateWeatherAgentDto: UpdateWeatherAgentDto) {
    return this.weatherAgentService.update(+id, updateWeatherAgentDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.weatherAgentService.remove(+id);
  }
}
