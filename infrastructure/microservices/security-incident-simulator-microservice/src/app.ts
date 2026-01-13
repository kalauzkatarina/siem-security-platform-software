import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { SimulationController } from "./WebAPI/controllers/SimulationController";
import { SimulationService } from "./Services/SimulationService";
import { HttpEventEmitter } from "./Services/HttpEventEmitter";
import { ISimulationService } from "./Domain/services/ISimulationService";
import { IEventEmitter } from "./Domain/services/IEventEmitter";

dotenv.config({ quiet: true });

const app = express();
app.use(express.json());

const corsOrigin = process.env.CORS_ORIGIN?.split(",").map((m) => m.trim()) ?? ["*"];
const corsMethods = process.env.CORS_METHODS?.split(",").map((m) => m.trim()) ?? ["GET", "POST"];

app.use(
  cors({
    origin: corsOrigin,
    methods: corsMethods,
  })
);

const eventCollectorUrl = process.env.EVENT_COLLECTOR_API;
const emitter: IEventEmitter = new HttpEventEmitter(eventCollectorUrl);
const simulationService: ISimulationService = new SimulationService(emitter);
const controller = new SimulationController(simulationService);

app.use("/api/v1", controller.getRouter());

export default app;
