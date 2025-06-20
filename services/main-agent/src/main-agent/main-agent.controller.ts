import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { MainAgentService } from './main-agent.service';
import { CreateMainAgentDto } from './dto/create-main-agent.dto';
import { UpdateMainAgentDto } from './dto/update-main-agent.dto';

@Controller('main-agent')
export class MainAgentController {
  constructor(private readonly mainAgentService: MainAgentService) {}

  @Post()
  create(@Body() createMainAgentDto: CreateMainAgentDto) {
    return this.mainAgentService.create(createMainAgentDto);
  }

  @Get()
  findAll() {
    return this.mainAgentService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.mainAgentService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateMainAgentDto: UpdateMainAgentDto) {
    return this.mainAgentService.update(+id, updateMainAgentDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.mainAgentService.remove(+id);
  }
}
