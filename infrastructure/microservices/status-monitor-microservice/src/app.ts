import express from "express";
import cors from "cors";

export function createApp() {
    const app = express();

    // middleware
    app.use(express.json());

    // CORS (kao u ostalim servisima)
    const origins = (process.env.CORS_ORIGIN || "").split(",").map(s => s.trim()).filter(Boolean);
    app.use(
        cors({
            origin: origins.length ? origins : "*",
            methods: process.env.CORS_METHODS || "GET,POST,PUT,DELETE",
        })
    );

    // health check
    app.get("/health", (_req, res) => {
        res.status(200).json({ status: "OK", service: "ServiceStatusMonitor" });
    });

    return app;
}
