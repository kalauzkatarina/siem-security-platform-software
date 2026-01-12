import axios, { AxiosInstance } from "axios";
import { EventDTO } from "../../Domain/DTOs/EventDTO";
import { defaultAxiosClient } from "../../Domain/constants/AxiosClient";
import { serviceConfig } from "../../Domain/constants/ServiceConfig";
import { IQueryGatewayService } from "../../Domain/services/IQueryGatewayService";
import { EventsResultDTO } from "../../Domain/DTOs/EventsResultDTO";
import { DistributionDTO } from "../../Domain/DTOs/DistributionDTO";
import { HourlyStatisticsDTO } from "../../Domain/DTOs/HourlyStatisticsDTO";


export class QueryGatewayService implements IQueryGatewayService {
  private readonly client: AxiosInstance;

  constructor() {
    this.client = axios.create({
      baseURL: serviceConfig.query,
      ...defaultAxiosClient
    });
  }

  async searchEvents(query: string, targetPage: number, limit: number): Promise<EventsResultDTO> {
    const response = await this.client.get<EventsResultDTO>("/query/search", {
      params: { q: query, p: targetPage, l: limit },
    });
    return response.data;
  }

  async getOldEvents(hours: number): Promise<EventDTO[]> {
    const response = await this.client.get<any[]>(`/query/oldEvents/${hours}`);
    return response.data;
  }

  async getLastThreeEvents(): Promise<EventDTO[]> {
    const response = await this.client.get<any[]>(`/query/lastThreeEvents`);
    return response.data;
  }

  async getAllEvents(): Promise<EventDTO[]> {
    const response = await this.client.get<any[]>("/query/events");
    return response.data;
  }

  async getEventsCount(): Promise<number> {
    const response = await this.client.get<{ count: number }>("/query/eventsCount");
    return response.data.count;
  }

  async getInfoCount(): Promise<number> {
    const response = await this.client.get<{ count: number }>("/query/infoCount");
    return response.data.count;
  }

  async getWarningCount(): Promise<number> {
    const response = await this.client.get<{ count: number }>("/query/warningCount");
    return response.data.count;
  }

  async getErrorCount(): Promise<number> {
    const response = await this.client.get<{ count: number }>("/query/errorCount");
    return response.data.count;
  }

  async getEventDistribution(): Promise<DistributionDTO> {
    const response = await this.client.get<DistributionDTO>("/query/eventDistribution");
    return response.data;
  }

  async getEventStatistics(): Promise<HourlyStatisticsDTO[]> {
    const response = await this.client.get<HourlyStatisticsDTO[]>("/query/statistics/events");
    return response.data;
  }

  async getAlertStatistics(): Promise<HourlyStatisticsDTO[]> {
    const response = await this.client.get<HourlyStatisticsDTO[]>("/query/statistics/alerts");
    return response.data;
  }
}