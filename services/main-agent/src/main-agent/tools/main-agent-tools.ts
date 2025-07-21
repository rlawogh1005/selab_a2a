import { SchemaType, Tool } from '@google/generative-ai';

// 각 전문가 에이전트의 skill을 LLM이 사용할 수 있는 Tool로 정의(Agent Card 대체)
export const specialistAgentTools: Tool[] = [
  {
        functionDeclarations: [
            {
                name: 'developer_agent',
                description: '개발자 에이전트입니다.',
                parameters: {
                type: SchemaType.OBJECT,
                properties: {
                    query: {
                    type: SchemaType.STRING,
                    description: '개발자 관점에서 요구사항을 생성합니다.',
                    },
                    personaId: { type: SchemaType.STRING, description: '페르소나 ID (developer)' },
                },
                required: ['query'],
                },
            },
            {
                name: 'designer_agent',
                description: 'UI/UX 디자이너 에이전트입니다.',
                parameters: {
                type: SchemaType.OBJECT,
                properties: {
                    query: {
                    type: SchemaType.STRING,
                    description: 'UI/UX 디자이너 관점에서 요구사항을 생성합니다.',
                    },
                    personaId: { type: SchemaType.STRING, description: '페르소나 ID (designer)' },
                },
                required: ['query'],
                },
            },
            {
                name: 'tester_agent',
                description: '테스터 에이전트입니다.',
                parameters: {
                type: SchemaType.OBJECT,
                properties: {
                    query: {
                    type: SchemaType.STRING,
                    description: '테스터 관점에서 요구사항을 생성합니다.',
                    },
                    personaId: { type: SchemaType.STRING, description: '페르소나 ID (tester)' },
                },
                required: ['query'],
                },
            },
            {
                name: 'project_manager_agent',
                description: '프로젝트 관리자 에이전트입니다.',
                parameters: {
                type: SchemaType.OBJECT,
                properties: {
                    query: {
                    type: SchemaType.STRING,
                    description: '프로젝트 관리자 관점에서 요구사항을 생성합니다.',
                    },
                    personaId: { type: SchemaType.STRING, description: '페르소나 ID (project_manager)' },
                },
                required: ['query'],
                },
            },
            {
                name: 'user_agent',
                description: '사용자 에이전트입니다.',
                parameters: {
                type: SchemaType.OBJECT,
                properties: {
                    query: {
                    type: SchemaType.STRING,
                    description: '사용자 관점에서 요구사항을 생성합니다.',
                    },
                    personaId: { type: SchemaType.STRING, description: '페르소나 ID (user)' },
                },
                required: ['query'],
                },
            },
            {
                name: 'client_agent',
                description: '클라이언트 에이전트입니다.',
                parameters: {
                type: SchemaType.OBJECT,
                properties: {
                    query: {
                    type: SchemaType.STRING,
                    description: '클라이언트 관점에서 요구사항을 생성합니다.',
                    },
                    personaId: { type: SchemaType.STRING, description: '페르소나 ID (client)' },
                },
                required: ['query'],
                },
            },
            {
                name: 'product_owner_agent',
                description: '제품 책임자 에이전트입니다.',
                parameters: {
                type: SchemaType.OBJECT,
                properties: {
                    query: {
                    type: SchemaType.STRING,
                    description: '제품 책임자 관점에서 요구사항을 생성합니다.',
                    },
                    personaId: { type: SchemaType.STRING, description: '페르소나 ID (product_owner)' },
                },
                required: ['query'],
                },
            },
            {
                name: 'sales_agent',
                description: '세일즈 에이전트입니다.',
                parameters: {
                type: SchemaType.OBJECT,
                properties: {
                    query: {
                    type: SchemaType.STRING,
                    description: '세일즈 관점에서 요구사항을 생성합니다.',
                    },
                    personaId: { type: SchemaType.STRING, description: '페르소나 ID (sales)' },
                },
                required: ['query'],
                },
            },
            {
                name: 'marketing_agent',
                description: '마케팅 에이전트입니다.',
                parameters: {
                type: SchemaType.OBJECT,
                properties: {
                    query: {
                    type: SchemaType.STRING,
                    description: '마케팅 관점에서 요구사항을 생성합니다.',
                    },
                    personaId: { type: SchemaType.STRING, description: '페르소나 ID (marketing)' },
                },
                required: ['query'],
                },
            },
            {
                name: 'business_agent',
                description: '비즈니스 에이전트입니다.',
                parameters: {
                type: SchemaType.OBJECT,
                properties: {
                    query: {
                    type: SchemaType.STRING,
                    description: '비즈니스 관점에서 요구사항을 생성합니다.',
                    },
                    personaId: { type: SchemaType.STRING, description: '페르소나 ID (business)' },
                },
                required: ['query'],
                },
            },
            {
                name: 'hr_agent',
                description: '인사 에이전트입니다.',
                parameters: {
                type: SchemaType.OBJECT,
                properties: {
                    query: {
                    type: SchemaType.STRING,
                    description: '인사 관점에서 요구사항을 생성합니다.',
                    },
                    personaId: { type: SchemaType.STRING, description: '페르소나 ID (hr)' },
                },
                required: ['query'],
                },
            },
            {
                name: 'legal_agent',
                description: '법무 에이전트입니다.',
                parameters: {
                type: SchemaType.OBJECT,
                properties: {
                    query: {
                    type: SchemaType.STRING,
                    description: '법무 관점에서 요구사항을 생성합니다.',
                    },
                    personaId: { type: SchemaType.STRING, description: '페르소나 ID (legal)' },
                },
                required: ['query'],
                },
            },
            {
                name: 'finance_agent',
                description: '재무 에이전트입니다.',
                parameters: {
                type: SchemaType.OBJECT,
                properties: {
                    query: {
                    type: SchemaType.STRING,
                    description: '재무 관점에서 요구사항을 생성합니다.',
                    },
                    personaId: { type: SchemaType.STRING, description: '페르소나 ID (finance)' },
                },
                required: ['query'],
                },
            },
        ],
  },
];