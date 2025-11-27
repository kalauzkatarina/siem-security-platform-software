import path from "path";
import axios from "axios";
import { Repository } from "typeorm";
import { StorageLog } from "../Domain/models/StorageLog";
import { mkdirSync } from "fs";
import { IStorageLogService } from "../Domain/services/IStorageLogService";
import { EventDTO } from "../Domain/DTOs/EventDTO";
import { CorrelationDTO } from "../Domain/DTOs/CorrelationDTO";

const ARCHIVE_DIR = process.env.ARCHIVE_PATH || path.join(__dirname, "../../archives");
const TEMP_DIR = path.join(ARCHIVE_DIR, "tmp");

export class StorageLogServices implements IStorageLogService{
    constructor(
        private readonly storageRepo: Repository<StorageLog>
    ){
        //radi proveru 
        mkdirSync(ARCHIVE_DIR, {recursive: true});
        mkdirSync(TEMP_DIR, {recursive: true});

        console.log("[StorageLogService] initialized");
    }
    
    private getTimeGroup(timeStamp: string): string{
        const d = new Date(timeStamp);
        const yyyy = d.getFullYear();
        const mm = String(d.getMonth() + 1).padStart(2, "0");
        const dd = String(d.getDate()).padStart(2, "0");
        const hh = String(d.getHours()).padStart(2, "0");

        const quarter = Math.floor(d.getMinutes() / 15) * 15;
        const qStr = String(quarter).padStart(2, "0");

        return '${yyyy}_${mm}_${dd}_${hh}_${qStr}';
    }

    public async getArchives(): Promise<StorageLog[]>{
        return this.storageRepo.find();
    }

    public async runArchiveProcess(): Promise<void> {
        console.log("[StorageLogService] Starting archive process...");
        
        const eventsRes = await axios.get<EventDTO[]>("http://event-collector-service/api/events/older-than/72h");
        const events = eventsRes.data;

        const corrRes = await axios.get<CorrelationDTO[]>("http://alert-service/api/correlations/older-than/72h");
        const correlations = corrRes.data;

        const groups: Record<string, string[]> = {};

        for(const e of events){
            const key = this.getTimeGroup(e.timeStamp);
            if(!groups[key]) groups[key] = [];

            groups[key].push('EVENT | ID=${e.id} | TYPE=${e.type} | SOURCE=${e.source} | ${e.description} | ${e.timestamp}');
        }

        for(const c of correlations){
            const key = this.getTimeGroup(c.timeStamp);
            if(!groups[key]) groups[key] = [];

            groups[key].push('CORR | ID=${c.id} | ALERT=${c.is_alert} | ${c.description} | ${c.timestamp}');
        }

    }
}