
export interface IAnalysisEngineService {
    sendPromptToLlm(prompt: string): Promise<string>;
    findCorrelation():Promise<void>;
}