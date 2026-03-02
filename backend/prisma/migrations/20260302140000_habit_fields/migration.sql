-- Add enums for habit features
CREATE TYPE "TaskKind" AS ENUM ('regular', 'one_time');
CREATE TYPE "TimeOfDay" AS ENUM ('anytime', 'morning', 'afternoon', 'evening');
CREATE TYPE "GoalType" AS ENUM ('off', 'duration', 'repeat');

-- Add columns to Task
ALTER TABLE "Task"
  ADD COLUMN "kind" "TaskKind" NOT NULL DEFAULT 'one_time',
  ADD COLUMN "repeatDays" TEXT[] NOT NULL DEFAULT '{}',
  ADD COLUMN "timeOfDay" "TimeOfDay" NOT NULL DEFAULT 'anytime',
  ADD COLUMN "goalType" "GoalType" NOT NULL DEFAULT 'off',
  ADD COLUMN "goalMinutes" INTEGER,
  ADD COLUMN "goalReps" INTEGER,
  ADD COLUMN "icon" TEXT,
  ADD COLUMN "color" TEXT;

