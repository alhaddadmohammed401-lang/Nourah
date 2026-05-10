// GCC climate context for Home. The values here are static stubs derived from the current
// month, mirroring the rules in AGENTS.md "GCC Climate Flags". A real weather API
// integration is deferred to a later craft run.

import type { GccFlag } from '../services/scanService';

export type TodayClimate = {
  uvIndex: number;
  uvLabel: 'Low' | 'Moderate' | 'High' | 'Very High' | 'Extreme';
  humidityLabel: 'Dry' | 'Moderate' | 'High' | 'Very High';
  flags: GccFlag[];
  city: string;
};

const HIGH_UV_MONTHS = new Set([4, 5, 6, 7, 8]); // May through September (0-indexed)

function uvLabelFor(uv: number): TodayClimate['uvLabel'] {
  if (uv >= 11) return 'Extreme';
  if (uv >= 8) return 'Very High';
  if (uv >= 6) return 'High';
  if (uv >= 3) return 'Moderate';
  return 'Low';
}

// Returns a plausible climate snapshot for today. Stable within a calendar day so the UI
// does not flicker on remount. Real values come from a weather API in a future iteration.
export function getTodayClimate(date: Date = new Date()): TodayClimate {
  const month = date.getMonth();
  const isHighUvSeason = HIGH_UV_MONTHS.has(month);

  const uvIndex = isHighUvSeason ? 9 : 5;
  const humidityLabel: TodayClimate['humidityLabel'] = isHighUvSeason ? 'Very High' : 'Moderate';

  const flags: GccFlag[] = [];
  if (isHighUvSeason) flags.push('high_uv');
  if (humidityLabel === 'Very High' || humidityLabel === 'High') flags.push('humidity_warning');

  return {
    uvIndex,
    uvLabel: uvLabelFor(uvIndex),
    humidityLabel,
    flags,
    city: 'Dubai',
  };
}

const FLAG_LABELS: Record<GccFlag, string> = {
  high_uv: 'High UV',
  humidity_warning: 'High humidity',
  melasma_risk: 'Melasma watch',
};

export function flagLabel(flag: GccFlag): string {
  return FLAG_LABELS[flag];
}
