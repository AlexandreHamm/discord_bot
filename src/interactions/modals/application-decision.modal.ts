import { ChannelType, ModalSubmitInteraction } from "discord.js";
import { processApplicationDecision } from "../../features/applications/application-decision.service.js";

export async function handleApplicationDecisionModal(
  interaction: ModalSubmitInteraction,
) {
  if (
    ![
      "application_accept_confirm",
      "application_deny_confirm",
    ].includes(interaction.customId)
  ) {
    return;
  }

  await interaction.deferReply({ flags: 64 });

  const channel = interaction.channel;

  if (!channel || !channel.isThread() || channel.parent?.type !== ChannelType.GuildForum) {
    await interaction.editReply(
      "Cette action doit être utilisée dans un post de candidature.",
    );
    return;
  }

  const confirmation = interaction.fields
    .getTextInputValue("confirmation")
    .trim()
    .toUpperCase();

  if (confirmation !== "OUI") {
    await interaction.editReply("Action annulée.");
    return;
  }

  const decision =
    interaction.customId === "application_accept_confirm" ? "accepted" : "denied";

  const reason =
    decision === "denied"
      ? interaction.fields.getTextInputValue("reason") || "Aucune raison spécifiée."
      : undefined;

  const result = await processApplicationDecision({
    channel,
    staffUser: interaction.user,
    decision,
    reason,
    allowOverride: false,
  });

  await interaction.editReply(
    result.ok
      ? decision === "accepted"
        ? "Candidature acceptée."
        : "Candidature refusée."
      : result.message,
  );

  await interaction.deleteReply().catch(() => null);
}
