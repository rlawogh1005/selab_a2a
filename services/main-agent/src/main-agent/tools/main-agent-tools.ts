import { SchemaType, Tool } from '@google/generative-ai';

// 각 전문가 에이전트의 skill을 LLM이 사용할 수 있는 Tool로 정의
export const specialistAgentTools: Tool[] = [
  {
    functionDeclarations: [
      {
        name: 'weather_agent', // 호출할 함수의 이름
        description: '특정 지역의 날씨 예보를 조회합니다.',
        parameters: {
          type: SchemaType.OBJECT,
          properties: {
            location: { type: SchemaType.STRING, description: '날씨를 조회할 도시나 지역' },
            personaId: { type: SchemaType.STRING, description: '페르소나 ID (sodam)' },
          },
          required: ['location'],
        },
      },
      {
        name: 'food_agent',
        description: '음식 추천, 맛집 검색, 레시피 정보 등을 제공합니다.',
        parameters: {
          type: SchemaType.OBJECT,
          properties: {
            query: {
              type: SchemaType.STRING,
              description: '맛집, 음식 종류, 지역 등을 포함하는 구체적인 질문 (예: "강남역 근처 파스타 맛집 추천해줘")',
            },
            personaId: { type: SchemaType.STRING, description: '페르소나 ID (sori)' },
          },
          required: ['query'],
        },
      },
      {
        name: 'maru_agent',
        description: '일정 조율, 스케줄링, 미팅 일정 조정 등을 도와줍니다. 사용자의 첫번째 상호작용은 반드시 maru_agent를 호출해야 합니다.',
        parameters: {
          type: SchemaType.OBJECT,
          properties: {
            query: {
              type: SchemaType.STRING,
              description: '일정 관련 구체적인 질문 (예: "다음 주 월요일에 갈만한 곳 추천해줘", "내일 일정 확인해줘")',
            },
            personaId: { type: SchemaType.STRING, description: '페르소나 ID (maru)' },
          },
          required: ['query'],
        },
      },
    ],
  },
];