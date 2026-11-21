import {
  ButtonInteraction,
  LabelBuilder,
  ModalBuilder,
  StringSelectMenuBuilder,
} from "discord.js";
import { getCurrentEscalationMissions } from "../../features/escalations/escalation-data.service.js";

export async function handleEscalationButton(interaction: ButtonInteraction) {
  if (!["escalation_create_fr", "escalation_create_en"].includes(interaction.customId)) {
    return;
  }

  const lang = interaction.customId.endsWith("_fr") ? "fr" : "en";

  let missions: string[];

  try {
    missions = await getCurrentEscalationMissions();
  } catch (error) {
    console.error("Failed to load Escalation missions.", error);

    await interaction.reply({
      content:
        lang === "fr"
          ? "Impossible de charger les missions Escalade pour le moment. Réessayez dans quelques instants."
          : "Unable to load the Escalation missions right now. Please try again in a moment.",
      flags: 64,
    });

    return;
  }

  const modal = new ModalBuilder()
    .setCustomId(`escalation_modal_${lang}`)
    .setTitle(lang === "fr" ? "Créer une équipe Escalade" : "Create Escalation Group");

  const missionLabel = new LabelBuilder()
    .setLabel("Mission")
    .setStringSelectMenuComponent(
      new StringSelectMenuBuilder()
        .setCustomId("mission_name")
        .setPlaceholder(
          lang === "fr" ? "Choisissez une mission" : "Choose a mission",
        )
        .addOptions(
          missions.map((mission) => ({
            label: mission,
            value: mission,
          })),
        ),
    );

  const tierLabel = new LabelBuilder()
    .setLabel("Tier")
    .setStringSelectMenuComponent(
      new StringSelectMenuBuilder()
        .setCustomId("tier_level")
        .setPlaceholder(lang === "fr" ? "Choisissez un tier" : "Choose a tier")
        .addOptions(
          Array.from({ length: 10 }, (_, i) => {
            const tier = i + 1;

            return {
              label: `Tier ${tier}`,
              value: tier.toString(),
            };
          }),
        ),
    );

  modal.addLabelComponents(missionLabel, tierLabel);

  await interaction.showModal(modal);
}
