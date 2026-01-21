import express from "express";
import dotenv from "dotenv";
import { initialize_database } from "./Database/InitializeConnection";

dotenv.config();

export function createApp() {
  const app = express();
  
  initialize_database();



  app.get("/health", (_req, res) => {
    res.json({
      status: "ok",
      service: process.env.SERVICE_NAME ?? "security-maturity-service"
    });
  });

  return app;
}
