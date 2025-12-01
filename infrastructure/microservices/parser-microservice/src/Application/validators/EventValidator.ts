import { IEventValidator } from "../../Domain/validators/IEventValidator";
import { EventDTO } from "../../Domain/DTOs/EventDTO";

export class EventValidator implements IEventValidator {

    validateInputMessage(message: string): void {
        if (!message || typeof message !== "string")
            throw new Error("Invalid input: 'message' must be a non-empty string.");

        if (message.length > 10000)
            throw new Error("Message exceeds maximum allowed size (10k chars).");
    }

    validateDTO(dto: EventDTO): void {
        if (!dto.type)
            throw new Error("Invalid DTO: missing type.");

        if (!dto.description)
            throw new Error("Invalid DTO: missing description.");

        if (!dto.timestamp)
            throw new Error("Invalid DTO: missing timestamp.");
    }
}
