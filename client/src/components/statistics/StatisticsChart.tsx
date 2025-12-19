import React, { useState } from "react";
import { AlertStatisticsDTO } from "../../models/query/AlertStatisticsDTO";
import { EventStatisticsDTO } from "../../models/query/EventStatisticsDTO"
import { CartesianGrid, Line, LineChart, ResponsiveContainer, XAxis, YAxis } from "recharts";

type StatisticsChartProps = {
    eventData: EventStatisticsDTO[];
    alertData: AlertStatisticsDTO[];
}

export default function StatisticsChart({eventData, alertData}: StatisticsChartProps) {
    const [showEvents, setShowEvents] = useState(true);
    const [showAlerts, setShowAlerts] = useState(true);

    const combinedData = eventData.map((event, index) => ({
        date: event.date,
        events: event.count,
        alerts: alertData[index]?.count || 0,
    }));

    const containerStyle: React.CSSProperties = {
        display: "flex",
        flexDirection: "column",
        gap: "16px",
        width: "100%",
        padding: "16px"
    };

    const headerStyle: React.CSSProperties = {
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        marginBottom: "12px"
    };

    const chartContainerStyle: React.CSSProperties = {
        width: "100%",
        height: "400px",
        backgroundColor: "#2b2d31",
        borderRadius: "12px",
        padding: "20px"
    };

    return(
        <div style={containerStyle}>
            <div style={headerStyle}>
                <span style={{color: "#c5c5c5", fontSize: "14px", fontWeight: 600}}>
                    Events per day
                </span>
            </div>

            <div style={chartContainerStyle}>
                <ResponsiveContainer width="100%" height={350}>
                    <LineChart
                        data={combinedData}>

                            <CartesianGrid strokeDasharray="3 3" stroke="#313338"/>
                            <XAxis dataKey="date" stroke="#c5c5c5" style={{fontSize: "12px"}} axisLine={false}/>
                            <YAxis stroke="#c5c5c5" style={{fontSize: "12px"}} axisLine={false}/>

                            {showEvents && (
                                <Line
                                    type="monotone"
                                    dataKey="events"
                                    stroke="#8b0000"
                                />
                            )}
                            {showAlerts && (
                                <Line
                                    type="monotone"
                                    dataKey="alerts"
                                    stroke="#6e008a"
                                />
                            )}
                    </LineChart>
                </ResponsiveContainer>
            </div>
        </div>
    );
}