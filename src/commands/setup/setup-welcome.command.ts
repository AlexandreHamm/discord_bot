import {
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle,
  ChatInputCommandInteraction,
  EmbedBuilder,
  PermissionFlagsBits,
  SlashCommandBuilder,
} from "discord.js";
import { botConfig } from "../../config/bot.js";
import { sendBotMessage } from "../../utils/send-bot-message.js";
import { channels } from "../../config/channels.js";


export default {
  data: new SlashCommandBuilder()
    .setName("setup-welcome")
    .setDescription("Posts the welcome panel.")
    .setDefaultMemberPermissions(PermissionFlagsBits.ManageGuild),

  async execute(interaction: ChatInputCommandInteraction) {
    await interaction.deferReply({ flags: 64 });

    if (!interaction.channelId) {
      await interaction.editReply("Impossible de détecter le salon actuel.");
      return;
    }

    const embed = new EmbedBuilder()
    .setColor(botConfig.color)
    .setTitle("👋 Bienvenue, Agent")
    .setDescription(
        [
            "Bienvenue sur le serveur communautaire autour de **The Division 2**.",
            "",
            "Ce serveur rassemble des agents francophones et anglophones afin de jouer, échanger, organiser des activités et faire vivre la communauté.",
            "",
            "**Pour bien commencer :**",
            "• Consultez le règlement du serveur",
            "• Choisissez vos rôles de langue",
            "• Présentez-vous si vous le souhaitez",
            "• Rejoignez les discussions et les groupes de jeu",
            "",
            "**Clan :**",
            "Le recrutement du clan est actuellement réservé aux joueurs **PC francophones**.",
            "Si vous souhaitez postuler, utilisez le panel de candidature prévu à cet effet.",
            "",
            "Bon retour sur le terrain, Agent.",
        ].join("\n"),
    )
    .setFooter({
        text: "I.S.A.C • Système d’accueil",
    });

    const row = new ActionRowBuilder<ButtonBuilder>().addComponents(
        new ButtonBuilder()
            .setLabel("Règlement")
            .setEmoji("📜")
            .setStyle(ButtonStyle.Link)
            .setURL(`https://discord.com/channels/${interaction.guildId}/${channels.rules}`),

        new ButtonBuilder()
            .setLabel("Rôles / Langues")
            .setEmoji("🌐")
            .setStyle(ButtonStyle.Link)
            .setURL(`https://discord.com/channels/${interaction.guildId}/${channels.roles}`),

        new ButtonBuilder()
            .setLabel("Candidature")
            .setEmoji("📨")
            .setStyle(ButtonStyle.Link)
            .setURL(`https://discord.com/channels/${interaction.guildId}/${channels.applications}`),
    );

    await sendBotMessage(interaction.channel!, {
      embeds: [embed],
      components: [row],
    });

    await interaction.deleteReply().catch(() => null);
  },
};