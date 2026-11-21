import { Message } from "discord.js";
import type { RaidWidgetState } from "./raid.types.js";
import {
  buildRaidWidgetButtons,
  buildRaidWidgetEmbed,
} from "./raid-widget.embed.js";

function normalize(line: string) {
  return line.replace(/\u200B/g, "").trim();
}

function extractLineValue(description: string, keyword: string) {
  const line = description
    .split("\n")
    .map(normalize)
    .find((line) => line.includes(keyword));

  if (!line) return "";

  return line
    .replace(/\*\*/g, "")
    .replace(keyword, "")
    .replace(/📅|⏰|🎮/g, "")
    .trim();
}

function extractLeaderId(description: string) {
  const match = description.match(/\*\*👑.*?LEADER\*\*\s*\n<@!?(\d{17,20})>/s);
  return match?.[1] ?? null;
}

function extractParticipantIds(description: string) {
  const teamSection = description.split("**📋")[0] ?? description;

  return [...teamSection.matchAll(/`?\d+\.?`?\s*<@!?(\d{17,20})>/g)].map(
    (match) => match[1],
  );
}

function extractMaxPlayers(description: string) {
  const match = description.match(/ÉQUIPE.*?\((\d+)\/(\d+)\)/);
  return match ? Number(match[2]) : 8;
}

function extractNotes(description: string) {
  const notesIndex = description.indexOf("📋");

  if (notesIndex === -1) return undefined;

  const notesBlock = description.slice(notesIndex);
  const lines = notesBlock.split("\n").slice(1);

  return lines.join("\n").trim() || undefined;
}

export function parseRaidWidgetState(message: Message): RaidWidgetState | null {
  const embed = message.embeds[0];

  if (!embed?.description || !embed.title) {
    return null;
  }

  const description = embed.description;

  const raidName = embed.title.replace("🏆", "").trim();

  const day = extractLineValue(description, "JOUR");
  const timeAndTimezone = extractLineValue(description, "HEURE");
  const type = extractLineValue(description, "TYPE");

  const leaderId = extractLeaderId(description);

  if (!leaderId || !day || !timeAndTimezone || !type) {
    return null;
  }

  const [time, timezone = ""] = timeAndTimezone.split(" ");

  const participantIds = extractParticipantIds(description);

  const participants = [...new Set(participantIds)].map((userId) => ({
    userId,
  }));

  if (!participants.some((p) => p.userId === leaderId)) {
    participants.unshift({ userId: leaderId });
  }

  return {
    raidName,
    day,
    time,
    timezone,
    type,
    leaderId,
    maxPlayers: extractMaxPlayers(description),
    participants,
    notes: extractNotes(description),
  };
}

export async function updateRaidWidgetMessage(
  message: Message,
  state: RaidWidgetState,
) {
  const isFull = state.participants.length >= state.maxPlayers;
  await message.edit({
    embeds: [buildRaidWidgetEmbed(state)],
    components: [buildRaidWidgetButtons(isFull)],
  });
}