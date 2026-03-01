import TelegramBot from "node-telegram-bot-api";
import { prisma } from "./prisma";
import { env } from "./env";

export const bot = new TelegramBot(env.TELEGRAM_BOT_TOKEN, {
  polling: env.NODE_ENV === "development"
});

const WEBAPP_URL = env.TELEGRAM_BOT_WEBAPP_URL;

bot.onText(/\/start/, async (msg: TelegramBot.Message) => {
  const chatId = msg.chat.id.toString();
  const from = msg.from;

  if (!from) return;

  await prisma.user.upsert({
    where: { telegramId: from.id },
    update: {
      chatId,
      username: from.username ?? undefined,
      firstName: from.first_name ?? undefined
    },
    create: {
      telegramId: from.id,
      chatId,
      username: from.username,
      firstName: from.first_name
    }
  });

  const text =
    "👋 Welcome to MyDay!\n\nA focused daily planner for your tasks and reminders.\nOpen the app below to get started.";

  const replyMarkup: TelegramBot.SendMessageOptions["reply_markup"] = WEBAPP_URL
    ? {
        inline_keyboard: [
          [
            {
              text: "Open MyDay",
              web_app: { url: WEBAPP_URL }
            }
          ]
        ]
      }
    : undefined;

  await bot.sendMessage(chatId, text, {
    reply_markup: replyMarkup
  });
});

export async function sendReminder(chatId: string, title: string, dueAt?: Date | null) {
  const lines = ["⏰ MyDay Reminder:", title];
  if (dueAt) {
    lines.push(`Time: ${dueAt.toLocaleString()}`);
  }
  const text = lines.join("\n");
  await bot.sendMessage(chatId, text);
}

