"use client";

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

const data = [
  { date: "01", frequency: 10 },
  { date: "02", frequency: 15 },
  { date: "03", frequency: 8 },
  { date: "04", frequency: 20 },
  { date: "05", frequency: 12 },
  { date: "06", frequency: 10 },
  { date: "07", frequency: 15 },
  { date: "08", frequency: 8 },
  { date: "09", frequency: 20 },
  { date: "10", frequency: 12 },
];

const VisitorGraph = () => {
  return (
    <div className="w-11/12 h-70 p-4 bg-white rounded-lg shadow-lg">
      <h5 className="text-sm font-bold mb-4">Pengunjung Salman Maret 2025</h5>
      <ResponsiveContainer width="100%" height="80%">
        <LineChart data={data}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="date" />
          <YAxis />
          <Tooltip />
          <Line
            type="monotone"
            dataKey="frequency"
            stroke="#8884d8"
            strokeWidth={3}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

export default VisitorGraph;
