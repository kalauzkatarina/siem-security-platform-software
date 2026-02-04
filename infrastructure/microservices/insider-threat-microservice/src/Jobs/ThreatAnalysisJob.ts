import axios from "axios";
import { IInsiderThreatService } from "../Domain/services/IInsiderThreatService";
import { IUserRiskAnalysisService } from "../Domain/services/IUserRiskAnalysisService";
import { IThreatDetectionService } from "../Domain/services/IThreatDetectionService";
import { ILoggerService } from "../Domain/services/ILoggerService";

export class ThreatAnalysisJob {
  private lastProcessedEventId: number = 0;
  private isRunning: boolean = false;
  private intervalId?: NodeJS.Timeout;
  private readonly intervalMinutes: number;

  constructor(
    private readonly eventCollectorUrl: string,
    private readonly threatService: IInsiderThreatService,
    private readonly riskService: IUserRiskAnalysisService,
    private readonly detectionService: IThreatDetectionService,
    private readonly logger: ILoggerService,
    intervalMinutes: number = 15
  ) {
    this.intervalMinutes = intervalMinutes;
  }

  start(): void {
    this.logger.log(` THREAT ANALYSIS JOB STARTED`);
    this.logger.log(`   Interval: ${this.intervalMinutes} minutes`);
    
    this.run();
    this.intervalId = setInterval(() => this.run(), this.intervalMinutes * 60 * 1000);
  }

  stop(): void {
    if (this.intervalId) {
      clearInterval(this.intervalId);
      this.logger.log(" Threat Analysis Job stopped");
    }
  }

  private async run(): Promise<void> {
    if (this.isRunning) {
      this.logger.log("[ThreatAnalysisJob] Previous analysis still running, skipping");
      return;
    }

    this.isRunning = true;
    const startTime = Date.now();
    
    this.logger.log(`[ThreatAnalysisJob] Starting analysis`);

    try {
      const maxEventId = await this.getMaxEventId();
      
      if (maxEventId <= this.lastProcessedEventId) {
        this.logger.log("[ThreatAnalysisJob] No new events to process");
        return;
      }

      const newEvents = await this.getEventsInRange(
        this.lastProcessedEventId + 1,
        maxEventId
      );

      this.logger.log(`[ThreatAnalysisJob] Analyzing ${newEvents.length} new events`);

      const eventsByUser = this.groupEventsByPrivilegedUsers(newEvents);
      const privilegedUserCount = Object.keys(eventsByUser).length;
      this.logger.log(` [ThreatAnalysisJob] Found ${privilegedUserCount} privileged users`);

      let threatsDetected = 0;
      for (const [userIdStr, events] of Object.entries(eventsByUser)) {
        const userId = parseInt(userIdStr, 10);
        const threats = await this.analyzeUserEvents(userId, events);
        threatsDetected += threats;
      }

      this.lastProcessedEventId = maxEventId;
      
      const duration = ((Date.now() - startTime) / 1000).toFixed(2);
      this.logger.log(` [ThreatAnalysisJob] Analysis completed`);


    } catch (error: any) {
      this.logger.log(`[ThreatAnalysisJob] ERROR: ${error.message}`);
      if (error.stack) {
        this.logger.log(error.stack);
      }
    } finally {
      this.isRunning = false;
    }
  }

  private async getMaxEventId(): Promise<number> {
    try {
      const response = await axios.get(`${this.eventCollectorUrl}/events`, {
        timeout: 10000
      });
      
      const events = response.data;
      
      if (!Array.isArray(events) || events.length === 0) {
        return 0;
      }

      return Math.max(...events.map((e: any) => e.id));
    } catch (error: any) {
      this.logger.log(`[ThreatAnalysisJob] Failed to get max event ID: ${error.message}`);
      return this.lastProcessedEventId;
    }
  }

  private async getEventsInRange(fromId: number, toId: number): Promise<any[]> {
    try {
      const response = await axios.get(
        `${this.eventCollectorUrl}/events/from/${fromId}/to/${toId}`,
        { timeout: 30000 }
      );
      
      return Array.isArray(response.data) ? response.data : [];
    } catch (error: any) {
      this.logger.log(`[ThreatAnalysisJob] Failed to get events: ${error.message}`);
      return [];
    }
  }

  private groupEventsByPrivilegedUsers(events: any[]): Record<string, any[]> {
    const grouped: Record<string, any[]> = {};
    const validEvents = events.filter(e => e.userId && e.userRole);

    if (validEvents.length === 0) {
      this.logger.log("[ThreatAnalysisJob] WARNING: No events have userId and userRole!");
      return grouped;
    }

    this.logger.log(`   Valid events (with userId & userRole): ${validEvents.length} / ${events.length}`);

    for (const event of validEvents) {
      if (!this.isPrivilegedRole(event.userRole)) {
        continue;
      }

      const userId = String(event.userId);

      if (!grouped[userId]) {
        grouped[userId] = [];
        this.logger.log(`   Privileged user found: userId=${event.userId}, role=${event.userRole}`);
      }
      
      grouped[userId].push(event);
    }

    return grouped;
  }

  private isPrivilegedRole(userRole: string): boolean {
    const role = userRole.toUpperCase(); 
    return role === "ADMIN" || role === "SYSADMIN";
  }

  private async analyzeUserEvents(userId: number, events: any[]): Promise<number> {
    try {
      const userRole = events[0].userRole;
      const eventIds = events.map(e => e.id);

      this.logger.log(`\n   🔎 Analyzing ${eventIds.length} events for userId=${userId} (${userRole})`);

      let threatsDetected = 0;

      threatsDetected += await this.detectMassDataRead(userId, eventIds);
      threatsDetected += await this.detectOffHoursAccess(userId, eventIds);
      threatsDetected += await this.detectPermissionChanges(userId, eventIds);
      threatsDetected += await this.detectAuthCorrelations(userId, eventIds);

      if (threatsDetected > 0) {
        this.logger.log(`     Detected ${threatsDetected} threat(s) for userId=${userId}`);
      }

      return threatsDetected;

    } catch (error: any) {
      this.logger.log(`    Error analyzing events for userId=${userId}: ${error.message}`);
      return 0;
    }
  }

  private async detectMassDataRead(userId: number, eventIds: number[]): Promise<number> {
    const result = await this.detectionService.detectMassDataRead(userId, eventIds);
    
    if (result && result.isDetected) {
      const threat = await this.threatService.createThreat({
        userId,
        threatType: result.threatType,
        riskLevel: result.riskLevel,
        description: result.description,
        metadata: result.metadata || {},
        correlatedEventIds: result.correlatedEventIds,
        source: "ThreatAnalysisJob",
      });

      await this.riskService.updateUserRiskAfterThreat(userId, threat.id);
      
      this.logger.log(`       THREAT #${threat.id}: ${result.threatType} (${result.riskLevel})`);
      return 1;
    }
    
    return 0;
  }

  private async detectOffHoursAccess(userId: number, eventIds: number[]): Promise<number> {
    const result = await this.detectionService.detectOffHoursAccess(userId, eventIds);
    
    if (result && result.isDetected) {
      const threat = await this.threatService.createThreat({
        userId,
        threatType: result.threatType,
        riskLevel: result.riskLevel,
        description: result.description,
        metadata: result.metadata || {},
        correlatedEventIds: result.correlatedEventIds,
        source: "ThreatAnalysisJob",
      });

      await this.riskService.updateUserRiskAfterThreat(userId, threat.id);
      
      this.logger.log(`       THREAT #${threat.id}: ${result.threatType} (${result.riskLevel})`);
      return 1;
    }
    
    return 0;
  }

  private async detectPermissionChanges(userId: number, eventIds: number[]): Promise<number> {
    const result = await this.detectionService.detectPermissionChange(userId, eventIds);
    
    if (result && result.isDetected) {
      const threat = await this.threatService.createThreat({
        userId,
        threatType: result.threatType,
        riskLevel: result.riskLevel,
        description: result.description,
        metadata: result.metadata || {},
        correlatedEventIds: result.correlatedEventIds,
        source: "ThreatAnalysisJob",
      });

      await this.riskService.updateUserRiskAfterThreat(userId, threat.id);
      
      this.logger.log(`       THREAT #${threat.id}: ${result.threatType} (${result.riskLevel})`);
      return 1;
    }
    
    return 0;
  }

  private async detectAuthCorrelations(userId: number, eventIds: number[]): Promise<number> {
    const results = await this.detectionService.correlateWithAuthEvents(userId, eventIds);
    
    let detected = 0;
    for (const result of results) {
      if (result.isDetected) {
        const threat = await this.threatService.createThreat({
          userId,
          threatType: result.threatType,
          riskLevel: result.riskLevel,
          description: result.description,
          metadata: result.metadata || {},
          correlatedEventIds: result.correlatedEventIds,
          source: "ThreatAnalysisJob",
        });

        await this.riskService.updateUserRiskAfterThreat(userId, threat.id);
        
        this.logger.log(`       THREAT #${threat.id}: ${result.threatType} (${result.riskLevel})`);
        detected++;
      }
    }
    
    return detected;
  }
}
