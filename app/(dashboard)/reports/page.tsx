"use client";

import { useEffect, useState } from "react";
import jsPDF from "jspdf";

export default function ReportsPage() {
  const [assets, setAssets] = useState<any[]>([]);
  const [logs, setLogs] = useState<any[]>([]);
  const [filteredLogs, setFilteredLogs] = useState<any[]>([]);
  const [selectedRoom, setSelectedRoom] = useState("All");
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch Assets
        const assetRes = await fetch("/api/rfid/tags");
        const assetData = await assetRes.json();

        // Fetch Logs
        const logRes = await fetch("/api/scanner/logs");
        const logData = await logRes.json();

        setAssets(assetData.rfidTags || []);
        setLogs(logData || []);
        setFilteredLogs(logData || []);
      } catch (error) {
        console.error("Error loading reports:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  // Filter logs by room
    useEffect(() => {
    if (selectedRoom === "All") {
        setFilteredLogs(logs);

    } else if (selectedRoom === "Outside") {

        setFilteredLogs(
        logs.filter(
            (log) =>
            log.action === "EXIT" &&
            log.toRoom === "-"
        )
        );

    } else {

        setFilteredLogs(
        logs.filter(
            (log) =>
            log.fromRoom === selectedRoom ||
            log.toRoom === selectedRoom
        )
        );
    }
    }, [selectedRoom, logs]);

  // Summary Counts
  const room1Assets = assets.filter(
    (asset) => asset.currentRoom === "Room1"
  );

  const outsideAssets = assets.filter(
    (asset) => asset.currentRoom === "Outside"
  );

  const generatePDF = () => {
  const doc = new jsPDF();

  let y = 20;

doc.setFontSize(22);

doc.text(
  "SDCA Asset Management System",
  105,
  20,
  { align: "center" }
);

  y += 20;

  doc.setFontSize(16);
  doc.text("Asset Reports", 20, y);

  y += 10;

  doc.setFontSize(11);
  doc.text(
    `Generated: ${new Date().toLocaleString()}`,
    20,
    y
  );

  y += 15;

  // TOTAL ASSETS
  doc.setFontSize(14);
  doc.text(`Total Assets: ${assets.length}`, 20, y);

  y += 10;

  assets.forEach((asset) => {
    doc.setFontSize(11);

    doc.text(
      `• ${asset.assetName} — UID: ${asset.uid}`,
      25,
      y
    );

    y += 7;
  });

  y += 10;

  // ROOM1
  doc.setFontSize(14);

  doc.text(
    `Assets in Room1: ${room1Assets.length}`,
    20,
    y
  );

  y += 10;

  room1Assets.forEach((asset) => {
    doc.setFontSize(11);

    doc.text(
      `• ${asset.assetName} — UID: ${asset.uid}`,
      25,
      y
    );

    y += 7;
  });

  y += 10;

  // OUTSIDE
  doc.setFontSize(14);

  doc.text(
    `Assets Outside: ${outsideAssets.length}`,
    20,
    y
  );

  y += 10;

  outsideAssets.forEach((asset) => {
    doc.setFontSize(11);

    doc.text(
      `• ${asset.assetName} — UID: ${asset.uid}`,
      25,
      y
    );

    y += 7;
  });

  y += 15;

// TOTAL SCANS TODAY
  doc.setFontSize(14);

    doc.text(
    `Total Scans Today: ${
    logs.filter((log) => {
        const today = new Date().toDateString();

        return (
        new Date(log.createdAt).toDateString() === today
        );
    }).length
    }`,
    20,
    y
    );

    y += 15;

  // TOTAL SCANS
  doc.setFontSize(14);

  doc.text(
    `Total Scans: ${logs.length}`,
    20,
    y
  );

  y += 15;

  // RECENT ACTIVITY
  doc.setFontSize(16);
  doc.text("Recent RFID Activity", 20, y);

  y += 10;

  logs.slice(0, 6).forEach((log) => {
    doc.setFontSize(11);

    const status =
      log.action === "EXIT"
        ? "Outside"
        : log.toRoom;

    doc.text(
      `${log.assetName || "Unknown Asset"} | UID: ${
        log.uid
      } | ${status}`,
      20,
      y
    );

    y += 7;

    doc.text(
      `${new Date(log.createdAt).toLocaleString()}`,
      25,
      y
    );

    y += 10;
  });

  doc.save("Asset-Report.pdf");
};

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">
            Asset Reports
          </h1>

          <p className="text-gray-600 mt-2">
            Monitor RFID asset activity and inventory movement
          </p>
        </div>

        {/* Print Button */}
        <button
          onClick={generatePDF}
          className="px-5 py-3 bg-red-600 hover:bg-red-700 text-white rounded-xl font-medium transition"
        >
          Export Report
        </button>
      </div>

      {/* Loading */}
      {isLoading ? (
        <div className="text-gray-500">
          Loading reports...
        </div>
      ) : (
        <>
          {/* Summary Cards */}
          <div className="grid grid-cols-4 gap-6">

            {/* Total Assets */}
            <div className="bg-white rounded-xl p-6 border shadow-sm">
              <p className="text-sm text-gray-500">
                Total Assets
              </p>

                <h2 className="text-4xl font-bold text-gray-900 mt-2">
                {assets.length}
                </h2>
            </div>

            {/* Room1 Assets */}
            <div className="bg-white rounded-xl p-6 border shadow-sm">
              <p className="text-sm text-gray-500">
                Assets in Room1
              </p>
                <h2 className="text-4xl font-bold text-green-600 mt-2">
                {room1Assets.length}
                </h2>
            </div>

            {/* Outside Assets */}
            <div className="bg-white rounded-xl p-6 border shadow-sm">
              <p className="text-sm text-gray-500">
                Assets Outside
              </p>

                <h2 className="text-4xl font-bold text-red-600 mt-2">
                {outsideAssets.length}
                </h2>
            </div>

            {/* Total Scans */}
            <div className="bg-white rounded-xl p-6 border shadow-sm">
              <p className="text-sm text-gray-500">
                Total Scans
              </p>

              <h2 className="text-4xl font-bold text-blue-600 mt-2">
                {logs.length}
              </h2>
            </div>
          </div>

          {/* Logs Section */}
          <div className="bg-white rounded-xl border shadow-sm overflow-hidden">

            {/* Top */}
            <div className="p-6 border-b flex items-center justify-between">
              <h2 className="text-xl font-bold text-gray-900">
                Recent RFID Activity
              </h2>

              {/* Room Filter */}
              <select
                value={selectedRoom}
                onChange={(e) => setSelectedRoom(e.target.value)}
                className="border border-gray-300 rounded-lg px-4 py-2 text-sm"
              >
                <option value="All">All Rooms</option>
                <option value="Room1">Room1</option>
                <option value="Outside">Outside</option>
              </select>
            </div>

            {/* Empty State */}
            {filteredLogs.length === 0 ? (
              <div className="p-6 text-gray-500">
                No scan activity found
              </div>
            ) : (
              <div className="divide-y">
                {filteredLogs.map((log, index) => (
                  <div
                    key={index}
                    className="p-6 flex items-center justify-between"
                  >
                    {/* Left */}
                    <div>
                      <p className="font-semibold text-gray-900">
                        {log.assetName || "Unknown Asset"}
                      </p>

                      <p className="text-sm text-gray-500 mt-1">
                        UID: {log.uid}
                      </p>
                    </div>

                    {/* Right */}
                    <div className="text-right">
                      <p
                        className={`font-semibold ${
                          log.room === "Outside"
                            ? "text-red-600"
                            : "text-green-600"
                        }`}
                      >
                        {log.action === "EXIT"
                                ? "Outside"
                                : log.toRoom}
                      </p>

                      <p className="text-sm text-gray-400 mt-1">
                        {new Date(
                          log.createdAt
                        ).toLocaleString()}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
}