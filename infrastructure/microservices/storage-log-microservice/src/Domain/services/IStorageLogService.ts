export interface IStorageLogService {
    runArchiveProcess(): Promise<void>;
    getArchives(): Promise<any[]>;
}