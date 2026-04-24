export type PersonaId = "ISAC" | "ANNA" | "DIAMOND";

export type PersonaConfig = {
  id: PersonaId;
  displayName: string;
  avatarUrl?: string;
  color: number;
};