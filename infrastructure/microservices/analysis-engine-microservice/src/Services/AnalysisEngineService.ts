import { Repository } from "typeorm";
import { IAnalysisEngineService } from "../Domain/services/IAnalysisEngineService";
import { Correlation } from "../Domain/models/Correlation";
import { CorrelationEventMap } from "../Domain/models/CorrelationEventMap";
import axios, { AxiosInstance } from "axios";

export class AnalysisEngineService implements IAnalysisEngineService {

    private readonly parserClient: AxiosInstance;
    private readonly alertClient: AxiosInstance;

    constructor(private CorrelationRepo: Repository<Correlation>, private CorrelationEventMap: Repository<CorrelationEventMap>){

        console.log(`\x1b[35m[AnalysisEngine@1.45.4]\x1b[0m Service started`);

        const parserServiceURL = process.env.PARSER_SERVICE_API;
        const alertServiceURL = process.env.ALERT_SERVICE_API;

        this.parserClient = axios.create({
            baseURL: parserServiceURL,
            headers: { "Content-Type": "application/json" },
            timeout: 5000,
        });

        this.alertClient = axios.create({
            baseURL: alertServiceURL,
            headers: { "Content-Type": "application/json" },
            timeout: 5000,
        });
    }

    async sendPromptToLlm(prompt: string): Promise<string> {

        //call LLM 
        //get the Content from the JSON
        //return it

        throw new Error("Method not implemented.");
    }

    async findCorrelation(): Promise<void> {
        throw new Error("Method not implemented.");
    }

}