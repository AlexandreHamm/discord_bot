import { Events } from "discord.js";
import { env } from "./config/env.js";
import { client } from "./discord/client.js";
import { loadCommands } from "./discord/command-loader.js";
import { handleApplyButton } from "./interactions/buttons/apply.button.js";
import { handleClanApplicationModal } from "./interactions/modals/clan-application.modal.js";

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
    return;
  }

  if (interaction.isModalSubmit()) {
    await handleClanApplicationModal(interaction);
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

    const payload = {
      content: "I.S.A.C. encountered an error while processing this command.",
      ephemeral: true,
    };

    if (interaction.replied || interaction.deferred) {
      await interaction.followUp(payload);
    } else {
      await interaction.reply(payload);
    }
  }
});

await client.login(env.discordToken);