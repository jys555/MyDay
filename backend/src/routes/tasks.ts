import { Router } from "express";
import { prisma } from "../prisma";

export const tasksRouter = Router();

// Simple auth middleware using header x-user-id (user.id from auth step)
tasksRouter.use(async (req, res, next) => {
  const userId = req.header("x-user-id");
  if (!userId) {
    return res.status(401).json({ error: "Missing x-user-id header" });
  }
  (req as any).userId = parseInt(userId, 10);
  next();
});

tasksRouter.get("/", async (req, res) => {
  const userId = (req as any).userId as number;
  const tasks = await prisma.task.findMany({
    where: { userId },
    include: { taskTags: { include: { tag: true } }, reminders: true },
    orderBy: { dueAt: "asc" }
  });

  res.json({ tasks });
});

tasksRouter.post("/", async (req, res) => {
  const userId = (req as any).userId as number;
  const {
    title,
    description,
    status,
    priority,
    dueAt,
    tagIds,
    kind,
    repeatDays,
    timeOfDay,
    goalType,
    goalMinutes,
    goalReps,
    icon,
    color
  } = req.body;

  if (!title) {
    return res.status(400).json({ error: "Title is required" });
  }

  const task = await prisma.task.create({
    data: {
      userId,
      title,
      description,
      status,
      priority,
      dueAt: dueAt ? new Date(dueAt) : null,
      kind,
      repeatDays,
      timeOfDay,
      goalType,
      goalMinutes,
      goalReps,
      icon,
      color,
      taskTags: tagIds
        ? {
            createMany: {
              data: (tagIds as number[]).map((tagId) => ({ tagId }))
            }
          }
        : undefined
    },
    include: { taskTags: { include: { tag: true } } }
  });

  res.status(201).json({ task });
});

tasksRouter.patch("/:id", async (req, res) => {
  const userId = (req as any).userId as number;
  const id = parseInt(req.params.id, 10);
  const {
    title,
    description,
    status,
    priority,
    dueAt,
    tagIds,
    kind,
    repeatDays,
    timeOfDay,
    goalType,
    goalMinutes,
    goalReps,
    icon,
    color
  } = req.body;

  const existing = await prisma.task.findFirst({ where: { id, userId } });
  if (!existing) {
    return res.status(404).json({ error: "Task not found" });
  }

  const task = await prisma.task.update({
    where: { id },
    data: {
      title,
      description,
      status,
      priority,
      dueAt: dueAt ? new Date(dueAt) : null,
      kind,
      repeatDays,
      timeOfDay,
      goalType,
      goalMinutes,
      goalReps,
      icon,
      color,
      ...(Array.isArray(tagIds)
        ? {
            taskTags: {
              deleteMany: {},
              createMany: {
                data: (tagIds as number[]).map((tagId) => ({ tagId }))
              }
            }
          }
        : {})
    },
    include: { taskTags: { include: { tag: true } } }
  });

  res.json({ task });
});

tasksRouter.delete("/:id", async (req, res) => {
  const userId = (req as any).userId as number;
  const id = parseInt(req.params.id, 10);

  const existing = await prisma.task.findFirst({ where: { id, userId } });
  if (!existing) {
    return res.status(404).json({ error: "Task not found" });
  }

  await prisma.task.delete({ where: { id } });

  res.status(204).send();
});

