import {
  Legend,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { formatTime } from "../../helpers/timeFormatters";

interface IMagnitudeLineChart {
  magnitudeData: Number[];
  recordingStart: Date;
  recordingEnd: Date;
}

const MagnitudeLineChart: React.FC<IMagnitudeLineChart> = ({
  magnitudeData,
  recordingStart,
  recordingEnd,
}: IMagnitudeLineChart) => {
  const startDate = new Date(recordingStart);
  const endDate = new Date(recordingEnd);

  const timeStep = Math.round(
    (endDate.getTime() - startDate.getTime()) / magnitudeData.length
  );
  const labelInterval = Math.ceil(magnitudeData.length / 10);

  const data = magnitudeData.map((magnitude, index) => ({
    magnitude,
    time: formatTime((index + 1) * timeStep),
  }));
  data.unshift({ magnitude: 0, time: formatTime(0) });

  return (
    <div className="w-full h-64">
      <ResponsiveContainer>
        <LineChart
          data={data}
          margin={{ top: 5, right: 40, left: 40, bottom: 5 }}
        >
          <YAxis />
          <XAxis dataKey="time" interval={labelInterval} />
          <Tooltip />
          <Legend />
          <Line
            type="natural"
            dataKey="magnitude"
            stroke="#2390ba"
            strokeWidth={2}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

export default MagnitudeLineChart;
