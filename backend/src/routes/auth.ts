import { Router } from "express";
import { findOrCreateUserFromTelegram, verifyTelegramInitData } from "../telegramAuth";

export const authRouter = Router();

authRouter.post("/telegram", async (req, res) => {
  try {
    const { initData } = req.body as { initData?: string };
    if (!initData) {
      return res.status(400).json({ error: "initData is required" });
    }

    const params = new URLSearchParams(initData);
    const auth = verifyTelegramInitData(params);

    if (!auth) {
      return res.status(401).json({ error: "Invalid initData" });
    }

    const user = await findOrCreateUserFromTelegram(auth);

    return res.json({
      user: {
        id: user.id,
        telegramId: user.telegramId,
        username: user.username,
        firstName: user.firstName,
        timezone: user.timezone,
        chatId: user.chatId
      }
    });
  } catch (err) {
    // eslint-disable-next-line no-console
    console.error(err);
    return res.status(500).json({ error: "Internal server error" });
  }
});

