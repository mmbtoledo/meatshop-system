import React from "react";

function Header() {
  return (
    <div className="ml-64 bg-white shadow p-4 flex justify-between">

      <h2 className="text-xl font-semibold">
        Dashboard
      </h2>

      <div>
        <span className="mr-4">Admin</span>
        <button className="bg-red-500 text-white px-3 py-1 rounded">
          Logout
        </button>
      </div>

    </div>
  );
}

export default Header;