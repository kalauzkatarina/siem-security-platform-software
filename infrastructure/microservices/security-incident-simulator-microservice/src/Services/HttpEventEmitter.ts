import axios, { AxiosInstance } from "axios";
import { IEventEmitter } from "../Domain/services/IEventEmitter";
import { EventDTO } from "../Domain/types/EventDTO";

export class HttpEventEmitter implements IEventEmitter {
  private readonly client: AxiosInstance;

  constructor(baseUrl?: string) {
    this.client = axios.create({
      baseURL: baseUrl,
      headers: { "Content-Type": "application/json" },
      timeout: 5000,
    });
  }

  async emitEvent(event: EventDTO): Promise<void> {
    await this.client.post("/api/v1/events", event);
  }
}
