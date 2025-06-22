import { Module } from '@nestjs/common';
import { MainAgentModule } from './main-agent/main-agent.module';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [ConfigModule.forRoot({ isGlobal: true }), MainAgentModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
