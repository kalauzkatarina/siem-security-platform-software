import { Repository, MoreThanOrEqual } from "typeorm";
import { UserRiskProfile } from "../Domain/models/UserRiskProfile";
import { IUserRiskRepositoryService } from "../Domain/services/IUserRiskRepositoryService";
import { ILoggerService } from "../Domain/services/ILoggerService";
import { RiskLevel } from "../Domain/enums/RiskLevel";

export class UserRiskRepositoryService implements IUserRiskRepositoryService {
  constructor(
    private repo: Repository<UserRiskProfile>,
    private readonly logger: ILoggerService
  ) {}

  async create(data: Partial<UserRiskProfile>): Promise<UserRiskProfile> {
    const entity = this.repo.create(data);
    const saved = await this.repo.save(entity);
    return saved;
  }

  async save(profile: UserRiskProfile): Promise<UserRiskProfile> {
    return this.repo.save(profile);
  }

  async findAll(): Promise<UserRiskProfile[]> {
    return this.repo.find({ order: { riskScore: 'DESC' } });
  }

  async findByUserId(userId: string): Promise<UserRiskProfile | null> {
    const profile = await this.repo.findOne({ where: { userId } });
    
    if (!profile) {
      await this.logger.log(`User risk profile for userId ${userId} not found`);
    }
    
    return profile;
  }

  async findByRiskLevel(level: RiskLevel): Promise<UserRiskProfile[]> {
    return this.repo.find({ 
      where: { currentRiskLevel: level },
      order: { riskScore: 'DESC' }
    });
  }

  async findHighRiskUsers(threshold: number): Promise<UserRiskProfile[]> {
    return this.repo.find({ 
      where: { riskScore: MoreThanOrEqual(threshold) },
      order: { riskScore: 'DESC' }
    });
  }
}