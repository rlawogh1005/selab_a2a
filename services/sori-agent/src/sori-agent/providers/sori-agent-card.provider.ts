import { Injectable } from '@nestjs/common';
import { AgentCard } from '@a2a-js/sdk';

@Injectable()
export class SoriAgentCardProvider {
  private readonly agentCard: AgentCard = {
    name: 'Sori Agent',
    url: 'http://localhost:3005/api/tasks',
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
    description: '소리입니다. 소리는 지역 정보를 기반으로 여행지를 추천합니다.',
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
