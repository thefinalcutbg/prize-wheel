import React, { useEffect, useRef, useState } from "react";

type AddPrizeDialogProps = {
  visible: boolean;
  onClose: () => void;
  onSave: (data: {
    label: string;
    count: number;
    imageData: string | null;
    segmentColor: string | null;
  }) => void;
  paletteColors: string[];
  customColors: string[];
  onAddCustomColor: (hex: string) => void;
  onClearCustomColors: () => void;
};

const colors = {
  cardBg: "#FFFFFF",
  text: "#111827",
  textMuted: "#6B7280",
  primary: "#009A6F",
  border: "#E5E7EB",
  danger: "#DC2626",
};

export const AddPrizeDialog: React.FC<AddPrizeDialogProps> = ({
  visible,
  onClose,
  onSave,
  paletteColors,
  customColors,
  onAddCustomColor,
  onClearCustomColors,
}) => {
  const defaultColor = paletteColors[0] ?? "#FFFFFF";

  const [label, setLabel] = useState("");
  const [countText, setCountText] = useState("1");
  const [imageData, setImageData] = useState<string | null>(null);
  const [selectedColor, setSelectedColor] = useState<string | null>(
    defaultColor
  );
  const [customColorText, setCustomColorText] = useState("");
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    if (visible) {
      setLabel("");
      setCountText("");
      setImageData(null);
      setSelectedColor(defaultColor); // винаги reset към зеления при отваряне
      setCustomColorText("");
    }
  }, [visible, defaultColor]);

  if (!visible) return null;

  const parsedCount = (() => {
    const num = parseInt(countText, 10);
    if (Number.isNaN(num) || num <= 0) return 1;
    return num;
  })();

  const handleOverlayClick: React.MouseEventHandler<HTMLDivElement> = (e) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  const handleFileChange: React.ChangeEventHandler<HTMLInputElement> = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = () => {
      const result = reader.result;
      if (typeof result === "string") {
        setImageData(result);
      }
    };
    reader.readAsDataURL(file);
  };

  const handlePickImageClick = () => {
    fileInputRef.current?.click();
  };

  const handleClearImage = () => {
    setImageData(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const normalizeHex = (value: string) => {
    let v = value.trim();
    if (!v) return null;
    if (!v.startsWith("#")) v = "#" + v;

    const shortRe = /^#([0-9a-fA-F]{3})$/;
    const longRe = /^#([0-9a-fA-F]{6})$/;

    if (longRe.test(v)) return v.toUpperCase();
    if (shortRe.test(v)) {
      const m = shortRe.exec(v);
      if (!m) return null;
      const c = m[1];
      const expanded = `#${c[0]}${c[0]}${c[1]}${c[1]}${c[2]}${c[2]}`;
      return expanded.toUpperCase();
    }
    return null;
  };

  const handleAddCustomColorClick = () => {
    const normalized = normalizeHex(customColorText);
    if (!normalized) return;
    onAddCustomColor(normalized);
    setSelectedColor(normalized);
    setCustomColorText("");
  };

  const handleClearCustomColorsClick = () => {
    onClearCustomColors();
    // ако текущият избран цвят е бил custom, връщаме пак на зелено
    if (selectedColor && !paletteColors.includes(selectedColor)) {
      setSelectedColor(defaultColor);
    }
  };

  const handleSubmit = () => {
    const trimmedLabel = label.trim();

    onSave({
      label: trimmedLabel, // без fallback "Награда"
      count: parsedCount,
      imageData,
      segmentColor: selectedColor,
    });

    onClose();
  };

  const hasCustomColors = customColors.length > 0;
  const allColors = [...paletteColors, ...customColors];

  return (
    <div
      onClick={handleOverlayClick}
      style={{
        position: "fixed",
        inset: 0,
        background: "rgba(0,0,0,0.35)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        zIndex: 1000,
      }}
    >
      <div
        style={{
          width: "100%",
          maxWidth: 420,
          background: colors.cardBg,
          borderRadius: 16,
          padding: 20,
          boxShadow: "0 10px 30px rgba(0,0,0,0.35)",
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <h2
          style={{
            margin: 0,
            marginBottom: 12,
            fontSize: 18,
            fontWeight: 700,
            color: colors.text,
          }}
        >
          Добавяне на награда
        </h2>

        {/* Име на награда */}
        <div style={{ marginBottom: 10 }}>
          <label
            style={{
              display: "block",
              fontSize: 13,
              fontWeight: 500,
              color: colors.text,
              marginBottom: 4,
            }}
          >
            Име на наградата
          </label>
          <input
            value={label}
            onChange={(e) => setLabel(e.target.value)}
            style={{
              width: "100%",
              padding: "8px 10px",
              borderRadius: 8,
              border: `1px solid ${colors.border}`,
              fontSize: 14,
            }}
          />
        </div>

        {/* Брой */}
        <div style={{ marginBottom: 10 }}>
          <label
            style={{
              display: "block",
              fontSize: 13,
              fontWeight: 500,
              color: colors.text,
              marginBottom: 4,
            }}
          >
            Брой налични
          </label>
          <input
            value={countText}
            onChange={(e) => setCountText(e.target.value)}
            type="number"
            min={1}
            style={{
              width: "120px",
              padding: "8px 10px",
              borderRadius: 8,
              border: `1px solid ${colors.border}`,
              fontSize: 14,
            }}
          />
          {parsedCount <= 0 && (
            <div
              style={{
                marginTop: 4,
                fontSize: 11,
                color: colors.danger,
              }}
            >
              Моля, въведи число &gt; 0.
            </div>
          )}
        </div>

        {/* Картинка */}
        <div style={{ marginBottom: 14 }}>
          <label
            style={{
              display: "block",
              fontSize: 13,
              fontWeight: 500,
              color: colors.text,
              marginBottom: 4,
            }}
          >
            Картинка
          </label>

          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 12,
            }}
          >
            <div
              style={{
                width: 64,
                height: 64,
                borderRadius: 12,
                overflow: "hidden",
                border: `1px solid ${colors.border}`,
                background: "#F9FAFB",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: 32,
              }}
            >
              {imageData ? (
                <img
                  src={imageData}
                  alt="Награда"
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

            <div
              style={{
                display: "flex",
                flexDirection: "column",
                gap: 6,
              }}
            >
              <button
                type="button"
                onClick={handlePickImageClick}
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

              {imageData && (
                <button
                  type="button"
                  onClick={handleClearImage}
                  style={{
                    padding: "4px 10px",
                    borderRadius: 999,
                    border: "none",
                    background: "#F3F4F6",
                    cursor: "pointer",
                    fontSize: 12,
                    color: colors.textMuted,
                  }}
                >
                  Изчисти картинката
                </button>
              )}

              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                style={{ display: "none" }}
                onChange={handleFileChange}
              />
            </div>
          </div>
        </div>

        {/* Цветове */}
        <div style={{ marginBottom: 14 }}>
          <label
            style={{
              display: "block",
              fontSize: 13,
              fontWeight: 500,
              color: colors.text,
              marginBottom: 4,
            }}
          >
            Цвят на сектора
          </label>

          <div
            style={{
              display: "flex",
              flexWrap: "wrap",
              gap: 8,
              marginTop: 4,
            }}
          >
            {allColors.map((c) => (
              <button
                key={c}
                type="button"
                onClick={() => setSelectedColor(c)}
                style={{
                  width: 26,
                  height: 26,
                  borderRadius: "50%",
                  border:
                    selectedColor === c
                      ? "3px solid #111827"
                      : "1px solid rgba(0,0,0,0.1)",
                  background: c,
                  cursor: "pointer",
                }}
              />
            ))}
          </div>

          {/* Добавяне на нов цвят */}
          <div
            style={{
              display: "flex",
              gap: 8,
              alignItems: "center",
              marginTop: 8,
            }}
          >
            <input
              value={customColorText}
              onChange={(e) => setCustomColorText(e.target.value)}
              placeholder="#FF0000"
              style={{
                flex: 1,
                padding: "8px 10px",
                borderRadius: 8,
                border: `1px solid ${colors.border}`,
              }}
            />
            <button
              type="button"
              onClick={handleAddCustomColorClick}
              style={{
                padding: "8px 12px",
                borderRadius: 999,
                border: "none",
                background: "#E5E7EB",
                cursor: "pointer",
              }}
            >
              Добави цвят
            </button>
          </div>

          {/* бутон за чистене на ръчните цветове */}
          {hasCustomColors && (
            <div
              style={{
                marginTop: 8,
              }}
            >
              <button
                type="button"
                onClick={handleClearCustomColorsClick}
                style={{
                  padding: "4px 10px",
                  fontSize: 12,
                  borderRadius: 999,
                  border: "none",
                  background: "#F3F4F6",
                  color: colors.textMuted,
                  cursor: "pointer",
                }}
              >
                Изчисти ръчно добавените цветове
              </button>
            </div>
          )}
        </div>

        {/* Долни бутони */}
        <div
          style={{
            display: "flex",
            gap: 8,
            marginTop: 16,
            justifyContent: "flex-end",
          }}
        >
          <button
            type="button"
            onClick={onClose}
            style={{
              padding: "8px 14px",
              borderRadius: 999,
              border: "none",
              background: "#F3F4F6",
              cursor: "pointer",
              fontSize: 14,
            }}
          >
            Отказ
          </button>
          <button
            type="button"
            onClick={handleSubmit}
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
            Добави
          </button>
        </div>
      </div>
    </div>
  );
};
