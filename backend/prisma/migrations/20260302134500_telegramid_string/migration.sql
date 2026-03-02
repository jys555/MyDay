-- Change telegramId to TEXT (store Telegram IDs as strings)
ALTER TABLE "User"
ALTER COLUMN "telegramId" TYPE TEXT
USING "telegramId"::text;

