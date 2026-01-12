import { CacheEntryDTO } from "../DTOs/CacheEntryDTO";
import { HourlyStatisticsDTO } from "../DTOs/HourlyStatisticsDTO";
import { Alert } from "../models/Alert";
import { CacheAlertEntry } from "../models/CacheAlertEntry";

export interface IQueryAlertRepositoryService{
    getAllAlerts(): Promise<Alert[]>
    getMaxId(): Promise<number>;
    getAlertsFromId1ToId2(fromId: number, toId: number): Promise<Alert[]>
    addEntry(entry : CacheEntryDTO) : Promise<CacheAlertEntry>;      
    getOldAlerts(hours: number): Promise<Alert[]>;
    findAlerts(query: string): Set<number>;
    findByKey(key: string): Promise<CacheAlertEntry>;
    deleteByKey(key: string): Promise<boolean>;
    getLastThreeAlerts(): Promise<Alert[]>;
    getAlertsCount(): number;
    getLastProcessedId(): number;    
<<<<<<< HEAD
   getFilteredAlerts(
        severity: string, 
        status?: string, 
        source?: string, 
        dateFrom?: string, 
        dateTo?: string
    ): Promise<Alert[]>;
=======
    getHourlyAlertStatistics(): Promise<HourlyStatisticsDTO[]>;

>>>>>>> c911f976b5ff22e881896a86c4a3702f9b125037
}