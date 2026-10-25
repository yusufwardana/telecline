export type EventDirection = 'inbound' | 'outbound';
export type EventType =
  | 'telegram.message'
  | 'telegram.command'
  | 'cline.response'
  | 'task.progress'
  | 'task.cancelled'
  | 'error';

export interface EventEnvelope {
  eventId: string;
  direction: EventDirection;
  eventType: EventType;
  workspaceId: string;
  taskId?: string;
  timestamp: string;
  payload: Record<string, unknown>;
  correlationId: string;
  deliveryStatus: 'pending' | 'delivered' | 'queued' | 'failed';
}

export interface BridgeStatus {
  connected: boolean;
  status: 'connected' | 'disconnected' | 'connecting' | 'error';
  message: string;
  lastError?: string;
  workspaceId?: string;
}

export function createEventEnvelope(
  direction: EventDirection,
  eventType: EventType,
  workspaceId: string,
  payload: Record<string, unknown>,
  taskId?: string,
  correlationId?: string,
): EventEnvelope {
  return {
    eventId: `evt_${Date.now()}_${Math.random().toString(16).slice(2)}`,
    direction,
    eventType,
    workspaceId,
    taskId,
    timestamp: new Date().toISOString(),
    payload,
    correlationId: correlationId ?? `corr_${Math.random().toString(16).slice(2)}`,
    deliveryStatus: 'queued',
  };
}

export function splitTelegramMessage(content: string, maxLength = 4096): string[] {
  const trimmed = content.trim();
  if (!trimmed) {
    return [''];
  }

  if (trimmed.length <= maxLength) {
    return [trimmed];
  }

  const chunks: string[] = [];
  for (let index = 0; index < trimmed.length; index += maxLength) {
    chunks.push(trimmed.slice(index, index + maxLength));
  }

  return chunks;
}
