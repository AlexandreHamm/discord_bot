export type SuggestionFeature =
  | "escalation"
  | "raids"
  | "incursions"
  | "casual"
  | "bot"
  | "server";

export type SuggestionFeatureConfig = {
  id: SuggestionFeature;
  label: string;
  emoji: string;
  forumTagName: string;
  title: string;
  description: string;
  buttonLabel: string;
  modalTitle: string;
};
