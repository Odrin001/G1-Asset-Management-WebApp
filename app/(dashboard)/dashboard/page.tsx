"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { assetUtils } from "@/lib/utils";
import { Asset } from "@/lib/types";
import toast from "react-hot-toast";

export default function DashboardPage() {
  const [assets, setAssets] = useState<Asset[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");

  const getStatusBadgeClass = (status: string): string => {
    switch (status) {
      case "active":
        return "bg-green-100 text-green-800";
      case "maintenance":
        return "bg-yellow-100 text-yellow-800";
      case "inactive":
        return "bg-gray-100 text-gray-800";
      default:
        return "bg-red-100 text-red-800";
    }
  };

  const getConditionBadgeClass = (condition: string): string => {
    switch (condition) {
      case "new":
        return "bg-blue-100 text-blue-800";
      case "good":
        return "bg-green-100 text-green-800";
      case "fair":
        return "bg-yellow-100 text-yellow-800";
      default:
        return "bg-red-100 text-red-800";
    }
  };

  useEffect(() => {
    // Load assets from localStorage
    setIsLoading(true);
    const loadedAssets = assetUtils.getAssets();
    setAssets(loadedAssets);
    setIsLoading(false);

    // Listen for search updates from layout
    const handleSearchUpdate = (e: CustomEvent) => {
      setSearchQuery(e.detail);
    };
    window.addEventListener("searchUpdate" as keyof WindowEventMap, handleSearchUpdate as EventListener);
    
    return () => {
      window.removeEventListener("searchUpdate" as keyof WindowEventMap, handleSearchUpdate as EventListener);
    };
  }, []);

  // Filter assets based on search query and category
  const filteredAssets = assets.filter((asset) => {
    // Only show Computer Hardware category
    if (asset.category !== "Computer Hardware") return false;
    
    if (!searchQuery) return true;
    const query = searchQuery.toLowerCase();
    return (
      asset.name?.toLowerCase().includes(query) ||
      asset.category?.toLowerCase().includes(query) ||
      asset.location?.toLowerCase().includes(query) ||
      asset.assetType?.toLowerCase().includes(query)
    );
  });

  return (
    <div className="space-y-6">
      {/* Header Section */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold text-gray-900">Computer Hardware</h2>
          <p className="text-gray-500 text-sm mt-1">
            Manage all computer hardware assets
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Link
            href="/register-asset"
            className="px-4 py-2 bg-primary-500 text-white rounded-lg hover:bg-primary-600 font-medium transition flex items-center gap-2"
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
                d="M12 4v16m8-8H4"
              />
            </svg>
            Add
          </Link>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-3 gap-4">
        <div className="bg-white rounded-lg p-4 border border-gray-200">
          <p className="text-gray-500 text-sm">Total Assets</p>
          <p className="text-3xl font-bold text-gray-900 mt-2">{filteredAssets.length}</p>
        </div>
        <div className="bg-white rounded-lg p-4 border border-gray-200">
          <p className="text-gray-500 text-sm">Active Assets</p>
          <p className="text-3xl font-bold text-primary-500 mt-2">
            {filteredAssets.filter((a) => a.assetStatus === "active").length}
          </p>
        </div>
        <div className="bg-white rounded-lg p-4 border border-gray-200">
          <p className="text-gray-500 text-sm">Good Condition</p>
          <p className="text-3xl font-bold text-green-600 mt-2">
            {filteredAssets.filter((a) => a.condition === "good" || a.condition === "new").length}
          </p>
        </div>
      </div>

      {/* Table Section */}
      <div className="bg-white rounded-lg border border-gray-200 overflow-hidden shadow-sm">
        {/* Table Header with Action Buttons */}
        <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between bg-gray-50">
          <h3 className="font-semibold text-gray-900">Assets</h3>
          <div className="flex gap-2">
            <button className="px-3 py-1 text-sm border border-gray-300 rounded hover:bg-gray-100 transition">
              Filter
            </button>
            <button className="px-3 py-1 text-sm border border-gray-300 rounded hover:bg-gray-100 transition">
              Sort
            </button>
          </div>
        </div>

        {/* Loading State */}
        {isLoading && (
          <div className="px-6 py-16 text-center">
            <svg
              className="w-8 h-8 text-primary-500 mx-auto mb-4 animate-spin"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 1v6m4.22-4.22l-4.24 4.24m0 0l-4.24-4.24M16.22 6.78l-4.24 4.24"
              />
            </svg>
            <p className="text-gray-500">Loading assets...</p>
          </div>
        )}

        {/* Table */}
        {!isLoading && filteredAssets.length > 0 && (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200 bg-gray-50">
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                    Name
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                    Category
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                    Date Registered
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                    Location
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                    Condition
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody>
                {filteredAssets.map((asset) => (
                  <tr
                    key={asset.id}
                    className="border-b border-gray-200 hover:bg-gray-50 transition"
                  >
                    <td className="px-6 py-4 text-sm text-gray-900 font-medium">
                      {asset.name}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-600">
                      {asset.category}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-600">
                      {asset.dateRegistered}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-600">
                      {asset.location}
                    </td>
                    <td className="px-6 py-4 text-sm">
                      <span
                        className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusBadgeClass(asset.assetStatus)}`}
                      >
                        {asset.assetStatus.charAt(0).toUpperCase() +
                          asset.assetStatus.slice(1)}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm">
                      <span
                        className={`px-2 py-1 rounded-full text-xs font-medium ${getConditionBadgeClass(asset.condition)}`}
                      >
                        {asset.condition.charAt(0).toUpperCase() +
                          asset.condition.slice(1)}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm flex gap-2">
                      <button className="p-2 text-primary-600 hover:bg-primary-50 rounded transition">
                        <svg
                          className="w-4 h-4"
                          fill="currentColor"
                          viewBox="0 0 20 20"
                        >
                          <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
                        </svg>
                      </button>
                      <button
                        onClick={ async () => {
                          if (confirm("Are you sure you want to delete this asset?")) {
                            const toastId = toast.loading("Deleting asset...");
                            
                            try{
                              // Simulate API call delay
                              await new Promise((resolve) => setTimeout(resolve, 1000));

                              assetUtils.deleteAsset(asset.id);
                              setAssets(assetUtils.getAssets());

                              toast.success("Asset deleted!", { id: toastId });
                            } catch (error) {
                              toast.error("Failed to delete asset.", { id: toastId });
                            }
                          } 
                        }}
                        
                        className="p-2 text-red-600 hover:bg-red-50 rounded transition"
                      >
                        <svg
                          className="w-4 h-4"
                          fill="currentColor"
                          viewBox="0 0 20 20"
                        >
                          <path
                            fillRule="evenodd"
                            d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z"
                            clipRule="evenodd"
                          />
                        </svg>
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Empty State */}
        {!isLoading && filteredAssets.length === 0 && (
          <div className="px-6 py-16 text-center">
            {searchQuery ? (
              <>
                <svg
                  className="w-12 h-12 text-gray-300 mx-auto mb-4"
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
                <p className="text-gray-500 mb-4">No assets found for "{searchQuery}"</p>
                <button
                  onClick={() => {
                    setSearchQuery("");
                    window.dispatchEvent(new CustomEvent("searchUpdate", { detail: "" }));
                  }}
                  className="text-primary-600 hover:text-primary-700 font-medium"
                >
                  Clear search
                </button>
              </>
            ) : (
            <Link
              href="/register-asset"
              className="inline-flex items-center gap-2 px-4 py-2 bg-primary-500 text-white rounded-lg hover:bg-primary-600 transition"
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
                  d="M12 4v16m8-8H4"
                />
              </svg>
              Register Your First Asset
            </Link>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
