import { Events } from "discord.js";
import { env } from "./config/env.js";
import { client } from "./discord/client.js";
import { createServer } from "node:http";
import { loadCommands } from "./discord/command-loader.js";
import { handleApplyButton } from "./interactions/buttons/apply.button.js";
import { handleClanApplicationModal } from "./interactions/modals/clan-application.modal.js";
import { handleRoleToggleButton } from "./interactions/buttons/role-toggle.button.js";
import { handleApplicationDecisionButton } from "./interactions/buttons/application-decision.button.js";
import { handleApplicationDecisionModal } from "./interactions/modals/application-decision.modal.js";

// RAIDS
import { handleRaidButton } from "./interactions/buttons/raid.button.js";
import { handleRaidModal } from "./interactions/modals/raid.modal.js";

// ESCALATION
import { handleEscalationButton } from "./interactions/buttons/escalation.button.js";
import { handleEscalationModal } from "./interactions/modals/escalation.modal.js";
import { registerEscalationVoiceCleanup } from "./features/escalations/escalation-voice-cleanup.service.js";
import { registerAutoPublish } from "./features/auto-publish/auto-publish.service.js";

import { handleRaidWidgetButton } from "./interactions/buttons/raid-widget.button.js";

// SUGGESTIONS
import { handleSuggestionButton } from "./interactions/buttons/suggestion.button.js";
import { handleSuggestionModal } from "./interactions/modals/suggestion.modal.js";

const commands = await loadCommands();

client.once(Events.ClientReady, (readyClient) => {
  console.log(`I.S.A.C. online as ${readyClient.user.tag}`);
});

client.on(Events.InteractionCreate, async (interaction) => {
  if (interaction.isChatInputCommand()) {
    const command = commands.get(interaction.commandName);

    if (!command) {
        await interaction.reply({
        content: "Unknown command.",
        ephemeral: true,
        });
        return;
    }

    try {
        await command.execute(interaction);
    } catch (error) {
        console.error(error);

        const payload = {
        content:
            "I.S.A.C. encountered an error while processing this command.",
        ephemeral: true,
        };

        if (interaction.replied || interaction.deferred) {
        await interaction.followUp(payload);
        } else {
        await interaction.reply(payload);
        }
    }

    return;
  }

  if (interaction.isButton()) {
    await handleApplyButton(interaction);
    await handleRoleToggleButton(interaction);
    await handleApplicationDecisionButton(interaction);

    // RAIDS
    await handleRaidButton(interaction);
    await handleRaidWidgetButton(interaction);

    // ESCALATION
    await handleEscalationButton(interaction);

    // SUGGESTIONS
    await handleSuggestionButton(interaction);
    return;
  }

  if (interaction.isModalSubmit()) {
    await handleClanApplicationModal(interaction);
    await handleApplicationDecisionModal(interaction);

    // RAIDS
    await handleRaidModal(interaction);

    // ESCALATION
    await handleEscalationModal(interaction);

    // SUGGESTIONS
    await handleSuggestionModal(interaction);

    return;
  }

  const command = commands.get(interaction.commandName);

  if (!command) {
    await interaction.reply({
      content: "Unknown command.",
      ephemeral: true,
    });
    return;
  }

  try {
    await command.execute(interaction);
  } catch (error) {
    console.error(error);

    const message =
      "I.S.A.C. encountered an error while processing this command.";

    try {
      if (interaction.deferred || interaction.replied) {
        await interaction.editReply({
          content: message,
        }).catch(() => null);

        await interaction.followUp({
          content: message,
          flags: 64,
        }).catch(() => null);
      } else {
        await interaction.reply({
          content: message,
          flags: 64,
        }).catch(() => null);
      }
    } catch {
      // Interaction expired or already handled.
    }
  }
});

registerEscalationVoiceCleanup();
registerAutoPublish();

const port = Number(process.env.PORT ?? 10000);

createServer((req, res) => {
  if (req.url === "/health") {
    res.writeHead(200, { "Content-Type": "application/json" });
    res.end(
      JSON.stringify({
        ok: true,
        service: "isac-discord-bot",
      }),
    );
    return;
  }

  res.writeHead(200, { "Content-Type": "text/plain" });
  res.end("I.S.A.C. online");
}).listen(port, "0.0.0.0", () => {
  console.log(`Health server listening on port ${port}`);
});

await client.login(env.discordToken);