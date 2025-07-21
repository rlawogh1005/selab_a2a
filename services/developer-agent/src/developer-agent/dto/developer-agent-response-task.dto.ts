import { Task } from '@a2a-js/sdk';
import { v4 as uuidv4 } from 'uuid';
import { DeveloperAgentRequestContextDto } from './developer-agent-request-context.dto';

export function createCompletedTask(
  responseText: string,
  context?: DeveloperAgentRequestContextDto,
): Task {
  const taskId = context?.task?.id ?? uuidv4();
  const contextId = context?.contextId ?? uuidv4();
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
        messageId: uuidv4(),
        parts: [{ kind: 'text', text: responseText }],
        taskId: taskId,
        contextId: contextId,
      },
    },
    history: context?.history ?? [],
    artifacts: [],
  };
}

export function createFailedTask(
  errorMessage: string,
  context?: DeveloperAgentRequestContextDto,
): Task {
  const taskId = context?.task?.id ?? uuidv4();
  const contextId = context?.contextId ?? uuidv4();
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
        messageId: uuidv4(),
        parts: [{ kind: 'text', text: errorMessage }],
        taskId: taskId,
        contextId: contextId,
      },
    },
    history: context?.history ?? [],
    artifacts: [],
  };
} 