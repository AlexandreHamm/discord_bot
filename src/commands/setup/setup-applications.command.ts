import {
  ChatInputCommandInteraction,
  EmbedBuilder,
  PermissionFlagsBits,
  SlashCommandBuilder,
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle,
} from "discord.js";
import { botConfig } from "../../config/bot.js";
import { sendBotMessage } from "../../utils/send-bot-message.js";

export default {
  data: new SlashCommandBuilder()
    .setName("setup-applications")
    .setDescription("Posts the clan application panel.")
    .setDefaultMemberPermissions(PermissionFlagsBits.ManageGuild),

  async execute(interaction: ChatInputCommandInteraction) {
    if (!interaction.channelId) {
      await interaction.reply({
        content: "Unable to detect the current channel.",
        ephemeral: true,
      });
      return;
    }

    const button = new ButtonBuilder()
    .setCustomId("apply_clan")
    .setLabel("📨 Postuler")
    .setStyle(ButtonStyle.Primary);

    const row = new ActionRowBuilder<ButtonBuilder>().addComponents(button);

    const embed = new EmbedBuilder()
      .setColor(botConfig.color)
      .setTitle("📨 Recrutement du clan")
      .setDescription(
        [
          "Vous souhaitez rejoindre le clan ?",
          "",
          "Cliquez sur le bouton ci-dessous pour remplir une candidature.",
          "Une fois envoyée, elle sera transmise au staff pour examen.",
          "",
          "**Avant de postuler :**",
          "• Soyez respectueux et mature",
          "• Le clan est francophone",
          "• L’activité et l’entraide sont importantes",
        ].join("\n"),
      )
      .setFooter({
        text: "I.S.A.C • Système de recrutement",
      });

    await sendBotMessage(interaction.channel!, {
      embeds: [embed],
      components: [row],
    });

    await interaction.reply({
      content: "Panel de candidature publié.",
      ephemeral: true,
    });
  },
};