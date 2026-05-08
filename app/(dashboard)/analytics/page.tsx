"use client";

import { useEffect, useState } from "react";

type ScanLog = {
  action: string;
  time: string;
  date: string;
  uid: string;
  fromRoom: string;
  toRoom: string;
  assetName: string;
  createdAt: string;
};

function generateUID(): string {
  const prefix = "E2003412017A1101890A1C";
  const suffix = Math.floor(Math.random() * 90 + 10).toString();
  return prefix + suffix;
}

function getCurrentTime(): string {
  const now = new Date();
  return now.toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  });
}

function getCurrentDate(): string {
  const now = new Date();
  const day = String(now.getDate()).padStart(2, "0");
  const month = String(now.getMonth() + 1).padStart(2, "0");
  const year = String(now.getFullYear()).slice(-2);
  return `${day}/${month}/${year}`;
}

export default function AnalyticsPage() {
  const [logs, setLogs] = useState<ScanLog[]>([]);

  const fetchLogs = async () => {
  try {
    const response = await fetch(
      "/api/scanner/logs"
    );

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();

    if (Array.isArray(data)) {
      setLogs(data);
    } else {
      console.error("Data is not an array", data);
      setLogs([]);
    }
  } catch (error) {
    console.error("Failed to fetch logs");
  }
};

  useEffect(() => {
  fetchLogs();

  const interval = setInterval(() => {
    fetchLogs();
  }, 2000);

  const handleKey = (e: KeyboardEvent) => {
    const key = e.key.toLowerCase();

    if (key === "r") {
      setLogs([]);
    }
  };

  window.addEventListener("keydown", handleKey);

  return () => {
    clearInterval(interval);
    window.removeEventListener("keydown", handleKey);
  };
}, []);

  return (
    <div className="space-y-8 p-8">
      {/* Header */}
      <div>
        <h1 className="text-4xl font-bold text-gray-900">
          Live Scanner
        </h1>

        <p className="text-gray-600 text-lg mt-2">
          Monitor real-time asset movement
        </p>

        <p className="text-sm text-red-500 mt-2">
          Press R to reset
        </p>
      </div>

      {/* Card */}
      <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
        {/* Top Bar */}
        <div className="px-6 py-5 border-b border-gray-200 flex items-center justify-between">
          <h2 className="text-2xl font-semibold text-gray-900">
            Recent Scan Activity
          </h2>

          <div className="flex items-center gap-2 text-green-600 font-semibold text-sm">
            <span className="relative flex h-3 w-3">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-3 w-3 bg-green-500"></span>
            </span>

            LIVE SCANNING
          </div>
        </div>

        {/* Table */}
        {logs.length > 0 ? (
          <div className="bg-white rounded-xl border border-gray-200 overflow-hidden shadow-sm">
            <table className="w-full">
              <thead>
                <tr className="bg-gray-50 border-b border-gray-200">
                  <th className="px-8 py-4 text-left text-sm font-semibold text-gray-900">Action</th>
                  <th className="px-8 py-4 text-left text-sm font-semibold text-gray-900">Date</th>
                  <th className="px-8 py-4 text-left text-sm font-semibold text-gray-900">Time</th>
                  <th className="px-8 py-4 text-left text-sm font-semibold text-gray-900">UID</th>
                  <th className="px-8 py-4 text-left text-sm font-semibold text-gray-900">From Room</th>
                  <th className="px-8 py-4 text-left text-sm font-semibold text-gray-900">To Room</th>
                  <th className="px-8 py-4 text-left text-sm font-semibold text-gray-900">Asset Name</th>
                </tr>
              </thead>

              <tbody>
                {logs.map((log, index) => (
                  <tr
                    key={index}
                    className="border-b border-gray-200 hover:bg-gray-50 transition-colors"
                  >
                    <td className="px-8 py-5">
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-medium text-white ${
                          log.action === "ENTER"
                            ? "bg-green-600"
                            : "bg-red-600"
                        }`}
                      >
                        {log.action}
                      </span>
                    </td>

                    <td className="px-8 py-5 text-gray-700">
                      {new Date(log.createdAt).toLocaleDateString("en-GB")}
                    </td>

                    <td className="px-8 py-5 text-gray-700">
                      {log.time}
                    </td>

                    <td className="px-8 py-5 font-medium text-gray-900">
                      {log.uid}
                    </td>

                    <td className="px-8 py-5 text-gray-700">
                      {log.fromRoom}
                    </td>

                    <td className="px-8 py-5 text-gray-700">
                      {log.toRoom}
                    </td>

                    <td className="px-8 py-5 font-medium text-gray-900">
                      {log.assetName}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="py-20 text-center">
            <p className="text-xl font-semibold text-gray-700">
              No scan activity yet
            </p>

            <p className="text-gray-500 mt-2">
              Start scanning to see real-time asset movement
            </p>
          </div>
        )}
      </div>
    </div>
  );
}