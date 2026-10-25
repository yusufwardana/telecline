import { Bot } from 'grammy';
import { z } from 'zod';

export const TelegramGatewayConfigSchema = z.object({
  botToken: z.string().min(1),
  authorizedUserIds: z.array(z.union([z.number(), z.string()])).default([]),
  authorizedChatIds: z.array(z.union([z.number(), z.string()])).default([]),
  rejectGroups: z.boolean().default(true),
});

export type TelegramGatewayConfig = z.infer<typeof TelegramGatewayConfigSchema>;

export async function createTelegramGateway(config: TelegramGatewayConfig) {
  const parsed = TelegramGatewayConfigSchema.parse(config);
  const bot = new Bot(parsed.botToken);

  bot.command('start', async (ctx) => {
    const userId = ctx.from?.id;
    const chatId = ctx.chat.id;
    if (userId === undefined || parsed.authorizedUserIds.length === 0 || !parsed.authorizedUserIds.includes(String(userId))) {
      await ctx.reply('Unauthorized Telegram account.');
      return;
    }
    if (parsed.rejectGroups && ctx.chat.type === 'group') {
      await ctx.reply('Group chats are not supported.');
      return;
    }
    await ctx.reply(`TeleCline ready. Chat: ${chatId}`);
  });

  bot.command('help', async (ctx) => {
    await ctx.reply('TeleCline commands: /start /help /status /projects /use /tasks /cancel /ping');
  });

  bot.command('status', async (ctx) => {
    await ctx.reply('Bridge status: connected');
  });

  return {
    bot,
    start: async () => {
      await bot.start();
      return true;
    },
    stop: async () => {
      await bot.stop();
      return true;
    },
  };
}
