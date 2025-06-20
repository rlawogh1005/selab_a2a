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
          },
          required: ['location'],
        },
      },
      {
        name: 'tourism_agent',
        description: '특정 지역의 관광 명소나 활동을 추천합니다.',
        parameters: {
          type: SchemaType.OBJECT,
          properties: {
            location: { type: SchemaType.STRING, description: '관광 정보를 조회할 도시나 지역' },
            category: { type: SchemaType.STRING, description: "선택사항. '실내', '맛집' 등 특정 카테고리" },
          },
          required: ['location'],
        },
      },
      {
        name: 'photo_agent',
        description: '특정 장소나 분위기에 맞는 사진을 찾아줍니다.',
        parameters: {
          type: SchemaType.OBJECT,
          properties: {
            subject: { type: SchemaType.STRING, description: '사진의 주제나 장소, 분위기' },
          },
          required: ['subject'],
        },
      },
    ],
  },
];