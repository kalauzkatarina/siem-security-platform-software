import axios from "axios";
import { IEventFetcherService, Event } from "../Domain/services/IEventFetcherService";
import { ILoggerService } from "../Domain/services/ILoggerService";

export class EventFetcherService implements IEventFetcherService {
  constructor(
    private readonly eventCollectorUrl: string,
    private readonly logger: ILoggerService
  ) {}

  async fetchEventsByIds(eventIds: number[]): Promise<Event[]> {
    if (eventIds.length === 0) {
      return [];
    }

    try {
      const minId = Math.min(...eventIds);
      const maxId = Math.max(...eventIds);
      
      const response = await axios.get(
        `${this.eventCollectorUrl}/events/from/${minId}/to/${maxId}`,
        { timeout: 10000 }
      );

      const allEvents = response.data;

      const events = allEvents.filter((e: any) => eventIds.includes(e.id));

      return events.map((e: any) => ({
        id: e.id,
        source: e.source,
        userId: e.userId,
        userRole: e.userRole,
        type: e.type,
        description: e.description,
        timestamp: new Date(e.timestamp),
        ipAddress: e.ipAddress
      }));

    } catch (error: any) {
      await this.logger.log(` [EventFetcher] Failed to fetch events: ${error.message}`);
      return [];
    }
  }

  async fetchEventsByUserId(userId: number): Promise<Event[]> {
    try {
      const response = await axios.get(
        `${this.eventCollectorUrl}/events`,
        { timeout: 10000 }
      );

      const allEvents = response.data;
      const userEvents = allEvents.filter((e: any) => e.userId === userId);

      return userEvents.map((e: any) => ({
        id: e.id,
        source: e.source,
        userId: e.userId,
        userRole: e.userRole,
        type: e.type,
        description: e.description,
        timestamp: new Date(e.timestamp),
        ipAddress: e.ipAddress
      }));

    } catch (error: any) {
      await this.logger.log(` [EventFetcher] Failed to fetch events for user ${userId}: ${error.message}`);
      return [];
    }
  }
}