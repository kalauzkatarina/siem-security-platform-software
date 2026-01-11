import { DistributionDTO } from "../DTOs/DistributionDTO";
import { EventDTO } from "../DTOs/EventDTO";
import { EventsResultDTO } from "../DTOs/EventsResultDTO";

export interface IQueryGatewayService {
  searchEvents(query: string, page: number, limit: number): Promise<EventsResultDTO>;
  getOldEvents(hours: number): Promise<EventDTO[]>;
  getLastThreeEvents(): Promise<EventDTO[]>;
  getAllEvents(): Promise<EventDTO[]>;
  getEventsCount(): Promise<number>;
  getInfoCount(): Promise<number>;
  getWarningCount(): Promise<number>;
  getErrorCount(): Promise<number>;
  getEventDistribution(): Promise<DistributionDTO>;
}