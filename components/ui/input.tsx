import React from "react";

export default function Input({
  label,
  value,
  onChange,
  disabled,
  type = "text",
  placeholder,
  maxLength,
  inputMode,
}: {
  label: string;
  value?: string;
  onChange?: (v: string) => void;
  disabled?: boolean;
  type?: React.HTMLInputTypeAttribute;
  placeholder?: string;
  maxLength?: number;
  inputMode?: React.HTMLAttributes<HTMLInputElement>["inputMode"];
}) {
  return (
    <div className="space-y-1">
      <label className="text-sm text-gray-500">{label}</label>
      <input
        type={type}
        maxLength={maxLength}
        value={value || ""}
        disabled={disabled}
        placeholder={placeholder || ""}
        inputMode={inputMode}
        onChange={(e) => onChange?.(e.target.value)}
        className="w-full border border-gray-200 rounded-xl px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-primary hideNumberSpinnerStyles disabled:bg-gray-100"
      />
    </div>
  );
}