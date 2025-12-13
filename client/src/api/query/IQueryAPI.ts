import { EventDTO } from "../../models/events/EventDTO";

export interface IQueryAPI {
    getAllEvents(): Promise<EventDTO[]>;
    getEventsByQuery(query: string): Promise<EventDTO[]>;
    getLastThreeEvents(): Promise<EventDTO[]>;
    getEventsCount(): Promise<number>;
}