import React, { useState } from "react";

type PasswordDialogProps = {
  visible: boolean;
  requiredPassword: string;
  onSuccess: () => void;
  onCancel: () => void;
};

const colors = {
  text: "#111827",
  textMuted: "#6B7280",
  danger: "#DC2626",
  border: "#E5E7EB",
  bg: "#FFFFFF",
  primary: "#009A6F",
};

export const PasswordDialog: React.FC<PasswordDialogProps> = ({
  visible,
  requiredPassword,
  onSuccess,
  onCancel,
}) => {
  const [enteredPassword, setEnteredPassword] = useState("");
  const [error, setError] = useState("");

  if (!visible || !requiredPassword.trim()) return null;

  const handleClose = () => {
    setEnteredPassword("");
    setError("");
    onCancel();
  };

  const handleConfirm = () => {
    if (enteredPassword === requiredPassword.trim()) {
      setEnteredPassword("");
      setError("");
      onSuccess();
    } else {
      setError("Невалидна парола.");
    }
  };

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        background: "rgba(0,0,0,0.35)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        zIndex: 1000,
      }}
      onClick={handleClose}
    >
      <div
        style={{
          width: "100%",
          maxWidth: 360,
          maxHeight: "80vh",
          margin: "0 16px",
          borderRadius: 16,
          padding: 16,
          background: colors.bg,
          border: `1px solid ${colors.border}`,
          overflowY: "auto",
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <h2 style={{ fontSize: 20, fontWeight: 700, color: colors.text }}>
          Парола за настройки
        </h2>
        <p style={{ fontSize: 13, color: colors.textMuted }}>
          Въведете паролата, за да отворите екрана с настройки.
        </p>

        <input
          type="password"
          value={enteredPassword}
          onChange={(e) => {
            setEnteredPassword(e.target.value);
            if (error) setError("");
          }}
          placeholder="Парола"
          style={{
            width: "100%",
            marginTop: 8,
            padding: "8px 10px",
            borderRadius: 8,
            border: `1px solid ${colors.border}`,
          }}
        />

        {error && (
          <div
            style={{
              marginTop: 6,
              fontSize: 13,
              color: colors.danger,
            }}
          >
            {error}
          </div>
        )}

        <div
          style={{
            display: "flex",
            gap: 8,
            marginTop: 12,
            justifyContent: "flex-end",
          }}
        >
          <button
            type="button"
            onClick={handleClose}
            style={{
              flex: 1,
              padding: 10,
              borderRadius: 999,
              background: "#FFFFFF",
              border: `1px solid ${colors.border}`,
              cursor: "pointer",
            }}
          >
            Отказ
          </button>
          <button
            type="button"
            onClick={handleConfirm}
            style={{
              flex: 1,
              padding: 10,
              borderRadius: 999,
              background: colors.primary,
              border: "none",
              color: "#FFFFFF",
              fontWeight: 600,
              cursor: "pointer",
            }}
          >
            ОК
          </button>
        </div>
      </div>
    </div>
  );
};
