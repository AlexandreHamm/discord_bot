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
    .setPlaceholder("Votre nom sur le jeu")
    .setRequired(true)
    .setMaxLength(20);

//   const platform = new TextInputBuilder()
//     .setCustomId("platform")
//     .setLabel("Plateforme (PC / PlayStation / Xbox)")
//     .setStyle(TextInputStyle.Short)
//     .setRequired(true);

  const shdLevel = new TextInputBuilder()
    .setCustomId("shd_level")
    .setLabel("Niveau SHD")
    .setPlaceholder("Exemple : 1250")
    .setStyle(TextInputStyle.Short)
    .setRequired(true)
    .setMaxLength(50);

  const experience = new TextInputBuilder()
    .setCustomId("experience")
    .setLabel("Expérience sur The Division 2")
    .setStyle(TextInputStyle.Paragraph)
    .setRequired(true)
    .setMinLength(50)
    .setMaxLength(500);

  const motivation = new TextInputBuilder()
    .setCustomId("motivation")
    .setLabel("Pourquoi veux-tu rejoindre le clan ?")
    .setStyle(TextInputStyle.Paragraph)
    .setRequired(true)
    .setMinLength(50)
    .setMaxLength(500);

  const rows = [
    new ActionRowBuilder<TextInputBuilder>().addComponents(agentName),
    // new ActionRowBuilder<TextInputBuilder>().addComponents(platform),
    new ActionRowBuilder<TextInputBuilder>().addComponents(shdLevel),
    new ActionRowBuilder<TextInputBuilder>().addComponents(experience),
    new ActionRowBuilder<TextInputBuilder>().addComponents(motivation),
  ];

  modal.addComponents(...rows);

  await interaction.showModal(modal);
}