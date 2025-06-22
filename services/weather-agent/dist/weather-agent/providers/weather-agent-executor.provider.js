"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var WeatherAgentExecutorProvider_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.WeatherAgentExecutorProvider = void 0;
const common_1 = require("@nestjs/common");
const generative_ai_1 = require("@google/generative-ai");
const weather_agent_response_task_dto_1 = require("../dto/weather-agent-response-task.dto");
let WeatherAgentExecutorProvider = WeatherAgentExecutorProvider_1 = class WeatherAgentExecutorProvider {
    logger = new common_1.Logger(WeatherAgentExecutorProvider_1.name);
    model;
    constructor() {
        if (!process.env.GEMINI_API_KEY) {
            throw new Error('GEMINI_API_KEY is not set in the environment variables.');
        }
        const genAI = new generative_ai_1.GoogleGenerativeAI(process.env.GEMINI_API_KEY);
        this.model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });
    }
    async executeTask(requestContextDto) {
        const userPrompt = requestContextDto.userMessage.parts.find(p => 'text' in p)?.text || '';
        this.logger.log(`Weather agent started for prompt: "${userPrompt}"`);
        try {
            const prompt = `You are a helpful assistant specializing in weather forecasts. Answer the following user query about weather: ${userPrompt}`;
            const result = await this.model.generateContent(prompt);
            const response = result.response;
            const responseText = response.text();
            return (0, weather_agent_response_task_dto_1.createCompletedTask)(responseText, requestContextDto);
        }
        catch (error) {
            this.logger.error(`Weather agent failed: ${error.message}`, error.stack);
            return (0, weather_agent_response_task_dto_1.createFailedTask)(`Weather agent processing error: ${error.message}`, requestContextDto);
        }
    }
};
exports.WeatherAgentExecutorProvider = WeatherAgentExecutorProvider;
exports.WeatherAgentExecutorProvider = WeatherAgentExecutorProvider = WeatherAgentExecutorProvider_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [])
], WeatherAgentExecutorProvider);
//# sourceMappingURL=weather-agent-executor.provider.js.map