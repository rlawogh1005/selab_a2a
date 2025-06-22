"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createCompletedTask = createCompletedTask;
exports.createFailedTask = createFailedTask;
const uuid_1 = require("uuid");
function createCompletedTask(responseText, context) {
    const taskId = context?.task?.id ?? (0, uuid_1.v4)();
    const contextId = context?.contextId ?? (0, uuid_1.v4)();
    return {
        kind: 'task',
        id: taskId,
        contextId: contextId,
        status: {
            state: 'completed',
            timestamp: new Date().toISOString(),
            message: {
                kind: 'message',
                role: 'agent',
                messageId: (0, uuid_1.v4)(),
                parts: [{ kind: 'text', text: responseText }],
                taskId: taskId,
                contextId: contextId,
            },
        },
        history: context?.history ?? [],
        artifacts: [],
    };
}
function createFailedTask(errorMessage, context) {
    const taskId = context?.task?.id ?? (0, uuid_1.v4)();
    const contextId = context?.contextId ?? (0, uuid_1.v4)();
    return {
        kind: 'task',
        id: taskId,
        contextId: contextId,
        status: {
            state: 'failed',
            timestamp: new Date().toISOString(),
            message: {
                kind: 'message',
                role: 'agent',
                messageId: (0, uuid_1.v4)(),
                parts: [{ kind: 'text', text: errorMessage }],
                taskId: taskId,
                contextId: contextId,
            },
        },
        history: context?.history ?? [],
        artifacts: [],
    };
}
//# sourceMappingURL=weather-agent-response-task.dto.js.map