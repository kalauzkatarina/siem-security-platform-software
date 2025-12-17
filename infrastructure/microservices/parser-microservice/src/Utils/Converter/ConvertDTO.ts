import { ParserEventDto } from "../../Domain/DTOs/ParserEventDTO";

export function toDTO(parserEvent: any): ParserEventDto {
    return {
      parser_id: parserEvent.parserId,
      event_id: parserEvent.eventId,
      text_before_parsing: parserEvent.textBeforeParsing,
    };
}