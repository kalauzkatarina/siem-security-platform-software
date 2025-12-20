import axios, { AxiosInstance } from "axios";
import { EventDTO } from "../../Domain/DTOs/EventDTO";
import { ParserEventDto } from "../../Domain/DTOs/ParserEventDTO";

export class ParserGatewayService {
  private readonly client: AxiosInstance;

  constructor(parserBaseUrl?: string) {
    this.client = axios.create({
      baseURL: parserBaseUrl,
      headers: { "Content-Type": "application/json" },
      timeout: 5000,
    });
  }

  async log(eventMessage: string, eventSource: string): Promise<EventDTO> {
    const response = await this.client.post<EventDTO>("/parserEvents/log", {
      message: eventMessage,
      source: eventSource,
    });

    return response.data;
  }

  async getAllParserEvents(): Promise<ParserEventDto[]> {
    const response = await this.client.get<ParserEventDto[]>("/parserEvents");
    return response.data;
  }

  async getParserEventById(id: number): Promise<ParserEventDto> {
    const response = await this.client.get<ParserEventDto>(`/parserEvents/${id}`);
    return response.data;
  }

  async deleteById(id: number): Promise<boolean> {
    const response = await this.client.delete<boolean>(`/parserEvents/${id}`);
    return response.data;
  }
}
