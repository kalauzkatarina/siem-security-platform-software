import { UserRiskProfile } from "../models/UserRiskProfile";
import { RiskLevel } from "../enums/RiskLevel";

export interface IUserRiskRepositoryService {
  create(data: Partial<UserRiskProfile>): Promise<UserRiskProfile>;
  save(profile: UserRiskProfile): Promise<UserRiskProfile>;
  findAll(): Promise<UserRiskProfile[]>;
  findByUserId(userId: string): Promise<UserRiskProfile | null>;
  findByRiskLevel(level: RiskLevel): Promise<UserRiskProfile[]>;
  findHighRiskUsers(threshold: number): Promise<UserRiskProfile[]>;
}