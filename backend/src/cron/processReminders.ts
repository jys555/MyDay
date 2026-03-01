import { prisma } from "../prisma";
import { sendReminder } from "../bot";

export async function processDueReminders() {
  const now = new Date();

  const reminders = await prisma.reminder.findMany({
    where: {
      sentAt: null,
      remindAt: { lte: now },
      user: {
        chatId: { not: null }
      }
    },
    include: {
      task: true,
      user: true
    }
  });

  for (const reminder of reminders) {
    const chatId = reminder.user.chatId;
    if (!chatId) continue;

    try {
      await sendReminder(chatId, reminder.task.title, reminder.task.dueAt);
      await prisma.reminder.update({
        where: { id: reminder.id },
        data: { sentAt: new Date() }
      });
    } catch (err) {
      // eslint-disable-next-line no-console
      console.error("Failed to send reminder", reminder.id, err);
    }
  }
}

