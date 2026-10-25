import { describe, expect, it } from 'vitest';
import { createTelegramGateway } from '../../apps/telegram-gateway/src/index.js';
import { isAuthorizedTelegramChat, isAuthorizedTelegramUser, redactSensitiveContent } from '../../packages/security/src/index.js';

describe('teleline gateway', () => {
  it('authorizes configured Telegram user ids', () => {
    expect(isAuthorizedTelegramUser('123', ['123', '456'])).toBe(true);
    expect(isAuthorizedTelegramUser('999', ['123', '456'])).toBe(false);
  });

  it('authorizes configured Telegram chat ids', () => {
    expect(isAuthorizedTelegramChat('987', ['987'])).toBe(true);
  });

  it('redacts sensitive content', () => {
    const redacted = redactSensitiveContent('token=abc123 secret=xyz', {
      enabled: true,
      patterns: ['token=[A-Za-z0-9]+', 'secret=[A-Za-z0-9]+'],
    });
    expect(redacted).toContain('[REDACTED]');
    expect(redacted).not.toContain('abc123');
  });

  it('creates a gateway with valid config', async () => {
    const gateway = await createTelegramGateway({
      botToken: '123:ABC',
      authorizedUserIds: ['123'],
      authorizedChatIds: ['456'],
      rejectGroups: true,
    });

    expect(gateway).toBeTruthy();
    expect(typeof gateway.start).toBe('function');
    expect(typeof gateway.stop).toBe('function');
  });
});
