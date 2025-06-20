import { Injectable } from '@nestjs/common';
import { AgentCard } from '@a2a-js/sdk';

@Injectable()
export class MainAgentCardProvider {
  private readonly agentCard: AgentCard = {
    name: '메인 에이전트 (NestJS)',
    url: 'http://localhost:3000/',
    skills: [
      {
        id: 'main_agent',
        name: '메인 에이전트',
        description: '메인 에이전트',
        tags: [],
      },
    ],
    description: '메인 에이전트',
    version: '1.0.0',
    capabilities: {
      streaming: false,
      pushNotifications: false,
      stateTransitionHistory: true,
    },
    defaultInputModes: ['text/plain'],
    defaultOutputModes: ['text/plain'],
  };
  getCard(): AgentCard {
    return this.agentCard;
  }
}