export interface ScoreInput {
  mttdMinutes: number | null;
  mttrMinutes: number | null;
  falseAlarmRate: number;
  totalAlerts: number;
}

export function calculateScore(input: ScoreInput): number {
  let score = 100;

  if (input.mttdMinutes && input.mttdMinutes > 60) score -= 20;
  if (input.mttrMinutes && input.mttrMinutes > 120) score -= 20;
  if (input.falseAlarmRate > 0.3) score -= 20;
  if (input.totalAlerts > 100) score -= 20;

  return Math.max(0, Math.min(100, score));
}
