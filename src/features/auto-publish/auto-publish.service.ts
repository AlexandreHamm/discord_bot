import { ChannelType, Events, MessageFlags } from "discord.js";
import { client } from "../../discord/client.js";

// This marker in an announcement channel's topic survives bot restarts.
export const AUTO_PUBLISH_TOPIC_MARKER = "[I.S.A.C. auto-publish]";

export function isAutoPublishEnabled(topic: string | null): boolean {
  return (topic ?? "")
    .split(/\r?\n/)
    .some((line) => line.trim() === AUTO_PUBLISH_TOPIC_MARKER);
}

export function buildAutoPublishTopic(
  topic: string | null,
  enabled: boolean,
): string | null {
  const previousTopic = (topic ?? "")
    .split(/\r?\n/)
    .filter((line) => line.trim() !== AUTO_PUBLISH_TOPIC_MARKER)
    .join("\n")
    .trimEnd();

  if (!enabled) return previousTopic || null;

  return previousTopic
    ? `${previousTopic}\n${AUTO_PUBLISH_TOPIC_MARKER}`
    : AUTO_PUBLISH_TOPIC_MARKER;
}

export function registerAutoPublish(): void {
  client.on(Events.MessageCreate, async (message) => {
    if (!message.inGuild()) return;
    if (message.channel.type !== ChannelType.GuildAnnouncement) return;
    if (!isAutoPublishEnabled(message.channel.topic)) return;

    // Skip system messages and anything already published/relayed.
    if (
      message.system ||
      message.flags.has(MessageFlags.Crossposted) ||
      message.flags.has(MessageFlags.IsCrosspost)
    ) {
      return;
    }

    // Works for member, bot and webhook messages without MessageContent intent.
    try {
      await message.crosspost();
    } catch (error) {
      console.error(
        `Auto-publish failed for message ${message.id} in ${message.channelId}:`,
        error,
      );
    }
  });
}
