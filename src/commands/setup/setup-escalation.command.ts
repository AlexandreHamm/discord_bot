import {
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle,
  ChatInputCommandInteraction,
  EmbedBuilder,
  PermissionFlagsBits,
  SlashCommandBuilder,
} from "discord.js";
import { botConfig } from "../../config/bot.js";
import { sendBotMessage } from "../../utils/send-bot-message.js";

export default {
  data: new SlashCommandBuilder()
    .setName("setup-escalation")
    .setDescription("Posts the Escalation matchmaking panel.")
    .setDefaultMemberPermissions(PermissionFlagsBits.ManageGuild),

  async execute(interaction: ChatInputCommandInteraction) {
    await interaction.deferReply({ flags: 64 });

    if (!interaction.channelId) {
      await interaction.editReply("Impossible de détecter le salon actuel.");
      return;
    }

    const embed = new EmbedBuilder()
      .setColor(botConfig.color)
      .setTitle("💎 Escalation Matchmaking")
      .setDescription(
        [
          "🇫🇷 Créez une équipe Escalade.",
          "",
          "🇬🇧 Start an Escalation matchmaking.",
          "",
          "**Choisissez votre langue / Choose your language:**",
        ].join("\n"),
      )
      .setFooter({
        text: "I.S.A.C • Escalation Matchmaking".padEnd(164) + "\u200B",
      });

    const row = new ActionRowBuilder<ButtonBuilder>().addComponents(
      new ButtonBuilder()
        .setCustomId("escalation_create_fr")
        .setLabel("Français")
        .setEmoji("🇫🇷")
        .setStyle(ButtonStyle.Primary),

      new ButtonBuilder()
        .setCustomId("escalation_create_en")
        .setLabel("English")
        .setEmoji("🇬🇧")
        .setStyle(ButtonStyle.Primary),
    );

    await sendBotMessage(interaction.channel!, {
      embeds: [embed],
      components: [row],
    });

    await interaction.deleteReply().catch(() => null);
  },
};