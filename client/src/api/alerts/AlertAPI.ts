import axios, { AxiosInstance } from "axios";
import { IAlertAPI } from "./IAlertAPI";
import { AlertDTO } from "../../models/alerts/AlertDTO";

export class AlertAPI implements IAlertAPI {
  private readonly client: AxiosInstance;

  constructor() {
    this.client = axios.create({
      baseURL: import.meta.env.VITE_GATEWAY_URL,
      headers: { "Content-Type": "application/json" },
    });
  }

  async getAllAlerts(token: string): Promise<AlertDTO[]> {
    const response = await this.client.get<AlertDTO[]>("/siem/alerts", {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
  }

  async getAlertById(id: number, token: string): Promise<AlertDTO> {
    const response = await this.client.get<AlertDTO>(`/siem/alerts/${id}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
  }
}