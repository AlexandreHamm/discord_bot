import type { PersonaConfig, PersonaId } from "./persona.types.js";

export const personas: Record<PersonaId, PersonaConfig> = {
  ISAC: {
    id: "ISAC",
    displayName: "I.S.A.C",
    color: 0xf5a623,
  },

  ANNA: {
    id: "ANNA",
    displayName: "A.N.N.A",
    color: 0x4aa3ff,
  },

  DIAMOND: {
    id: "DIAMOND",
    displayName: "DIAMOND",
    color: 0xd72638,
  },
};

export function getPersona(id: PersonaId): PersonaConfig {
  return personas[id];
}