import { Router } from "express";
import { prisma } from "../prisma";

export const remindersRouter = Router();

remindersRouter.use((req, res, next) => {
  const userId = req.header("x-user-id");
  if (!userId) {
    return res.status(401).json({ error: "Missing x-user-id header" });
  }
  (req as any).userId = parseInt(userId, 10);
  next();
});

remindersRouter.get("/", async (req, res) => {
  const userId = (req as any).userId as number;
  const reminders = await prisma.reminder.findMany({
    where: { userId },
    include: { task: true },
    orderBy: { remindAt: "asc" }
  });
  res.json({ reminders });
});

remindersRouter.post("/", async (req, res) => {
  const userId = (req as any).userId as number;
  const { taskId, remindAt } = req.body;

  if (!taskId || !remindAt) {
    return res.status(400).json({ error: "taskId and remindAt are required" });
  }

  const task = await prisma.task.findFirst({
    where: { id: taskId, userId }
  });
  if (!task) {
    return res.status(404).json({ error: "Task not found" });
  }

  const reminder = await prisma.reminder.create({
    data: {
      userId,
      taskId,
      remindAt: new Date(remindAt)
    }
  });

  res.status(201).json({ reminder });
});

