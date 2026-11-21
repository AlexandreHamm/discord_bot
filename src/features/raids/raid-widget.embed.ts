import { ActionRowBuilder, ButtonBuilder, ButtonStyle, EmbedBuilder } from "discord.js";
import type { RaidWidgetState } from "./raid.types.js";

export function buildRaidWidgetEmbed(state: RaidWidgetState) {

  const slots = Array.from({ length: state.maxPlayers }, (_, i) => {
    const p = state.participants[i];

    if (!p) {
      return `\`${i + 1}.\` Libre`;
    }

    const isLeader = p.userId === state.leaderId;

    return `\`${i + 1}.\` <@${p.userId}>${isLeader ? " 👑" : ""}`;
  });

  const isFull = state.participants.length >= state.maxPlayers;

  const description: string[] = [
    `**📅 \u200B JOUR** \u200B \u200B \u200B ${state.day}`,
    `**⏰ \u200B HEURE** \u200B \u200B \u200B ${state.time} ${state.timezone}`,
    `**🎮 \u200B TYPE** \u200B \u200B \u200B ${state.type}`,
    "",
    `**👑 \u200B LEADER**`,
    `<@${state.leaderId}>`,
    "",
    "━━━━━━━━━━━━━━━━━━",
    "",
    `**👥 \u200B ÉQUIPE \u200B (${state.participants.length}/${state.maxPlayers})**`,
    "",
    slots.join("\n"),
  ];

  // 👉 Conditional block
  if (state.notes && state.notes.trim().length > 0) {
    description.push(
      "━━━━━━━━━━━━━━━━━━",
      "",
      `**📋 \u200B NOTES**`,
      "",
      `> ${state.notes.replace(/\n/g, "\n> ")}`
    );
  }

  if (isFull) {
    description.unshift("🟢 **RAID COMPLET**", "");
  }

  const embedFooter = "I.S.A.C • Raid Helper";

  return new EmbedBuilder()
    .setTitle(`🏆 \u200B ${state.raidName.toUpperCase()}`)
    .setDescription(description.join("\n"))
    .setColor(0xf5a623)
    .setFooter({
      text: embedFooter.padEnd(180 - embedFooter.length) + '\u200B',
    });
  }

export function buildRaidWidgetButtons(isFull = false) {
  return new ActionRowBuilder<ButtonBuilder>().addComponents(
    new ButtonBuilder()
      .setCustomId("raid_join")
      .setLabel("Rejoindre")
      .setEmoji("✅")
      .setStyle(ButtonStyle.Success)
      .setDisabled(isFull),

    new ButtonBuilder()
      .setCustomId("raid_leave")
      .setLabel("Quitter")
      .setEmoji("❌")
      .setStyle(ButtonStyle.Secondary)
  );
}