import { SecurityMaturityDTO } from "../Domain/DTOs/SecurityMaturityDTO";
import { ISecurityMaturityService } from "../Domain/services/ISecurityMaturityService";
import { mapScoreToLevel } from "../Utils/MapScoreToLevel";
import { calculateScore } from "../Utils/ScoreCalculator";

export class SecurityMaturityService implements ISecurityMaturityService {
  async calculateCurrentMaturity(): Promise<SecurityMaturityDTO> {
    const score = calculateScore({
      mttdMinutes: 45,
      mttrMinutes: 90,
      falseAlarmRate: 0.2,
      totalAlerts: 30,
    });

    const level = mapScoreToLevel(score);

    return { score, level };
  }
}
