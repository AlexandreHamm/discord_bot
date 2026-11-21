import type { MessageCreateOptions, TextBasedChannel } from "discord.js";

export async function sendBotMessage(
  channel: TextBasedChannel,
  payload: MessageCreateOptions,
) {
  return channel.send(payload);
}
