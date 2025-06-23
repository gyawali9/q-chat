import React, { useState } from "react";

interface FormInputProps {
  type?: "text" | "email" | "password" | "textarea" | "checkbox";
  value: string | boolean;
  onChange: (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => void;
  placeholder?: string;
  required?: boolean;
  iconRight?: React.ReactNode; // optional icon (for example eye icon)
  className?: string;
  name?: string;
  rows?: number; // for textarea rows
  label?: React.ReactNode; // optional label (for checkbox)
}

const FormInput: React.FC<FormInputProps> = ({
  type = "text",
  value,
  onChange,
  placeholder,
  required = false,
  iconRight,
  className = "",
  name,
  rows,
  label,
}) => {
  const [showPassword, setShowPassword] = useState(false);

  // Determine input type (text/password toggle)
  const inputType =
    type === "password" ? (showPassword ? "text" : "password") : type;

  // For password fields, add toggle icon if no iconRight passed
  const passwordToggleIcon =
    type === "password" && !iconRight ? (
      <button
        type="button"
        onClick={() => setShowPassword((prev) => !prev)}
        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
        tabIndex={-1} // exclude from tab order
        aria-label={showPassword ? "Hide password" : "Show password"}
      >
        {showPassword ? (
          // Eye slash icon SVG
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            className="w-5 h-5"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M13.875 18.825A10.05 10.05 0 0112 19c-5.523 0-10-4.477-10-10 0-1.223.22-2.392.625-3.475M4.22 4.22l15.56 15.56M9.879 9.879A3 3 0 1114.121 14.12M9.879 9.879L4.22 4.22m15.56 15.56L14.12 14.121"
            />
          </svg>
        ) : (
          // Eye icon SVG
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            className="w-5 h-5"
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
        )}
      </button>
    ) : null;

  // Render textarea or input depending on type
  if (type === "textarea") {
    return (
      <textarea
        name={name}
        value={typeof value === "string" ? value : ""}
        onChange={onChange as React.ChangeEventHandler<HTMLTextAreaElement>}
        required={required}
        placeholder={placeholder}
        rows={rows}
        className={`p-2 border border-gray-500 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 w-full resize-none ${className}`}
      />
    );
  }

  // Render textarea or input depending on type
  if (type === "checkbox") {
    return (
      <label
        className={`inline-flex items-center cursor-pointer gap-2 ${className}`}
      >
        <input
          type="checkbox"
          name={name}
          // value is boolean for checkbox
          checked={typeof value === "boolean" ? value : false}
          onChange={onChange as React.ChangeEventHandler<HTMLInputElement>}
          required={required}
          className="form-checkbox h-5 w-5 text-indigo-600"
        />
        {label}
      </label>
    );
  }

  return (
    <div className="relative w-full">
      <input
        name={name}
        type={inputType}
        value={
          typeof value === "string" || typeof value === "number" ? value : ""
        }
        onChange={onChange as React.ChangeEventHandler<HTMLInputElement>}
        required={required}
        placeholder={placeholder}
        autoComplete="off"
        className={`p-2 ${
          iconRight || passwordToggleIcon ? "pr-10" : ""
        } border border-gray-500 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 w-full ${className}`}
      />
      {passwordToggleIcon}
    </div>
  );
};

export default FormInput;
