import {
    LineChart,
    Line,
    XAxis,
    YAxis,
    Tooltip,
    Legend,
    ResponsiveContainer,
} from "recharts";
import { formatTime } from "../../helpers/timeFormatters";

interface Props {
    data: any;
}

const StatsLineChart = ({ data }: Props) => {
    const processedData = data.map((segment: any) => {
        return {
            time: formatTime(segment.travelTime),
            averageSpeed: segment.avgSpeed,
            maxSpeed: segment.maxSpeed,
            power: segment.power,
            elevation: segment.elevation,
        };
    });

    return (
        <div className="w-full h-64">
            <ResponsiveContainer>
                <LineChart
                    data={processedData}
                    margin={{ top: 5, right: 20, left: 20, bottom: 5 }}
                >
                    <YAxis />
                    <XAxis dataKey="time" />
                    <Tooltip />
                    <Legend />
                    <Line
                        type="natural"
                        dataKey="averageSpeed"
                        stroke="#661bde"
                        strokeWidth={2}
                    />
                    <Line
                        type="natural"
                        dataKey="maxSpeed"
                        stroke="#de1bce"
                        strokeWidth={2}
                    />
                    <Line
                        type="natural"
                        dataKey="power"
                        stroke="#1bde76"
                        strokeWidth={2}
                    />
                    <Line
                        type="natural"
                        dataKey="elevation"
                        stroke="#de1b83"
                        strokeWidth={2}
                    />
                </LineChart>
            </ResponsiveContainer>
        </div>
    );
};

export default StatsLineChart;
