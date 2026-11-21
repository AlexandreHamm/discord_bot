import {
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle,
  ChatInputCommandInteraction,
  PermissionFlagsBits,
  SlashCommandBuilder,
} from "discord.js";
import { sendBotMessage } from "../../utils/send-bot-message.js";
import {
  getSuggestionFeature,
  getSuggestionFeatureChoices,
} from "../../features/suggestions/suggestion.config.js";
import { buildSuggestionPanelEmbed } from "../../features/suggestions/suggestion.embeds.js";

export default {
  data: new SlashCommandBuilder()
    .setName("setup-suggestions")
    .setDescription("Posts a suggestion panel for a specific feature.")
    .addStringOption((option) =>
      option
        .setName("feature")
        .setDescription("Feature this suggestion panel is for.")
        .setRequired(true)
        .addChoices(...getSuggestionFeatureChoices()),
    )
    .setDefaultMemberPermissions(PermissionFlagsBits.ManageGuild),

  async execute(interaction: ChatInputCommandInteraction) {
    await interaction.deferReply({ flags: 64 });

    if (!interaction.channel || !interaction.channel.isTextBased()) {
      await interaction.editReply("Impossible de détecter le salon actuel.");
      return;
    }

    const featureId = interaction.options.getString("feature", true);
    const feature = getSuggestionFeature(featureId);

    if (!feature) {
      await interaction.editReply("Type de suggestion inconnu.");
      return;
    }

    const row = new ActionRowBuilder<ButtonBuilder>().addComponents(
      new ButtonBuilder()
        .setCustomId(`suggestion_create:${feature.id}`)
        .setLabel(feature.buttonLabel)
        .setEmoji("💡")
        .setStyle(ButtonStyle.Primary),
    );

    await sendBotMessage(interaction.channel, {
      embeds: [buildSuggestionPanelEmbed(feature)],
      components: [row],
    });

    await interaction.deleteReply().catch(() => null);
  },
};
