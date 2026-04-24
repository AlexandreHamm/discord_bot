import {
  ChatInputCommandInteraction,
  ChannelType,
  EmbedBuilder,
  PermissionFlagsBits,
  SlashCommandBuilder,
} from "discord.js";
import { getPersona } from "../../personas/persona.config.js";
import { roles } from "../../config/roles.js";

export default {
  data: new SlashCommandBuilder()
    .setName("accept")
    .setDescription("Accepte une candidature clan.")
    .setDefaultMemberPermissions(PermissionFlagsBits.ManageGuild),

  async execute(interaction: ChatInputCommandInteraction) {
    await interaction.deferReply({ flags: 64 });

    const channel = interaction.channel;

    if (!channel || !channel.isThread()) {
      await interaction.reply({
        content: "Cette commande doit être utilisée dans un post de candidature.",
        ephemeral: true,
      });
      return;
    }

    if (channel.parent?.type !== ChannelType.GuildForum) {
      await interaction.reply({
        content: "Cette commande doit être utilisée dans un forum de candidatures.",
        ephemeral: true,
      });
      return;
    }

    const starterMessage = await channel.fetchStarterMessage();

    if (!starterMessage?.embeds.length) {
      await interaction.reply({
        content: "Impossible de trouver la candidature.",
        ephemeral: true,
      });
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

    const userIdField = embed.fields.find(
      (field) => field.name === "🆔 ID utilisateur",
    );

    if (!userIdField) {
      await interaction.reply({
        content: "Impossible de trouver l'utilisateur lié à cette candidature.",
        ephemeral: true,
      });
      return;
    }

    const userId = userIdField.value.trim();

    const member = await interaction.guild?.members.fetch(userId).catch(() => null);

    if (!member) {
      await interaction.reply({
        content: "Utilisateur introuvable sur le serveur.",
        ephemeral: true,
      });
      return;
    }

    await member.roles.add(roles.clanMember);

    await member.send({
        content:
            "🎉 **Candidature acceptée !**\n\nBienvenue dans le clan ! Nous sommes ravis de t'accueillir parmi nous.\n\nN'hésite pas à rejoindre les salons et à jouer avec les autres membres.",
    }).catch(() => null);

    const persona = getPersona("ISAC");

    const acceptedEmbed = EmbedBuilder.from(embed)
      .setColor(0x57f287)
      .setFooter({
        text: `Statut: Accepté • Par ${interaction.user.username}`,
      });

    await starterMessage.edit({
      embeds: [acceptedEmbed],
    });

    await channel.send({
      content: `✅ Candidature acceptée. Bienvenue dans le clan, <@${userId}>.`,
    });
    
    // await interaction.reply({
        //   content: "Candidature acceptée.",
        //   ephemeral: true,
    // });

    await channel.setLocked(true, "Candidature traitée.");
    await channel.setArchived(true, "Candidature traitée.");

    await interaction.deleteReply().catch(() => null);
  },
};