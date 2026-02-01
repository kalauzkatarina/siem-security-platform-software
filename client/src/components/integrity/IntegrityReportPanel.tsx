import { IntegrityReportPanelProps } from "../../types/props/integrity/IntegrityReportPanelProps";

export default function IntegrityReportPanel({ report, onClose }: IntegrityReportPanelProps) {
    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
            <div className="bg-[#1a1a1a] border border-[#333] rounded-[16px] w-full max-w-[600px] overflow-hidden shadow-2xl">
                <div className="flex justify-between items-center p-4 border-b border-[#333]">
                    <h3 className="text-white font-semibold text-[14px]">Verification Report</h3>
                    <button onClick={onClose} className="text-gray-400 hover:text-white transition-colors">✕</button>
                </div>
                
                <div className="p-6 max-h-[70vh] overflow-y-auto">
                    <div className="mb-6">
                        <div className="text-[11px] text-gray-500 uppercase tracking-[1px] mb-2 font-semibold">Status</div>
                        <div className={`text-lg font-bold ${report.isValid ? "text-[#00ffa3]" : "text-[#ff4d4d]"}`}>
                            {report.isValid ? "Blockchain Verified" : "Integrity Compromised"}
                        </div>
                        <div className="text-[12px] text-gray-400 mt-1">
                            Time: {new Date(report.checkTimestamp).toLocaleString()}
                        </div>
                    </div>

                    <div className="space-y-3">
                        <div className="text-[11px] text-gray-500 uppercase tracking-[1px] font-semibold">Findings</div>
                        {report.tamperedEvents.length > 0 ? (
                            report.tamperedEvents.map((event, index) => (
                                <div key={index} className="p-3 bg-[rgba(255,77,77,0.05)] rounded-lg border border-[rgba(255,77,77,0.2)] text-[12px] text-gray-300 font-mono">
                                    <span className="text-[#ff4d4d] mr-2">⚠</span> {event}
                                </div>
                            ))
                        ) : (
                            <div className="p-3 bg-[rgba(0,255,163,0.05)] rounded-lg border border-[rgba(0,255,163,0.2)] text-[12px] text-gray-300 font-mono">
                                <span className="text-[#00ffa3] mr-2">✓</span> No tampered events found. Chain is consistent.
                            </div>
                        )}
                    </div>
                </div>

                <div className="p-4 bg-[#1f1f1f] flex justify-end">
                    <button 
                        onClick={onClose}
                        className="px-5 py-2 bg-[#333] text-white rounded-lg font-semibold text-[13px] hover:bg-[#444] transition-all border border-white/5"
                    >
                        Close Report
                    </button>
                </div>
            </div>
        </div>
    );
}