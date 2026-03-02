-- Alter telegramId to BIGINT to support Telegram int64 user IDs
ALTER TABLE "User"
ALTER COLUMN "telegramId" TYPE BIGINT
USING "telegramId"::bigint;

