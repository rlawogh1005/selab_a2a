"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.WeatherAgentCardProvider = void 0;
const common_1 = require("@nestjs/common");
let WeatherAgentCardProvider = class WeatherAgentCardProvider {
    agentCard = {
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
    getCard() {
        return this.agentCard;
    }
};
exports.WeatherAgentCardProvider = WeatherAgentCardProvider;
exports.WeatherAgentCardProvider = WeatherAgentCardProvider = __decorate([
    (0, common_1.Injectable)()
], WeatherAgentCardProvider);
//# sourceMappingURL=weather-agent-card.provider.js.map