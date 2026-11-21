import {
  ChannelType,
  ModalSubmitInteraction,
} from "discord.js";
import { channels } from "../../config/channels.js";
import { client } from "../../discord/client.js";
import { getForumTagIdByName } from "../../utils/forum-tags.js";
import { getSuggestionFeature } from "../../features/suggestions/suggestion.config.js";
import { buildSuggestionPostEmbed } from "../../features/suggestions/suggestion.embeds.js";

export async function handleSuggestionModal(interaction: ModalSubmitInteraction) {
  if (!interaction.customId.startsWith("suggestion_modal:")) {
    return;
  }

  await interaction.deferReply({ flags: 64 });

  const featureId = interaction.customId.split(":")[1];
  const feature = getSuggestionFeature(featureId);

  if (!feature) {
    await interaction.editReply("Type de suggestion inconnu.");
    return;
  }

  const title = interaction.fields.getTextInputValue("suggestion_title");
  const suggestion = interaction.fields.getTextInputValue("suggestion_content");

  const forum = await client.channels.fetch(channels.suggestionsForum);

  if (!forum || forum.type !== ChannelType.GuildForum) {
    await interaction.editReply("Forum de suggestions introuvable.");
    return;
  }

  const tagId = getForumTagIdByName(forum, feature.forumTagName);

  const thread = await forum.threads.create({
    name: `${feature.emoji} ${title}`,
    appliedTags: [tagId],
    message: {
      embeds: [
        buildSuggestionPostEmbed({
          feature,
          userId: interaction.user.id,
          title,
          suggestion,
        }),
      ],
    },
  });

  await interaction.editReply({
    content: [
      "🇫🇷 Votre suggestion a bien été envoyée à l’équipe.",
      "",
      "🇬🇧 Your suggestion has been sent to the staff team.",
    ].join("\n"),
  });
}
