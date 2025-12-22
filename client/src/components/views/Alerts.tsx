import React, { useState } from "react";
import { AlertAPI } from "../../api/alerts/AlertAPI";
import { useAlerts } from "../../hooks/useAlerts";
import { AlertStatistics } from "../alerts/AlertStatistics";
import { AlertFilters } from "../alerts/AlertFilters";
import RecentAlertsTable from "../tables/RecentAlertsTable";
import { AlertQueryDTO } from "../../models/alerts/AlertQueryDTO";
import AlertDetailsPanel from "../alerts/AlertDetailsPanel";

const alertAPI = new AlertAPI();

export default function Alerts() {
  const { alerts, isLoading, searchAlerts, resolveAlert, updateStatus } = useAlerts(alertAPI);
  const [selectedAlertId, setSelectedAlertId] = useState<number | null>(null);

  const handleSearch = (query: AlertQueryDTO) => {
    searchAlerts(query);
  };

  const handleSelectAlert = (id: number) => {
    setSelectedAlertId(id);
  };

  const handleCloseDetails = () => {
    setSelectedAlertId(null);
  };

  const handleResolve = async (id: number, resolvedBy: string) => {
    await resolveAlert(id, resolvedBy, "RESOLVED");
    setSelectedAlertId(null);
  };

  const handleUpdateStatus = async (id: number, status: string) => {
    await updateStatus(id, status);
  };

  const lastAlert = alerts.length > 0 ? alerts[0] : null;
  const lastAlertTime = lastAlert 
    ? new Date(lastAlert.createdAt).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })
    : "--:--";

  const selectedAlert = selectedAlertId 
    ? alerts.find(a => a.id === selectedAlertId) || null
    : null;

  const containerStyle: React.CSSProperties = {
    border: "2px solid #282A28",
    backgroundColor: "transparent",
    borderRadius: "14px",
    padding: "24px"
  };

  return (
    <div style={containerStyle}>
      <h2 style={{ marginBottom: "24px", color: "#fff" }}>Alert Dashboard</h2>

      <AlertStatistics alerts={alerts} lastAlertTime={lastAlertTime} />
      <AlertFilters onSearch={handleSearch} />

      {isLoading && (
        <div style={{ textAlign: "center", padding: "40px" }}>
          <div className="spinner"></div>
        </div>
      )}

      {!isLoading && (
        <RecentAlertsTable 
          alerts={alerts}
          onSelectAlert={handleSelectAlert}
          onResolve={handleResolve}
          onUpdateStatus={handleUpdateStatus}
        />
      )}

      {selectedAlert && (
        <AlertDetailsPanel 
          alert={selectedAlert}
          onClose={handleCloseDetails}
          onResolve={handleResolve}
        />
      )}
    </div>
  );
}