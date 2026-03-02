import dotenv from "dotenv";

dotenv.config();

export const env = {
  NODE_ENV: process.env.NODE_ENV ?? "development",
  PORT: process.env.PORT ?? "4000",
  DATABASE_URL: process.env.DATABASE_URL ?? "",
  TELEGRAM_BOT_TOKEN: process.env.TELEGRAM_BOT_TOKEN ?? "",
  TELEGRAM_BOT_WEBAPP_URL: process.env.TELEGRAM_BOT_WEBAPP_URL ?? "",
  TELEGRAM_BOT_SECRET: process.env.TELEGRAM_BOT_SECRET ?? "",
  // CORS_ORIGIN is optional - defaults to "*" if not set
  CORS_ORIGIN: process.env.CORS_ORIGIN || "*"
};

if (!env.DATABASE_URL) {
  // eslint-disable-next-line no-console
  console.warn("DATABASE_URL is not set");
}

if (!env.TELEGRAM_BOT_TOKEN) {
  console.warn("TELEGRAM_BOT_TOKEN is not set");
}

