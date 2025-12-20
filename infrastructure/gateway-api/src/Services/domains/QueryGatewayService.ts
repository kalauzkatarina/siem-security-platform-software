import axios, { AxiosInstance } from "axios";
import { EventDTO } from "../../Domain/DTOs/EventDTO";

export class QueryGatewayService {
  private readonly client: AxiosInstance;

  constructor(queryBaseUrl?: string) {
    this.client = axios.create({
      baseURL: queryBaseUrl,
      headers: { "Content-Type": "application/json" },
      timeout: 5000,
    });
  }

  async searchEvents(query: string): Promise<EventDTO[]> {
    const response = await this.client.get<any[]>("/query/search", {
      params: { q: query },
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
}
