import { ForumChannel } from "discord.js";

export function getForumTagIdByName(
  forum: ForumChannel,
  tagName: string,
): string {
  const tag = forum.availableTags.find((tag) => tag.name === tagName);

  if (!tag) {
    throw new Error(`Forum tag not found: ${tagName}`);
  }

  return tag.id;
}