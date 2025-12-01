import React, { useEffect, useRef, useState } from "react";
import type { Prize } from "../types";
import { PrizeWheelCanvas } from "./PrizeWheelCanvas";
import { PasswordDialog } from "./PasswordDialog";

const colors = {
  bg: "#FFFFFF",
  text: "#111827",
  primary: "#009A6F",
  textMuted: "#6B7280",
  border: "#E5E7EB",
  danger: "#DC2626",
};

type Props = {
  prizes: Prize[];
  onPrizesChange: (p: Prize[]) => void;
  wheelTitle: string;
  centerImageData: string | null;
  settingsPassword: string;
  onGoToSetup?: () => void;
};

function drawWeightedPrize(eligiblePrizes: Prize[]): Prize {
  const total = eligiblePrizes.reduce((sum, p) => sum + (p.count || 0), 0);
  if (total <= 0) {
    return eligiblePrizes[Math.floor(Math.random() * eligiblePrizes.length)];
  }
  const rand = Math.random() * total;
  let acc = 0;
  for (const p of eligiblePrizes) {
    acc += p.count || 0;
    if (rand <= acc) return p;
  }
  return eligiblePrizes[eligiblePrizes.length - 1];
}

export const PrizeWheelScreen: React.FC<Props> = ({
  prizes,
  onPrizesChange,
  wheelTitle,
  centerImageData,
  settingsPassword,
  onGoToSetup,
}) => {
  const [spinning, setSpinning] = useState(false);
  const [rotationDeg, setRotationDeg] = useState(0);
  const [spinDurationMs, setSpinDurationMs] = useState(0);

  const [winner, setWinner] = useState<Prize | null>(null);
  const [winnerDialogVisible, setWinnerDialogVisible] = useState(false);
  const [showNoPrizesAfterWin, setShowNoPrizesAfterWin] = useState(false);
  const [noPrizesDialogVisible, setNoPrizesDialogVisible] = useState(false);

  const [passwordDialogVisible, setPasswordDialogVisible] = useState(false);

  const lastRotationRef = useRef(0);
  const spinTimeoutRef = useRef<number | null>(null);

  useEffect(() => {
    return () => {
      if (spinTimeoutRef.current !== null) {
        window.clearTimeout(spinTimeoutRef.current);
        spinTimeoutRef.current = null;
      }
    };
  }, []);

  const handleSpin = (strength: number = 1) => {
    if (spinning) return;

    const eligiblePrizes = prizes.filter((p) => p.count > 0);

    if (eligiblePrizes.length === 0) {
      setNoPrizesDialogVisible(true);
      return;
    }

    if (spinTimeoutRef.current !== null) {
      window.clearTimeout(spinTimeoutRef.current);
      spinTimeoutRef.current = null;
    }

    setSpinning(true);
    setWinner(null);
    setWinnerDialogVisible(false);
    setShowNoPrizesAfterWin(false);

    const winningPrize = drawWeightedPrize(eligiblePrizes);

    const visiblePrizes = prizes;
    const n = visiblePrizes.length || 1;
    const segmentAngle = 360 / n;

    const visualIndex = visiblePrizes.findIndex(
      (p) => p.id === winningPrize.id
    );

    if (visualIndex === -1) {
      setSpinning(false);
      return;
    }

    const angleCenter = visualIndex * segmentAngle + segmentAngle / 2;

    const clampedStrength = Math.min(Math.max(strength, 0.5), 3);
    const baseSpins = 6 + Math.round(2 * clampedStrength);
    const duration = 5000 + Math.round(1500 * clampedStrength);

    const from = lastRotationRef.current;

    const targetMod = ((-angleCenter % 360) + 360) % 360;
    const currentMod = ((from % 360) + 360) % 360;

    const minimalDiff = (targetMod - currentMod + 360) % 360;
    const delta = baseSpins * 360 + minimalDiff;
    const to = from + delta;

    lastRotationRef.current = to;
    setSpinDurationMs(duration);
    setRotationDeg(to);

    spinTimeoutRef.current = window.setTimeout(() => {
      try {
        const updated = prizes.map((p) =>
          p.id === winningPrize.id
            ? { ...p, count: Math.max(0, p.count - 1) }
            : p
        );
        onPrizesChange(updated);

        const anyLeft = updated.some((p) => p.count > 0);

        setWinner(winningPrize);
        setWinnerDialogVisible(true);

        if (!anyLeft) {
          setShowNoPrizesAfterWin(true);
        }
      } finally {
        setSpinning(false);
        spinTimeoutRef.current = null;
      }
    }, duration);
  };

  const handleSettingsClick = () => {
    if (!onGoToSetup) return;

    if (!settingsPassword) {
      onGoToSetup();
      return;
    }
    setPasswordDialogVisible(true);
  };

  const handleWinDialogOk = () => {
    setWinnerDialogVisible(false);
  };

  const handleNoPrizesDialogClose = () => {
    setNoPrizesDialogVisible(false);
  };

  return (
    <div
      style={{
        flex: 1,
        width: "100%",
        maxWidth: 900,
        margin: "0 auto",
        padding: 16,
        background: colors.bg,
      }}
    >
      {/* топ ред – дискретни Настройки горе вляво */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          marginBottom: 8,
        }}
      >
        <button
          type="button"
          onClick={handleSettingsClick}
          style={{
            padding: "4px 4px",
            borderRadius: 999,
            border: "none",
            background: "transparent",
            fontSize: 12,
            fontWeight: 500,
            color: colors.textMuted,
            cursor: "pointer",
            display: "flex",
            alignItems: "center",
            gap: 4,
          }}
        >
          <span style={{ fontSize: 14 }}>⚙️</span>
          <span>Настройки</span>
        </button>

        {/* празен spacer за баланс вдясно */}
        <div style={{ width: 80 }} />
      </div>

      {/* заглавие в центъра – стилизирано като в RN */}
      <div
        style={{
          textAlign: "center",
          marginBottom: 12,
        }}
      >
        <h1
          style={{
            margin: 0,
            fontSize: 24,
            fontWeight: 800,
            color: "#0B8DF0",
            letterSpacing: "1.4px",
            textShadow: "0 2px 4px rgba(0,0,0,0.15)",
          }}
        >
          {wheelTitle || "Колело на наградите"}
        </h1>
      </div>

      {/* колело + pointer pill – клик по колелото също върти */}
      <div
        style={{
          marginTop: 32,
          marginBottom: 24,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <div
          style={{
            position: "relative",
            display: "inline-block",
            cursor: spinning ? "default" : "pointer",
          }}
          onClick={() => {
            if (!spinning) handleSpin();
          }}
        >
          {/* pointer като в RN: жълта „таблетка“ с ▼ */}
          <div
            style={{
              position: "absolute",
              top: -20,
              left: "50%",
              transform: "translateX(-50%)",
              backgroundColor: "#FFD54F",
              padding: "4px 14px",
              borderRadius: 999,
              boxShadow: "0 3px 8px rgba(0,0,0,0.35)",
              zIndex: 20,
            }}
          >
            <span
              style={{
                fontSize: 20,
                color: "#1F2937",
                lineHeight: 1,
              }}
            >
              ▼
            </span>
          </div>

          <PrizeWheelCanvas
            prizes={prizes}
            centerImageData={centerImageData}
            rotationDeg={rotationDeg}
            spinning={spinning}
            spinDurationMs={spinDurationMs}
          />
        </div>
      </div>

      {/* бутон за завъртане */}
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          marginBottom: 8,
        }}
      >
        <button
          type="button"
          onClick={() => handleSpin()}
          disabled={spinning}
          style={{
            minWidth: 160,
            padding: "10px 20px",
            borderRadius: 999,
            border: "none",
            background: spinning ? "#6EE7B7" : colors.primary,
            color: "#FFFFFF",
            fontWeight: 700,
            fontSize: 16,
            cursor: spinning ? "default" : "pointer",
            boxShadow: "0 4px 10px rgba(0,0,0,0.25)",
            opacity: spinning ? 0.8 : 1,
            transform: spinning ? "translateY(1px)" : "translateY(0)",
            transition:
              "background 150ms ease, opacity 150ms ease, transform 150ms ease",
          }}
        >
          {spinning ? "Завъртане..." : "Завърти"}
        </button>
      </div>

      {/* диалог: печеливша награда */}
      {winnerDialogVisible && winner && (
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
          onClick={handleWinDialogOk}
        >
          <div
            style={{
              maxWidth: 360,
              width: "90%",
              background: "#FFFFFF",
              borderRadius: 16,
              padding: 20,
              boxShadow: "0 10px 30px rgba(0,0,0,0.35)",
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <h2
              style={{
                margin: 0,
                marginBottom: 8,
                fontSize: 20,
                fontWeight: 700,
                color: colors.text,
              }}
            >
              Печелиш:
            </h2>
            <div
              style={{
                marginBottom: 12,
                fontSize: 18,
                fontWeight: 700,
                color: colors.primary,
              }}
            >
              {winner.label}
            </div>

            {/* картинка или placeholder 🎁 */}
            <div
              style={{
                width: 140,
                height: 140,
                borderRadius: 16,
                overflow: "hidden",
                margin: "0 auto 12px auto",
                border: `2px solid ${colors.border}`,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                background: "#F9FAFB",
                fontSize: 64,
              }}
            >
              {winner.imageData ? (
                <img
                  src={winner.imageData}
                  alt={winner.label}
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

            {showNoPrizesAfterWin && (
              <div
                style={{
                  marginBottom: 12,
                  fontSize: 13,
                  color: colors.danger,
                }}
              >
                Това беше последната налична награда. Всички награди са
                изчерпани.
              </div>
            )}

            <div
              style={{
                display: "flex",
                justifyContent: "flex-end",
                marginTop: 8,
              }}
            >
              <button
                type="button"
                onClick={handleWinDialogOk}
                style={{
                  padding: "8px 16px",
                  borderRadius: 999,
                  border: "none",
                  background: colors.primary,
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
      )}

      {/* диалог: няма награди */}
      {noPrizesDialogVisible && (
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
          onClick={handleNoPrizesDialogClose}
        >
          <div
            style={{
              maxWidth: 360,
              width: "90%",
              background: "#FFFFFF",
              borderRadius: 16,
              padding: 20,
              boxShadow: "0 10px 30px rgba(0,0,0,0.35)",
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <h2
              style={{
                margin: 0,
                marginBottom: 8,
                fontSize: 18,
                fontWeight: 700,
                color: colors.text,
              }}
            >
              Няма налични награди
            </h2>
            <div
              style={{
                marginBottom: 12,
                fontSize: 14,
                color: colors.textMuted,
              }}
            >
              Всички награди са с изчерпани бройки. Можеш да добавиш нови от
              екрана „Настройки“.
            </div>
            <div
              style={{
                display: "flex",
                justifyContent: "flex-end",
                marginTop: 8,
              }}
            >
              <button
                type="button"
                onClick={handleNoPrizesDialogClose}
                style={{
                  padding: "8px 16px",
                  borderRadius: 999,
                  border: "none",
                  background: colors.primary,
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
      )}

      {/* диалог за парола за настройки */}
      <PasswordDialog
        visible={passwordDialogVisible}
        requiredPassword={settingsPassword}
        onCancel={() => setPasswordDialogVisible(false)}
        onSuccess={() => {
          setPasswordDialogVisible(false);
          onGoToSetup && onGoToSetup();
        }}
      />
    </div>
  );
};
