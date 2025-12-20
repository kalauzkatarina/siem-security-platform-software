import { Request, Response, Router } from "express";
import { IGatewayService } from "../../Domain/services/IGatewayService";
import { requireSysAdmin } from "../../Middlewares/authorization/AuthorizeMiddleware";

export class AnalysisGatewayController {
  private readonly router: Router;

  constructor(private readonly gatewayService: IGatewayService, private readonly authenticate: any) {
    this.router = Router();
    this.initializeRoutes();
  }

  private initializeRoutes(): void {
    this.router.post(
      "/analysis-engine/process",
      this.authenticate,
      requireSysAdmin,
      this.analysisEngineNormalize.bind(this)
    );

    this.router.post(
      "/analysis-engine/correlations/delete",
      this.authenticate,
      requireSysAdmin,
      this.analysisEngineDeleteCorrelationsByEventIds.bind(this)
    );
  }

  private async analysisEngineNormalize(req: Request, res: Response): Promise<void> {
    try {
      const rawMessage = req.body.message as string;

      if (!rawMessage) {
        res.status(400).json({ message: "Raw message is required" });
        return;
      }

      const result = await this.gatewayService.analysisEngineNormalize(rawMessage);
      res.status(200).json(result);
    } catch (err) {
      console.error("[AnalysisEngineError]", err);
      res.status(500).json({ message: "Internal server error" });
    }
  }

  private async analysisEngineDeleteCorrelationsByEventIds(req: Request, res: Response): Promise<void> {
    try {
      const eventIds: number[] = req.body.eventIds;

      if (!eventIds || !Array.isArray(eventIds) || eventIds.length === 0) {
        res.status(400).json({
          message: "Event IDs are required"
        });
        return;
      }
      const deletedCount = await this.gatewayService.analysisEngineDeleteCorrelationsByEventIds(eventIds);

      if (deletedCount === 0) {
        res.status(204).send();
        return;
      }

      res.status(200).json({
        deletedCount: deletedCount
      });

    } catch (err) {
      console.error("[AnalysisEngineError]", err);
      res.status(500).json({ message: "Internal server error" });
    }
  }

  public getRouter(): Router {
    return this.router;
  }
}
