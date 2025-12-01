import React from "react";
import type { Prize } from "../types";
import { AddPrizeDialog } from "./AddPrizeDialog";

const colors = {
  bg: "#FFFFFF",
  cardBg: "#FFFFFF",
  text: "#111827",
  textMuted: "#6B7280",
  primary: "#009A6F",
  promo: "#FFB800",
  danger: "#DC2626",
  border: "#E5E7EB",
};

const DEFAULT_SEGMENT_COLORS = [
  "#009A6F",
  "#FFB800",
  "#F97316",
  "#22C55E",
  "#6366F1",
  "#EC4899",
  "#0EA5E9",
];

type PrizeSetupScreenProps = {
  prizes: Prize[];
  onPrizesChange: (p: Prize[]) => void;

  wheelTitle: string;
  onWheelTitleChange: (title: string) => void;

  centerImageData: string | null;
  onCenterImageChange: (data: string | null) => void;

  settingsPassword: string;
  onSettingsPasswordChange: (pwd: string) => void;

  customColors: string[];
  onCustomColorsChange: (colors: string[]) => void;

  onGoToWheel?: () => void;
};

export const PrizeSetupScreen: React.FC<PrizeSetupScreenProps> = ({
  prizes,
  onPrizesChange,
  wheelTitle,
  onWheelTitleChange,
  centerImageData,
  onCenterImageChange,
  settingsPassword,
  onSettingsPasswordChange,
  customColors,
  onCustomColorsChange,
  onGoToWheel,
}) => {
  const [addDialogVisible, setAddDialogVisible] = React.useState(false);

  const fileInputRef = React.useRef<HTMLInputElement | null>(null);

  const handleDeletePrize = (id: string) => {
    const next = prizes.filter((p) => p.id !== id);
    onPrizesChange(next);
  };

  const handlePickCenterImageClick = () => {
    fileInputRef.current?.click();
  };

  const handleCenterImageFileChange: React.ChangeEventHandler<
    HTMLInputElement
  > = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = () => {
      const result = reader.result;
      if (typeof result === "string") {
        onCenterImageChange(result);
      }
    };
    reader.readAsDataURL(file);
  };

  const handleClearCenterImage = () => {
    onCenterImageChange(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const handleAddCustomColor = (hex: string) => {
    if (!hex) return;
    if (customColors.includes(hex)) return;
    onCustomColorsChange([...customColors, hex]);
  };

  const handleSaveNewPrizeFromDialog = (data: {
    label: string;
    count: number;
    imageData: string | null;
    segmentColor: string | null;
  }) => {
    const newPrize: Prize = {
      id: Date.now().toString(),
      label: data.label || "",
      count: data.count,
      imageData: data.imageData,
      segmentColor: data.segmentColor ?? undefined,
    };
    onPrizesChange([...prizes, newPrize]);
  };

  const titleValue =
    wheelTitle && wheelTitle.trim().length > 0
      ? wheelTitle
      : "Колело на наградите";

  return (
    <div
      style={{
        flex: 1,
        width: "100%",
        maxWidth: 900,
        margin: "0 auto",
        padding: 16,
        background: colors.bg,
        overflowY: "auto",
      }}
    >
      <h1
        style={{
          fontSize: 26,
          fontWeight: 600,
          color: colors.text,
          textAlign: "center",
          marginBottom: 12,
        }}
      >
        Настройки на наградите
      </h1>

      {/* Колело */}
      <div
        style={{
          marginBottom: 16,
          padding: 14,
          borderRadius: 16,
          background: colors.cardBg,
          border: `1px solid ${colors.border}`,
        }}
      >
        <h2 style={{ fontSize: 18, fontWeight: 600, color: colors.text }}>
          Колело
        </h2>

        <label
          style={{
            display: "block",
            marginTop: 8,
            marginBottom: 4,
            fontSize: 13,
            color: colors.textMuted,
          }}
        >
          Заглавие на колелото
        </label>
        <input
          value={titleValue}
          onChange={(e) => onWheelTitleChange(e.target.value)}
          style={{
            width: "100%",
            padding: "8px 10px",
            borderRadius: 8,
            border: `1px solid ${colors.border}`,
          }}
        />

        <label
          style={{
            display: "block",
            marginTop: 8,
            marginBottom: 4,
            fontSize: 13,
            color: colors.textMuted,
          }}
        >
          Централно изображение
        </label>
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <button
            type="button"
            onClick={handlePickCenterImageClick}
            style={{
              borderRadius: 999,
              border: `1px solid ${colors.border}`,
              padding: "8px 12px",
              background: "#F9FAFB",
              display: "flex",
              alignItems: "center",
              gap: 8,
              cursor: "pointer",
            }}
          >
            {centerImageData ? (
              <div
                style={{
                  width: 48,
                  height: 48,
                  borderRadius: 24,
                  overflow: "hidden",
                  border: `1px solid ${colors.border}`,
                  background: "#FFFFFF",
                }}
              >
                <img
                  src={centerImageData}
                  alt="Center"
                  style={{ width: "100%", height: "100%", objectFit: "cover" }}
                />
              </div>
            ) : (
              <span style={{ fontSize: 13, color: colors.textMuted }}>
                Избери изображение
              </span>
            )}
          </button>
          <input
            type="file"
            accept="image/*"
            ref={fileInputRef}
            style={{ display: "none" }}
            onChange={handleCenterImageFileChange}
          />
          {centerImageData && (
            <button
              type="button"
              onClick={handleClearCenterImage}
              style={{
                padding: "6px 10px",
                borderRadius: 999,
                border: `1px solid ${colors.border}`,
                background: "#FFFFFF",
                cursor: "pointer",
                fontSize: 12,
                color: colors.textMuted,
              }}
            >
              Премахни
            </button>
          )}
        </div>

        <label
          style={{
            display: "block",
            marginTop: 8,
            marginBottom: 4,
            fontSize: 13,
            color: colors.textMuted,
          }}
        >
          Парола за достъп до настройките
        </label>
        <input
          type="password"
          value={settingsPassword}
          onChange={(e) => onSettingsPasswordChange(e.target.value)}
          placeholder="Оставете празно, ако не искате парола"
          style={{
            width: "100%",
            padding: "8px 10px",
            borderRadius: 8,
            border: `1px solid ${colors.border}`,
          }}
        />
      </div>

      {/* Награди */}
      <div
        style={{
          marginBottom: 16,
          padding: 14,
          borderRadius: 16,
          background: colors.cardBg,
          border: `1px solid ${colors.border}`,
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <h2 style={{ fontSize: 18, fontWeight: 600, color: colors.text }}>
            Награди
          </h2>
          <button
            type="button"
            onClick={() => setAddDialogVisible(true)}
            style={{
              padding: "8px 16px",
              borderRadius: 999,
              border: "none",
              background: colors.primary,
              color: "#FFFFFF",
              fontWeight: 600,
              cursor: "pointer",
              fontSize: 14,
            }}
          >
            Нова награда
          </button>
        </div>

        {prizes.length === 0 ? (
          <p
            style={{
              marginTop: 12,
              fontSize: 14,
              color: colors.textMuted,
              textAlign: "center",
            }}
          >
            Все още няма добавени награди. Използвайте бутона „Нова награда“.
          </p>
        ) : (
          <div style={{ marginTop: 8 }}>
            {prizes.map((item) => (
              <div
                key={item.id}
                style={{
                  display: "flex",
                  alignItems: "center",
                  padding: "8px 10px",
                  borderRadius: 14,
                  marginBottom: 8,
                  background: colors.cardBg,
                  border: `1px solid ${colors.border}`,
                }}
              >
                <div
                  style={{
                    width: 12,
                    height: 12,
                    borderRadius: "50%",
                    marginRight: 8,
                    background: item.segmentColor || "#E5E7EB",
                    opacity: item.segmentColor ? 1 : 0.4,
                  }}
                />
                {item.imageData ? (
                  <img
                    src={item.imageData}
                    alt={item.label}
                    style={{
                      width: 36,
                      height: 36,
                      borderRadius: 10,
                      marginRight: 10,
                      objectFit: "cover",
                    }}
                  />
                ) : (
                  <div
                    style={{
                      width: 36,
                      height: 36,
                      borderRadius: 10,
                      marginRight: 10,
                      background: "#F9FAFB",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    <span style={{ fontSize: 20 }}>🎁</span>
                  </div>
                )}
                <div style={{ flex: 1 }}>
                  <div
                    style={{
                      fontSize: 16,
                      color: colors.text,
                      marginBottom: 2,
                    }}
                  >
                    {item.label}
                  </div>
                  <div
                    style={{
                      fontSize: 13,
                      fontWeight: 600,
                      color: colors.promo,
                    }}
                  >
                    Брой: {item.count}
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => handleDeletePrize(item.id)}
                  style={{
                    padding: "4px 8px",
                    borderRadius: 999,
                    border: "none",
                    background: colors.danger,
                    color: "#FFFFFF",
                    fontWeight: 700,
                    cursor: "pointer",
                    marginLeft: 8,
                  }}
                >
                  ✕
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      {onGoToWheel && (
        <button
          type="button"
          onClick={onGoToWheel}
          style={{
            width: "100%",
            padding: 10,
            borderRadius: 999,
            border: `1px solid ${colors.border}`,
            background: colors.cardBg,
            fontSize: 15,
            fontWeight: 500,
            cursor: "pointer",
          }}
        >
          Към колелото
        </button>
      )}

      <AddPrizeDialog
        visible={addDialogVisible}
        onClose={() => setAddDialogVisible(false)}
        onSave={handleSaveNewPrizeFromDialog}
        paletteColors={DEFAULT_SEGMENT_COLORS}
        customColors={customColors}
        onAddCustomColor={handleAddCustomColor}
      />
    </div>
  );
};
