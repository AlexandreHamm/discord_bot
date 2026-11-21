import { 
  ModalSubmitInteraction,
  ChannelType,
 } from "discord.js";
import { client } from "../../discord/client.js";
import { channels } from "../../config/channels.js";
import { getForumTagIdByName } from "../../utils/forum-tags.js";
import {
  buildRaidWidgetEmbed,
  buildRaidWidgetButtons,
} from "../../features/raids/raid-widget.embed.js";

const raidLabels = {
  dark_hours: "Dark Hours",
  iron_horse: "Iron Horse",
} as const;

const typeLabels = {
  normal: "Normal",
  speedrun: "Speedrun",
} as const;

const dayLabels = {
  mon: "Lun/Mon",
  tue: "Mar/Tue",
  wed: "Mer/Wed",
  thu: "Jeu/Thu",
  fri: "Ven/Fri",
  sat: "Sam/Sat",
  sun: "Dim/Sun",
} as const;

function getLabel<T extends Record<string, string>>(
  map: T,
  value: string,
  fallback = "Inconnu",
) {
  return map[value as keyof T] ?? fallback;
}

const weekdays = {
  mon: 1,
  tue: 2,
  wed: 3,
  thu: 4,
  fri: 5,
  sat: 6,
  sun: 7,
} as const;

type WeekdayKey = keyof typeof weekdays;

function formatDate(date: Date) {
  return date.toLocaleDateString("fr-FR", {
    day: "2-digit",
    month: "2-digit",
  });
}

function getNextWeekday(key: WeekdayKey) {
  const weekday = weekdays[key];

  const today = new Date(new Date().getTime()); // fresh instance every time

  const result = new Date(today); // clone

  const diff = (weekday - today.getDay() + 7) % 7;

  result.setDate(today.getDate() + diff);

  return formatDate(result);
}

export async function handleRaidModal(interaction: ModalSubmitInteraction) {
  if (interaction.customId !== "raid_modal") return;

  const raidValue = interaction.fields.getStringSelectValues("raid_select")[0];
  const typeValue = interaction.fields.getStringSelectValues("type_select")[0];
  const dayValue = interaction.fields.getStringSelectValues("day_select")[0];

  const raid = getLabel(raidLabels, raidValue);
  const type = getLabel(typeLabels, typeValue);
  const day = getLabel(dayLabels, dayValue) + ' ' + getNextWeekday(dayValue as WeekdayKey);

  // const time = interaction.fields.getTextInputValue("time_input");
  const timeInput = interaction.fields.getTextInputValue("time_input").trim();

  // Basic format check
  if (!/^\d{1,2}:\d{2}$/.test(timeInput)) {
    await interaction.reply({
      content: "Format invalide. Utilisez le format **HH:MM** (ex: 22:00).",
      flags: 64,
    });
    return;
  }

  const [hRaw, mRaw] = timeInput.split(":");
  const hour = Number(hRaw);
  const minutes = Number(mRaw);

  // // Value validation
  // if (
  //   isNaN(hour) ||
  //   isNaN(minutes) ||
  //   hour < 0 ||
  //   hour > 23 ||
  //   ![0, 15, 30, 45].includes(minutes)
  // ) {
  //   await interaction.reply({
  //     content:
  //       "Heure invalide.\n\n• Heure: 00–23\n• Minutes: 00, 15, 30 ou 45",
  //     flags: 64,
  //   });
  //   return;
  // }

  // Normalized time (always 2 digits)
  const time = `${hour.toString().padStart(2, "0")}:${minutes
    .toString()
    .padStart(2, "0")}`;

  const notes =
    interaction.fields.getTextInputValue("notes_input");

  const forum = await client.channels.fetch(channels.raids);

  if (!forum || forum.type !== ChannelType.GuildForum) {
    throw new Error("Invalid forum channel.");
  }

  const raidState = {
    raidName: raid,
    day,
    time,
    timezone: "CET",
    type,
    leaderId: interaction.user.id,
    maxPlayers: 8,
    participants: [{ userId: interaction.user.id }],
    notes: notes,
  };

  const thread = await forum.threads.create({
    name: `🏆 ${raid} - ${day} ${time}`,
    message: {
      embeds: [buildRaidWidgetEmbed(raidState)],
      components: [buildRaidWidgetButtons()],
    },
  });

  const appliedTags = [];

  // Example mapping (adapt to your IDs)
  if (raid === "Dark Hours") appliedTags.push(getForumTagIdByName(forum, "Dark Hours"));
  if (raid === "Iron Horse") appliedTags.push(getForumTagIdByName(forum, "Iron Horse"));

  // Day tag
  // appliedTags.push("TAG_ID_DAY");

  await thread.setAppliedTags(appliedTags);

  // const raidState = {
  //   raidName: raid,
  //   day,
  //   time,
  //   timezone: "CET",
  //   type,
  //   leaderId: interaction.user.id,
  //   maxPlayers: 8,
  //   participants: [{ userId: interaction.user.id }],
  // };

  // await thread.send({
  //   embeds: [buildRaidWidgetEmbed(raidState)],
  //   components: [buildRaidWidgetButtons()],
  // });

  await interaction.reply({
    content: `Votre raid a été créé : ${thread.url}`,
    flags: 64,
  });

  await interaction.user.send({
    content: `Votre raid est prêt : ${thread.url}`,
  }).catch(() => null);

  // console.log({
  //   raidName,
  //   typeValue,
  //   dayValue,
  //   raid,
  //   type,
  //   day,
  //   time,
  //   notes,
  // });

  // await interaction.reply({
  //   content: [
  //     "✅ Raid récupéré avec succès.",
  //     "",
  //     `Raid : ${raid}`,
  //     `Type : ${type}`,
  //     `Jour : ${day}`,
  //     `Heure : ${time}`,
  //     `Notes : ${notes}`,
  //   ].join("\n"),
  //   flags: 64,
  // });
}