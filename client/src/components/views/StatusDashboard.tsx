import { useState, useEffect } from "react";
import { StatusDashboardProps } from "../../types/props/status-monitor/StatusDashboardProps";
import { ServiceStatusDTO } from "../../models/status-monitor/ServiceStatusDTO";
import { IncidentDTO } from "../../models/status-monitor/IncidentDTO";
import UptimeBar from "../../components/status-monitor/UptimeBar";
import IncidentTable from "../../components/status-monitor/IncidentTable";


export default function StatusDashboard({ statusApi }: StatusDashboardProps) {
  const [services, setServices] = useState<ServiceStatusDTO[]>([]);
  const [incidents, setIncidents] = useState<IncidentDTO[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  // Hardkodovan token za testiranje (kao u tvom primeru)
  const token = "token"; 

  useEffect(() => {
    const fetchData = async () => {
      try {
        // 1. Dohvatamo statuse
        const statusData = await statusApi.getOverallStatus(token);
        setServices(statusData);

        // 2. Dohvatamo incidente (sa AI analizom)
        const incidentData = await statusApi.getAllIncidents(token);
        setIncidents(incidentData);
        
        setLoading(false);
      } catch (error) {
        console.error("Failed to fetch status data", error);
        setLoading(false);
      }
    };

    fetchData();
    // Osvežavamo na svakih 5 sekundi
    const interval = setInterval(fetchData, 5000);
    return () => clearInterval(interval);

  }, [statusApi]);

  if (loading) return <div className="text-white p-10">Loading System Status...</div>;

  return (
    <div className="p-2 h-full overflow-y-auto">
       <h1 className="text-2xl font-bold text-white mb-6 pl-2 border-l-4 border-indigo-500">
           System Status & Health
       </h1>

       {/* Grid prikaz servisa (Uptime Bars) */}
       <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
           {services.map((service) => (
               <UptimeBar key={service.serviceName} service={service} />
           ))}
       </div>

       {/* Tabela incidenata na dnu */}
       <IncidentTable incidents={incidents} />
    </div>
  );
}