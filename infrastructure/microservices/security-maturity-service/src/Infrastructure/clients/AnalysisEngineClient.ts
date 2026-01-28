import axios, { AxiosInstance, AxiosResponse } from "axios";
import { Recommendation } from "../../Domain/types/Recommendation";
import { RecommendationPayloadDto } from "../../Domain/types/RecommendationPayloadDto";
import { mapRecommendationPayloadDto } from "../mappers/recommendationPayloadMapper";
import { createAxiosClient } from "../helpers/createAxiosClient";

export class AnalysisEngineClient {
  private readonly client: AxiosInstance;

  constructor(baseUrl: string) {
    this.client = createAxiosClient(baseUrl);
  }
  public async fetchRecommendations(): Promise<Recommendation[]> {
    try {
      const response: AxiosResponse<RecommendationPayloadDto[]> =
        await this.client.get("/recommendations");

      if (!Array.isArray(response.data)) {
        console.error("[AnalysisEngineClient] Invalid response shape (not array).");
        return [];
      }

      const results: Recommendation[] = [];

      for (const dto of response.data) {
        const mapped = mapRecommendationPayloadDto(dto);

        if (mapped.errors.length > 0) {
          console.error(
            "[AnalysisEngineClient] Dropping invalid recommendation payload:",
            mapped.errors.join("; ")
          );
          continue;
        }

        if (mapped.recommendation.id === -1) {
          continue;
        }

        results.push(mapped.recommendation);
      }

      return results;
    } catch (e) {
      console.error("[AnalysisEngineClient] Request failed.", String(e));
      return [];
    }
  }
}
