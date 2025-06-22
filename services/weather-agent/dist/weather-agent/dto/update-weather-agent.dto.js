"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UpdateWeatherAgentDto = void 0;
const mapped_types_1 = require("@nestjs/mapped-types");
const create_weather_agent_dto_1 = require("./create-weather-agent.dto");
class UpdateWeatherAgentDto extends (0, mapped_types_1.PartialType)(create_weather_agent_dto_1.CreateWeatherAgentDto) {
}
exports.UpdateWeatherAgentDto = UpdateWeatherAgentDto;
//# sourceMappingURL=update-weather-agent.dto.js.map