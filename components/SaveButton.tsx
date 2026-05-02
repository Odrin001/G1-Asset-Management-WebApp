"use client";

import toast from "react-hot-toast";

export default function SaveButton() {
  const handleSave = async () => {
    try {
      const loading = toast.loading("Saving...");

      // simulate API request
      await new Promise((resolve) => setTimeout(resolve, 2000));

      toast.success("Saved successfully!", { id: loading });
    } catch (error) {
      toast.error("Something went wrong!");
    }
  };

  return (
    <button
      onClick={handleSave}
      className="bg-blue-500 text-white px-4 py-2 rounded"
    >
      Save
    </button>
  );
}