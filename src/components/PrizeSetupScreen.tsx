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
  "#FFFFFF",
  "#009A6F",
  "#0EA5E9",
  "#6366F1",
  "#F97316",
  "#FFB800",
  "#EC4899",
  "#22C55E",
];

type PrizeSetupScreenProps = {
  prizes: Prize[];
  onPrizesChange: (prizes: Prize[]) => void;

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

  const handleAddPrizeClick = () => {
    setAddDialogVisible(true);
  };

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
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleAddCustomColor = (hex: string) => {
    if (!hex) return;
    if (customColors.includes(hex)) return;
    onCustomColorsChange([...customColors, hex]);
  };

  const handleClearCustomColors = () => {
    onCustomColorsChange([]);
  };

  const handleSaveNewPrizeFromDialog = (data: {
    label: string;
    count: number;
    imageData: string | null;
    segmentColor: string | null;
  }) => {
    const newPrize: Prize = {
      id: Date.now().toString(),
      label: data.label.trim(), // без fallback „Награда“
      count: data.count,
      imageData: data.imageData,
      segmentColor: data.segmentColor ?? undefined,
    };

    onPrizesChange([...prizes, newPrize]);
    setAddDialogVisible(false);
  };

  return (
    <div
      style={{
        flex: 1,
        width: "100%",
        maxWidth: 960,
        margin: "0 auto",
        padding: 16,
        background: colors.bg,
        display: "flex",
        flexDirection: "column",
        gap: 16,
      }}
    >
      {/* Header */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: 4,
        }}
      >
        <h1
          style={{
            margin: 0,
            fontSize: 20,
            fontWeight: 700,
            color: colors.text,
          }}
        >
          Настройки на колелото
        </h1>

        {onGoToWheel && (
          <button
            type="button"
            onClick={onGoToWheel}
            style={{
              padding: "8px 14px",
              borderRadius: 999,
              border: "none",
              background: colors.primary,
              color: "#FFFFFF",
              fontWeight: 600,
              cursor: "pointer",
              fontSize: 14,
            }}
          >
            Към колелото
          </button>
        )}
      </div>

      {/* Заглавие + парола */}
      <div
        style={{
          display: "flex",
          flexWrap: "wrap",
          gap: 12,
        }}
      >
        <div
          style={{
            flex: 1,
            minWidth: 220,
            background: colors.cardBg,
            borderRadius: 12,
            padding: 12,
            border: `1px solid ${colors.border}`,
          }}
        >
          <div
            style={{
              fontSize: 13,
              fontWeight: 500,
              color: colors.text,
              marginBottom: 4,
            }}
          >
            Заглавие на колелото
          </div>
          <input
            value={wheelTitle}
            onChange={(e) => onWheelTitleChange(e.target.value)}
            style={{
              width: "100%",
              padding: "8px 10px",
              borderRadius: 8,
              border: `1px solid ${colors.border}`,
              fontSize: 14,
            }}
          />
        </div>

        <div
          style={{
            width: 260,
            background: colors.cardBg,
            borderRadius: 12,
            padding: 12,
            border: `1px solid ${colors.border}`,
          }}
        >
          <div
            style={{
              fontSize: 13,
              fontWeight: 500,
              color: colors.text,
              marginBottom: 4,
            }}
          >
            Парола за настройки
          </div>
          <input
            type="password"
            value={settingsPassword}
            onChange={(e) => onSettingsPasswordChange(e.target.value)}
            placeholder=""
            style={{
              width: "100%",
              padding: "8px 10px",
              borderRadius: 8,
              border: `1px solid ${colors.border}`,
              fontSize: 14,
            }}
          />
          <div
            style={{
              marginTop: 4,
              fontSize: 11,
              color: colors.textMuted,
            }}
          >
            Ако оставиш празно, екранът с настройки ще е свободно достъпен.
          </div>
        </div>
      </div>

      {/* Централна картинка */}
      <div
        style={{
          display: "flex",
          flexWrap: "wrap",
          gap: 12,
        }}
      >
        <div
          style={{
            flex: 1,
            minWidth: 260,
            background: colors.cardBg,
            borderRadius: 12,
            padding: 12,
            border: `1px solid ${colors.border}`,
            display: "flex",
            alignItems: "center",
            gap: 12,
          }}
        >
          <div
            style={{
              width: 72,
              height: 72,
              borderRadius: "50%",
              overflow: "hidden",
              border: `1px solid ${colors.border}`,
              background: "#F9FAFB",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: 32,
            }}
          >
            {centerImageData ? (
              <img
                src={centerImageData}
                alt="Center"
                style={{
                  width: "100%",
                  height: "100%",
                  objectFit: "cover",
                }}
              />
            ) : (
              ""
            )}
          </div>

          <div
            style={{
              display: "flex",
              flexDirection: "column",
              gap: 6,
              flex: 1,
            }}
          >
            <div
              style={{
                fontSize: 13,
                fontWeight: 500,
                color: colors.text,
              }}
            >
              Картинка в центъра
            </div>
            <div
              style={{
                fontSize: 12,
                color: colors.textMuted,
              }}
            >
              По желание – лого на търговския център или бранда.
            </div>

            <div
              style={{
                display: "flex",
                gap: 8,
                marginTop: 4,
              }}
            >
              <button
                type="button"
                onClick={handlePickCenterImageClick}
                style={{
                  padding: "6px 12px",
                  borderRadius: 999,
                  border: "none",
                  background: "#E5E7EB",
                  cursor: "pointer",
                  fontSize: 13,
                }}
              >
                Избери файл…
              </button>
              {centerImageData && (
                <button
                  type="button"
                  onClick={handleClearCenterImage}
                  style={{
                    padding: "6px 12px",
                    borderRadius: 999,
                    border: "none",
                    background: "#F3F4F6",
                    cursor: "pointer",
                    fontSize: 12,
                    color: colors.textMuted,
                  }}
                >
                  Изчисти
                </button>
              )}
            </div>

            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              style={{ display: "none" }}
              onChange={handleCenterImageFileChange}
            />
          </div>
        </div>
      </div>

      {/* Списък с награди */}
      <div
        style={{
          background: colors.cardBg,
          borderRadius: 12,
          padding: 12,
          border: `1px solid ${colors.border}`,
          marginTop: 4,
        }}
      >
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: 8,
          }}
        >
          <div
            style={{
              fontSize: 14,
              fontWeight: 600,
              color: colors.text,
            }}
          >
            Награди
          </div>
          <button
            type="button"
            onClick={handleAddPrizeClick}
            style={{
              padding: "6px 12px",
              borderRadius: 999,
              border: "none",
              background: colors.primary,
              color: "#FFFFFF",
              fontSize: 13,
              fontWeight: 600,
              cursor: "pointer",
            }}
          >
            + Добави награда
          </button>
        </div>

        {prizes.length === 0 ? (
          <div
            style={{
              fontSize: 13,
              color: colors.textMuted,
            }}
          >
            Все още няма добавени награди.
          </div>
        ) : (
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              gap: 6,
            }}
          >
            {prizes.map((p) => (
              <div
                key={p.id}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 8,
                  padding: "6px 8px",
                  borderRadius: 8,
                  border: `1px solid ${colors.border}`,
                }}
              >
                {/* цвят */}
                <div
                  style={{
                    width: 20,
                    height: 20,
                    borderRadius: "50%",
                    background: p.segmentColor || "#CBD5F5",
                    border: "1px solid rgba(0,0,0,0.1)",
                  }}
                />

                {/* картинка */}
                <div
                  style={{
                    width: 40,
                    height: 40,
                    borderRadius: 8,
                    overflow: "hidden",
                    border: `1px solid ${colors.border}`,
                    background: "#F9FAFB",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: 20,
                    flexShrink: 0,
                  }}
                >
                  {p.imageData ? (
                    <img
                      src={p.imageData}
                      alt={p.label || "Награда"}
                      style={{
                        width: "100%",
                        height: "100%",
                        objectFit: "cover",
                      }}
                    />
                  ) : (
                    "🎁"
                  )}
                </div>

                {/* текст */}
                <div
                  style={{
                    flex: 1,
                    minWidth: 0,
                  }}
                >
                  <div
                    style={{
                      fontSize: 14,
                      fontWeight: 600,
                      color: colors.text,
                      whiteSpace: "nowrap",
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                    }}
                  >
                    {p.label && p.label.trim().length > 0 ? p.label : ""}
                  </div>
                  <div
                    style={{
                      fontSize: 12,
                      color: colors.textMuted,
                    }}
                  >
                    Брой: {p.count}
                  </div>
                </div>

                {/* бутони */}
                <button
                  type="button"
                  onClick={() => handleDeletePrize(p.id)}
                  style={{
                    padding: "4px 8px",
                    borderRadius: 999,
                    border: "none",
                    background: "#FEE2E2",
                    color: colors.danger,
                    fontSize: 12,
                    cursor: "pointer",
                  }}
                >
                  Изтрий
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Диалог за добавяне на награда */}
      <AddPrizeDialog
        visible={addDialogVisible}
        onClose={() => setAddDialogVisible(false)}
        onSave={handleSaveNewPrizeFromDialog}
        paletteColors={DEFAULT_SEGMENT_COLORS}
        customColors={customColors}
        onAddCustomColor={handleAddCustomColor}
        onClearCustomColors={handleClearCustomColors}
      />
    </div>
  );
};
