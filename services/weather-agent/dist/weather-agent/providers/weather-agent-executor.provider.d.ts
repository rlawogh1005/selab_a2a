import { Task } from '@a2a-js/sdk';
import { WeatherAgentRequestContextDto } from '../dto/weather-agent-request-context.dto';
export declare class WeatherAgentExecutorProvider {
    private readonly logger;
    private readonly model;
    constructor();
    executeTask(requestContextDto: WeatherAgentRequestContextDto): Promise<Task>;
}
