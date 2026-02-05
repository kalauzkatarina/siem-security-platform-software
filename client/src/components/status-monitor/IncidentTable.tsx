import { IncidentTableProps } from "../../types/props/status-monitor/IncidentTableProps";
import { AiFillRobot } from "react-icons/ai";
import { BiErrorCircle } from "react-icons/bi";

export default function IncidentTable({ incidents }: IncidentTableProps) {
  return (
    <div className="bg-[#313338] rounded-[14px] p-4 mt-6 border-2 border-[#282A28]">
      <h2 className="text-white text-xl mb-4 font-bold flex items-center gap-2">
        <BiErrorCircle className="text-[#ff4b4b]" /> Recent Incidents & AI Analysis
      </h2>
      
      <div className="overflow-x-auto">
        <table className="w-full text-left text-gray-300">
          <thead className="text-xs uppercase bg-[#2b2d31] text-gray-400">
            <tr>
              <th className="px-4 py-3 rounded-l-lg">Time</th>
              <th className="px-4 py-3">Service</th>
              <th className="px-4 py-3">Reason</th>
              <th className="px-4 py-3 rounded-r-lg w-1/2">AI Correlation Summary</th>
            </tr>
          </thead>
          <tbody className="text-sm">
            {incidents.length === 0 ? (
                <tr><td colSpan={4} className="text-center py-4">No recent incidents. System is healthy.</td></tr>
            ) : (
                incidents.map((incident) => (
                <tr key={incident.id} className="border-b border-gray-700 hover:bg-[#2b2d31]/50 transition">
                    <td className="px-4 py-3 text-white">
                        {new Date(incident.startTime).toLocaleString()}
                    </td>
                    <td className="px-4 py-3 font-bold text-[#ff4b4b]">
                        {incident.serviceName}
                    </td>
                    <td className="px-4 py-3">
                        {incident.reason}
                    </td>
                    <td className="px-4 py-3">
                        {/* Prikaz AI Analize */}
                        {incident.correlationSummary ? (
                            <div className="flex gap-2 items-start bg-[#202225] p-2 rounded border border-indigo-500/30">
                                <AiFillRobot className="text-indigo-400 text-xl mt-1 shrink-0" />
                                <span className="text-indigo-100 italic">
                                    "{incident.correlationSummary}"
                                </span>
                            </div>
                        ) : (
                            <span className="text-gray-500">Analysis pending...</span>
                        )}
                    </td>
                </tr>
                ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}