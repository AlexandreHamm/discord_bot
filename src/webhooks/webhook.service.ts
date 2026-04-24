import {
  ChannelType,
  EmbedBuilder,
  TextChannel,
  WebhookClient,
} from "discord.js";
import { client } from "../discord/client.js";
import { getPersona } from "../personas/persona.config.js";
import type { PersonaId } from "../personas/persona.types.js";

type SendPersonaMessageOptions = {
  channelId: string;
  persona: PersonaId;
  embeds: EmbedBuilder[];
  components?: any[];
};

export async function sendPersonaMessage({
  channelId,
  persona,
  embeds,
  components,
}: SendPersonaMessageOptions) {
  const channel = await client.channels.fetch(channelId);

  if (!channel || channel.type !== ChannelType.GuildText) {
    throw new Error(`Channel ${channelId} is not a text channel.`);
  }

  const textChannel = channel as TextChannel;
  const personaConfig = getPersona(persona);

  const webhooks = await textChannel.fetchWebhooks();

  let webhook = webhooks.find(
    (hook) => hook.owner?.id === client.user?.id && hook.name === "ISAC Persona",
  );

  if (!webhook) {
    webhook = await textChannel.createWebhook({
      name: "ISAC Persona",
      avatar: client.user?.displayAvatarURL(),
      reason: "Create persona webhook for ISAC bot messages.",
    });
  }

  const webhookClient = new WebhookClient({
    id: webhook.id,
    token: webhook.token!,
  });

  return webhookClient.send({
    username: personaConfig.displayName,
    avatarURL: personaConfig.avatarUrl,
    embeds,
    components,
  });
}