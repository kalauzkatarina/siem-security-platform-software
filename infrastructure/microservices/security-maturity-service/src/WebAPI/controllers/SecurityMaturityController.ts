import { Router, Request, Response } from "express";
import { TrendMetricType } from "../../Domain/enums/TrendMetricType";
import { TrendPeriod } from "../../Domain/enums/TrendPeriod";
import { KpiSnapshotQuery } from "../../Application/queries/KpiSnapshotQuery";
import { IKpiSnapshotService } from "../../Domain/services/IKpiSnapshotService";
import { IRecommendationService } from "../../Domain/services/IRecommendationService";

export class SecurityMaturityController {
  private readonly router: Router;
  private readonly service: IKpiSnapshotService;
  private readonly recommendationService: IRecommendationService;

  constructor(
    private readonly query: KpiSnapshotQuery,
    servicee: IKpiSnapshotService,
    recommendationService: IRecommendationService
  ) {
    this.router = Router();
    this.service = servicee;
    this.recommendationService = recommendationService;
    this.initializeRoutes();
  }

  private initializeRoutes(): void {
    this.router.get("/current", this.getCurrent.bind(this));
    this.router.get("/incidents-by-category", this.getIncidentsByCategory.bind(this));
    this.router.get("/test", this.test.bind(this));
    this.router.get("/trend", this.getTrend.bind(this));
    this.router.get("/recommendations", this.getRecommendations.bind(this));
  }

  private async getCurrent(req: Request, res: Response): Promise<void> {
    try {
      const result = await this.query.getCurrent();
      res.status(200).json(result);
    } catch (err) {
      console.error("[SecurityMatuirtyController]: getCurrent failed", err);
      res.status(500).json({ message: "Service error" });
    }
  }

  private async test(req: Request, res: Response): Promise<void> {
    try {
      const now = new Date();
      const oneHourAgo = new Date(now.getTime() - 60 * 60 * 1000);

      const result = await this.service.createSnapshotForWindow(oneHourAgo, now);
      res.status(200).json(result);
    } catch (err) {
      console.error("[SecurityMaturityController]: test failed", err);
      res.status(500).json({ message: "Service error" });
    }
  }

  private async getIncidentsByCategory(req: Request, res: Response): Promise<void> {
    try {
      const periodRaw = req.query.period;

      if (typeof periodRaw !== "string") {
        res.status(400).json({ message: "Invalid period" });
        return;
      }

      const period = periodRaw as TrendPeriod;

      if (!Object.values(TrendPeriod).includes(period)) {
        res.status(400).json({ message: "Invalid period" });
        return;
      }

      const result = await this.query.getIncidentsByCategory(period);
      res.status(200).json(result);
    } catch (err) {
      console.error("[SecurityMaturityController]: getIncidentsByCategory failed", err);
      res.status(500).json({ message: "Service error" });
    }
  }

  private async getTrend(req: Request, res: Response): Promise<void> {
    try {
      const metricRaw = req.query.metric;
      const periodRaw = req.query.period;

      if (typeof metricRaw !== "string") {
        res.status(400).json({ message: "Invalid metric" });
        return;
      }

      if (typeof periodRaw !== "string") {
        res.status(400).json({ message: "Invalid period" });
        return;
      }

      const metric = metricRaw as TrendMetricType;
      const period = periodRaw as TrendPeriod;

      if (!Object.values(TrendMetricType).includes(metric)) {
        res.status(400).json({ message: "Invalid metric" });
        return;
      }

      if (!Object.values(TrendPeriod).includes(period)) {
        res.status(400).json({ message: "Invalid period" });
        return;
      }

      const result = await this.query.getTrend(metric, period);
      res.status(200).json(result);
    } catch (err) {
      console.error("[SecurityMaturityController]: getTrend failed", err);
      res.status(500).json({ message: "Service error" });
    }
  }

  private async getRecommendations(req: Request, res: Response): Promise<void> {
    try {
      const recs = await this.recommendationService.getRecommendations();
      res.status(200).json(recs);
    } catch (err) {
      console.error("[SecurityMaturityController]: getRecommendations failed", err);
      res.status(500).json({ message: "Service error" });
    }
  }

  public getRouter(): Router {
    return this.router;
  }
}
