import {
  ChatInputCommandInteraction,
  ChannelType,
  PermissionFlagsBits,
  SlashCommandBuilder,
} from "discord.js";
import { processApplicationDecision } from "../../features/applications/application-decision.service.js";

export default {
  data: new SlashCommandBuilder()
    .setName("deny")
    .setDescription("Refuse une candidature clan. Peut servir d'override.")
    .addStringOption((option) =>
      option
        .setName("raison")
        .setDescription("Raison du refus")
        .setRequired(false),
    )
    .setDefaultMemberPermissions(PermissionFlagsBits.ManageGuild),

  async execute(interaction: ChatInputCommandInteraction) {
    await interaction.deferReply({ flags: 64 });

    const channel = interaction.channel;

    if (!channel || !channel.isThread() || channel.parent?.type !== ChannelType.GuildForum) {
      await interaction.editReply(
        "Cette commande doit être utilisée dans un post de candidature.",
      );
      return;
    }

    const reason =
      interaction.options.getString("raison") ?? "Aucune raison spécifiée.";

    const result = await processApplicationDecision({
      channel,
      staffUser: interaction.user,
      decision: "denied",
      reason,
      allowOverride: true,
    });

    await interaction.editReply(
      result.ok ? "Candidature refusée." : result.message,
    );
    await interaction.deleteReply().catch(() => null);
  },
};
