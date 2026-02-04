import { DetectionResult } from "../Domain/types/DetectionResult";
import { IThreatDetectionService } from "../Domain/services/IThreatDetectionService";
import { IEventFetcherService } from "../Domain/services/IEventFetcherService";
import { ILoggerService } from "../Domain/services/ILoggerService";
import { detectMassDataRead } from "../Utils/Detectors/MassDataReadDetector";
import { detectPermissionChange } from "../Utils/Detectors/PermissionChangeDetector";
import { detectOffHoursAccess } from "../Utils/Detectors/OffHoursAccessDetector";
import { correlateAuthEvents } from "../Utils/Analyzers/AuthEventCorrelator";


export class ThreatDetectionService implements IThreatDetectionService {
  constructor(
    private readonly eventFetcher: IEventFetcherService,
    private readonly logger: ILoggerService
  ) {}

  async analyzeEvents(userId: number, eventIds: number[]): Promise<DetectionResult[]> {
    await this.logger.log(`Analyzing ${eventIds.length} events for user ${userId}`);

    const events = await this.eventFetcher.fetchEventsByIds(eventIds);

    if (events.length === 0) {
      return [];
    }

    const results: DetectionResult[] = [];

    const authResults = await correlateAuthEvents(userId, events);
    results.push(...authResults);

    const offHours = await detectOffHoursAccess(userId, events);
    if (offHours) {
      results.push(offHours);
    }

    const massRead = await detectMassDataRead(userId, events);
    if (massRead) {
      results.push(massRead);
    }

    const permissionChange = await detectPermissionChange(userId, events);
    if (permissionChange) {
      results.push(permissionChange);
    }

    return results;
  }

  async detectMassDataRead(userId: number, eventIds: number[]): Promise<DetectionResult | null> {
    await this.logger.log(`Checking for mass data read by user ${userId}`);
    
    const events = await this.eventFetcher.fetchEventsByIds(eventIds);
    const result = await detectMassDataRead(userId, events);
    
    if (result) {
      await this.logger.log(`Mass data read detected for user ${userId}`);
    }
    
    return result;
  }

  async detectPermissionChange(userId: number, eventIds: number[]): Promise<DetectionResult | null> {
    await this.logger.log(`Checking for permission changes by user ${userId}`);
    
    const events = await this.eventFetcher.fetchEventsByIds(eventIds);
    const result = await detectPermissionChange(userId, events);
    
    if (result) {
      await this.logger.log(`Suspicious permission change detected for user ${userId}`);
    }
    
    return result;
  }

  async detectOffHoursAccess(userId: number, eventIds: number[]): Promise<DetectionResult | null> {
    await this.logger.log(`Checking for off-hours access by user ${userId}`);
    
    const events = await this.eventFetcher.fetchEventsByIds(eventIds);
    const result = await detectOffHoursAccess(userId, events);
    
    if (result) {
      await this.logger.log(`Off-hours access detected for user ${userId}`);
    }
    
    return result;
  }

  async correlateWithAuthEvents(userId: number, eventIds: number[]): Promise<DetectionResult[]> {
    await this.logger.log(`Correlating events with auth data for user ${userId}`);
    
    const events = await this.eventFetcher.fetchEventsByIds(eventIds);
    return correlateAuthEvents(userId, events);
  }
}