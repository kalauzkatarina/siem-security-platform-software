import { CorrelationCandidate } from "../types/CorrelationCandidate";
import { EventDTO } from "../types/EventDTO";

export interface ILLMChatAPIService {
  sendNormalizationPrompt(rawMessage: string): Promise<EventDTO>;
  sendCorrelationPrompt(rawMessage: string): Promise<CorrelationCandidate[]>;
}
