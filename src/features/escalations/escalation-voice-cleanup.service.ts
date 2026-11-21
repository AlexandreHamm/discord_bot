import { ChannelType, Events, VoiceState } from "discord.js";
import { client } from "../../discord/client.js";
import { env } from "../../config/env.js";

const cleanupTimers = new Map<string, NodeJS.Timeout>();
const CLEANUP_DELAY_MS = 10 * 60 * 1000;

function isEscalationVoiceChannel(channelId?: string | null) {
  if (!channelId) return false;

  const channel = client.channels.cache.get(channelId);

  return (
    channel?.type === ChannelType.GuildVoice &&
    channel.parentId === env.escalationCategoryId
  );
}

export async function scheduleEscalationVoiceCleanup(channelId: string) {
  if (cleanupTimers.has(channelId)) return;

  const timer = setTimeout(async () => {
    cleanupTimers.delete(channelId);

    const channel = await client.channels.fetch(channelId).catch(() => null);

    if (!channel || channel.type !== ChannelType.GuildVoice) return;
    if (channel.parentId !== env.escalationCategoryId) return;
    if (channel.members.size > 0) return;

    await channel.delete("Escalation voice channel inactive.").catch(() => null);
  }, CLEANUP_DELAY_MS);

  cleanupTimers.set(channelId, timer);
}

function cancelCleanup(channelId: string) {
  const timer = cleanupTimers.get(channelId);

  if (!timer) return;

  clearTimeout(timer);
  cleanupTimers.delete(channelId);
}

export function registerEscalationVoiceCleanup() {
  client.on(
    Events.VoiceStateUpdate,
    async (oldState: VoiceState, newState: VoiceState) => {
      const oldChannelId = oldState.channelId;
      const newChannelId = newState.channelId;

      if (oldChannelId && isEscalationVoiceChannel(oldChannelId)) {
        const oldChannel = oldState.guild.channels.cache.get(oldChannelId);

        if (
          oldChannel?.type === ChannelType.GuildVoice &&
          oldChannel.members.size === 0
        ) {
          await scheduleEscalationVoiceCleanup(oldChannelId);
        }
      }

      if (newChannelId && isEscalationVoiceChannel(newChannelId)) {
        cancelCleanup(newChannelId);
      }
    },
  );
}