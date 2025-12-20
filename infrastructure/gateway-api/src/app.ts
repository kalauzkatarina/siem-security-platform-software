import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';

import { IGatewayService } from './Domain/services/IGatewayService';
import { GatewayService } from './Services/GatewayService';
import { AuthGatewayController } from './WebAPI/controllers/AuthGatewayController';
import { UserGatewayController } from './WebAPI/controllers/UserGatewayController';
import { AlertGatewayController } from './WebAPI/controllers/AlertGatewayController';
import { QueryGatewayController } from './WebAPI/controllers/QueryGatewayController';
import { StorageGatewayController } from './WebAPI/controllers/StorageGatewayController';
import { ParserGatewayController } from './WebAPI/controllers/ParserGatewayController';
import { AnalysisGatewayController } from './WebAPI/controllers/AnalysisGatewayController';
import { createAuthMiddleware } from './Middlewares/authentification/AuthMiddleware';

dotenv.config({ quiet: true });

const app = express();

// Read CORS settings from environment
const corsOrigin = process.env.CORS_ORIGIN ?? "*";
const corsMethods = process.env.CORS_METHODS?.split(",").map(m => m.trim()) ?? ["POST"];

// Protected microservice from unauthorized access
app.use(cors({
  origin: corsOrigin,
  methods: corsMethods,
  credentials: true,
}));

app.use(express.json());

// Health check endpoint
app.get('/health', (req, res) => {
  res.status(200).json({
    status: 'OK',
    service: 'Gateway',
    timestamp: new Date().toISOString()
  });
});

// Services
const gatewayService: IGatewayService = new GatewayService();

// Auth middleware (reuse across controllers)
const authenticate = createAuthMiddleware(gatewayService);

// WebAPI routes
app.use('/api/v1', new AuthGatewayController(gatewayService).getRouter());
app.use('/api/v1', new UserGatewayController(gatewayService, authenticate).getRouter());
app.use('/api/v1', new AlertGatewayController(gatewayService, authenticate).getRouter());
app.use('/api/v1', new QueryGatewayController(gatewayService, authenticate).getRouter());
app.use('/api/v1', new StorageGatewayController(gatewayService, authenticate).getRouter());
app.use('/api/v1', new ParserGatewayController(gatewayService, authenticate).getRouter());
app.use('/api/v1', new AnalysisGatewayController(gatewayService, authenticate).getRouter());

export default app;
