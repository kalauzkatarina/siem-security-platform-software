import { ParserEventDto } from "../DTOs/ParserEventDTO";

export interface IParserRepositoryService {
    getAll(): Promise<ParserEventDto[]>;
    getParserEventById(id: number): Promise<ParserEventDto>;
    deleteById(id: number): Promise<boolean>;
}