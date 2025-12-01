import { EventDTO } from "../DTOs/EventDTO";

export interface IEventValidator {
    validateInputMessage(message: string): void;
    validateDTO(dto: EventDTO): void;
}
