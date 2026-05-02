"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";

export default function DashboardLayout({
  children,
}: {
  readonly children: React.ReactNode;
}) {
  const searchParams = useSearchParams();
  const [searchQuery, setSearchQuery] = useState(searchParams.get("search") || "");

  // Update URL when search changes
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchQuery(value);
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Update URL with search query for child pages to access
    const url = new URL(window.location.href);
    if (searchQuery) {
      url.searchParams.set("search", searchQuery);
    } else {
      url.searchParams.delete("search");
    }
    window.history.pushState({}, "", url);
    // Dispatch custom event for child components to listen
    window.dispatchEvent(new CustomEvent("searchUpdate", { detail: searchQuery }));
  };

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar */}
      <div className="w-64 bg-primary-600 border-r border-primary-800 text-white flex flex-col shadow-lg">
        {/* Logo Section */}
        <div className="p-6 flex items-center gap-3 border-b border-primary-700">
          <div className="w-10 h-10 bg-white rounded-lg flex items-center justify-center flex-shrink-0">
            <svg
              className="w-6 h-6 text-primary-800"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M13 10V3L4 14h7v7l9-11h-7z"
              />
            </svg>
          </div>
          <span className="font-bold text-lg text-white">AssetTrack</span>
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-4 space-y-2">
          {/* Assets Section */}
          <div className="text-xs font-semibold text-primary-200 uppercase px-2 py-2 mb-4">
            Assets
          </div>

          <Link
            href="/dashboard"
            className="w-full flex items-center gap-3 px-4 py-3 rounded-lg bg-primary-600 hover:bg-primary-700 text-white font-medium transition"
          >
            <svg
              className="w-5 h-5 flex-shrink-0"
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path d="M3 4a1 1 0 011-1h12a1 1 0 011 1v2a1 1 0 01-1 1H4a1 1 0 01-1-1V4z" />
              <path
                fillRule="evenodd"
                d="M3 10a1 1 0 011-1h12a1 1 0 011 1v6a1 1 0 01-1 1H4a1 1 0 01-1-1v-6z"
                clipRule="evenodd"
              />
            </svg>
            <span>Computer Hardware</span>
          </Link>

          <Link
            href="/furniture"
            className="w-full flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-primary-700 text-primary-100 font-medium transition"
          >
            <svg
              className="w-5 h-5 flex-shrink-0"
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path d="M3 4a1 1 0 011-1h12a1 1 0 011 1v2a1 1 0 01-1 1H4a1 1 0 01-1-1V4z" />
              <path
                fillRule="evenodd"
                d="M3 10a1 1 0 011-1h12a1 1 0 011 1v6a1 1 0 01-1 1H4a1 1 0 01-1-1v-6z"
                clipRule="evenodd"
              />
            </svg>
            <span>Furniture</span>
          </Link>
        </nav>

        {/* Footer */}
        <div className="p-4 border-t border-primary-700 space-y-3">
            <Link
              href="/analytics"
              className="w-full flex items-center gap-3 px-4 py-3 rounded-lg bg-primary-700 hover:bg-primary-600 text-white font-medium transition"
            >
              <svg
                className="w-5 h-5 flex-shrink-0"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path d="M2 11a1 1 0 011-1h2a1 1 0 011 1v5a1 1 0 01-1 1H3a1 1 0 01-1-1v-5z" />
                <path d="M8 7a1 1 0 011-1h2a1 1 0 011 1v9a1 1 0 01-1 1H9a1 1 0 01-1-1V7z" />
                <path d="M14 4a1 1 0 011-1h2a1 1 0 011 1v12a1 1 0 01-1 1h-2a1 1 0 01-1-1V4z" />
              </svg>

              <span>Analytics</span>
            </Link>

          <button className="w-full bg-white text-primary-700 py-2 rounded-lg font-semibold hover:bg-primary-50 transition">
            Contact Support
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Top Bar */}
        <div className="bg-primary-600 border-b border-primary-700 px-8 py-4 flex items-center justify-between">
          <h1 className="text-white text-sm">Hello, admin!</h1>
          <div className="flex items-center gap-4">
            <form onSubmit={handleSearchSubmit} className="relative">
              <svg
                className="w-5 h-5 text-primary-300 absolute left-3 top-1/2 transform -translate-y-1/2"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                />
              </svg>
              <input
                type="text"
                placeholder="Search assets..."
                value={searchQuery}
                onChange={handleSearchChange}
                className="pl-10 pr-4 py-2 border border-primary-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-200 bg-primary-50 text-sm w-64 text-primary-900 placeholder-primary-400"
              />
            </form>
            <button
              onClick={() => {
                if (confirm("Are you sure you want to sign out?")) {
                  window.location.href = "/login";
                }
              }}
              className="flex items-center gap-2 px-3 py-2 text-gray-600 hover:text-red-600 hover:bg-red-50 rounded-lg transition"
              title="Sign Out"
            >
              <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
                />
              </svg>
              <span className="text-sm font-medium">Sign Out</span>
            </button>
          </div>
        </div>

        {/* Page Content */}
        <div className="flex-1 overflow-auto p-8">{children}</div>
      </div>
    </div>
  );
}
