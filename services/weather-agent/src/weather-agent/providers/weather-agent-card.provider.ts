import { Injectable } from '@nestjs/common';
import { AgentCard } from '@a2a-js/sdk';

@Injectable()
export class WeatherAgentCardProvider {
  private readonly agentCard: AgentCard = {
    name: 'Weather Agent',
    url: 'http://localhost:3001/',
    skills: [
      {
        id: 'weather_forecast',
        name: '날씨 예보',
description: '날씨 예보 정보 제공',
        tags: ['weather', 'forecast'],
      },
      {
        id: 'current_weather',
        name: '현재 날씨',
        description: '현재 날씨 상태 정보 제공',
        tags: ['weather', 'current'],
      },
    ],
    description: '날씨 정보를 제공하는 AI 어시스턴트입니다. 날씨 예보, 현재 날씨 상태, 기온, 습도, 바람 등의 정보를 제공할 수 있습니다.',
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
