import { CorrelationDTO } from "../types/CorrelationDTO";
export interface ICorrelationService{
    findCorrelations(): Promise<void>;
    
}