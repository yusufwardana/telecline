import type { BridgeStatus, EventEnvelope } from '@telecline/shared';

export interface ClineTaskInfo {
  id: string;
  label: string;
  status: 'active' | 'completed' | 'cancelled' | 'error';
}

export interface ClineAdapterOptions {
  workspaceId: string;
}

export class ClineAdapter {
  public readonly workspaceId: string;

  constructor(options: ClineAdapterOptions) {
    this.workspaceId = options.workspaceId;
  }

  public async sendInstruction(instruction: string): Promise<{ accepted: boolean; result?: string; error?: string }> {
    if (!instruction?.trim()) {
      return { accepted: false, error: 'Instruction cannot be empty' };
    }

    return {
      accepted: true,
      result: `Instruction queued for workspace ${this.workspaceId}: ${instruction}`,
    };
  }

  public async forwardResponse(event: EventEnvelope): Promise<void> {
    if (!event || !event.eventId) {
      throw new Error('Invalid event envelope');
    }
  }

  public async getStatus(): Promise<BridgeStatus> {
    return {
      connected: true,
      status: 'connected',
      message: 'Cline adapter connected',
      workspaceId: this.workspaceId,
    };
  }

  public async listTasks(): Promise<ClineTaskInfo[]> {
    return [
      { id: 'default-task', label: 'Default task', status: 'active' },
    ];
  }
}
