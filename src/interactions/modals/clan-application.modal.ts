import {
  ModalSubmitInteraction,
  EmbedBuilder,
  ChannelType,
} from "discord.js";
import { client } from "../../discord/client.js";
import { getPersona } from "../../personas/persona.config.js";
import { channels } from "../../config/channels.js";

// 👉 Put your staff forum channel ID here
const STAFF_FORUM_CHANNEL_ID = channels.staffApplicationsForum;

export async function handleClanApplicationModal(
  interaction: ModalSubmitInteraction,
) {
  if (interaction.customId !== "clan_application_modal") return;

  const agentName = interaction.fields.getTextInputValue("agent_name");
//   const platform = interaction.fields.getTextInputValue("platform");
  const playstyle = interaction.fields.getTextInputValue("playstyle");
  const experience = interaction.fields.getTextInputValue("experience");
  const motivation = interaction.fields.getTextInputValue("motivation");

  const persona = getPersona("ISAC");

  const embed = new EmbedBuilder()
    .setColor(persona.color)
    .setTitle(`📨 Candidature - ${agentName}`)
    .addFields(
      { name: "👤 Utilisateur", value: `<@${interaction.user.id}>`, inline: true },
      { name: "🆔 ID utilisateur", value: interaction.user.id, inline: false },
    //   { name: "🎮 Plateforme", value: platform, inline: true },
      { name: "🎯 Style de jeu", value: playstyle, inline: false },
      { name: "📊 Expérience", value: experience, inline: false },
      { name: "💬 Motivation", value: motivation, inline: false },
    )
    .setFooter({
      text: "Statut: En attente",
    })
    .setTimestamp();

  const channel = await client.channels.fetch(STAFF_FORUM_CHANNEL_ID);

  if (!channel || channel.type !== ChannelType.GuildForum) {
    throw new Error("Invalid forum channel.");
  }

  const existingThread = channel.threads.cache.find((thread) =>
    thread.name.includes(`[${interaction.user.id}]`),
  );

  if (existingThread) {
    await interaction.reply({
        content:
        "Vous avez déjà une candidature en cours d'examen. Merci de patienter pendant que le staff l'étudie.",
        ephemeral: true,
    });
    return;
  }

  await channel.threads.create({
    name: `Candidature - ${agentName} [${interaction.user.id}]`,
    message: {
      embeds: [embed],
    },
  });

  await interaction.reply({
    content:
      "Votre candidature a été envoyée au staff. Vous serez contacté prochainement.",
    ephemeral: true,
  });
}