import { env } from "./env.js";

export const channels = {
  rules: env.rulesChannelId,
  roles: env.rolesChannelId,
  applications: env.applicationsChannelId,

  raids: env.raidsForumId,

  staffApplicationsForum: env.staffApplicationForumId,

  suggestionsForum: env.suggestionsForumId,
};