import axios, { AxiosInstance } from "axios";
import { UserDTO } from "../../Domain/DTOs/UserDTO";

export class UserGatewayService {
  private readonly client: AxiosInstance;

  constructor(userBaseUrl?: string) {
    this.client = axios.create({
      baseURL: userBaseUrl,
      headers: { "Content-Type": "application/json" },
      timeout: 5000,
    });
  }

  async getAllUsers(): Promise<UserDTO[]> {
    const response = await this.client.get<UserDTO[]>("/users");
    return response.data;
  }

  async getUserById(id: number): Promise<UserDTO> {
    const response = await this.client.get<UserDTO>(`/users/${id}`);
    return response.data;
  }
}
