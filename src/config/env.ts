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
  staffApplicationForumId: requireEnv("STAFF_APPLICATION_FORUM_ID"),
};