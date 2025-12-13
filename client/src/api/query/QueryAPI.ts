import axios, { AxiosInstance } from "axios";
import { EventDTO } from "../../models/events/EventDTO";
import { IQueryAPI } from "./IQueryAPI";

export class QueryAPI implements IQueryAPI {
    private readonly client: AxiosInstance;

    constructor(){
        this.client = axios.create({
            baseURL: import.meta.env.VITE_GATEWAY_URL,
            headers: {
                "Content-Type": "application/json"
            },
        });
    }
    
    async getAllEvents(): Promise<EventDTO[]> {
        const response = await this.client.get<EventDTO[]>("/query/events");
        return response.data;
    }

    async getEventsByQuery(query: string): Promise<EventDTO[]> {
        const response = await this.client.get<EventDTO[]>("/query/events/search", {
            params: {q: query},
        });
        return response.data;
    }
    
    async getLastThreeEvents(): Promise<EventDTO[]> {
        const response = await this.client.get<EventDTO[]>("/query/events/lastThree");
        return response.data;
    }
    
    async getEventsCount(): Promise<number> {
        const response = await this.client.get<number>("/query/events/count");
        return response.data;
    }
}