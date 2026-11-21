import "dotenv/config";

function requireEnv(name: string): string {
  const value = process.env[name];

  if (!value) {
    throw new Error(`Missing environment variable: ${name}`);
  }

  return value;
}

export const env = {
  discordToken: requireEnv("DISCORD_TOKEN"),
  discordClientId: requireEnv("DISCORD_CLIENT_ID"),
  discordGuildId: requireEnv("DISCORD_GUILD_ID"),

  clanMemberRoleId: requireEnv("CLAN_MEMBER_ROLE_ID"),
  frenchRoleId: requireEnv("FRENCH_ROLE_ID"),
  englishRoleId: requireEnv("ENGLISH_ROLE_ID"),

  rulesChannelId: requireEnv("RULES_CHANNEL_ID"),
  rolesChannelId: requireEnv("ROLES_CHANNEL_ID"),
  applicationsChannelId: requireEnv("APPLICATIONS_CHANNEL_ID"),

  // RAIDS
  raidsForumId: requireEnv("RAIDS_CHANNEL_ID"),

  // ESCALATION
  escalationCategoryId: requireEnv("ESCALATION_CATEGORY_ID"),
  escalationFrChannelId: requireEnv("ESCALATION_FR_CHANNEL_ID"),
  escalationEnChannelId: requireEnv("ESCALATION_EN_CHANNEL_ID"),

  staffApplicationForumId: requireEnv("STAFF_APPLICATION_FORUM_ID"),

  // SUGGESTIONS
  suggestionsForumId: requireEnv("SUGGESTIONS_FORUM_ID"),
};