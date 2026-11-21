import fs from "fs";
import path from "path";
import { pathToFileURL } from "url";

export type Command = {
  data: {
    name: string;
    toJSON: () => unknown;
  };
  execute: (...args: any[]) => Promise<void>;
};

export async function loadCommands() {
  const commands = new Map<string, Command>();

  const commandsPath = path.resolve("src/commands");

  async function readCommands(dir: string) {
    const files = fs.readdirSync(dir);

    for (const file of files) {
      const fullPath = path.join(dir, file);
      const stat = fs.statSync(fullPath);

      if (stat.isDirectory()) {
        await readCommands(fullPath);
        continue;
      }

      if (!file.endsWith(".ts")) continue;

      const moduleUrl = pathToFileURL(fullPath).href;
      const commandModule = await import(moduleUrl);
      const command = commandModule.default;

      if (command?.data?.name) {
        commands.set(command.data.name, command);
      }
    }
  }

  await readCommands(commandsPath);

  return commands;
}