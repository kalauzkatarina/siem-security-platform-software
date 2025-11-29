import { CacheEntry } from "../models/CacheEntry";

export interface IQueryService {
    addEntry(entry : CacheEntry) : Promise<void>;
}