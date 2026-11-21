import {
  ChannelType,
  EmbedBuilder,
  GuildMember,
  ThreadChannel,
  User,
} from "discord.js";
import { roles } from "../../config/roles.js";
import { getForumTagIdByName } from "../../utils/forum-tags.js";

export type ApplicationDecision = "accepted" | "denied";

export type ProcessApplicationDecisionOptions = {
  channel: ThreadChannel;
  staffUser: User;
  decision: ApplicationDecision;
  reason?: string;
  allowOverride?: boolean;
};

function isApplicationProcessed(footerText: string) {
  return footerText.includes("Accepté") || footerText.includes("Refusé");
}

function getApplicantIdFromEmbed(embed: { fields: readonly { value: string }[] }) {
  const userIdField = embed.fields.find((field) => /\d{17,20}/.test(field.value));
  return userIdField?.value.match(/\d{17,20}/)?.[0] ?? null;
}

function removeDecisionFields(embed: EmbedBuilder) {
  const data = embed.toJSON();

  const filteredFields = data.fields?.filter((field) => {
    return ![
      "✅ Décision",
      "❌ Décision",
      "❌ Raison du refus",
    ].includes(field.name);
  });

  embed.setFields(filteredFields ?? []);
}

async function fetchApplicantMember(
  channel: ThreadChannel,
  userId: string,
): Promise<GuildMember | null> {
  return channel.guild.members.fetch(userId).catch(() => null);
}

export async function processApplicationDecision({
  channel,
  staffUser,
  decision,
  reason,
  allowOverride = false,
}: ProcessApplicationDecisionOptions) {
  if (channel.parent?.type !== ChannelType.GuildForum) {
    throw new Error("Application decision must be processed inside a forum thread.");
  }

  const starterMessage = await channel.fetchStarterMessage();

  if (!starterMessage?.embeds.length) {
    await channel.send("Impossible de trouver la candidature.");
    return { ok: false, message: "Impossible de trouver la candidature." };
  }

  const sourceEmbed = starterMessage.embeds[0];
  const currentStatus = sourceEmbed.footer?.text ?? "";

  if (!allowOverride && isApplicationProcessed(currentStatus)) {
    await channel.send({
      content: "⚠️ Cette candidature a déjà été traitée.",
    });

    return { ok: false, message: "Cette candidature a déjà été traitée." };
  }

  const userId = getApplicantIdFromEmbed(sourceEmbed);

  if (!userId) {
    await channel.send("Impossible de trouver l'utilisateur lié à cette candidature.");
    return {
      ok: false,
      message: "Impossible de trouver l'utilisateur lié à cette candidature.",
    };
  }

  const member = await fetchApplicantMember(channel, userId);

  if (decision === "accepted") {
    if (!member) {
      await channel.send("Utilisateur introuvable sur le serveur.");
      return { ok: false, message: "Utilisateur introuvable sur le serveur." };
    }

    await member.roles.add(roles.clanMember);

    await member
      .send({
        content:
          "🎉 **Candidature acceptée !**\n\nBienvenue dans le clan ! Nous sommes ravis de t'accueillir parmi nous.\n\nN'hésite pas à rejoindre les salons et à jouer avec les autres membres.",
      })
      .catch(() => null);
  }

  if (decision === "denied") {
    if (member) {
      await member.roles.remove(roles.clanMember).catch(() => null);
    }

    const user = await channel.client.users.fetch(userId).catch(() => null);

    if (user) {
      await user
        .send({
          content: `❌ **Candidature refusée**\n\nMerci pour ta candidature.\n\n**Raison :** ${reason ?? "Aucune raison spécifiée."}\n\nTu peux retenter ta chance plus tard.`,
        })
        .catch(() => null);
    }
  }

  const updatedEmbed = EmbedBuilder.from(sourceEmbed);
  removeDecisionFields(updatedEmbed);

  if (decision === "accepted") {
    updatedEmbed
      .setColor(0x57f287)
      .addFields({
        name: "✅ Décision",
        value: `Acceptée par <@${staffUser.id}>`,
        inline: false,
      })
      .setFooter({ text: `Statut: Accepté • Par ${staffUser.displayName}` });

    await starterMessage.edit({ embeds: [updatedEmbed], components: [] });

    await channel.send({
      content: `✅ Candidature acceptée par <@${staffUser.id}>.`,
    });

    const acceptedTagId = getForumTagIdByName(channel.parent, "Acceptée");
    await channel.setAppliedTags([acceptedTagId]);
  }

  if (decision === "denied") {
    const safeReason = reason?.trim() || "Aucune raison spécifiée.";

    updatedEmbed
      .setColor(0xed4245)
      .addFields({
        name: "❌ Décision",
        value: `Refusée par <@${staffUser.id}>\n\n**Raison :** ${safeReason}`,
        inline: false,
      })
      .setFooter({ text: `Statut: Refusé • Par ${staffUser.displayName}` });

    await starterMessage.edit({ embeds: [updatedEmbed], components: [] });

    await channel.send({
      content: `❌ Candidature refusée par <@${staffUser.id}>.\n**Raison :** ${safeReason}`,
    });

    const deniedTagId = getForumTagIdByName(channel.parent, "Refusée");
    await channel.setAppliedTags([deniedTagId]);
  }

  await channel.send({ content: "🔒 Vote clôturé — décision prise." });
  await channel.setLocked(true, "Candidature traitée.");
  await channel.setArchived(true, "Candidature traitée.");

  return { ok: true, userId };
}
