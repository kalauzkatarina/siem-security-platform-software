import { IntegrityStatusCardProps } from "../../types/props/integrity/IntegrityStatusCardProps";

export default function IntegrityStatusCard({ status, onVerify, loading }: IntegrityStatusCardProps) {
    const isSecure = status.status === 'secure';
    const statusColor = isSecure ? "#00ffa3" : "#ff4d4d";

    return (
        <div className="bg-[rgba(255,255,255,0.05)] rounded-[12px] p-5 border border-[rgba(255,255,255,0.1)] backdrop-blur-[10px] w-full max-w-[400px]">
            <div className="flex justify-between items-start">
                <div>
                    <div className="text-[28px] font-bold" style={{ color: statusColor }}>
                        {status.status.toUpperCase()}
                    </div>
                    <div className="text-[12px] text-[#a6a6a6] mt-1">Blockchain Integrity Status</div>
                </div>
                <div className="text-right font-mono text-[14px] text-white opacity-80">
                    Checked: {status.totalLogsChecked} logs
                </div>
            </div>

            <div className="mt-4 pt-4 border-t border-[rgba(255,255,255,0.05)]">
                <div className="flex justify-between mb-2 text-[13px]">
                    <span className="text-[#a6a6a6]">Last Verification:</span>
                    <span className="text-white">{new Date(status.lastVerified).toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-[13px]">
                    <span className="text-[#a6a6a6]">Issues Detected:</span>
                    <span style={{ color: status.compromisedLogsCount > 0 ? "#ff4d4d" : "white" }}>
                        {status.compromisedLogsCount}
                    </span>
                </div>
            </div>

            <button 
                onClick={onVerify}
                disabled={loading}
                className="w-full mt-5 py-3 rounded-lg bg-[#2a2a2a] hover:bg-[#3a3a3a] text-white font-semibold text-sm transition-all border border-[rgba(255,255,255,0.1)]"
            >
                {loading ? "Verifying Chain..." : "Run Integrity Check"}
            </button>
        </div>
    );
}