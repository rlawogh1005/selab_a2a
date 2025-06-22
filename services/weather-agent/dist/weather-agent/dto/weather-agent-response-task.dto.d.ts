import { Task } from '@a2a-js/sdk';
import { WeatherAgentRequestContextDto } from './weather-agent-request-context.dto';
export declare function createCompletedTask(responseText: string, context?: WeatherAgentRequestContextDto): Task;
export declare function createFailedTask(errorMessage: string, context?: WeatherAgentRequestContextDto): Task;
