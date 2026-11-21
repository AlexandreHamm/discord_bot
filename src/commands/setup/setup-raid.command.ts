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
    .setName("setup-raid")
    .setDescription("Posts the raid creation test panel.")
    .setDefaultMemberPermissions(PermissionFlagsBits.ManageGuild),

  async execute(interaction: ChatInputCommandInteraction) {
    await interaction.deferReply({ flags: 64 });

    if (!interaction.channelId) {
      await interaction.editReply("Impossible de détecter le salon actuel.");
      return;
    }

    const embed = new EmbedBuilder()
      .setColor(botConfig.color)
      .setTitle("🏆 Création de raid")
      .setDescription(
        [
          "Utilisez le bouton ci-dessous pour tester la création d’un raid.",
          "",
          "Ce panel est temporaire et servira à valider le futur système de planification.",
        ].join("\n"),
      )
      .setFooter({
        text: "I.S.A.C • Module raid expérimental",
      });

    const row = new ActionRowBuilder<ButtonBuilder>().addComponents(
      new ButtonBuilder()
        .setCustomId("raid")
        .setLabel("Créer un raid")
        .setEmoji("🏆")
        .setStyle(ButtonStyle.Primary),
    );

    await sendBotMessage(interaction.channel!, {
      embeds: [embed],
      components: [row],
    });

    await interaction.deleteReply().catch(() => null);
  },
};