import { AgentCard, Message, Task } from '@a2a-js/sdk';
export declare class WeatherAgentRequestContextDto {
    userMessage: Message;
    history?: Message[];
    agentCard?: AgentCard;
    contextId?: string;
    task?: Task;
}
