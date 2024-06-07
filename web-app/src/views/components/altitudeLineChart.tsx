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

const AltitudeLineChart = ({ data }: Props) => {
    const start = new Date(data[0].timestamp).getTime() || 0;

    const altitudes = data.map((data: any) => {
        return {
            time: formatTime(new Date(data.timestamp).getTime() - start),
            altitude: data.gps.altitude,
        };
    });

    const labelInterval = Math.ceil(altitudes.length / 8);

    const formatYAxisTick = (value: number) => `${Math.round(value)} m`;

    return (
        <div className="w-full h-64">
            <ResponsiveContainer>
                <LineChart
                    data={altitudes}
                    margin={{ top: 5, right: 20, left: 20, bottom: 5 }}
                >
                    <YAxis tickFormatter={formatYAxisTick} />
                    <XAxis dataKey="time" interval={labelInterval} />
                    <Tooltip />
                    <Legend />
                    <Line
                        type="natural"
                        dataKey="altitude"
                        stroke="#2390ba"
                        strokeWidth={2}
                    />
                </LineChart>
            </ResponsiveContainer>
        </div>
    );
};

export default AltitudeLineChart;
