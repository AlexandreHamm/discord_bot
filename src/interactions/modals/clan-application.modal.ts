import {
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle,
  ModalSubmitInteraction,
  EmbedBuilder,
  ChannelType,
} from "discord.js";
import { botConfig } from "../../config/bot.js";
import { client } from "../../discord/client.js";
import { channels } from "../../config/channels.js";
import { getForumTagIdByName } from "../../utils/forum-tags.js";
import { findRecentApplicationThread } from "../../features/applications/application-lookup.js";

// 👉 Put your staff forum channel ID here
const STAFF_FORUM_CHANNEL_ID = channels.staffApplicationsForum;

export async function handleClanApplicationModal(
  interaction: ModalSubmitInteraction,
) {
  if (interaction.customId !== "clan_application_modal") return;

  const agentName = interaction.fields.getTextInputValue("agent_name");
//   const platform = interaction.fields.getTextInputValue("platform");
  const shdLevel = interaction.fields.getTextInputValue("shd_level");
  const experience = interaction.fields.getTextInputValue("experience");
  const motivation = interaction.fields.getTextInputValue("motivation");

  const embedTitle = `📨 Candidature - ${agentName}`;

  const embed = new EmbedBuilder()
    .setColor(botConfig.color)
    .setTitle(embedTitle.padEnd(256 - embedTitle.length) + '\u200B')
    .addFields(
      { name: "", value: interaction.user.id, inline: true },
      { name: "👤 Utilisateur", value: `<@${interaction.user.id}>`, inline: false },
    //   { name: "🎮 Plateforme", value: platform, inline: true },
      { name: "⌚ Niveau SHD", value: shdLevel, inline: true },
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

  const existingThread = await findRecentApplicationThread(
    channel,
    interaction.user.id,
  );

  if (existingThread) {
    await interaction.reply({
      content:
        "Vous avez déjà une candidature récente en cours ou traitée. Merci de patienter avant de refaire une demande.",
      flags: 64,
    });
    return;
  }

  const pendingTagId = getForumTagIdByName(channel, "En attente");

  const staffActionsRow = new ActionRowBuilder<ButtonBuilder>().addComponents(
    new ButtonBuilder()
      .setCustomId("application_accept")
      .setLabel("Accepter")
      .setEmoji("✅")
      .setStyle(ButtonStyle.Success),

    new ButtonBuilder()
      .setCustomId("application_deny")
      .setLabel("Refuser")
      .setEmoji("❌")
      .setStyle(ButtonStyle.Danger),
  );

  const thread = await channel.threads.create({
    name: `Candidature - ${agentName}`,
    appliedTags: [pendingTagId],
    message: {
      embeds: [embed],
      components: [staffActionsRow],
    },
  });

  await interaction.reply({
    content:
      "Votre candidature a été envoyée au staff. Vous serez contacté prochainement.",
    flags: 64,
  });

  await thread.send({
    poll: {
      question: {
        text: "Avis sur la candidature ?",
      },
      answers: [
        {
          text: "Pour",
          emoji: "✅",
        },
        {
          text: "Contre",
          emoji: "❌",
        },
      ],
      duration: 168,
      allowMultiselect: false,
    },
  });
}