import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { SecuirtyMaturityIncidentsByCategoryDTO } from "../../models/security-maturity/SecurityMaturityIncidentsByCategory"

type Props = {
    data: SecuirtyMaturityIncidentsByCategoryDTO[];
};

export default function IncidentsByCategoryChart({data}: Props){
    return (
        <div className="w-full h-[320px]">

            <ResponsiveContainer width="100%" height="100%">
                <BarChart 
                    data={data}
                    margin={{top: 10, right: 20, left: 0, bottom: 40}} >
                    <CartesianGrid
                        strokeDasharray="3 3"
                        vertical={false}
                        stroke="#333"
                        opacity={0.5} />

                    <XAxis
                        dataKey="category"
                        tick={{fill: "#fff", fontSize: 12, fontWeight: 600}}
                        axisLine={false}
                        tickLine={false}
                        textAnchor="end"
                        height={60} />
                    <YAxis
                        tick={{fill: "#fff", fontSize: 12, fontWeight: 600}}
                        axisLine={false}
                        tickLine={false} />
                    <Tooltip
                        contentStyle={{
                            backgroundColor: "#1f2123",
                            border: "1px solid #292a28",
                            borderRadius: "8px"
                        }}
                        labelStyle={{color: "#9ca3af"}}
                        formatter={(value) => `${value} incidents`} />

                    <Bar
                        dataKey="count"
                        fill="#007a55"
                        fillOpacity={0.35}
                        activeBar={{
                            fill: "#007a55",
                            fillOpacity: 1
                        }}
                        radius={[6, 6, 0, 0]} />
                </BarChart>
            </ResponsiveContainer>
        </div>
    )
}