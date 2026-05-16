"use client";

import Link from "next/link";
import { useState, useRef } from "react";
import { useRouter } from "next/navigation";
import { Card, CardBody, CardHeader, Input, Select, Textarea, Button } from "@/components";
import { 
  validateAssetForm
} from "@/lib/utils";

export default function RegisterAssetPage() {
  const router = useRouter();
  const formRef = useRef<HTMLFormElement>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const [formData, setFormData] = useState({
    assetType: "",
    name: "",
    category: "",
    quantity: "1",
    location: "",
    dateRegistered: new Date().toISOString().split("T")[0],
    dateRemoved: "",
    assetStatus: "active",
    condition: "",
    rfidUid: "",
    description: "",
  });

  const handleInputChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { id, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [id]: value,
    }));
  };

  const handleSubmit = async (e: React.SyntheticEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    // Validate form using centralized validation
    const validationError = validateAssetForm(formData);
    if (validationError) {
      setError(validationError);
      setIsLoading(false);
      return;
    }

    try {
      const res = await fetch("/api/rfid/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          uid: formData.rfidUid.trim(),
          assetName: formData.name.trim(),
          category: formData.category.trim(),
          currentRoom: formData.location.trim(),
          quantity: Number.parseInt(formData.quantity) || 1,
          assetStatus: formData.assetStatus,
          condition: formData.condition,
          description: formData.description.trim() || undefined,
          dateRegistered: formData.dateRegistered,
          dateRemoved: formData.dateRemoved || undefined,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.message || "Failed to register asset");
        setIsLoading(false);
        return;
      }

      // Reset form
      if (formRef.current) {
        formRef.current.reset();
      }

      // Redirect to furniture page to see the newly registered asset
      setTimeout(() => {
        router.push("/furniture");
      }, 500);
    } catch (err) {
      setError("Failed to register asset. Please try again.");
      console.error("Error registering asset:", err);
      setIsLoading(false);
    }
  };

  const assetTypeOptions = [
    { value: "computer", label: "Computer Hardware" },
    { value: "furniture", label: "Furniture" },
    { value: "equipment", label: "Equipment" },
  ];

  const conditionOptions = [
    { value: "new", label: "New" },
    { value: "good", label: "Good" },
    { value: "fair", label: "Fair" },
    { value: "poor", label: "Poor" },
  ];

  const statusOptions = [
    { value: "active", label: "Active" },
    { value: "inactive", label: "Inactive" },
    { value: "maintenance", label: "In Maintenance" },
    { value: "retired", label: "Retired" },
  ];

  return (
    <div className="space-y-6">
      {/* Header Section */}
      <div className="flex items-center gap-4">
        <Link
          href="/dashboard"
          className="p-2 hover:bg-gray-200 rounded-lg transition"
        >
          <svg
            className="w-6 h-6 text-gray-600"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M15 19l-7-7 7-7"
            />
          </svg>
        </Link>
        <div>
          <h2 className="text-3xl font-bold text-gray-900">Register Asset</h2>
          <p className="text-gray-500 text-sm mt-1">Add a new asset to the system</p>
        </div>
      </div>

      {/* Error Message */}
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
          {error}
        </div>
      )}

      {/* Form Section */}
      <form ref={formRef} onSubmit={handleSubmit} className="space-y-6">
        {/* Basic Information Section */}
        <Card>
          <CardHeader
            title="Basic Information"
            icon={
              <svg
                className="w-5 h-5 text-primary-600"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
              </svg>
            }
          />
          <CardBody>
            <div className="space-y-4">
              <Select
                label="Asset Type"
                id="assetType"
                value={formData.assetType}
                onChange={handleInputChange}
                options={assetTypeOptions}
                required
                helperText="Select the primary type of asset"
                icon={
                  <svg
                    className="w-4 h-4"
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
                }
              />

              <Input
                label="Asset Name"
                type="text"
                id="name"
                placeholder="e.g., Dell Laptop, Office Chair"
                value={formData.name}
                onChange={handleInputChange}
                required
                helperText="Enter the descriptive name or model of the asset"
                icon={
                  <svg
                    className="w-4 h-4"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path d="M4 4a2 2 0 00-2 2v4a2 2 0 002 2V6h10a2 2 0 00-2-2H4z" />
                    <path
                      fillRule="evenodd"
                      d="M2 8a2 2 0 012-2h12a2 2 0 012 2v8a2 2 0 01-2 2H4a2 2 0 01-2-2V8zm12-1a1 1 0 00-1 1v3a1 1 0 002 0V8a1 1 0 00-1-1z"
                      clipRule="evenodd"
                    />
                  </svg>
                }
              />

              <div className="grid grid-cols-2 gap-4">
                  <Select
                    label="Category"
                    id="category"
                    value={formData.category}
                    onChange={handleInputChange}
                    options={[
                      {
                        value: "computer hardware",
                        label: "Computer Hardware",
                      },
                      {
                        value: "furniture",
                        label: "Furniture",
                      },
                    ]}
                    required
                    helperText="Select asset category"
                    icon={
                      <svg
                        className="w-4 h-4"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path d="M5 3a2 2 0 00-2 2v2a2 2 0 002 2h2a2 2 0 002-2V5a2 2 0 00-2-2H5zM15 3a2 2 0 00-2 2v2a2 2 0 002 2h2a2 2 0 002-2V5a2 2 0 00-2-2h-2zM5 13a2 2 0 00-2 2v2a2 2 0 002 2h2a2 2 0 002-2v-2a2 2 0 00-2-2H5zM15 13a2 2 0 00-2 2v2a2 2 0 002 2h2a2 2 0 002-2v-2a2 2 0 00-2-2h-2z" />
                      </svg>
                    }
          />

                <Input
                  label="Quantity"
                  type="number"
                  id="quantity"
                  placeholder="1"
                  value={formData.quantity}
                  onChange={handleInputChange}
                  min="1"
                  helperText="Number of items"
                  icon={
                    <svg
                      className="w-4 h-4"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fillRule="evenodd"
                        d="M12 7a1 1 0 110-2h.01a1 1 0 110 2H12zm-2 2a1 1 0 100-2 1 1 0 000 2zm4 2a1 1 0 110-2h.01a1 1 0 110 2H14zm-6 2a1 1 0 100-2 1 1 0 000 2zm0 2a1 1 0 100-2 1 1 0 000 2z"
                        clipRule="evenodd"
                      />
                    </svg>
                  }
                />
              </div>
            </div>
          </CardBody>
        </Card>

        {/* Asset Details Section */}
        <Card>
          <CardHeader
            title="Asset Details"
            icon={
              <svg
                className="w-5 h-5 text-primary-600"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path
                  fillRule="evenodd"
                  d="M11.49 3.17c-.38-1.56-2.6-1.56-2.98 0a1.532 1.532 0 01-2.286.948c-1.372-.836-2.942.734-2.106 2.106.54.886.061 2.042-.947 2.287-1.561.379-1.561 2.6 0 2.978a1.532 1.532 0 01.947 2.287c-.836 1.372.734 2.942 2.106 2.106a1.532 1.532 0 012.287.947c.379 1.561 2.6 1.561 2.978 0a1.533 1.533 0 012.287-.947c1.372.836 2.942-.734 2.106-2.106a1.533 1.533 0 01.947-2.287c1.561-.379 1.561-2.6 0-2.978a1.532 1.532 0 01-.947-2.287c.836-1.372-.734-2.942-2.106-2.106a1.532 1.532 0 01-2.287-.947zm-3.08 5.601a1 1 0 100-2 1 1 0 000 2z"
                  clipRule="evenodd"
                />
              </svg>
            }
          />
          <CardBody>
            <div className="space-y-4">
              <Input
                label="Location"
                type="text"
                id="location"
                placeholder="e.g., Room 101, Lab A, Building 2"
                value={formData.location}
                onChange={handleInputChange}
                required
                icon={
                  <svg
                    className="w-4 h-4"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z"
                      clipRule="evenodd"
                    />
                  </svg>
                }
              />

              <div className="grid grid-cols-2 gap-4">
                <Input
                  label="Date Registered"
                  type="date"
                  id="dateRegistered"
                  value={formData.dateRegistered}
                  onChange={handleInputChange}
                  max={new Date().toISOString().split("T")[0]} //Limiting Date Pickers to Current Dates 
                  required
                  helperText="When the asset was registered"
                  icon={
                    <svg
                      className="w-4 h-4"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fillRule="evenodd"
                        d="M6 2a1 1 0 00-1 1v2H4a2 2 0 00-2 2v2h16V7a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v2H7V3a1 1 0 00-1-1zm0 5a2 2 0 002 2h8a2 2 0 002-2H6z"
                        clipRule="evenodd"
                      />
                    </svg>
                  }
                />

                <Input
                  label="Date Removed"
                  type="date"
                  id="dateRemoved"
                  value={formData.dateRemoved}
                  onChange={handleInputChange}
                  max={new Date().toISOString().split("T")[0]} //Limiting Date Pickers to Current Date 
                  helperText="Optional - when asset was removed"
                  icon={
                    <svg
                      className="w-4 h-4"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fillRule="evenodd"
                        d="M6 2a1 1 0 00-1 1v2H4a2 2 0 00-2 2v2h16V7a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v2H7V3a1 1 0 00-1-1zm0 5a2 2 0 002 2h8a2 2 0 002-2H6z"
                        clipRule="evenodd"
                      />
                    </svg>
                  }
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <Select
                  label="Asset Status"
                  id="assetStatus"
                  value={formData.assetStatus}
                  onChange={handleInputChange}
                  options={statusOptions}
                  required
                  helperText="Current operational status"
                  icon={
                    <svg
                      className="w-4 h-4"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fillRule="evenodd"
                        d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                        clipRule="evenodd"
                      />
                    </svg>
                  }
                />

                <Select
                  label="Condition"
                  id="condition"
                  value={formData.condition}
                  onChange={handleInputChange}
                  options={conditionOptions}
                  required
                  helperText="Physical condition of the asset"
                  icon={
                    <svg
                      className="w-4 h-4"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                  }
                />
              </div>
            </div>
          </CardBody>
        </Card>

        {/* Additional Information Section */}
        <Card>
          <CardHeader
            title="Additional Information"
            icon={
              <svg
                className="w-5 h-5 text-primary-600"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path
                  fillRule="evenodd"
                  d="M18 5v8a2 2 0 01-2 2h-5l-5 4v-4H4a2 2 0 01-2-2V5a2 2 0 012-2h12a2 2 0 012 2zm-11-1a1 1 0 11-2 0 1 1 0 012 0z"
                  clipRule="evenodd"
                />
              </svg>
            }
          />
          <CardBody>
            <div className="space-y-4">
              <Input
                label="RFID UID"
                type="text"
                id="rfidUid"
                placeholder="Scan or enter UID"
                value={formData.rfidUid}
                onChange={handleInputChange}
                required
                helperText="Required - Unique identifier for RFID tracking"
                icon={
                  <svg
                    className="w-4 h-4"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M3 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z"
                      clipRule="evenodd"
                    />
                  </svg>
                }
              />

              <Textarea
                label="Notes / Description"
                id="description"
                placeholder="Add any additional information about this asset..."
                value={formData.description}
                onChange={handleInputChange}
                helperText="Optional - any additional details to remember"
                icon={
                  <svg
                    className="w-4 h-4"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M4 4a2 2 0 00-2 2v4a2 2 0 002 2V6h10a2 2 0 00-2-2H4zm2 6a2 2 0 012-2h8a2 2 0 012 2v4a2 2 0 01-2 2H8a2 2 0 01-2-2v-4zm6 4a2 2 0 100-4 2 2 0 000 4z"
                      clipRule="evenodd"
                    />
                  </svg>
                }
              />
            </div>
          </CardBody>
        </Card>

        {/* Buttons */}
        <div className="flex gap-4 justify-end">
          <Link href="/dashboard">
            <Button variant="secondary">Cancel</Button>
          </Link>
          <Button type="submit" loading={isLoading}>
            Register Asset
          </Button>
        </div>
      </form>
    </div>
  );
}
