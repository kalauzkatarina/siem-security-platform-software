import axios, { AxiosInstance } from "axios";
import { ISimulatorAPI, SimulationRequestDTO } from "./ISimulatorAPI";
import { SimulationDTO } from "../../models/simulator/SimulationDTO";

export class SimulatorAPI implements ISimulatorAPI {
  private readonly client: AxiosInstance;

  constructor(client?: AxiosInstance) {
    this.client =
      client ??
      axios.create({
        baseURL: import.meta.env.VITE_GATEWAY_URL,
        headers: { "Content-Type": "application/json" },
      });
  }

  async startSimulation(payload: SimulationRequestDTO, token: string): Promise<SimulationDTO> {
    const response = await this.client.post<SimulationDTO>("/simulator/start", payload, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
  }

  async stopSimulation(id: string, token: string): Promise<SimulationDTO> {
    const response = await this.client.post<SimulationDTO>(`/simulator/${id}/stop`, undefined, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
  }

  async getSimulation(id: string, token: string): Promise<SimulationDTO> {
    const response = await this.client.get<SimulationDTO>(`/simulator/${id}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
  }

  async listSimulations(token: string): Promise<SimulationDTO[]> {
    const response = await this.client.get<SimulationDTO[]>("/simulator", {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
  }
}
