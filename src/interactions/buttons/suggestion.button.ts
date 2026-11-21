import {
  ActionRowBuilder,
  ButtonInteraction,
  ModalBuilder,
  TextInputBuilder,
  TextInputStyle,
} from "discord.js";
import { getSuggestionFeature } from "../../features/suggestions/suggestion.config.js";

export async function handleSuggestionButton(interaction: ButtonInteraction) {
  if (!interaction.customId.startsWith("suggestion_create:")) {
    return;
  }

  const featureId = interaction.customId.split(":")[1];
  const feature = getSuggestionFeature(featureId);

  if (!feature) {
    await interaction.reply({
      content: "Type de suggestion inconnu.",
      flags: 64,
    });
    return;
  }

  const modal = new ModalBuilder()
    .setCustomId(`suggestion_modal:${feature.id}`)
    .setTitle(feature.modalTitle);

  const titleInput = new TextInputBuilder()
    .setCustomId("suggestion_title")
    .setLabel("Résumé de la suggestion")
    .setPlaceholder("Ex: Ajouter un rappel avant le lancement")
    .setStyle(TextInputStyle.Short)
    .setRequired(true)
    .setMinLength(5)
    .setMaxLength(80);

  const suggestionInput = new TextInputBuilder()
    .setCustomId("suggestion_content")
    .setLabel("Expliquez votre suggestion")
    .setPlaceholder("Décrivez votre idée, le problème qu'elle résout, ou le comportement attendu.")
    .setStyle(TextInputStyle.Paragraph)
    .setRequired(true)
    .setMinLength(20)
    .setMaxLength(1000);

  modal.addComponents(
    new ActionRowBuilder<TextInputBuilder>().addComponents(titleInput),
    new ActionRowBuilder<TextInputBuilder>().addComponents(suggestionInput),
  );

  await interaction.showModal(modal);
}
