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
    .setName("setup-roles")
    .setDescription("Posts the language role panel.")
    .setDefaultMemberPermissions(PermissionFlagsBits.ManageGuild),

  async execute(interaction: ChatInputCommandInteraction) {
    await interaction.deferReply({ flags: 64 });

    if (!interaction.channelId) {
      await interaction.editReply("Impossible de détecter le salon actuel.");
      return;
    }

    const embed = new EmbedBuilder()
      .setColor(botConfig.color)
      .setTitle("🌐 Langues / Languages")
      .setDescription(
        [
          ":flag_fr: - Sélectionnez les langues que vous souhaitez voir sur le serveur.",
          "Vous pouvez modifier votre choix à tout moment.",
          "",
          ":flag_gb: - Select the languages you want to see on the server.",
          "You can update your choice at any time.",
        ].join("\n"),
      )
      .setFooter({
        text: "I.S.A.C • Gestion des accès",
      });

    const row = new ActionRowBuilder<ButtonBuilder>().addComponents(
      new ButtonBuilder()
        .setCustomId("toggle_role_fr")
        .setLabel("Français")
        .setEmoji("🇫🇷")
        .setStyle(ButtonStyle.Secondary),

      new ButtonBuilder()
        .setCustomId("toggle_role_en")
        .setLabel("English")
        .setEmoji("🇬🇧")
        .setStyle(ButtonStyle.Secondary),
    );

    await sendBotMessage(interaction.channel!, {
      embeds: [embed],
      components: [row],
    });

    await interaction.deleteReply().catch(() => null);
  },
};