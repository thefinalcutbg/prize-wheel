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
};

const colors = {
  cardBg: "#FFFFFF",
  text: "#111827",
  textMuted: "#6B7280",
  primary: "#009A6F",
  border: "#E5E7EB",
};

export const AddPrizeDialog: React.FC<AddPrizeDialogProps> = ({
  visible,
  onClose,
  onSave,
  paletteColors,
  customColors,
  onAddCustomColor,
}) => {
  const [label, setLabel] = useState("");
  const [countText, setCountText] = useState("1");
  const [imageData, setImageData] = useState<string | null>(null);
  const [selectedColor, setSelectedColor] = useState<string | null>(null);
  const [customColorText, setCustomColorText] = useState("");
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    if (visible) {
      setLabel("");
      setCountText("1");
      setImageData(null);
      setSelectedColor(paletteColors[0] ?? null);
      setCustomColorText("");
    }
  }, [visible, paletteColors]);

  const handlePickImageClick = () => {
    fileInputRef.current?.click();
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

  const normalizeHex = (value: string) => {
    let v = value.trim();
    if (!v) return null;
    if (!v.startsWith("#")) v = "#" + v;

    const shortRe = /^#([0-9a-fA-F]{3})$/;
    const longRe = /^#([0-9a-fA-F]{6})$/;

    if (longRe.test(v)) return v.toUpperCase();
    if (shortRe.test(v)) {
      const m = v.match(shortRe)!;
      const s = m[1];
      const full = "#" + s[0] + s[0] + s[1] + s[1] + s[2] + s[2];
      return full.toUpperCase();
    }
    return null;
  };

  const handleAddCustomColorClick = () => {
    const normalized = normalizeHex(customColorText);
    if (!normalized) {
      alert("Моля, въведете валиден HEX цвят (например #FF0000).");
      return;
    }
    onAddCustomColor(normalized);
    setSelectedColor(normalized);
    setCustomColorText("");
  };

  const handleSave = () => {
    const trimmedLabel = label.trim();
    const n = parseInt(countText, 10);
    const count = Number.isNaN(n) || n < 1 ? 1 : n;

    onSave({
      label: trimmedLabel,
      count,
      imageData,
      segmentColor: selectedColor,
    });

    onClose();
  };

  if (!visible) return null;

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        background: "rgba(0,0,0,0.45)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        zIndex: 1000,
      }}
      onClick={onClose}
    >
      <div
        style={{
          width: "100%",
          maxWidth: 420,
          maxHeight: "90vh",
          margin: "0 16px",
          borderRadius: 16,
          padding: 16,
          background: colors.cardBg,
          border: `1px solid ${colors.border}`,
          overflowY: "auto",
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <h2
          style={{
            fontSize: 20,
            fontWeight: 700,
            color: colors.text,
            textAlign: "center",
            marginBottom: 8,
          }}
        >
          Нова награда
        </h2>

        <label style={{ fontSize: 13, color: colors.textMuted }}>
          Наименование на наградата
        </label>
        <input
          value={label}
          onChange={(e) => setLabel(e.target.value)}
          style={{
            width: "100%",
            marginTop: 4,
            padding: "8px 10px",
            borderRadius: 8,
            border: `1px solid ${colors.border}`,
          }}
        />

        <label
          style={{
            display: "block",
            marginTop: 8,
            fontSize: 13,
            color: colors.textMuted,
          }}
        >
          Брой (колко пъти може да се падне)
        </label>
        <input
          value={countText}
          onChange={(e) => setCountText(e.target.value)}
          type="number"
          min={1}
          style={{
            width: "100%",
            marginTop: 4,
            padding: "8px 10px",
            borderRadius: 8,
            border: `1px solid ${colors.border}`,
          }}
        />

        <label
          style={{
            display: "block",
            marginTop: 8,
            fontSize: 13,
            color: colors.textMuted,
          }}
        >
          Изображение
        </label>
        <button
          type="button"
          onClick={handlePickImageClick}
          style={{
            width: "100%",
            marginTop: 4,
            padding: 8,
            borderRadius: 10,
            border: `1px solid ${colors.border}`,
            background: "#F9FAFB",
          }}
        >
          {imageData ? (
            <img
              src={imageData}
              alt="preview"
              style={{ width: 48, height: 48, borderRadius: 10 }}
            />
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
          onChange={handleFileChange}
        />

        <label
          style={{
            display: "block",
            marginTop: 8,
            fontSize: 13,
            color: colors.textMuted,
          }}
        >
          Цвят на сегмента
        </label>
        <div
          style={{ display: "flex", flexWrap: "wrap", gap: 8, marginTop: 4 }}
        >
          {paletteColors.concat(customColors).map((c) => (
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
              flex: 1,
              padding: 10,
              borderRadius: 999,
              border: `1px solid ${colors.border}`,
              background: "#FFFFFF",
              cursor: "pointer",
            }}
          >
            Отказ
          </button>
          <button
            type="button"
            onClick={handleSave}
            style={{
              flex: 1,
              padding: 10,
              borderRadius: 999,
              border: "none",
              background: colors.primary,
              color: "#FFFFFF",
              fontWeight: 600,
              cursor: "pointer",
            }}
          >
            Добави
          </button>
        </div>
      </div>
    </div>
  );
};
