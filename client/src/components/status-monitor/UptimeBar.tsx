import { UptimeBarProps } from "../../types/props/status-monitor/UptimeBarProps";
import { BiServer, BiErrorCircle, BiCheckCircle } from "react-icons/bi";

export default function UptimeBar({ service }: UptimeBarProps) {
  const statusColor = service.isDown ? "text-[#ff4b4b]" : "text-[#4ade80]";
  const borderColor = service.isDown ? "border-[#ff4b4b]" : "border-[#4ade80]";
  const bgColor = service.isDown ? "bg-[#ff4b4b]/10" : "bg-[#4ade80]/10";

  return (
    <div className={`flex flex-col bg-[#313338] p-4 rounded-[10px] mb-3 border-l-4 shadow-md ${borderColor}`}>
      
      <div className="flex justify-between items-center mb-2">
        <div className="flex items-center gap-2">
          <BiServer className="text-gray-400 text-xl" />
          <span className="font-bold text-white text-lg">{service.serviceName}</span>
        </div>
        
        <div className={`flex items-center gap-2 px-3 py-1 rounded-full ${bgColor}`}>
            {service.isDown ? <BiErrorCircle className={statusColor}/> : <BiCheckCircle className={statusColor}/>}
            <span className={`font-bold text-sm ${statusColor}`}>
                {service.isDown ? "OUTAGE" : "OPERATIONAL"}
            </span>
        </div>
      </div>

      <div className="flex justify-between items-center text-xs text-gray-400 mt-2">
        <span>Endpoint: {service.pingUrl}</span>
        {service.lastCheck && (
            <span>Response: {service.lastCheck.responseTimeMs}ms</span>
        )}
      </div>

      <div className="flex gap-[2px] mt-3 h-2 w-full overflow-hidden opacity-50">
         {[...Array(30)].map((_, i) => (
             <div 
                key={i} 
                className={`flex-1 rounded-sm ${service.isDown && i > 25 ? "bg-[#ff4b4b]" : "bg-[#4ade80]"}`}
             />
         ))}
      </div>
    </div>
  );
}