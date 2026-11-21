import {
  ChatInputCommandInteraction,
  SlashCommandBuilder,
} from "discord.js";

export default {
  data: new SlashCommandBuilder()
    .setName("ping")
    .setDescription("Checks if ISAC is online."),

  async execute(interaction: ChatInputCommandInteraction) {
    await interaction.reply({
      content: "I.S.A.C. systems online.",
      ephemeral: true,
    });
  },
};