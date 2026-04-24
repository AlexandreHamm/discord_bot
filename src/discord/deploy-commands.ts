import { REST, Routes } from "discord.js";
import { env } from "../config/env.js";

import pingCommand from "../commands/utility/ping.command.js";

import setupApplicationsCommand from "../commands/setup/setup-applications.command.js";

import acceptCommand from "../commands/staff/accept.command.js";
import rejectCommand from "../commands/staff/reject.command.js";

import setupRulesCommand from "../commands/setup/setup-rules.command.js";

const commands = [
  pingCommand.data.toJSON(),
  setupApplicationsCommand.data.toJSON(),
  setupRulesCommand.data.toJSON(),
  acceptCommand.data.toJSON(),
  rejectCommand.data.toJSON(),
];

const rest = new REST({ version: "10" }).setToken(env.discordToken);

try {
  console.log("Deploying guild slash commands...");

  await rest.put(
    Routes.applicationGuildCommands(env.discordClientId, env.discordGuildId),
    { body: commands },
  );

  console.log("Slash commands deployed.");
} catch (error) {
  console.error("Failed to deploy slash commands:", error);
  process.exit(1);
}