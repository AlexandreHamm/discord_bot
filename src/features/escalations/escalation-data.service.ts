const EVENT_INDEX_URL =
  "https://hi-dep.github.io/division2/data/event/index.json";

const CACHE_TTL_MS = 10 * 60 * 1000;
const REQUEST_TIMEOUT_MS = 1_800;

type CachedMissionPool = {
  missions: string[];
  expiresAt: number;
};

let cache: CachedMissionPool | null = null;
let inFlightRequest: Promise<string[]> | null = null;

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null;
}

function normalizeMissions(value: unknown): string[] {
  if (!Array.isArray(value)) return [];

  return Array.from(
    new Set(
      value
        .filter((mission): mission is string => typeof mission === "string")
        .map((mission) => mission.trim())
        .filter(Boolean),
    ),
  ).slice(0, 25);
}

function extractMissionPool(data: unknown, targetDay: string): string[] {
  if (!isRecord(data) || !Array.isArray(data.Escalation)) {
    throw new Error("Escalation data is missing from the event index.");
  }

  let fallback:
    | {
        day: string;
        missions: string[];
      }
    | null = null;

  for (const rawEntry of data.Escalation) {
    if (!isRecord(rawEntry)) continue;

    const missions = normalizeMissions(rawEntry.missions);
    const dailyRows = rawEntry.target_loot_by_day;

    if (!missions.length || !Array.isArray(dailyRows)) continue;

    for (const rawRow of dailyRows) {
      if (!isRecord(rawRow)) continue;

      const day =
        typeof rawRow.day === "string" ? rawRow.day.trim() : "";

      if (!day) continue;

      if (day === targetDay) {
        return missions;
      }

      if (!fallback || day > fallback.day) {
        fallback = {
          day,
          missions,
        };
      }
    }
  }

  if (fallback) {
    return fallback.missions;
  }

  throw new Error("No Escalation mission pool was found.");
}

async function fetchCurrentEscalationMissions(): Promise<string[]> {
  const response = await fetch(EVENT_INDEX_URL, {
    headers: {
      Accept: "application/json",
    },
    signal: AbortSignal.timeout(REQUEST_TIMEOUT_MS),
  });

  if (!response.ok) {
    throw new Error(
      `Escalation API returned ${response.status} ${response.statusText}.`,
    );
  }

  const data: unknown = await response.json();
  const today = new Date().toISOString().slice(0, 10);

  return extractMissionPool(data, today);
}

export async function getCurrentEscalationMissions(): Promise<string[]> {
  if (cache && Date.now() < cache.expiresAt) {
    return [...cache.missions];
  }

  if (!inFlightRequest) {
    inFlightRequest = fetchCurrentEscalationMissions()
      .then((missions) => {
        cache = {
          missions,
          expiresAt: Date.now() + CACHE_TTL_MS,
        };

        return missions;
      })
      .finally(() => {
        inFlightRequest = null;
      });
  }

  try {
    return [...(await inFlightRequest)];
  } catch (error) {
    if (cache) {
      console.warn(
        "Escalation API unavailable; using the last cached mission pool.",
        error,
      );

      return [...cache.missions];
    }

    throw error;
  }
}
