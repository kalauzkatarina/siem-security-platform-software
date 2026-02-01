import { IntegrityReportDTO, IntegrityStatusDTO } from "../../models/interity/IntegrityLogDTO";

export interface IIntegrityAPI {
  getStatus(token: string): Promise<IntegrityStatusDTO>;
  verifyIntegrity(token: string): Promise<IntegrityReportDTO>;
}