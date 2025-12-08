import express from 'express';
import cors from 'cors';
import 'reflect-metadata';
import dotenv from 'dotenv';
import { initialize_database } from './Database/InitializeConnection';
//import { Repository } from 'typeorm';
import { Db } from './Database/DbConnectionPool';
import { CacheEntry } from './Domain/models/CacheEntry';
import { MongoRepository } from 'typeorm';
import { QueryRepositoryService } from './Services/QueryRepositoryService';
import { QueryService } from './Services/QueryService';
import { LoggerService } from './Services/LoggerService';
import { QueryController } from './WebAPI/controllers/QueryController';
import { saveQueryState } from './Utils/StateManager';


dotenv.config({ quiet: true });

const app = express();

// parsiranje JSON body-ja
app.use(express.json());

// CORS podešavanje iz .env
const corsOrigin =
  process.env.CORS_ORIGIN?.split(",").map((m) => m.trim()) ?? ["*"];

const corsMethods =
  process.env.CORS_METHODS?.split(",").map((m) => m.trim()) ??
  ["GET", "POST", "DELETE", "OPTIONS"];

app.use(
  cors({
    origin: corsOrigin,
    methods: corsMethods,
  }),
);

// inicijalizacija baze
void (async () => {
  await initialize_database();
})();

// ORM Repository
const cacheRepository : MongoRepository<CacheEntry> = Db.getMongoRepository(CacheEntry);

// Servisi
const loggerService = new LoggerService();
const queryRepositoryService = new QueryRepositoryService(cacheRepository, loggerService);
const queryService = new QueryService(queryRepositoryService);

// WebAPI rute
const queryController = new QueryController(queryService, queryRepositoryService);

// Registracija ruta
app.use('/api/v1', queryController.getRouter());

process.on('SIGINT', async () => {
  loggerService.log("Saving query service state before shutdown...");

  // ako se inverted indeks struktura azurira => sacekaj da se zavrsi
  while (queryRepositoryService.isIndexingInProgress()) {
    loggerService.log("Indexing in progress, waiting to save state...");
    await new Promise(resolve => setTimeout(resolve, 1000));
  }

  saveQueryState({
    lastProcessedId: queryRepositoryService.getLastProcessedId(),
    invertedIndex: queryRepositoryService.getInvertedIndex(),
    eventTokenMap: queryRepositoryService.getEventIdToTokens()
  });
  loggerService.log("State saved. Exiting...");
  process.exit(0);
});

export default app;
