import { Injectable } from '@nestjs/common';
import { AgentCard } from '@a2a-js/sdk';

@Injectable()
export class TourismAgentCardProvider {
  private readonly agentCard: AgentCard = {
    name: '관광 정보 전문가 (NestJS)',
    url: 'http://localhost:3002/',
    skills: [{ id: 'search_attractions', name: '관광지 검색', ... }],
    // ...
  };
  getCard(): AgentCard { return this.agentCard; }
}