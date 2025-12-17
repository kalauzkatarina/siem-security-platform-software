import { Pie, PieChart, ResponsiveContainer } from "recharts";
import { DistributionDTO } from "../../models/query/DistributionDTO"

type EventDistributionProps = {
    data: DistributionDTO;
}

export default function EventDistribution({data}: EventDistributionProps){
    const chartData = [
        {name: 'Notifications', value: data.notifications, color: 'green'},
        {name: 'Warnings', value: data.warnings, color: 'orange'},
        {name: 'Errors', value: data.errors, color: 'red'},
    ];

    return(
        <div>
            <div>
                <h3>test render</h3>
            </div>
            <div>
                <ResponsiveContainer width="100%" height={250}>
                    <PieChart>
                        <Pie
                            data={chartData}
                            outerRadius={100}
                            fill="#8b0000"
                            dataKey="value">

                        </Pie>
                    </PieChart>
                </ResponsiveContainer>
            </div>
        </div>
    );
}