import axios, { AxiosInstance } from "axios";
import { NormalizedEventDTO } from "../../Domain/DTOs/NormalizedEventDTO";

export class AnalysisGatewayService {
  private readonly client: AxiosInstance;

  constructor(baseUrl?: string) {
    this.client = axios.create({
      baseURL: baseUrl,
      headers: { "Content-Type": "application/json" },
      timeout: 5000,
    });
  }

  async normalize(rawMessage: string): Promise<NormalizedEventDTO> {
    const response = await this.client.post<{ eventData: NormalizedEventDTO }>(
      "/AnalysisEngine/processEvent",
      { message: rawMessage },
    );
    return response.data.eventData;
  }

  async deleteCorrelationsByEventIds(eventIds: number[]): Promise<number> {
    const response = await this.client.post<{ deletedCount: number }>(
      "/AnalysisEngine/correlations/deleteByEventIds",
      { eventIds },
    );
    const data = response.data;

    if (!data || typeof data.deletedCount !== "number") {
      console.error("Invalid response from correlation service");
    }

    return data.deletedCount;
  }
}
