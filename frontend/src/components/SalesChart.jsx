import React from "react";
import { LineChart, Line, XAxis, YAxis, Tooltip, CartesianGrid } from "recharts";

const data = [
  { day: "Mon", sales: 2000 },
  { day: "Tue", sales: 3500 },
  { day: "Wed", sales: 4000 },
  { day: "Thu", sales: 2800 },
  { day: "Fri", sales: 5000 }
];

function SalesChart() {

  return (

    <div className="ml-64 p-4">

      <div className="bg-white shadow rounded p-4">

        <h3 className="text-lg font-semibold mb-4">
          Weekly Sales
        </h3>

        <LineChart width={700} height={300} data={data}>
          <XAxis dataKey="day"/>
          <YAxis/>
          <Tooltip/>
          <CartesianGrid stroke="#eee"/>
          <Line type="monotone" dataKey="sales"/>
        </LineChart>

      </div>

    </div>

  );
}

export default SalesChart;