import React from "react";
import { useFormContext } from "react-hook-form";

export interface InputFieldProps extends React.InputHTMLAttributes<HTMLInputElement> {
  name: string;
  label: string;
  description?: string;
}

export const InputField: React.FC<InputFieldProps> = ({ name, label, description, type = "text", ...props }) => {
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
      <input
        id={name}
        type={type}
        aria-invalid={isInvalid ? "true" : "false"}
        aria-describedby={`${error ? errorId : ""} ${description ? descId : ""}`.trim() || undefined}
        style={{
          padding: "0.5rem",
          borderRadius: "4px",
          border: isInvalid ? "2px solid #d32f2f" : "1px solid #ccc"
        }}
        {...register(name)}
        {...props}
      />
      {isInvalid && (
        <span id={errorId} role="alert" style={{ color: "#d32f2f", fontSize: "0.85rem", marginTop: "0.25rem" }}>
          {error.message as string}
        </span>
      )}
    </div>
  );
};
