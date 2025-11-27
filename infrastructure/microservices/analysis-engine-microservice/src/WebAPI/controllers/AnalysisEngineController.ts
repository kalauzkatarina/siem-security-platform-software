import { Router, Request, Response } from "express";
import { IAnalysisEngineService } from "../../Domain/services/IAnalysisEngineService";


export class AnalysisEngineController {

    private readonly router: Router;

    constructor(private readonly analysisEngineService: IAnalysisEngineService){
        this.router = Router();
        this.initializeRoutes();
    }

    private initializeRoutes(): void {
        this.router.post("/AnalysisEngine/processEvent", this.processEvent.bind(this));
    }

    private async processEvent(req: Request, res: Response): Promise<void> {
        try {
            const rawMessage = req.body.message as string;

            if (!rawMessage) {
                res.status(400).json({ error: "Message is required" });
                return;
            }

            const processedEvent = await this.analysisEngineService.sendPromptToLlm(rawMessage);

            res.status(200).json({ eventData: processedEvent }); //it needs to be called eventData because ParserService expects it
        } catch (err) {
            res.status(500).json({ error: (err as Error).message });
        }
    }

    public getRouter(): Router{
        return this.router;
    }
}