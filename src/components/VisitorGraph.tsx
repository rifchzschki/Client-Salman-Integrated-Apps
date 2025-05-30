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
import { useEffect, useState } from "react";

interface visitorData {
  date: Date;
  amount: number;
}
const VisitorGraph = () => {
  const [data, setData] = useState([]);

  useEffect(() => {
    const fetchVisitors = async () => {
      try {
        const monthNames = [
          "Januari",
          "Februari",
          "Maret",
          "April",
          "Mei",
          "Juni",
          "Juli",
          "Agustus",
          "September",
          "Oktober",
          "November",
          "Desember",
        ];
        const today = new Date();
        const month = monthNames[today.getMonth()];
        const year = today.getFullYear();

        const response = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/visitors?month=${month}&year=${year}`,
          { method: "GET" }
        );
        const json = await response.json();

        const formattedData = json.map((item: visitorData) => ({
          date: item.date,
          frequency: item.amount,
        }));
        console.log(formattedData);

        setData(formattedData);
      } catch (error) {
        console.error("Error fetching visitors:", error);
      }
    };

    fetchVisitors();
  }, []);

  return (
    <div className="w-11/12 h-70 p-4 bg-white rounded-lg">
      <h5 className="text-sm font-bold mb-4">Pengunjung Salman Bulan Ini</h5>
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
