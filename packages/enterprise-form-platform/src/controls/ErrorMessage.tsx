import React from "react";

export interface ErrorMessageProps {
  message: string | null;
}

export const ErrorMessage: React.FC<ErrorMessageProps> = ({ message }) => {
  if (!message) return null;
  return (
    <div
      role="alert"
      style={{
        padding: "0.75rem",
        backgroundColor: "#fde8e8",
        borderLeft: "4px solid #f05252",
        color: "#9b1c1c",
        marginBottom: "1rem",
        borderRadius: "4px"
      }}
    >
      <span style={{ fontWeight: "bold" }}>Submit Error: </span>
      {message}
    </div>
  );
};
