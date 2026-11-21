import { ButtonInteraction } from "discord.js";
import {
  parseRaidWidgetState,
  updateRaidWidgetMessage,
} from "../../features/raids/raid-widget.service.js";

export async function handleRaidWidgetButton(interaction: ButtonInteraction) {
  if (!["raid_join", "raid_leave"].includes(interaction.customId)) {
    return;
  }

  await interaction.deferReply({ flags: 64 });

  const message = interaction.message;
  const state = parseRaidWidgetState(message);

  if (!state) {
    await interaction.editReply(
      "Impossible de lire les informations de ce raid.",
    );
    return;
  }

  const userId = interaction.user.id;
  const alreadyJoined = state.participants.some(
    (participant) => participant.userId === userId,
  );

  const isFull = state.participants.length >= state.maxPlayers;

  if (interaction.customId === "raid_join") {
    if (alreadyJoined) {
      await interaction.editReply("Vous êtes déjà inscrit à ce raid.");
      return;
    }

    if (isFull) {
      await interaction.editReply("Ce raid est déjà complet.");
      return;
    }

    state.participants.push({ userId });

    await updateRaidWidgetMessage(message, state);
    await interaction.editReply("Vous avez rejoint le raid.");
    return;
  }

  if (interaction.customId === "raid_leave") {
    if (!alreadyJoined) {
      await interaction.editReply("Vous n'êtes pas inscrit à ce raid.");
      return;
    }

    if (state.leaderId === userId) {
      await interaction.editReply(
        "Le leader ne peut pas quitter son propre raid.",
      );
      return;
    }

    state.participants = state.participants.filter(
      (participant) => participant.userId !== userId,
    );

    await updateRaidWidgetMessage(message, state);
    await interaction.editReply("Vous avez quitté le raid.");
  }
}