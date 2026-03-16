import React from "react";

function DashboardCards() {
  return (

    <div className="grid grid-cols-4 gap-4 p-4 ml-64">

      <div className="bg-white shadow rounded p-4">
        <h3 className="text-gray-500">Total Sales</h3>
        <p className="text-2xl font-bold">₱25,000</p>
      </div>

      <div className="bg-white shadow rounded p-4">
        <h3 className="text-gray-500">Total Expenses</h3>
        <p className="text-2xl font-bold">₱8,000</p>
      </div>

      <div className="bg-white shadow rounded p-4">
        <h3 className="text-gray-500">Net Profit</h3>
        <p className="text-2xl font-bold text-green-600">
          ₱17,000
        </p>
      </div>

      <div className="bg-white shadow rounded p-4">
        <h3 className="text-gray-500">Low Stock Products</h3>
        <p className="text-2xl font-bold text-red-500">
          4
        </p>
      </div>

    </div>

  );
}

export default DashboardCards;