import { Request, Response, Router } from "express";
import { SimulationRequestDTO } from "../../Domain/DTOs/SimulationRequestDTO";
import { ISimulationService } from "../../Domain/services/ISimulationService";
import { SimulationType } from "../../Domain/types/SimulationType";

export class SimulationController {
  private readonly router: Router;

  constructor(private readonly simulationService: ISimulationService) {
    this.router = Router();
    this.initializeRoutes();
  }

  private initializeRoutes(): void {
    this.router.get("/health", this.healthCheck.bind(this));
    this.router.get("/simulator", this.listSimulations.bind(this));
    this.router.get("/simulator/:id", this.getSimulation.bind(this));
    this.router.post("/simulator/start", this.startSimulation.bind(this));
    this.router.post("/simulator/:id/stop", this.stopSimulation.bind(this));
  }

  private healthCheck(req: Request, res: Response): void {
    res.status(200).json({ status: "OK" });
  }

  private async listSimulations(req: Request, res: Response): Promise<void> {
    if (!this.isSimulatorEnabled()) {
      res.status(403).json({ message: "Simulator disabled in this environment." });
      return;
    }

    res.status(200).json(this.simulationService.listSimulations());
  }

  private async getSimulation(req: Request, res: Response): Promise<void> {
    if (!this.isSimulatorEnabled()) {
      res.status(403).json({ message: "Simulator disabled in this environment." });
      return;
    }

    const simulationId = String(req.params.id);
    const simulation = this.simulationService.getSimulation(simulationId);
    if (!simulation) {
      res.status(404).json({ message: "Simulation not found" });
      return;
    }
    res.status(200).json(simulation);
  }

  private async startSimulation(req: Request, res: Response): Promise<void> {
    if (!this.isSimulatorEnabled()) {
      res.status(403).json({ message: "Simulator disabled in this environment." });
      return;
    }

    const body = req.body as SimulationRequestDTO;

    if (!body.type || !Object.values(SimulationType).includes(body.type)) {
      res.status(400).json({ message: "Invalid simulation type" });
      return;
    }

    if (!Number.isFinite(body.intensity) || body.intensity <= 0) {
      res.status(400).json({ message: "Intensity must be a positive number" });
      return;
    }

    if (!Number.isFinite(body.durationSeconds) || body.durationSeconds <= 0) {
      res.status(400).json({ message: "Duration must be a positive number" });
      return;
    }

    const result = await this.simulationService.startSimulation(body);
    res.status(201).json(result);
  }

  private async stopSimulation(req: Request, res: Response): Promise<void> {
    if (!this.isSimulatorEnabled()) {
      res.status(403).json({ message: "Simulator disabled in this environment." });
      return;
    }

    const simulationId = String(req.params.id);
    const result = await this.simulationService.stopSimulation(simulationId);
    if (!result) {
      res.status(404).json({ message: "Simulation not found" });
      return;
    }
    res.status(200).json(result);
  }

  private isSimulatorEnabled(): boolean {
    const enabled = process.env.SIMULATOR_ENABLED === "true";
    const env = process.env.NODE_ENV ?? "development";
    return enabled && env !== "production";
  }

  public getRouter(): Router {
    return this.router;
  }
}
