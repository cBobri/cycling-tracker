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
    const processedData = data.map((quartile: any) => {
        return {
            time: formatTime(quartile.travelTime),
            averageSpeed: quartile.avgSpeed,
            power: quartile.power,
            elevation: quartile.elevation,
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
