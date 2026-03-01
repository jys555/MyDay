import { Router } from "express";
import { prisma } from "../prisma";

export const tagsRouter = Router();

tagsRouter.use((req, res, next) => {
  const userId = req.header("x-user-id");
  if (!userId) {
    return res.status(401).json({ error: "Missing x-user-id header" });
  }
  (req as any).userId = parseInt(userId, 10);
  next();
});

tagsRouter.get("/", async (req, res) => {
  const userId = (req as any).userId as number;
  const tags = await prisma.tag.findMany({
    where: { userId },
    orderBy: { name: "asc" }
  });
  res.json({ tags });
});

tagsRouter.post("/", async (req, res) => {
  const userId = (req as any).userId as number;
  const { name } = req.body;
  if (!name) {
    return res.status(400).json({ error: "Name is required" });
  }
  const tag = await prisma.tag.create({
    data: {
      userId,
      name
    }
  });
  res.status(201).json({ tag });
});

tagsRouter.patch("/:id", async (req, res) => {
  const userId = (req as any).userId as number;
  const id = parseInt(req.params.id, 10);
  const { name } = req.body;

  const existing = await prisma.tag.findFirst({ where: { id, userId } });
  if (!existing) {
    return res.status(404).json({ error: "Tag not found" });
  }

  const tag = await prisma.tag.update({
    where: { id },
    data: { name }
  });
  res.json({ tag });
});

tagsRouter.delete("/:id", async (req, res) => {
  const userId = (req as any).userId as number;
  const id = parseInt(req.params.id, 10);

  const existing = await prisma.tag.findFirst({ where: { id, userId } });
  if (!existing) {
    return res.status(404).json({ error: "Tag not found" });
  }

  await prisma.tag.delete({ where: { id } });

  res.status(204).send();
});

