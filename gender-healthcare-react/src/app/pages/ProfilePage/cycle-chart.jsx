import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

export function CycleChart({ data }) {
  return (
    <div className="w-full h-[300px] rounded-2xl bg-white shadow-md p-4">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart
          data={data}
          margin={{ top: 10, right: 20, bottom: 20, left: 0 }}
        >
          <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
          <XAxis
            dataKey="day"
            label={{
              value: "Cycle Day",
              position: "insideBottom",
              offset: -10,
              fill: "#4b5563",
              fontSize: 12,
            }}
            tick={{ fill: "#6b7280", fontSize: 11 }}
          />
          <YAxis
            label={{
              value: "Temperature (°C)",
              angle: -90,
              position: "insideLeft",
              fill: "#4b5563",
              fontSize: 12,
            }}
            tick={{ fill: "#6b7280", fontSize: 11 }}
          />
          <Tooltip
            contentStyle={{ backgroundColor: "#f9fafb", borderRadius: "0.5rem", borderColor: "#e5e7eb" }}
            labelStyle={{ color: "#4b5563" }}
            itemStyle={{ color: "#6366f1" }}
          />
          <Line
            type="monotone"
            dataKey="temp"
            stroke="#6366f1"
            strokeWidth={2}
            dot={{ r: 4 }}
            activeDot={{ r: 6, fill: "#4f46e5" }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
