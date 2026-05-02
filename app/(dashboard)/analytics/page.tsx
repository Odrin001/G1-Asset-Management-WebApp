"use client";

import { useEffect, useState } from "react";

type ScanLog = {
  action: "ENTER";
  time: string;
  date: string;
  uid: string;
  fromRoom: string;
  toRoom: string;
  assetName: string;
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

  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      const key = e.key.toLowerCase();

      if (key === "r") {
        setLogs([]);
        return;
      }
    };

    window.addEventListener("keydown", handleKey);

    return () => {
      window.removeEventListener("keydown", handleKey);
    };
  }, [logs.length]);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-4xl font-bold text-gray-900">
          Live Scanner
        </h1>

        <p className="text-gray-500 mt-2">
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
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-red-500 text-white text-left">
                  <th className="px-6 py-4 font-semibold">Action</th>
                  <th className="px-6 py-4 font-semibold">Date</th>
                  <th className="px-6 py-4 font-semibold">Time</th>
                  <th className="px-6 py-4 font-semibold">UID</th>
                  <th className="px-6 py-4 font-semibold">From Room</th>
                  <th className="px-6 py-4 font-semibold">To Room</th>
                  <th className="px-6 py-4 font-semibold">Asset Name</th>
                </tr>
              </thead>

              <tbody>
                {logs.map((log, index) => (
                  <tr
                    key={index}
                    className="border-b border-gray-100 hover:bg-gray-50"
                  >
                    <td className="px-6 py-4">
                      <span className="px-3 py-1 rounded-lg text-sm font-semibold text-white bg-green-500">
                        ENTER
                      </span>
                    </td>

                    <td className="px-6 py-4 text-gray-700">
                      {log.date}
                    </td>

                    <td className="px-6 py-4 text-gray-700">
                      {log.time}
                    </td>

                    <td className="px-6 py-4 font-medium text-gray-900">
                      {log.uid}
                    </td>

                    <td className="px-6 py-4 text-gray-700">
                      {log.fromRoom}
                    </td>

                    <td className="px-6 py-4 text-gray-700">
                      {log.toRoom}
                    </td>

                    <td className="px-6 py-4 font-medium text-gray-900">
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