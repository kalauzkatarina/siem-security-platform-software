import { Router, Request, Response } from "express";
import { IGatewayService } from "../../Domain/services/IGatewayService";
import { ILogerService } from "../../Domain/services/ILogerService";

export class IntegrityGatewayController {
    private readonly router: Router;

    constructor(
        private readonly gatewayService: IGatewayService,
        private readonly authenticate: any,
        private readonly logger: ILogerService
    ) {
        this.router = Router();
        this.initializeRoutes();
    }

    private initializeRoutes(): void {
        // Koristimo anonimne funkcije da pozovemo konkretne metode iz gatewayService
        this.router.get("/integrity/status", this.authenticate, this.getStatus.bind(this));
        this.router.get("/integrity/compromised", this.authenticate, this.getCompromised.bind(this));
        this.router.post("/integrity/verify", this.authenticate, this.verify.bind(this));
    }

    private async getStatus(req: Request, res: Response): Promise<void> {
        try {
            // Ove metode (getIntegrityStatus itd.) ćemo dodati u IGatewayService
            const data = await this.gatewayService.getIntegrityStatus();
            res.json(data);
        } catch (err) {
            await this.handleError(err, res);
        }
    }

    private async getCompromised(req: Request, res: Response): Promise<void> {
        try {
            const data = await this.gatewayService.getCompromisedLogs();
            res.json(data);
        } catch (err) {
            await this.handleError(err, res);
        }
    }

    private async verify(req: Request, res: Response): Promise<void> {
        try {
            const data = await this.gatewayService.verifyIntegrity();
            res.json(data);
        } catch (err) {
            await this.handleError(err, res);
        }
    }

    private async handleError(err: any, res: Response): Promise<void> {
        const message = (err as Error).message;
        await this.logger.log(`Gateway Error (Integrity): ${message}`);
        res.status(500).json({ message: "Integrity service error." });
    }

    public getRouter(): Router {
        return this.router;
    }
}