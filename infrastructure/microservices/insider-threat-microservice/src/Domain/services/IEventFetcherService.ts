export interface Event {
  id: number;
  source: string;
  userId: number;
  userRole: string;
  type: string;
  description: string;
  timestamp: Date;
  ipAddress: string;
}

export interface IEventFetcherService {

  fetchEventsByIds(eventIds: number[]): Promise<Event[]>;
  fetchEventsByUserId(userId: number): Promise<Event[]>;
}