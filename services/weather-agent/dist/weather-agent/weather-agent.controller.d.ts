import { WeatherAgentRequestContextDto } from './dto/weather-agent-request-context.dto';
import { Task } from '@a2a-js/sdk';
import { WeatherAgentExecutorProvider } from './providers/weather-agent-executor.provider';
export declare class WeatherAgentController {
    private readonly weatherAgentExecutor;
    private readonly logger;
    constructor(weatherAgentExecutor: WeatherAgentExecutorProvider);
    executeTask(requestContextDto: WeatherAgentRequestContextDto): Promise<Task>;
}
