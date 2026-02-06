import { CartesianGrid, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { SecurityMaturityTrendDTO } from "../../models/security-maturity/SecurityMaturityTrendDTO";

interface Props{
    data: SecurityMaturityTrendDTO[];
}

export default function SecurityMaturityTrend({data}: Props){
    return (
        <div className="flex flex-col items-center justify-center w-full min-h-[250]" style={{marginTop: "30px", marginBottom: "10px"}}>
            <h3 className="text-sm uppercase tracking-widest text-gray-400">
                    Security Maturity Trend
            </h3>

            <div className="w-full h-[220px] mt-5! mr-5!">
                <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={data}>
                        <CartesianGrid stroke="#333" strokeDasharray="3 3" vertical={false} opacity={0.5} />

                        <XAxis dataKey="bucketStart" tickFormatter={(v) => v.slice(5, 7)} tick={{ fill: "#ffffff", fontSize: 13, fontWeight: "bold" }} axisLine={false} tickLine={false} />
                        <YAxis domain={[0, 100]} tick={{ fill: "#ffffff", fontSize: 13, fontWeight: "bold" }} axisLine={false} tickLine={false} />

                        <Tooltip contentStyle={{
                            backgroundColor: "#1f2123",
                            border: "1px solid #292a28",
                            borderRadius: "8px",
                        }}
                        labelFormatter={(label) => `Period: ${label}`}
                        formatter={(value) => [`Score: ${value}`, ""]} />

                        <Line 
                            type="monotone"
                            dataKey="value"
                            stroke="#007a55"
                            strokeWidth={3}
                            dot={{r: 4}}
                            activeDot={{r: 6}} />
                    </LineChart>
                </ResponsiveContainer>
            </div>
        </div>
    )
}