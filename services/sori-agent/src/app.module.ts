import { Module } from '@nestjs/common';
import { SoriAgentController } from './sori-agent/sori-agent.controller';
import { SoriAgentModule } from './sori-agent/sori-agent.module';
import { ConfigModule } from '@nestjs/config';
import { HttpModule } from '@nestjs/axios';
import { SoriAgentExecutorProvider } from './sori-agent/providers/sori-agent-executor.provider';

@Module({
    imports: [ConfigModule.forRoot({ isGlobal: true }), HttpModule, SoriAgentModule],
    controllers: [SoriAgentController],
    providers: [SoriAgentExecutorProvider],
})
export class AppModule {}
