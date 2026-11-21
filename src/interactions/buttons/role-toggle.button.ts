import { ButtonInteraction } from "discord.js";
import { roles } from "../../config/roles.js";

const roleMap = {
  toggle_role_fr: {
    roleId: roles.french,
    label: "Français",
  },
  toggle_role_en: {
    roleId: roles.english,
    label: "English",
  },
} as const;

export async function handleRoleToggleButton(interaction: ButtonInteraction) {
  const config = roleMap[interaction.customId as keyof typeof roleMap];

  if (!config) return;

  const member = await interaction.guild?.members
    .fetch(interaction.user.id)
    .catch(() => null);

  if (!member) {
    await interaction.reply({
      content: "Impossible de trouver votre profil sur le serveur.",
      flags: 64,
    });
    return;
  }

  const hasRole = member.roles.cache.has(config.roleId);

  if (hasRole) {
    await member.roles.remove(config.roleId);

    await interaction.reply({
      content: `Role revoked : **${config.label}**`,
      flags: 64,
    });

    return;
  }

  await member.roles.add(config.roleId);

  await interaction.reply({
    content: `New role : **${config.label}**`,
    flags: 64,
  });
}