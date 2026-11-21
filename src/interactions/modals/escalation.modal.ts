import {
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle,
  ChannelType,
  EmbedBuilder,
  ModalSubmitInteraction,
  PermissionFlagsBits,
  TextChannel,
} from "discord.js";
import { env } from "../../config/env.js";
import { scheduleEscalationVoiceCleanup } from "../../features/escalations/escalation-voice-cleanup.service.js";

export async function handleEscalationModal(
  interaction: ModalSubmitInteraction,
) {
  if (!interaction.customId.startsWith("escalation_modal_")) return;

  await interaction.deferReply({ flags: 64 });

  const lang = interaction.customId.endsWith("_fr") ? "fr" : "en";

  const missionName = getModalSelectValue(interaction, "mission_name");
  const tier = getModalSelectValue(interaction, "tier_level");

  const guild = interaction.guild;

  if (!guild) {
    await interaction.editReply("Impossible de trouver le serveur.");
    return;
  }

  function getModalSelectValue(interaction: ModalSubmitInteraction, customId: string) {
    const findValue = (components: any[]): string | null => {
        for (const component of components) {
        if (component.customId === customId && Array.isArray(component.values)) {
            return component.values[0] ?? null;
        }

        if (component.component) {
            const value = findValue([component.component]);
            if (value) return value;
        }

        if (Array.isArray(component.components)) {
            const value = findValue(component.components);
            if (value) return value;
        }
        }

        return null;
    };

    const value = findValue(interaction.components as any[]);

    if (!value) {
        throw new Error(`Missing modal select value: ${customId}`);
    }

    return value;
  }

  const member = await guild.members.fetch(interaction.user.id);

  // const flag = lang === "fr" ? "🇫🇷" : "🇬🇧";

  const voiceChannel = await guild.channels.create({
    name: `Tier ${tier} - ${missionName}`,
    type: ChannelType.GuildVoice,
    parent: env.escalationCategoryId,
    permissionOverwrites: [], // don't override manually
    userLimit: 4,
  });

  await voiceChannel.lockPermissions();

  await scheduleEscalationVoiceCleanup(voiceChannel.id);

  const invite = await voiceChannel
    .createInvite({
        maxAge: 0,
        maxUses: 0,
        unique: true,
        reason: "Escalation matchmaking voice invite.",
    })
    .catch(async () => {
        await interaction.editReply(
        lang === "fr"
            ? "Le vocal a été créé, mais ISAC n'a pas la permission de créer une invitation."
            : "The voice channel was created, but ISAC cannot create an invite.",
        );

        return null;
    });

    if (!invite) return;

  const lfgChannelId =
    lang === "fr" ? env.escalationFrChannelId : env.escalationEnChannelId;

  const lfgChannel = await guild.channels.fetch(lfgChannelId);

  if (!lfgChannel || lfgChannel.type !== ChannelType.GuildText) {
    await interaction.editReply("Salon LFG Escalation introuvable.");
    return;
  }

  const embed = new EmbedBuilder()
    .setColor(0xf5a623)
    .setTitle(
      lang === "fr"
        ? "💎 Equipe Escalade créée"
        : "💎 Escalation group created",
    )
    .setDescription(
      lang === "fr"
        ? [
            `**Mission :** ${missionName}`,
            `**Tier :** ${tier}`,
            `**Leader :** <@${interaction.user.id}>`,
            "",
            "Cliquez ci-dessous pour rejoindre le vocal.",
          ].join("\n")
        : [
            `**Mission :** ${missionName}`,
            `**Tier :** ${tier}`,
            `**Leader :** <@${interaction.user.id}>`,
            "",
            "Click below to join the voice channel.",
          ].join("\n"),
    )
    .setFooter({
      text: "I.S.A.C • Escalation Matchmaking",
    });

  const row = new ActionRowBuilder<ButtonBuilder>().addComponents(
    new ButtonBuilder()
      .setLabel(lang === "fr" ? "Rejoindre le vocal" : "Join voice")
      .setEmoji("🔊")
      .setStyle(ButtonStyle.Link)
      .setURL(invite.url),
  );

  await (lfgChannel as TextChannel).send({
    embeds: [embed],
    components: [row],
  });

  try {
    if (member.voice.channel) {
      await member.voice.setChannel(voiceChannel);
    }
  } catch {
    await interaction.user.send({
      content:
        lang === "fr"
          ? `Votre vocal Escalade est prêt : ${invite.url}`
          : `Your Escalation voice channel is ready: ${invite.url}`,
    }).catch(() => null);
  }

  const confirmationRow = new ActionRowBuilder<ButtonBuilder>().addComponents(
    new ButtonBuilder()
      .setLabel(voiceChannel.name)
      .setEmoji("🔊")
      .setStyle(ButtonStyle.Link)
      .setURL(invite.url),
  );

  await interaction.editReply({
    content:
      lang === "fr"
        ? "Équipe Escalade créée."
        : "Escalation group created.",
    components: [confirmationRow],
  });
}
