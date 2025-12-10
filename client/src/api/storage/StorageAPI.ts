import { ArchiveDTO } from "../../models/storage/ArchiveDTO";
import { IStorageAPI } from "./IStorageAPI";
import axios, { AxiosInstance } from "axios";

export class StorageAPI implements IStorageAPI {
    private readonly client: AxiosInstance;

    constructor(){
        this.client = axios.create({
            baseURL: import.meta.env.VITE_GATEWAY_URL,
            headers: {
                "Content-Type": "application/json"
            },
        });
    }

    async getAllArchives(): Promise<ArchiveDTO[]> {
        const response = await this.client.get<ArchiveDTO[]>("/storageLog");
        return response.data;
    }

    async searchArchives(query: string): Promise<ArchiveDTO[]> {
        const response = await this.client.get<ArchiveDTO[]>("/storageLog/run", {
            params: {q: query},
        });
        return response.data;
    }
}