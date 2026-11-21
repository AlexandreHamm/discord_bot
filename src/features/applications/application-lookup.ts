import { ForumChannel, ThreadChannel } from "discord.js";
import { applicationsConfig } from "../../config/applications.js";

function isThreadRecent(thread: ThreadChannel) {
  const cooldownMs =
    applicationsConfig.reapplyCooldownDays * 24 * 60 * 60 * 1000;

  return Date.now() - thread.createdTimestamp < cooldownMs;
}

async function threadBelongsToUser(thread: ThreadChannel, userId: string) {
  const starterMessage = await thread.fetchStarterMessage().catch(() => null);

  if (!starterMessage?.embeds.length) {
    return false;
  }

  const embed = starterMessage.embeds[0];

  return embed.fields.some((field) => field.value.includes(userId));
}

async function findMatchingThread(
  threads: Iterable<ThreadChannel>,
  userId: string,
) {
  for (const thread of threads) {
    if (!isThreadRecent(thread)) continue;

    const belongsToUser = await threadBelongsToUser(thread, userId);

    if (belongsToUser) {
      return thread;
    }
  }

  return null;
}

export async function findRecentApplicationThread(
  forum: ForumChannel,
  userId: string,
) {
  const activeThreads = await forum.threads.fetchActive();

  const activeMatch = await findMatchingThread(
    activeThreads.threads.values(),
    userId,
  );

  if (activeMatch) {
    return activeMatch;
  }

  const archivedThreads = await forum.threads.fetchArchived({
    type: "public",
    limit: 100,
  });

  return findMatchingThread(archivedThreads.threads.values(), userId);
}