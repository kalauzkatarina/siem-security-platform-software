import { Repository, Timestamp } from "typeorm";
import { EventDTO } from "../Domain/DTOs/EventDTO";
import { ParserEvent } from "../Domain/models/ParserEvent";
import { IParserService } from "../Domain/services/IParserService";
import axios, { Axios, AxiosError, AxiosInstance } from "axios";
import { EventType } from "../Domain/enums/EventType";
import { parseLoginMessage } from "../Utils/Regex/LoginMessageParser";
import { parsePermissionChangeMessage } from "../Utils/Regex/PermissionChangeParser";
import { parseDbAccessMessage } from "../Utils/Regex/DbAccessParser";
import { parseRateLimitMessage } from "../Utils/Regex/RateLimitParser";
import { parseBruteForceMessage } from "../Utils/Regex/BruteForceParser";
import { parseSqlInjectionMessage } from "../Utils/Regex/SqlInjectionParser";
import { parseServiceConfigurationChangeMessage } from "../Utils/Regex/ServiceConfigurationChangeParser";
import { pareseResourceExplotationMessage } from "../Utils/Regex/ResourceExplotationParser";
import { parseFileChangeMessage } from "../Utils/Regex/FileChangeParser";
import { parseNetworkAnomalyMessage } from "../Utils/Regex/NetworkAnomalyParser";
import { ILogerService } from "../Domain/services/ILogerService";
import { createAxiosClient } from "../Utils/Client/AxiosClient";

export class ParserService implements IParserService {
    private readonly analysisEngineClient: AxiosInstance;
    private readonly eventClient: AxiosInstance;

    constructor(
        private parserEventRepository: Repository<ParserEvent>,
        private readonly logger: ILogerService
    ) {
        this.analysisEngineClient = createAxiosClient(process.env.ANALYSIS_ENGINE_API ?? "");
        this.eventClient = createAxiosClient(process.env.EVENT_SERVICE_API ?? "");
    }

    async normalizeAndSaveEvent(eventMessage: string, eventSource: string): Promise<EventDTO> {
        const timeOfEvent: Date = new Date();

        let event = this.normalizeEventWithRegexes(eventMessage);

        if (event.id === -1) {    // Couldn't normalize with regexes -> send it to LLM
            event = await this.normalizeEventWithLlm(eventMessage);

            if (event.id === -1)    // Couldn't normalize with LLM either -> discarding event
                return event;
        }

        event.source = eventSource;
        event.timestamp = timeOfEvent;
        const responseEvent = (await this.eventClient.post<EventDTO>("/events", event)).data;    // Saving to the Events table (calling event-collector)

        if (responseEvent.id === -1)
            this.logger.log("Failed to save event to the database. Event: " + event);

        const parserEvent: ParserEvent = { parserId: 0, eventId: responseEvent.id, textBeforeParsing: eventMessage, timestamp: timeOfEvent }
        await this.parserEventRepository.insert(parserEvent);   // Saving to the Parser table

        return responseEvent;
    }

    private normalizeEventWithRegexes(message: string): EventDTO {
        let parseResult;

        parseResult = parseLoginMessage(message);
        if (parseResult.doesMatch)
            return parseResult.event!;

        parseResult = parsePermissionChangeMessage(message);
        if (parseResult.doesMatch)
            return parseResult.event!;

        parseResult = parseDbAccessMessage(message);
        if (parseResult.doesMatch)
            return parseResult.event!;

        parseResult = parseRateLimitMessage(message);
        if (parseResult.doesMatch)
            return parseResult.event!;

        parseResult = parseBruteForceMessage(message);
        if (parseResult.doesMatch)
            return parseResult.event!;

        parseResult = parseSqlInjectionMessage(message);
        if (parseResult.doesMatch)
            return parseResult.event!;

        parseResult = parseServiceConfigurationChangeMessage(message);
        if (parseResult.doesMatch)
            return parseResult.event!;

        parseResult = pareseResourceExplotationMessage(message);
        if (parseResult.doesMatch)
            return parseResult.event!;

        parseResult = parseFileChangeMessage(message);
        if (parseResult.doesMatch)
            return parseResult.event!;

        parseResult = parseNetworkAnomalyMessage(message);
        if (parseResult.doesMatch)
            return parseResult.event!;

        const event: EventDTO = {
            id: -1,
        };

        return event;
    }


    private async normalizeEventWithLlm(message: string): Promise<EventDTO> {
        const requestBody = {
            message: message
        };

        const response = await this.analysisEngineClient.post("/AnalysisEngine/processEvent", requestBody);

        // Extract LLM-generated event JSON
        const eventData = response.data?.eventData;
        if (!eventData || eventData.description === "_NORMALIZATION_FAILED_") {
            this.logger.log("LLM failed to normalize event. Raw message: " + message);

            const event: EventDTO = {
                id: -1,
                type: EventType.ERROR,
                description: "_NORMALIZATION_FAILED_"
            };

            return event;
        }

        // Convert JSON to Event
        const event: EventDTO = {
            id: 0,
            type: eventData.type,
            description: eventData.description,
        };

        return event;
    }
}