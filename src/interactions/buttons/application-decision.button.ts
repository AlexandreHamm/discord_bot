import {
  ActionRowBuilder,
  ButtonInteraction,
  ModalBuilder,
  TextInputBuilder,
  TextInputStyle,
} from "discord.js";

export async function handleApplicationDecisionButton(
  interaction: ButtonInteraction,
) {
  if (!["application_accept", "application_deny"].includes(interaction.customId)) {
    return;
  }

  const isAccept = interaction.customId === "application_accept";

  const modal = new ModalBuilder()
    .setCustomId(isAccept ? "application_accept_confirm" : "application_deny_confirm")
    .setTitle(isAccept ? "Confirmer l'acceptation" : "Confirmer le refus");

  const confirmationInput = new TextInputBuilder()
    .setCustomId("confirmation")
    .setLabel(isAccept ? "Tapez OUI pour accepter ce joueur" : "Tapez OUI pour refuser ce joueur")
    .setPlaceholder("OUI")
    .setStyle(TextInputStyle.Short)
    .setRequired(true)
    .setMinLength(3)
    .setMaxLength(3);

  modal.addComponents(
    new ActionRowBuilder<TextInputBuilder>().addComponents(confirmationInput),
  );

  if (!isAccept) {
    const reasonInput = new TextInputBuilder()
      .setCustomId("reason")
      .setLabel("Raison du refus")
      .setPlaceholder("Aucune raison spécifiée.")
      .setStyle(TextInputStyle.Paragraph)
      .setRequired(false)
      .setMaxLength(500);

    modal.addComponents(
      new ActionRowBuilder<TextInputBuilder>().addComponents(reasonInput),
    );
  }

  await interaction.showModal(modal);
}
