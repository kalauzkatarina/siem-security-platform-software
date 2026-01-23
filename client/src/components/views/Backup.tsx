import { useEffect, useState } from "react";
import { BackupValidationResultDTO } from "../../models/backup/BackupValidationResultDTO";
import { BackupProps } from "../../types/props/backup/BackupProps";
import BackupStats from "../backup/BackupStats";
import { emptyBackupStats } from "../../constants/backupEmptyStats";

export default function Backup({ backupApi}: BackupProps) {
    const [stats, setStats] = useState<BackupValidationResultDTO | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                setIsLoading(true);
                const summary = await backupApi.getSummary();
                setStats(summary);
            } catch (err) {
                console.error("Failed to load backup summary:", err);
                setError("Failed to load backup statistics");
            } finally {
                setIsLoading(false);
            }
        };
        fetchData();
    }, []);

    return(
        <div className="border-2 border-[#282A28] bg-transparent rounded-[10px]!">
            <h2 className="mt-[3px]! p-[5px]! m-[10px]!">Backup</h2>

            <div className="flex justify-end me-[10px]! mb-2!">
                <div className={`flex w-[180px]! items-center gap-2 px-3! py-1.5! rounded-[8px] text-[12px] font-semibold
                    ${!isLoading
                        ? "bg-[rgba(74,222,128,0.15)] text-[$4ade80] border border-[rgba(74,222,128,0.3)]"
                        : "bg-[rgba(239,68,68,0.15)] text-[#f87171] border border-[rgba(239,68,68,0.3)]"
                    }`}>
                        <div className={`w-2 h-2 rounded-[14px]! ${!isLoading ? "bg-[#4ade80] animate-pulse" : "bg-[#f87171] animate-none"}`}></div>
                        {!isLoading ? "Live Updates Active" : "Connecting..."}
                    </div>
            </div>

            {error && (
                <div className="text-center p-4 text-red-400">
                    {error}
                </div>
            )}

            <BackupStats stats={stats ?? emptyBackupStats}/>
            
        </div>
    )
}