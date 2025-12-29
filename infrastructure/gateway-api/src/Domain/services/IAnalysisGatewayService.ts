import { NormalizedEventDTO } from "../DTOs/NormalizedEventDTO";

export interface IAnalysisGatewayService {
  normalize(rawMessage: string): Promise<NormalizedEventDTO>;
  deleteCorrelationsByEventIds(eventIds: number[]): Promise<number>;
}