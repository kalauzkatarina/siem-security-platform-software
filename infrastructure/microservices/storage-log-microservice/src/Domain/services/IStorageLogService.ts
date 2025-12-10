import { ArchiveStatsDTO } from "../DTOs/ArchiveStatsDTO";
import { StorageLog } from "../models/StorageLog";

export interface IStorageLogService {
    runArchiveProcess(): Promise<Boolean>;
    getArchives(): Promise<any[]>;
    searchArchives(query: string): Promise<StorageLog[]>;
    sortArchives(by: "date" | "size" | "name", order: "asc" | "desc"): Promise<StorageLog[]>;
    getStats(): Promise<ArchiveStatsDTO>;
    getArchiveFilePath(id: number): Promise<string|null>;
}