import { AgentCard, Message } from '@a2a-js/sdk';

// A2A 요청 본문을 검증하기 위한 DTO
export class RequestContextDto {
  userMessage: Message;
  history?: Message[];
  agentCard?: AgentCard;
}