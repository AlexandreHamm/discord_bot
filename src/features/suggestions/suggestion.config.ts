import type {
  SuggestionFeature,
  SuggestionFeatureConfig,
} from "./suggestion.types.js";

export const suggestionFeatures: Record<SuggestionFeature, SuggestionFeatureConfig> = {
  escalation: {
    id: "escalation",
    label: "Escalation",
    emoji: "💎",
    forumTagName: "Escalation",

    title: "Suggestions Escalation",

    description: [
      "🇫🇷 **Suggestions & améliorations**",
      "",
      "Vous avez une idée pour améliorer l'outil Escalation ?",
      "Cliquez ci-dessous pour envoyer une suggestion au staff.",
      "",
      "━━━━━━━━━━━━━━━━━━",
      "",
      "🇬🇧 **Suggestions & improvements**",
      "",
      "Have an idea to improve the Escalation tool?",
      "Click below to send a suggestion to the staff.",
    ].join("\n"),

    buttonLabel: "Proposer une amélioration / Suggest an improvement",
    modalTitle: "Suggestion Escalation",
  },

  raids: {
    id: "raids",
    label: "Raids",
    emoji: "🏆",
    forumTagName: "Raids",

    title: "Suggestions Raids",

    description: [
      "🇫🇷 **Suggestions & améliorations**",
      "",
      "Vous avez une idée pour améliorer l'organisation des raids ?",
      "Cliquez ci-dessous pour envoyer une suggestion au staff.",
      "",
      "━━━━━━━━━━━━━━━━━━",
      "",
      "🇬🇧 **Suggestions & improvements**",
      "",
      "Have an idea to improve raid organization?",
      "Click below to send a suggestion to the staff.",
    ].join("\n"),

    buttonLabel: "Proposer une amélioration / Suggest an improvement",
    modalTitle: "Suggestion Raids",
  },

  incursions: {
    id: "incursions",
    label: "Incursions",
    emoji: "⚔️",
    forumTagName: "Incursions",

    title: "Suggestions Incursions",

    description: [
      "🇫🇷 **Suggestions & améliorations**",
      "",
      "Vous avez une idée pour améliorer l'outil Incursions ?",
      "Cliquez ci-dessous pour envoyer une suggestion au staff.",
      "",
      "━━━━━━━━━━━━━━━━━━",
      "",
      "🇬🇧 **Suggestions & improvements**",
      "",
      "Have an idea to improve the Incursions tool?",
      "Click below to send a suggestion to the staff.",
    ].join("\n"),

    buttonLabel: "Proposer une amélioration / Suggest an improvement",
    modalTitle: "Suggestion Incursions",
  },

  casual: {
    id: "casual",
    label: "Casual",
    emoji: "🎮",
    forumTagName: "Casual",

    title: "Suggestions Casual Activities",

    description: [
      "🇫🇷 **Suggestions & améliorations**",
      "",
      "Vous avez une idée pour améliorer les activités casual ?",
      "Cliquez ci-dessous pour envoyer une suggestion au staff.",
      "",
      "━━━━━━━━━━━━━━━━━━",
      "",
      "🇬🇧 **Suggestions & improvements**",
      "",
      "Have an idea to improve casual activities?",
      "Click below to send a suggestion to the staff.",
    ].join("\n"),

    buttonLabel: "Proposer une amélioration / Suggest an improvement",
    modalTitle: "Suggestion Casual",
  },

  bot: {
    id: "bot",
    label: "Bot",
    emoji: "🤖",
    forumTagName: "Bot",

    title: "Suggestions Bot",

    description: [
      "🇫🇷 **Suggestions & améliorations**",
      "",
      "Vous avez une idée pour améliorer I.S.A.C ?",
      "Cliquez ci-dessous pour envoyer une suggestion au staff.",
      "",
      "━━━━━━━━━━━━━━━━━━",
      "",
      "🇬🇧 **Suggestions & improvements**",
      "",
      "Have an idea to improve I.S.A.C?",
      "Click below to send a suggestion to the staff.",
    ].join("\n"),

    buttonLabel: "Proposer une amélioration / Suggest an improvement",
    modalTitle: "Suggestion Bot",
  },

  server: {
    id: "server",
    label: "Serveur",
    emoji: "🛰️",
    forumTagName: "Server",

    title: "Suggestions Serveur / Server",

    description: [
      "🇫🇷 **Suggestions & améliorations**",
      "",
      "Vous avez une idée pour améliorer le serveur Discord ?",
      "Cliquez ci-dessous pour envoyer une suggestion au staff.",
      "",
      "━━━━━━━━━━━━━━━━━━",
      "",
      "🇬🇧 **Suggestions & improvements**",
      "",
      "Have an idea to improve the Discord server?",
      "Click below to send a suggestion to the staff.",
    ].join("\n"),

    buttonLabel: "Proposer une amélioration / Suggest an improvement",
    modalTitle: "Suggestion Serveur / Server",
  },
};

export function getSuggestionFeature(feature: string) {
  return suggestionFeatures[feature as SuggestionFeature] ?? null;
}

export function getSuggestionFeatureChoices() {
  return Object.values(suggestionFeatures).map((feature) => ({
    name: feature.label,
    value: feature.id,
  }));
}