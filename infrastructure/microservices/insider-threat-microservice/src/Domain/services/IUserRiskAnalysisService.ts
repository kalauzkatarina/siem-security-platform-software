import { UserRiskProfileDTO } from "../DTOs/UserRiskProfileDTO";
import { UserRiskAnalysisDTO } from "../DTOs/UserRiskAnalysisDTO";

export interface IUserRiskAnalysisService {
  getUserRiskProfile(userId: string): Promise<UserRiskProfileDTO>;
  getAllUserRiskProfiles(): Promise<UserRiskProfileDTO[]>;
  getHighRiskUsers(): Promise<UserRiskProfileDTO[]>;
  getUserRiskAnalysis(userId: string): Promise<UserRiskAnalysisDTO>;
  updateUserRiskAfterThreat(userId: string, username: string, threatId: number): Promise<void>;
  updateUserLoginInfo(userId: string, username: string, isSuccessful: boolean): Promise<void>;
  recalculateUserRisk(userId: string): Promise<UserRiskProfileDTO>;
}