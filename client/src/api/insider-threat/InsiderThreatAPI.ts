import axios, { AxiosInstance } from "axios";
import { IInsiderThreatAPI } from "./IInsiderThreatAPI";
import { InsiderThreatDTO } from "../../models/insider-threat/InsiderThreatDTO";
import { PaginatedThreatsDTO, ThreatQueryDTO } from "../../models/insider-threat/ThreatQueryDTO";
import { UserRiskProfileDTO } from "../../models/insider-threat/UserRiskProfileDTO";
import { UserRiskAnalysisDTO } from "../../models/insider-threat/UserRiskAnalysisDTO";

export class InsiderThreatAPI implements IInsiderThreatAPI {
  private readonly client: AxiosInstance;
  private readonly basePath = "/insider-threats";
  private readonly riskPath = "/siem/user-risk";

  constructor() {
    this.client = axios.create({
      baseURL: import.meta.env.VITE_GATEWAY_URL,
      headers: { "Content-Type": "application/json" },
      timeout: 30000,
    });
  }

  // =============== THREAT METHODS ===============

  async getAllThreats(token: string): Promise<InsiderThreatDTO[]> {
    const response = await this.client.get<InsiderThreatDTO[]>(this.basePath, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
  }

  async getThreatById(id: number, token: string): Promise<InsiderThreatDTO> {
    const response = await this.client.get<InsiderThreatDTO>(`${this.basePath}/${id}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
  }

  async getThreatsByUserId(userId: string, token: string): Promise<InsiderThreatDTO[]> {
    const response = await this.client.get<InsiderThreatDTO[]>(`${this.basePath}/user/${userId}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
  }

  async getUnresolvedThreats(token: string): Promise<InsiderThreatDTO[]> {
    const response = await this.client.get<InsiderThreatDTO[]>(`${this.basePath}/unresolved`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
  }

  async searchThreats(query: ThreatQueryDTO, token: string): Promise<PaginatedThreatsDTO> {
    const response = await this.client.get<PaginatedThreatsDTO>(`${this.basePath}/search`, {
      headers: { Authorization: `Bearer ${token}` },
      params: this.sanitizeQuery(query),
    });
    return response.data;
  }

  async resolveThreat(id: number, resolvedBy: string, resolutionNotes: string | undefined, token: string): Promise<InsiderThreatDTO> {
    const response = await this.client.put<InsiderThreatDTO>(
      `${this.basePath}/${id}/resolve`,
      { resolvedBy, resolutionNotes },
      { headers: { Authorization: `Bearer ${token}` } }
    );
    return response.data;
  }

  // =============== USER RISK METHODS ===============

  async getAllUserRiskProfiles(token: string): Promise<UserRiskProfileDTO[]> {
    const response = await this.client.get<UserRiskProfileDTO[]>(`${this.riskPath}/profiles`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
  }

  async getHighRiskUsers(token: string): Promise<UserRiskProfileDTO[]> {
    const response = await this.client.get<UserRiskProfileDTO[]>(`${this.riskPath}/high-risk`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
  }

  async getUserRiskProfile(userId: string, token: string): Promise<UserRiskProfileDTO> {
    const response = await this.client.get<UserRiskProfileDTO>(`${this.riskPath}/${userId}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
  }

  async getUserRiskAnalysis(userId: string, token: string): Promise<UserRiskAnalysisDTO> {
    const response = await this.client.get<UserRiskAnalysisDTO>(`${this.riskPath}/${userId}/analysis`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
  }

  async recalculateUserRisk(userId: string, token: string): Promise<UserRiskProfileDTO> {
    const response = await this.client.post<UserRiskProfileDTO>(
      `${this.riskPath}/${userId}/recalculate`,
      {},
      { headers: { Authorization: `Bearer ${token}` } }
    );
    return response.data;
  }

  // =============== HELPER ===============

  private sanitizeQuery(query: ThreatQueryDTO): Record<string, any> {
    const sanitized: Record<string, any> = {};
    Object.entries(query).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== "") {
        sanitized[key] = value;
      }
    });
    return sanitized;
  }
}