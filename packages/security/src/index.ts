export type SensitiveRedactorConfig = {
  enabled: boolean;
  patterns: string[];
};

export function redactSensitiveContent(value: string, config: SensitiveRedactorConfig): string {
  if (!config.enabled || !value) return value;
  let redacted = value;
  for (const pattern of config.patterns) {
    if (!pattern) continue;
    redacted = redacted.replace(new RegExp(pattern, 'gi'), '[REDACTED]');
  }
  return redacted;
}

export function isAuthorizedTelegramUser(userId: number | string | undefined, allowed: Array<number | string>): boolean {
  if (userId === undefined || userId === null) return false;
  const normalizedUserId = String(userId);
  return allowed.some((item) => String(item) === normalizedUserId);
}

export function isAuthorizedTelegramChat(chatId: number | string | undefined, allowed: Array<number | string>): boolean {
  if (chatId === undefined || chatId === null) return false;
  const normalizedChatId = String(chatId);
  return allowed.some((item) => String(item) === normalizedChatId);
}

export function sanitizeWorkspaceId(workspaceId: string): string {
  return workspaceId.replace(/[^a-zA-Z0-9_-]+/g, '_').slice(0, 255) || 'default';
}
