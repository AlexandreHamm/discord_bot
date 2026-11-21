export type RaidParticipant = {
  userId: string;
};

export type RaidWidgetState = {
  raidName: string;
  day: string;
  time: string;
  timezone: string;
  type: string;
  leaderId: string;
  maxPlayers: number;
  participants: RaidParticipant[];
  notes?: string;
};