import {
  ChannelType,
  ChatInputCommandInteraction,
  MessageFlags,
  PermissionFlagsBits,
  SlashCommandBuilder,
} from "discord.js";
import {
  buildAutoPublishTopic,
  isAutoPublishEnabled,
} from "../../features/auto-publish/auto-publish.service.js";

const PUBLISH_PERMISSIONS = [
  { flag: PermissionFlagsBits.ViewChannel, name: "View Channel" },
  { flag: PermissionFlagsBits.ReadMessageHistory, name: "Read Message History" },
  { flag: PermissionFlagsBits.SendMessages, name: "Send Messages" },
  { flag: PermissionFlagsBits.ManageMessages, name: "Manage Messages" },
] as const;

export default {
  data: new SlashCommandBuilder()
    .setName("auto-publish")
    .setDescription("Enable or disable publishing new announcement messages automatically.")
    .addChannelOption((option) =>
      option
        .setName("channel")
        .setDescription("Announcement channel to configure.")
        .addChannelTypes(ChannelType.GuildAnnouncement)
        .setRequired(true),
    )
    .addBooleanOption((option) =>
      option
        .setName("enabled")
        .setDescription("True to enable; false to disable auto-publishing.")
        .setRequired(true),
    )
    .setDefaultMemberPermissions(PermissionFlagsBits.ManageChannels),

  async execute(interaction: ChatInputCommandInteraction): Promise<void> {
    await interaction.deferReply({ flags: MessageFlags.Ephemeral });

    const guild = interaction.guild;
    if (!guild || !interaction.memberPermissions?.has(PermissionFlagsBits.ManageChannels)) {
      await interaction.editReply("You need Manage Channels permission in a server to use this command.");
      return;
    }

    const chosenChannel = interaction.options.getChannel("channel", true);
    const enabled = interaction.options.getBoolean("enabled", true);
    const channel = await guild.channels.fetch(chosenChannel.id);

    if (!channel || channel.type !== ChannelType.GuildAnnouncement) {
      await interaction.editReply("Please select an Announcement channel, not a regular text channel.");
      return;
    }

    const botMember = await guild.members.fetchMe();
    const botPermissions = channel.permissionsFor(botMember);

    if (!botPermissions?.has(PermissionFlagsBits.ManageChannels)) {
      await interaction.editReply("I need Manage Channels permission to save the setting in the channel topic.");
      return;
    }

    if (enabled) {
      const missing = PUBLISH_PERMISSIONS
        .filter(({ flag }) => !botPermissions?.has(flag))
        .map(({ name }) => name);

      if (missing.length > 0) {
        await interaction.editReply(`I need these permissions in ${channel}: ${missing.join(", ")}.`);
        return;
      }
    }

    if (isAutoPublishEnabled(channel.topic) === enabled) {
      await interaction.editReply(`Auto-publish is already ${enabled ? "enabled" : "disabled"} in ${channel}.`);
      return;
    }

    const newTopic = buildAutoPublishTopic(channel.topic, enabled);
    if (newTopic && newTopic.length > 1024) {
      await interaction.editReply("The channel topic is too long to add the auto-publish marker (1024-character limit).");
      return;
    }

    await channel.setTopic(
      newTopic,
      `Auto-publish ${enabled ? "enabled" : "disabled"} by ${interaction.user.id}`,
    );

    await interaction.editReply(
      `Auto-publish **${enabled ? "enabled" : "disabled"}** for ${channel}. ` +
      (enabled ? "New messages will be published automatically." : "New messages will no longer be auto-published."),
    );
  },
};

