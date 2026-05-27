import React from "react";

interface InputProps {
  label?: string;
  type?: string;
  id: string;
  placeholder?: string;
  icon?: React.ReactNode;
  required?: boolean;
  helperText?: string;
  error?: string;
  value?: string | number;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  className?: string;
  labelClassName?: string;

  max?: string;
  min?: string;
}

/**
 * Input - Reusable text input component
 * Supports email, password, text, date, number types
 */
export function Input({
  label,
  type = "text",
  id,
  placeholder,
  icon,
  required,
  helperText,
  error,
  value,
  onChange,
  className = "",
  labelClassName = "",
  max,
  min,
}: Readonly<InputProps>) {
  return (
    <div>
      {label && (
        <div className="flex items-center gap-2 mb-2">
          {icon && <span className="text-gray-500">{icon}</span>}
          <label htmlFor={id} className={`text-sm font-semibold text-gray-900 ${labelClassName}`}>
            {label}
            {required && <span className="text-red-500 ml-1">*</span>}
          </label>
        </div>
      )}
      <input
        type={type}
        id={id}
        placeholder={placeholder}
        value={value || ""}
        onChange={onChange}
        max={max}   
        min={min}   
        className={`w-full px-4 py-3 text-black border rounded-lg focus:outline-none focus:ring-2 focus:border-transparent transition ${
          error
            ? "border-red-300 focus:ring-red-500"
            : "border-gray-300 focus:ring-primary-500"
        } ${className}`}
      />
      {error && <p className="text-xs text-red-500 mt-1">{error}</p>}
      {helperText && !error && (
        <p className="text-xs text-gray-500 mt-1">{helperText}</p>
      )}
    </div>
  );
}
