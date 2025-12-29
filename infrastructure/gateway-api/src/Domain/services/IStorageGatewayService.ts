import { ArchiveStatsDTO } from "../DTOs/ArchiveStatsDTO";
import { TopArchiveDTO } from "../DTOs/TopArchiveDTO";
import { ArchiveVolumeDTO } from "../DTOs/ArchiveVolumeDTO";
import { LargestArchiveDTO } from "../DTOs/LargestArchiveDTO";
import { StorageLogResponseDTO } from "../DTOs/StorageLogResponseDTO";

export interface IStorageGatewayService {
  getAllArchives(): Promise<StorageLogResponseDTO[]>;
  searchArchives(query: string): Promise<StorageLogResponseDTO[]>;
  sortArchives(by: "date" | "size" | "name", order: "asc" | "desc"): Promise<StorageLogResponseDTO[]>;
  runArchiveProcess(): Promise<StorageLogResponseDTO>;
  getArchiveStats(): Promise<ArchiveStatsDTO>;
  downloadArchive(id: string): Promise<ArrayBuffer>;
  getTopArchives(type: "events" | "alerts", limit: number): Promise<TopArchiveDTO[]>;
  getArchiveVolume(period: "daily" | "monthly" | "yearly"): Promise<ArchiveVolumeDTO[]>;
  getLargestArchive(): Promise<LargestArchiveDTO | null>;
}