"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { Asset } from "@/lib/types";

export default function DashboardPage() {
  const [assets, setAssets] = useState<Asset[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedAsset, setSelectedAsset] = useState<any | null>(null);
  const [editingAsset, setEditingAsset] = useState<any | null>(null);
  const [toastMessage, setToastMessage] = useState("");
  
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
      const fetchAssets = async () => {
        setIsLoading(true);

        try {
          const response = await fetch("/api/rfid/tags");

          const data = await response.json();

          console.log("RFID TAGS:", data);

          if (!response.ok) {
            throw new Error("Failed to fetch RFID tags");
          }

          const formattedAssets = data.rfidTags.map((tag: any) => ({
            id: String(tag._id),

            name: tag.assetName,

            category: tag.category?.trim().toLowerCase(),

            location: tag.currentRoom,

            dateRegistered:
              tag.dateRegistered ||
              new Date(tag.createdAt)
                .toISOString()
                .split("T")[0],

            rfidUid: tag.uid,

            quantity: tag.quantity || 1,

            assetStatus: tag.assetStatus || "active",

            condition: tag.condition || "good",

            description: tag.description || "",

            createdAt: tag.createdAt,
          }));

          console.log("FORMATTED:", formattedAssets);

          setAssets(formattedAssets);
        } catch (error) {
          console.error("Error fetching RFID tags:", error);
        } finally {
          setIsLoading(false);
        }
      };

      fetchAssets();

      const handleSearchUpdate = (e: CustomEvent) => {
        setSearchQuery(e.detail);
      };

      window.addEventListener(
        "searchUpdate" as keyof WindowEventMap,
        handleSearchUpdate as EventListener
      );

      return () => {
        window.removeEventListener(
          "searchUpdate" as keyof WindowEventMap,
          handleSearchUpdate as EventListener
        );
      };
    }, []);

  // Filter assets based on search query and category
  const filteredAssets = assets.filter((asset) => {
    // Show Computer Hardware and Furniture categories (case insensitive)
    const category = asset.category.toLowerCase();
    if (category !== "computer hardware" && category !== "furniture") return false;
    
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
    <div className="space-y-8 p-8">
      {/* Header Section */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold text-gray-900">Assets Dashboard</h2>
          <p className="text-gray-600 text-lg mt-2">
            Manage all computer hardware and furniture assets
          </p>
        </div>
        <div className="flex items-center gap-4">
          <Link
            href="/register-asset"
            className="px-6 py-3 bg-red-600 text-white rounded-xl hover:bg-red-700 font-semibold transition-all shadow-sm hover:shadow-md flex items-center gap-3"
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
            Add Asset
          </Link>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-3 gap-6">
        <div className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-blue-50 rounded-lg">
              <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
              </svg>
            </div>
            <div>
              <p className="text-gray-600 text-sm font-medium">Total Assets</p>
              <p className="text-3xl font-bold text-gray-900 mt-1">{filteredAssets.length}</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-green-50 rounded-lg">
              <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div>
              <p className="text-gray-600 text-sm font-medium">Active Assets</p>
              <p className="text-3xl font-bold text-green-600 mt-1">
                {filteredAssets.filter((a) => a.assetStatus === "active").length}
              </p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-red-50 rounded-lg">
              <svg className="w-6 h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
              </svg>
            </div>
            <div>
              <p className="text-gray-600 text-sm font-medium">Maintenance Due</p>
              <p className="text-3xl font-bold text-red-600 mt-1">
                {filteredAssets.filter((a) => a.assetStatus === "maintenance").length}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Table Section */}
      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden shadow-sm">
        {/* Table Header with Action Buttons */}
        <div className="px-8 py-6 border-b border-gray-200 flex items-center justify-between bg-gray-50">
          <h3 className="font-semibold text-gray-900 text-lg">Assets</h3>
          <div className="flex gap-3">
            <button className="px-4 py-2 text-sm border border-gray-300 rounded-lg hover:bg-gray-100 transition-colors font-medium">
              Filter
            </button>
            <button className="px-4 py-2 text-sm border border-gray-300 rounded-lg hover:bg-gray-100 transition-colors font-medium">
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
                  <th className="px-8 py-4 text-left text-sm font-semibold text-gray-900">
                    Asset Name
                  </th>
                  <th className="px-8 py-4 text-left text-sm font-semibold text-gray-900">
                    Category
                  </th>
                  <th className="px-8 py-4 text-left text-sm font-semibold text-gray-900">
                    Date Registered
                  </th>
                  <th className="px-8 py-4 text-left text-sm font-semibold text-gray-900">
                    Location
                  </th>
                  <th className="px-8 py-4 text-left text-sm font-semibold text-gray-900">
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
                    className="border-b border-gray-200 hover:bg-gray-50 transition-colors"
                  >
                    <td className="px-8 py-5 text-sm text-gray-900 font-medium">
                      {asset.name}
                    </td>
                    <td className="px-8 py-5 text-sm text-gray-600">
                      {asset.category}
                    </td>
                    <td className="px-8 py-5 text-sm text-gray-600">
                      {asset.dateRegistered}
                    </td>
                    <td className="px-8 py-5 text-sm text-gray-600">
                      {asset.location}
                    </td>
                    <td className="px-8 py-5 text-sm">
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusBadgeClass(asset.assetStatus)}`}
                      >
                        {asset.assetStatus.charAt(0).toUpperCase() +
                          asset.assetStatus.slice(1)}
                      </span>
                    </td>
                    <td className="px-8 py-5 text-sm">
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-medium ${getConditionBadgeClass(asset.condition)}`}
                      >
                        {asset.condition.charAt(0).toUpperCase() +
                          asset.condition.slice(1)}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm flex gap-2">
                      <button
                        onClick={() => setSelectedAsset(asset)}
                        className="p-2 text-blue-600 hover:bg-blue-50 rounded transition"
                      >
                        <svg
                          className="w-4 h-4"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                          />
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                          />
                        </svg>
                      </button>
                      <button
                            onClick={() => setEditingAsset(asset)}
                            className="p-2 text-primary-600 hover:bg-primary-50 rounded transition"
                          >
                        <svg
                          className="w-4 h-4"
                          fill="currentColor"
                          viewBox="0 0 20 20"
                        >
                          <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
                        </svg>
                      </button>
                      <button
                        onClick={async () => {
                          if (
                            confirm(
                              "Are you sure you want to delete this asset?"
                            )
                          ) {
                            try {
                              // Determine if this is an RFID tag or regular asset
                                const res = await fetch(`/api/rfid/tags/${asset.id}`, {
                                  method: "DELETE",
                                });

                                if (res.ok) {
                                  const refreshed = await fetch("/api/rfid/tags");
                                  const refreshedData = await refreshed.json();

                                  const updatedAssets = refreshedData.rfidTags.map((tag: any) => ({
                                    id: String(tag._id),
                                    name: tag.assetName,
                                    category: tag.category?.trim().toLowerCase(),
                                    location: tag.currentRoom,
                                    dateRegistered:
                                      tag.dateRegistered ||
                                      new Date(tag.createdAt)
                                        .toISOString()
                                        .split("T")[0],
                                    rfidUid: tag.uid,
                                    quantity: tag.quantity || 1,
                                    assetStatus: tag.assetStatus || "active",
                                    condition: tag.condition || "good",
                                    description: tag.description || "",
                                    createdAt: tag.createdAt,
                                  }));

                                  setAssets(updatedAssets);
                                } else {
                                  alert("Failed to delete asset");
                                }
                            } catch (error) {
                              console.error("Error deleting asset:", error);
                              alert("Error deleting asset");
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
      {selectedAsset && (
  <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
    <div className="bg-white rounded-xl p-6 w-full max-w-lg shadow-xl">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-2xl font-bold text-gray-900">
          Asset Details
        </h2>

        <button
          onClick={() => setSelectedAsset(null)}
          className="text-gray-500 hover:text-gray-700 text-2xl"
        >
          ×
        </button>
      </div>

      <div className="space-y-4 text-sm">
        <div>
          <p className="font-semibold text-gray-700">Asset Name</p>
          <p className="text-gray-600">{selectedAsset.name}</p>
        </div>

        <div>
          <p className="font-semibold text-gray-700">RFID UID</p>
          <p className="text-gray-600">{selectedAsset.rfidUid}</p>
        </div>

        <div>
          <p className="font-semibold text-gray-700">Location</p>
          <p className="text-gray-600">{selectedAsset.location}</p>
        </div>

        <div>
          <p className="font-semibold text-gray-700">Status</p>
          <p className="text-gray-600">{selectedAsset.assetStatus}</p>
        </div>

        <div>
          <p className="font-semibold text-gray-700">Condition</p>
          <p className="text-gray-600">{selectedAsset.condition}</p>
        </div>

        <div>
          <p className="font-semibold text-gray-700">Description</p>
          <p className="text-gray-600">
            {selectedAsset.description || "No description provided"}
          </p>
        </div>
      </div>
    </div>
  </div>
)}
    {editingAsset && (
      <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
        <div className="bg-white rounded-xl p-6 w-full max-w-lg shadow-xl">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-2xl font-bold text-gray-900">
              Edit Asset
            </h2>

            <button
              onClick={() => setEditingAsset(null)}
              className="text-gray-500 hover:text-gray-700 text-2xl"
            >
              ×
            </button>
          </div>

  <div className="space-y-4">

    <div>
      <label className="block text-sm font-semibold text-gray-700 mb-2">
        Asset Name
      </label>

      <input
        type="text"
        value={editingAsset.name}
        onChange={(e) =>
          setEditingAsset({
            ...editingAsset,
            name: e.target.value,
          })
        }
        className="w-full border rounded-lg p-3"
        placeholder="Asset Name"
      />
    </div>

    <div>
      <label className="block text-sm font-semibold text-gray-700 mb-2">
        RFID UID
      </label>

      <input
        type="text"
        value={editingAsset.rfidUid}
        onChange={(e) =>
          setEditingAsset({
            ...editingAsset,
            rfidUid: e.target.value,
          })
        }
        className="w-full border rounded-lg p-3"
        placeholder="RFID UID"
      />
    </div>

    <div>
      <label className="block text-sm font-semibold text-gray-700 mb-2">
        Location
      </label>

      <input
        type="text"
        value={editingAsset.location}
        onChange={(e) =>
          setEditingAsset({
            ...editingAsset,
            location: e.target.value,
          })
        }
        className="w-full border rounded-lg p-3"
        placeholder="Location"
      />
    </div>

  <div>
    <label className="block text-sm font-semibold text-gray-700 mb-2">
      Quantity
    </label>

    <input
      type="number"
      value={editingAsset.quantity}
      onChange={(e) =>
        setEditingAsset({
          ...editingAsset,
          quantity: Number(e.target.value),
        })
      }
      className="w-full border rounded-lg p-3"
      placeholder="Quantity"
    />
  </div>

  <div>
    <label className="block text-sm font-semibold text-gray-700 mb-2">
      Category
    </label>

    <select
      value={editingAsset.category}
      onChange={(e) =>
        setEditingAsset({
          ...editingAsset,
          category: e.target.value,
        })
      }
      className="w-full border rounded-lg p-3"
    >
      <option value="computer hardware">
        Computer Hardware
      </option>

      <option value="furniture">
        Furniture
      </option>
    </select>
  </div>

  <div>
    <label className="block text-sm font-semibold text-gray-700 mb-2">
      Asset Status
    </label>

    <select
      value={editingAsset.assetStatus}
      onChange={(e) =>
        setEditingAsset({
          ...editingAsset,
          assetStatus: e.target.value,
        })
      }
      className="w-full border rounded-lg p-3"
    >
      <option value="active">Active</option>
      <option value="inactive">Inactive</option>
      <option value="maintenance">Maintenance</option>
      <option value="retired">Retired</option>
    </select>
  </div>

  <div>
    <label className="block text-sm font-semibold text-gray-700 mb-2">
      Condition
    </label>

    <select
      value={editingAsset.condition}
      onChange={(e) =>
        setEditingAsset({
          ...editingAsset,
          condition: e.target.value,
        })
      }
      className="w-full border rounded-lg p-3"
    >
      <option value="new">New</option>
      <option value="good">Good</option>
      <option value="fair">Fair</option>
      <option value="poor">Poor</option>
    </select>
  </div>

  <div>
    <label className="block text-sm font-semibold text-gray-700 mb-2">
      Description
    </label>

    <textarea
      value={editingAsset.description}
      onChange={(e) =>
        setEditingAsset({
          ...editingAsset,
          description: e.target.value,
        })
      }
      className="w-full border rounded-lg p-3"
      placeholder="Description"
      rows={4}
    />
  </div>

            <button
              onClick={async () => {
                try {
                  const res = await fetch(
                    `/api/rfid/tags/${editingAsset.id}`,
                    {
                      method: "PUT",
                      headers: {
                        "Content-Type": "application/json",
                      },
                      body: JSON.stringify(editingAsset),
                    }
                  );

                  if (res.ok) {
                    setAssets((prev) =>
                      prev.map((a) =>
                        a.id === editingAsset.id
                          ? editingAsset
                          : a
                      )
                    );

                    setEditingAsset(null);

                    setToastMessage("Asset updated successfully!");

                    setTimeout(() => {
                      setToastMessage("");
                    }, 3000);
                  } else {
                    alert("Failed to update asset");
                  }
                } catch (error) {
                  console.error(error);
                  alert("Error updating asset");
                }
              }}
              className="w-full bg-red-600 hover:bg-red-700 text-white py-3 rounded-lg font-semibold"
            >
              Save Changes
            </button>
          </div>
        </div>
      </div>
    )}
    
        {toastMessage && (
      <div className="fixed top-6 right-6 bg-green-600 text-white px-6 py-4 rounded-xl shadow-2xl z-[100] animate-pulse">
        <div className="flex items-center gap-3">
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
              d="M5 13l4 4L19 7"
            />
          </svg>

          <span className="font-medium">
            {toastMessage}
          </span>
        </div>
      </div>
    )}
    </div>
  );
}
