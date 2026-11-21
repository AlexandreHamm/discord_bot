import { REST, Routes } from "discord.js";
import { env } from "../config/env.js";

import pingCommand from "../commands/utility/ping.command.js";

import setupApplicationsCommand from "../commands/setup/setup-applications.command.js";

import acceptCommand from "../commands/staff/accept.command.js";
import denyCommand from "../commands/staff/deny.command.js";

import setupRulesCommand from "../commands/setup/setup-rules.command.js";
import setupRolesCommand from "../commands/setup/setup-roles.command.js";
import setupWelcomeCommand from "../commands/setup/setup-welcome.command.js";

// TEST
import setupRaidCommand from "../commands/setup/setup-raid.command.js";

import setupEscalationCommand from "../commands/setup/setup-escalation.command.js";
import setupSuggestionsCommand from "../commands/setup/setup-suggestions.command.js";
import autoPublishCommand from "../commands/setup/auto-publish.command.js";

const commands = [
  pingCommand.data.toJSON(),
  setupApplicationsCommand.data.toJSON(),
  setupRulesCommand.data.toJSON(),
  setupRolesCommand.data.toJSON(),
  setupWelcomeCommand.data.toJSON(),
  setupEscalationCommand.data.toJSON(),
  setupSuggestionsCommand.data.toJSON(),
  autoPublishCommand.data.toJSON(),
  acceptCommand.data.toJSON(),
  denyCommand.data.toJSON(),
  setupRaidCommand.data.toJSON(), // TEST
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