import {
  ButtonInteraction,
  LabelBuilder,
  ModalBuilder,
  StringSelectMenuBuilder,
  StringSelectMenuOptionBuilder,
  TextInputBuilder,
  TextInputStyle,
} from "discord.js";

export async function handleRaidButton(interaction: ButtonInteraction) {
  if (interaction.customId !== "raid") return;

  const modal = new ModalBuilder()
    .setCustomId("raid_modal")
    .setTitle("Créer un raid");

  const raidSelect = new StringSelectMenuBuilder()
    .setCustomId("raid_select")
    .setPlaceholder("Choisir le raid")
    .addOptions(
      new StringSelectMenuOptionBuilder()
        .setLabel("Dark Hours")
        .setValue("dark_hours"),

      new StringSelectMenuOptionBuilder()
        .setLabel("Iron Horse")
        .setValue("iron_horse"),
    );

  const raidLabel = new LabelBuilder()
    .setLabel("Raid")
    .setStringSelectMenuComponent(raidSelect);

  const typeSelect = new StringSelectMenuBuilder()
    .setCustomId("type_select")
    .setPlaceholder("Choisir le type")
    .addOptions(
      new StringSelectMenuOptionBuilder()
        .setLabel("Normal")
        .setValue("normal"),

      new StringSelectMenuOptionBuilder()
        .setLabel("Speedrun")
        .setValue("speedrun"),
    );

  const typeLabel = new LabelBuilder()
    .setLabel("Type de raid")
    .setStringSelectMenuComponent(typeSelect);

  const daySelect = new StringSelectMenuBuilder()
    .setCustomId("day_select")
    .setPlaceholder("Choisir le jour")
    .addOptions(
      new StringSelectMenuOptionBuilder()
        .setLabel("Lun/Mon")
        .setValue("mon"),

      new StringSelectMenuOptionBuilder()
        .setLabel("Mar/Tue")
        .setValue("tue"),

      new StringSelectMenuOptionBuilder()
        .setLabel("Mer/Wed")
        .setValue("wed"),

      new StringSelectMenuOptionBuilder()
        .setLabel("Jeu/Thu")
        .setValue("thu"),

      new StringSelectMenuOptionBuilder()
        .setLabel("Ven/Fri")
        .setValue("fri"),

      new StringSelectMenuOptionBuilder()
        .setLabel("Sam/Sat")
        .setValue("sat"),

      new StringSelectMenuOptionBuilder()
        .setLabel("Dim/Sun")
        .setValue("sun"),
    );

  const dayLabel = new LabelBuilder()
    .setLabel("Jour du raid")
    .setStringSelectMenuComponent(daySelect);

  const timeInput = new TextInputBuilder()
  .setCustomId("time_input")
  .setPlaceholder("Exemple : 20:00")
  .setStyle(TextInputStyle.Short)
  .setRequired(true)
  .setMinLength(4)
  .setMaxLength(10);

const notesInput = new TextInputBuilder()
  .setCustomId("notes_input")
  .setPlaceholder("Exemple : micro requis, débutants acceptés...")
  .setStyle(TextInputStyle.Paragraph)
  .setRequired(false)
  .setMaxLength(500);

  modal.addLabelComponents(raidLabel, typeLabel, dayLabel);

  modal.addComponents(
    new LabelBuilder()
        .setLabel("Heure du raid")
        .setTextInputComponent(timeInput),

    new LabelBuilder()
        .setLabel("Notes optionnelles")
        .setTextInputComponent(notesInput),
    );

  await interaction.showModal(modal);
}