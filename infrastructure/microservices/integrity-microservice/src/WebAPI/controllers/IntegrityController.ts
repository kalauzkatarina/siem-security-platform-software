import { Router, Request, Response } from "express";
import { IntegrityService } from "../../Services/IntegrityService.js";

export class IntegrityController {
    private readonly router: Router;

    constructor(private readonly integrityService: IntegrityService) {
        this.router = Router();
        this.initializeRoutes();
    }

    private initializeRoutes(): void {
        this.router.get("/integrity/status", this.getChainStatus.bind(this));
        this.router.get("/integrity/compromised", this.getCompromisedLogs.bind(this));
        this.router.post("/integrity/verify", this.verifyIntegrity.bind(this));
        this.router.post("/integrity/protect", this.protectLog.bind(this));
    }

    private async getChainStatus(req: Request, res: Response): Promise<void> {
        try {
            const isSecure = await this.integrityService.isChainSecure();
            res.status(200).json({ 
                status: isSecure ? "SECURE" : "COMPROMISED"
            });
        } catch (err) {
            res.status(500).json({ message: "Error checking status" });
        }
    }

    private async getCompromisedLogs(req: Request, res: Response): Promise<void> {
        try {
            // Poziva metodu iz servisa
            const logs = await this.integrityService.getCompromisedEntries();
            res.status(200).json(logs);
        } catch (err) {
            res.status(500).json({ message: "Error fetching logs" });
        }
    }

    private async verifyIntegrity(req: Request, res: Response): Promise<void> {
        try {
            const isValid = await this.integrityService.verifyIntegrity();
            res.status(200).json({ success: true, isValid });
        } catch (err) {
            res.status(500).json({ message: "Verification failed" });
        }
    }
    private async protectLog(req: Request, res: Response): Promise<void> {
        try {
            const { eventId, eventData } = req.body;
            await this.integrityService.protectEvent(eventId, eventData);
            res.status(201).json({ message: "Log protected successfully" });
        } catch (err) {
            console.error("Error in protectLog:", err);
            res.status(500).json({ message: "Error protecting log" });
        }
    }
    public getRouter(): Router {
        return this.router;
    }
}