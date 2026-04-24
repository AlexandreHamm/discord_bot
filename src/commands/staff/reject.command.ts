import {
  ChatInputCommandInteraction,
  ChannelType,
  EmbedBuilder,
  PermissionFlagsBits,
  SlashCommandBuilder,
} from "discord.js";

export default {
  data: new SlashCommandBuilder()
    .setName("reject")
    .setDescription("Refuse une candidature clan.")
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

    if (!channel || !channel.isThread()) {
      return;
    }

    if (channel.parent?.type !== ChannelType.GuildForum) {
      return;
    }

    const reason =
      interaction.options.getString("raison") ?? "Aucune raison spécifiée.";

    const starterMessage = await channel.fetchStarterMessage();

    if (!starterMessage?.embeds.length) {
      await channel.send("Impossible de trouver la candidature.");
      return;
    }

    const embed = starterMessage.embeds[0];

    const currentStatus = embed.footer?.text ?? "";

    if (
        currentStatus.includes("Accepté") ||
        currentStatus.includes("Refusé")
    ) {
        await interaction.deferReply({ flags: 64 });
        await interaction.deleteReply();

        await channel.send({
            content: "⚠️ Cette candidature a déjà été traitée.",
        });

        return;
    }

    const rejectedEmbed = EmbedBuilder.from(embed)
      .setColor(0xed4245)
      .addFields({
        name: "❌ Raison du refus",
        value: reason,
        inline: false,
      })
      .setFooter({
        text: `Statut: Refusé • Par ${interaction.user.username}`,
      });

    await starterMessage.edit({
      embeds: [rejectedEmbed],
    });

    await channel.send({
      content: `❌ Candidature refusée.\n**Raison :** ${reason}`,
    });

    const userIdField = embed.fields.find(
        (field) => field.name === "🆔 ID utilisateur",
    );

    if (userIdField) {
        const userId = userIdField.value.trim();

        const user = await interaction.client.users.fetch(userId).catch(() => null);

        if (user) {
            await user
            .send({
                content:
                `❌ **Candidature refusée**\n\nMerci pour ta candidature.\n\n**Raison :** ${reason}\n\nTu peux retenter ta chance plus tard.`,
            })
            .catch(() => null);
        }
    }

    await channel.setLocked(true, "Candidature traitée.");
    await channel.setArchived(true, "Candidature traitée.");

    await interaction.deleteReply().catch(() => null);
  },
};