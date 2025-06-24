import { SchemaType, Tool } from '@google/generative-ai';

// 각 전문가 에이전트의 skill을 LLM이 사용할 수 있는 Tool로 정의
export const specialistAgentTools: Tool[] = [
  {
    functionDeclarations: [
      {
        name: 'maru_agent',
        description: '여행 일정 수립과 전반적인 스케줄링을 도와주는 최고 우선순위 에이전트입니다. 사용자의 첫 번째 상호작용은 반드시 maru_agent를 호출해야 합니다.',
        parameters: {
          type: SchemaType.OBJECT,
          properties: {
            query: {
              type: SchemaType.STRING,
              description: '여행 및 일정 관련 범용적인 질문',
            },
            personaId: { type: SchemaType.STRING, description: '페르소나 ID (maru)' },
          },
          required: ['query'],
        },
      },
      {
        name: 'sodam_agent',
        description: '소담이는 맛집(식당, 카페 등)을 추천하는 음식 전문 에이전트입니다. 지역·음식 키워드(예: "강남 파스타 맛집", "제주 카페 추천")와 함께 사용하세요.',
        parameters: {
          type: SchemaType.OBJECT,
          properties: {
            query: {
              type: SchemaType.STRING,
              description: '음식/맛집 관련 구체적인 질문',
            },
            personaId: { type: SchemaType.STRING, description: '페르소나 ID (sodam)' },
          },
          required: ['query'],
        },
      },
      {
        name: 'sori_agent',
        description: '소리는 지역 정보를 기반으로 여행지를 추천합니다.',
        parameters: {
          type: SchemaType.OBJECT,
          properties: {
            query: {
              type: SchemaType.STRING,
              description: '지역 정보를 포함하는 여행지 추천 요청 (예: "다음 주 제주 2박 3일 일정 짜줘", "부산 여행 코스 추천해줘")',
            },
            personaId: { type: SchemaType.STRING, description: '페르소나 ID (sori)' },
          },
          required: ['query'],
        },
      },
    ],
  },
];