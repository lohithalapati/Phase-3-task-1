import React from "react";
import { useFormContext } from "react-hook-form";

export interface SelectOption {
  value: string;
  label: string;
}

export interface SelectFieldProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  name: string;
  label: string;
  options: SelectOption[];
  description?: string;
}

export const SelectField: React.FC<SelectFieldProps> = ({ name, label, options, description, ...props }) => {
  const {
    register,
    formState: { errors }
  } = useFormContext();

  const error = errors[name];
  const errorId = `${name}-error`;
  const descId = `${name}-desc`;
  const isInvalid = !!error;

  return (
    <div style={{ marginBottom: "1rem", display: "flex", flexDirection: "column" }}>
      <label htmlFor={name} style={{ fontWeight: "bold", marginBottom: "0.25rem" }}>
        {label}
      </label>
      {description && (
        <span id={descId} style={{ fontSize: "0.85rem", color: "#555", marginBottom: "0.25rem" }}>
          {description}
        </span>
      )}
      <select
        id={name}
        aria-invalid={isInvalid ? "true" : "false"}
        aria-describedby={`${error ? errorId : ""} ${description ? descId : ""}`.trim() || undefined}
        style={{
          padding: "0.5rem",
          borderRadius: "4px",
          border: isInvalid ? "2px solid #d32f2f" : "1px solid #ccc"
        }}
        {...register(name)}
        {...props}
      >
        <option value="">Select an option</option>
        {options.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>
      {isInvalid && (
        <span id={errorId} role="alert" style={{ color: "#d32f2f", fontSize: "0.85rem", marginTop: "0.25rem" }}>
          {error.message as string}
        </span>
      )}
    </div>
  );
};
