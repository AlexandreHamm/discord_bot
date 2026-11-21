import {
  ChatInputCommandInteraction,
  ChannelType,
  PermissionFlagsBits,
  SlashCommandBuilder,
} from "discord.js";
import { processApplicationDecision } from "../../features/applications/application-decision.service.js";

export default {
  data: new SlashCommandBuilder()
    .setName("accept")
    .setDescription("Accepte une candidature clan. Peut servir d'override.")
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

    const result = await processApplicationDecision({
      channel,
      staffUser: interaction.user,
      decision: "accepted",
      allowOverride: true,
    });

    await interaction.editReply(
      result.ok ? "Candidature acceptée." : result.message,
    );
    await interaction.deleteReply().catch(() => null);
  },
};
