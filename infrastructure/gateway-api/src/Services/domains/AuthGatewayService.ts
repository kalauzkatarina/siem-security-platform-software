import axios, { AxiosInstance } from "axios";
import { LoginUserDTO } from "../../Domain/DTOs/LoginUserDTO";
import { RegistrationUserDTO } from "../../Domain/DTOs/RegistrationUserDTO";
import { AuthResponseType } from "../../Domain/types/AuthResponse";

export class AuthGatewayService {
  private readonly client: AxiosInstance;
  private readonly siemAuthClient: AxiosInstance;

  constructor(authBaseUrl?: string, siemAuthBaseUrl?: string) {
    this.client = axios.create({
      baseURL: authBaseUrl,
      headers: { "Content-Type": "application/json" },
      timeout: 5000,
    });

    this.siemAuthClient = axios.create({
      baseURL: siemAuthBaseUrl,
      headers: { "Content-Type": "application/json" },
      timeout: 5000,
    });
  }

  async login(data: LoginUserDTO): Promise<AuthResponseType> {
    try {
      const response = await this.client.post<AuthResponseType>("/auth/login", data);
      return response.data;
    } catch {
      return { authenificated: false };
    }
  }

  async register(data: RegistrationUserDTO): Promise<AuthResponseType> {
    try {
      const response = await this.client.post<AuthResponseType>("/auth/register", data);
      return response.data;
    } catch {
      return { authenificated: false };
    }
  }

  async validateToken(token: string): Promise<{
    valid: boolean;
    payload?: any;
    isSysAdmin?: boolean;
    error?: string;
  }> {
    try {
      const response = await this.siemAuthClient.post<{
        success: boolean;
        valid: boolean;
        isSysAdmin: boolean;
        user: { user_id: number; username: string; role: number };
      }>("/auth/validate", { token });

      if (!response.data.success || !response.data.valid) {
        return { valid: false, error: "Token validation failed." };
      }

      return {
        valid: true,
        payload: response.data.user,
        isSysAdmin: response.data.isSysAdmin,
      };
    } catch (error: any) {
      return { valid: false, error: error };
    }
  }
}
