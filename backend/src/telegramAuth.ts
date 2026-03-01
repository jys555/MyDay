import crypto from "crypto";
import { prisma } from "./prisma";

export interface TelegramAuthPayload {
  id: number;
  username?: string;
  first_name?: string;
}

export interface TelegramInitData {
  auth_date: string;
  hash: string;
  query_id?: string;
  user?: string;
}

const BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN ?? "";

function getCheckString(data: Record<string, string>): string {
  const entries = Object.entries(data)
    .filter(([key]) => key !== "hash")
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([key, value]) => `${key}=${value}`);

  return entries.join("\n");
}

export function verifyTelegramInitData(initData: URLSearchParams): TelegramAuthPayload | null {
  if (!BOT_TOKEN) {
    throw new Error("TELEGRAM_BOT_TOKEN is not configured");
  }

  const data: Record<string, string> = {};
  initData.forEach((value, key) => {
    data[key] = value;
  });

  const hash = data["hash"];
  if (!hash) {
    return null;
  }

  const checkString = getCheckString(data);

  const secretKey = crypto.createHmac("sha256", "WebAppData").update(BOT_TOKEN).digest();
  const computedHash = crypto.createHmac("sha256", secretKey).update(checkString).digest("hex");

  if (computedHash !== hash) {
    return null;
  }

  if (!data["user"]) {
    return null;
  }

  const user = JSON.parse(data["user"]);

  return {
    id: user.id,
    username: user.username,
    first_name: user.first_name
  };
}

export async function findOrCreateUserFromTelegram(auth: TelegramAuthPayload) {
  const existing = await prisma.user.findUnique({
    where: { telegramId: auth.id }
  });

  if (existing) {
    return prisma.user.update({
      where: { id: existing.id },
      data: {
        username: auth.username ?? existing.username,
        firstName: auth.first_name ?? existing.firstName
      }
    });
  }

  return prisma.user.create({
    data: {
      telegramId: auth.id,
      username: auth.username,
      firstName: auth.first_name
    }
  });
}

