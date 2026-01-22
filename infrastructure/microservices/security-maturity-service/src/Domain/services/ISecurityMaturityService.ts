import { SecurityMaturityDTO } from "../DTOs/SecurityMaturityDTO";

export interface ISecurityMaturityService {
  calculateCurrentMaturity(): Promise<SecurityMaturityDTO>;
}
