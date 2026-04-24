import {
  ChatInputCommandInteraction,
  EmbedBuilder,
  PermissionFlagsBits,
  SlashCommandBuilder,
} from "discord.js";
import { getPersona } from "../../personas/persona.config.js";
import { sendPersonaMessage } from "../../webhooks/webhook.service.js";

export default {
  data: new SlashCommandBuilder()
    .setName("setup-rules")
    .setDescription("Posts the server rules panel.")
    .setDefaultMemberPermissions(PermissionFlagsBits.ManageGuild),

  async execute(interaction: ChatInputCommandInteraction) {
    await interaction.deferReply({ flags: 64 });

    if (!interaction.channelId) {
      await interaction.editReply("Impossible de détecter le salon actuel.");
      return;
    }

    const persona = getPersona("ISAC");

    const embed = new EmbedBuilder()
      .setColor(persona.color)
      .setTitle("📜 Règlement du serveur")
      .setDescription(
        [
          "Bienvenue sur le serveur.",
          "",
          "Pour garder une communauté agréable, merci de respecter les règles ci-dessous.",
          "",
          "**1. Respect avant tout**",
          "Aucune insulte, provocation, discrimination, harcèlement ou comportement toxique ne sera toléré.",
          "",
          "**2. Pas de spam**",
          "Évitez les messages répétés, le flood, les mentions abusives et la publicité non autorisée.",
          "",
          "**3. Salons appropriés**",
          "Utilisez les bons salons pour les discussions, recherches de groupe, builds, médias et candidatures.",
          "",
          "**4. Contenu approprié**",
          "Pas de contenu NSFW, illégal, choquant ou contraire aux règles de Discord.",
          "",
          "**5. Esprit d’entraide**",
          "Le serveur est là pour jouer, progresser et créer une bonne ambiance autour de The Division 2.",
          "",
          "**6. Staff & décisions**",
          "Le staff peut intervenir si nécessaire afin de protéger la communauté.",
        ].join("\n"),
      )
      .setFooter({
        text: "I.S.A.C • Protocole communautaire",
      });

    await sendPersonaMessage({
      channelId: interaction.channelId,
      persona: "ISAC",
      embeds: [embed],
    });

    await interaction.deleteReply().catch(() => null);
  },
};