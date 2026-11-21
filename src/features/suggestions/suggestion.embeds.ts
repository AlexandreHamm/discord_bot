import { EmbedBuilder } from "discord.js";
import { botConfig } from "../../config/bot.js";
import type { SuggestionFeatureConfig } from "./suggestion.types.js";

export function buildSuggestionPanelEmbed(feature: SuggestionFeatureConfig) {
  return new EmbedBuilder()
    .setColor(botConfig.color)
    .setTitle(`${feature.emoji} ${feature.title}`)
    .setDescription(feature.description)
    .setFooter({
      text: "I.S.A.C • Suggestions".padEnd(164) + "\u200B",
    });
}

export function buildSuggestionPostEmbed({
  feature,
  userId,
  title,
  suggestion,
}: {
  feature: SuggestionFeatureConfig;
  userId: string;
  title: string;
  suggestion: string;
}) {
  return new EmbedBuilder()
    .setColor(botConfig.color)
    .setTitle(`${feature.emoji} Suggestion - ${feature.label}`)
    .addFields(
      {
        name: "👤 Auteur",
        value: `<@${userId}>`,
        inline: false,
      },
      {
        name: "📌 Sujet",
        value: title,
        inline: false,
      },
      {
        name: "💬 Suggestion",
        value: suggestion,
        inline: false,
      },
    )
    .setFooter({
      text: "Statut: Nouvelle suggestion",
    })
    .setTimestamp();
}
