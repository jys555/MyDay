import express from "express";
import helmet from "helmet";
import cors from "cors";
import morgan from "morgan";
import { env } from "./env";
import { authRouter } from "./routes/auth";
import { tasksRouter } from "./routes/tasks";
import { remindersRouter } from "./routes/reminders";
import { tagsRouter } from "./routes/tags";
import "./bot";

const app = express();

app.use(helmet());
app.use(
  cors({
    origin: env.TELEGRAM_BOT_WEBAPP_URL || "*",
    credentials: true
  })
);
app.use(express.json());
app.use(morgan("dev"));

app.get("/health", (_req, res) => {
  res.json({ status: "ok" });
});

app.use("/auth", authRouter);
app.use("/tasks", tasksRouter);
app.use("/reminders", remindersRouter);
app.use("/tags", tagsRouter);

const port = Number(env.PORT) || 4000;

app.listen(port, () => {
  // eslint-disable-next-line no-console
  console.log(`Backend listening on port ${port}`);
});

