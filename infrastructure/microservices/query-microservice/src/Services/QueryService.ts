import { MongoRepository } from "typeorm";
import { CacheEntry } from "../Domain/models/CacheEntry";
import { IQueryService } from "../Domain/services/IQueryService";

export class QueryService implements IQueryService {
    constructor(
        private readonly cacheRepository: MongoRepository<CacheEntry>,
    ) {}
    
    async addEntry(entry: CacheEntry): Promise<void> {
        entry.cachedAt = new Date(); 
        // postavljamo trenutno vreme kao vreme kesiranja
        await this.cacheRepository.save(entry);
    }
}