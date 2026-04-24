import {
  ButtonInteraction,
  ModalBuilder,
  TextInputBuilder,
  TextInputStyle,
  ActionRowBuilder,
} from "discord.js";

export async function handleApplyButton(interaction: ButtonInteraction) {
  if (interaction.customId !== "apply_clan") return;

  const modal = new ModalBuilder()
    .setCustomId("clan_application_modal")
    .setTitle("Candidature au clan");

  const agentName = new TextInputBuilder()
    .setCustomId("agent_name")
    .setLabel("Nom d'agent")
    .setStyle(TextInputStyle.Short)
    .setRequired(true);

//   const platform = new TextInputBuilder()
//     .setCustomId("platform")
//     .setLabel("Plateforme (PC / PlayStation / Xbox)")
//     .setStyle(TextInputStyle.Short)
//     .setRequired(true);

  const playstyle = new TextInputBuilder()
    .setCustomId("playstyle")
    .setLabel("Style de jeu (PvE / PvP / DZ / Raid...)")
    .setStyle(TextInputStyle.Short)
    .setRequired(true);

  const experience = new TextInputBuilder()
    .setCustomId("experience")
    .setLabel("Expérience sur The Division 2")
    .setStyle(TextInputStyle.Paragraph)
    .setRequired(true);

  const motivation = new TextInputBuilder()
    .setCustomId("motivation")
    .setLabel("Pourquoi veux-tu rejoindre le clan ?")
    .setStyle(TextInputStyle.Paragraph)
    .setRequired(true);

  const rows = [
    new ActionRowBuilder<TextInputBuilder>().addComponents(agentName),
    // new ActionRowBuilder<TextInputBuilder>().addComponents(platform),
    new ActionRowBuilder<TextInputBuilder>().addComponents(playstyle),
    new ActionRowBuilder<TextInputBuilder>().addComponents(experience),
    new ActionRowBuilder<TextInputBuilder>().addComponents(motivation),
  ];

  modal.addComponents(...rows);

  await interaction.showModal(modal);
}