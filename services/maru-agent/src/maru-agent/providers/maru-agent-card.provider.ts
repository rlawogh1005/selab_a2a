import { Injectable } from '@nestjs/common';
import { AgentCard } from '@a2a-js/sdk';

@Injectable()
export class MaruAgentCardProvider {
  private readonly agentCard: AgentCard = {
    name: 'Maru Agent',
    url: 'http://localhost:3003/api/tasks',
    skills: [
//       {
//         id: 'weather_forecast',
//         name: '날씨 예보',
// description: '날씨 예보 정보 제공',
//         tags: ['weather', 'forecast'],
//       },
//       {
//         id: 'current_weather',
//         name: '현재 날씨',
//         description: '현재 날씨 상태 정보 제공',
//         tags: ['weather', 'current'],
//       },
    ],
    description: '마루입니다. 마루는 일정을 조율합니다.',
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
