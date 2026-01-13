import { v4 as uuidv4 } from "uuid";
import { SimulationRequestDTO } from "../Domain/DTOs/SimulationRequestDTO";
import { SimulationResponseDTO } from "../Domain/DTOs/SimulationResponseDTO";
import { SimulationTimelinePointDTO } from "../Domain/DTOs/SimulationTimelinePointDTO";
import { IEventEmitter } from "../Domain/services/IEventEmitter";
import { ISimulationService } from "../Domain/services/ISimulationService";
import { SimulationStatus } from "../Domain/types/SimulationStatus";
import { SimulationType } from "../Domain/types/SimulationType";
import { EventDTO } from "../Domain/types/EventDTO";

type SimulationSession = {
  state: SimulationResponseDTO;
  intervalId?: NodeJS.Timeout;
  startedAtMs: number;
};

export class SimulationService implements ISimulationService {
  private readonly sessions = new Map<string, SimulationSession>();

  constructor(private readonly emitter: IEventEmitter) {}

  async startSimulation(request: SimulationRequestDTO): Promise<SimulationResponseDTO> {
    const id = uuidv4();
    const now = new Date();
    const intensity = Math.max(1, Math.floor(request.intensity));
    const durationSeconds = Math.max(1, Math.floor(request.durationSeconds));

    const state: SimulationResponseDTO = {
      id,
      type: request.type,
      status: SimulationStatus.RUNNING,
      intensity,
      durationSeconds,
      target: request.target,
      startedAt: now.toISOString(),
      eventsGenerated: 0,
      timeline: [],
    };

    const session: SimulationSession = {
      state,
      startedAtMs: now.getTime(),
    };

    session.intervalId = setInterval(() => {
      void this.emitBatch(session);
    }, 1000);

    this.sessions.set(id, session);
    return state;
  }

  async stopSimulation(id: string): Promise<SimulationResponseDTO | null> {
    const session = this.sessions.get(id);
    if (!session) return null;

    if (session.intervalId) {
      clearInterval(session.intervalId);
    }

    if (session.state.status === SimulationStatus.RUNNING) {
      session.state.status = SimulationStatus.STOPPED;
      session.state.endedAt = new Date().toISOString();
    }

    return session.state;
  }

  getSimulation(id: string): SimulationResponseDTO | null {
    return this.sessions.get(id)?.state ?? null;
  }

  listSimulations(): SimulationResponseDTO[] {
    return Array.from(this.sessions.values()).map((s) => s.state);
  }

  private async emitBatch(session: SimulationSession): Promise<void> {
    const elapsed = Math.floor((Date.now() - session.startedAtMs) / 1000);
    if (elapsed >= session.state.durationSeconds) {
      await this.completeSession(session);
      return;
    }

    const now = new Date();
    const events: EventDTO[] = [];

    for (let i = 0; i < session.state.intensity; i++) {
      events.push(this.buildEvent(session.state, now));
    }

    for (const event of events) {
      try {
        await this.emitter.emitEvent(event);
        session.state.eventsGenerated += 1;
      } catch {
        session.state.status = SimulationStatus.FAILED;
      }
    }

    this.appendTimeline(session.state, events.length, now);
  }

  private async completeSession(session: SimulationSession): Promise<void> {
    if (session.intervalId) {
      clearInterval(session.intervalId);
    }

    session.state.status = SimulationStatus.COMPLETED;
    session.state.endedAt = new Date().toISOString();
  }

  private appendTimeline(state: SimulationResponseDTO, count: number, time: Date): void {
    const point: SimulationTimelinePointDTO = {
      timestamp: time.toISOString(),
      count,
    };
    state.timeline.push(point);
  }

  private buildEvent(state: SimulationResponseDTO, time: Date): EventDTO {
    const correlationId = state.id;
    const target = state.target ?? "unknown";

    const description = [
      "SIMULATION",
      `simulationId=${state.id}`,
      `correlationId=${correlationId}`,
      `type=${state.type}`,
      `target=${target}`,
    ].join(" | ");

    return {
      source: `SIMULATOR:${state.type}`,
      type: this.mapEventType(state.type),
      description,
      timestamp: time.toISOString(),
    };
  }

  private mapEventType(type: SimulationType): EventDTO["type"] {
    switch (type) {
      case SimulationType.PRIVILEGE_ESCALATION:
        return "ERROR";
      case SimulationType.DDOS:
        return "WARNING";
      case SimulationType.BRUTE_FORCE:
      default:
        return "WARNING";
    }
  }
}
