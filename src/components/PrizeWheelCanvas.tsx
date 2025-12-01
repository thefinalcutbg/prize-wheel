import React from "react";
import type { Prize } from "../types";

const NUM_LIGHTS = 32;

const segmentColors = [
  "#009A6F",
  "#FFB800",
  "#F97316",
  "#22C55E",
  "#6366F1",
  "#EC4899",
  "#0EA5E9",
];

function polarToCartesian(
  centerX: number,
  centerY: number,
  radius: number,
  angleInDegrees: number
) {
  const angleInRadians = ((angleInDegrees - 90) * Math.PI) / 180.0;
  return {
    x: centerX + radius * Math.cos(angleInRadians),
    y: centerY + radius * Math.sin(angleInRadians),
  };
}

function createWedgePath(
  centerX: number,
  centerY: number,
  radius: number,
  startAngle: number,
  endAngle: number
) {
  const start = polarToCartesian(centerX, centerY, radius, endAngle);
  const end = polarToCartesian(centerX, centerY, radius, startAngle);
  const largeArcFlag = endAngle - startAngle <= 180 ? "0" : "1";

  const d = [
    `M ${centerX} ${centerY}`,
    `L ${start.x} ${start.y}`,
    `A ${radius} ${radius} 0 ${largeArcFlag} 0 ${end.x} ${end.y}`,
    "Z",
  ].join(" ");

  return d;
}

type Props = {
  prizes: Prize[];
  centerImageData?: string | null;
  rotationDeg: number;
  spinning: boolean;
  spinDurationMs: number;
};

export const PrizeWheelCanvas: React.FC<Props> = ({
  prizes,
  centerImageData,
  rotationDeg,
  spinning,
  spinDurationMs,
}) => {
  const size = 400;
  const radius = size / 2;
  const segmentRadius = radius - 26;
  const centerImageSize = Math.min(size * 0.35, 100);

  const n = prizes.length || 1;
  const segmentAngle = 360 / n;
  const hasPrizes = prizes.length > 0;

  const baseWheel = 320;
  const wheelScale = size / baseWheel;
  const densityScale = n > 10 ? 10 / n : 1;
  const combinedScale = wheelScale * densityScale;

  const iconCircleSize = Math.max(30, 56 * combinedScale);
  const iconImageSize = iconCircleSize * 0.7;
  const labelFontSize = Math.max(8, 11 * combinedScale);

  const iconMarginFromEdge = 50;
  const outerBased = radius - iconCircleSize / 2 - iconMarginFromEdge;

  const minMarginFromCenter = centerImageSize / 2 + iconCircleSize / 2 + 12;

  // радиална дистанция за иконата (по радиус от центъра)
  const iconDistance = Math.max(minMarginFromCenter, outerBased);

  return (
    <div
      style={{
        position: "relative",
        width: "min(90vw, 90vh, 640px)",
        aspectRatio: "1 / 1",
        borderRadius: "50%",
        boxShadow: "0 6px 12px rgba(0,0,0,0.3)",
        overflow: "visible",
        transform: `rotate(${rotationDeg}deg)`,
        transition: spinning
          ? `transform ${spinDurationMs}ms cubic-bezier(0.33,1,0.68,1)`
          : undefined,
        margin: "0 auto",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: "transparent",
      }}
    >
      {hasPrizes ? (
        <svg
          viewBox={`0 0 ${size} ${size}`}
          style={{ width: "100%", height: "100%" }}
        >
          {/* фон зад сегментите */}
          <circle cx={radius} cy={radius} r={radius - 6} fill="#004BA8" />

          {/* сегменти + иконки + текст */}
          {prizes.map((p, index) => {
            const startAngle = index * segmentAngle;
            const endAngle = startAngle + segmentAngle;
            const d = createWedgePath(
              radius,
              radius,
              segmentRadius,
              startAngle,
              endAngle
            );
            const color =
              p.segmentColor || segmentColors[index % segmentColors.length];

            // среда на сегмента
            const midAngle = startAngle + segmentAngle / 2;

            // радиална дистанция за текста – малко по-близо до периферията
            const textDistance = Math.min(
              radius - 18,
              iconDistance + iconCircleSize / 2 + 14
            );

            const rawLabel = p.label || "";
            const maxChars = 18;
            const displayLabel =
              rawLabel.length > maxChars
                ? rawLabel.slice(0, maxChars - 1) + "…"
                : rawLabel;

            return (
              <g key={p.id}>
                {/* сегмент */}
                <path d={d} fill={color} />

                {/* ИКОНКА + ТЕКСТ, ориентирани по сегмента */}
                <g transform={`rotate(${midAngle}, ${radius}, ${radius})`}>
                  {/* бял кръг за иконката */}
                  <circle
                    cx={radius}
                    cy={radius - iconDistance}
                    r={iconCircleSize / 2}
                    fill="#FFFFFF"
                  />

                  {/* вътрешна картинка или 🎁 */}
                  {p.imageData ? (
                    <image
                      href={p.imageData}
                      x={radius - iconImageSize / 2}
                      y={radius - iconDistance - iconImageSize / 2}
                      width={iconImageSize}
                      height={iconImageSize}
                      preserveAspectRatio="xMidYMid contain"
                    />
                  ) : (
                    <text
                      x={radius}
                      y={radius - iconDistance + 2}
                      textAnchor="middle"
                      dominantBaseline="middle"
                      fontSize={iconImageSize * 0.7}
                    >
                      🎁
                    </text>
                  )}

                  {/* текст на наградата */}
                  {displayLabel && (
                    <text
                      x={radius}
                      y={radius - textDistance}
                      textAnchor="middle"
                      dominantBaseline="middle"
                      fontSize={labelFontSize}
                      fontWeight={600}
                      fill="#FFFFFF"
                      stroke="rgba(0,0,0,0.6)"
                      strokeWidth={2}
                      style={{ paintOrder: "stroke" }}
                    >
                      {displayLabel}
                    </text>
                  )}
                </g>
              </g>
            );
          })}

          {/* синя рамка под лампичките */}
          <circle
            cx={radius}
            cy={radius}
            r={radius - 6}
            stroke="#0EA5E9"
            strokeWidth={3}
            fill="none"
          />

          {/* лампички по ръба */}
          {Array.from({ length: NUM_LIGHTS }).map((_, i) => {
            const angle = (360 / NUM_LIGHTS) * i;
            const outerPos = polarToCartesian(
              radius,
              radius,
              radius - 8,
              angle
            );
            return (
              <g key={`light-${i}`}>
                <circle cx={outerPos.x} cy={outerPos.y} r={7} fill="#0EA5E9" />
                <circle cx={outerPos.x} cy={outerPos.y} r={4} fill="#E0F2FE" />
              </g>
            );
          })}
        </svg>
      ) : (
        <div style={{ color: "#E5E7EB", fontSize: 14 }}>
          Няма налични награди
        </div>
      )}

      {centerImageData && (
        <div
          style={{
            position: "absolute",
            width: `${(centerImageSize / size) * 100}%`,
            height: `${(centerImageSize / size) * 100}%`,
            borderRadius: "50%",
            overflow: "hidden",
            border: "3px solid #FFFFFF",
            background: "#FFFFFF",
          }}
        >
          <img
            src={centerImageData}
            alt="Center"
            style={{ width: "100%", height: "100%", objectFit: "cover" }}
          />
        </div>
      )}
    </div>
  );
};
