import type { ReactNode } from "react";

export type Tone = "ink" | "muted" | "faint" | "accent" | "feat" | "perf" | "infra" | "fix";

/** Theme-token colour for a tone, so figures follow the paper/ink edition. */
export const tone = (t: Tone) =>
  ({
    ink: "var(--ink)",
    muted: "var(--muted)",
    faint: "var(--faint)",
    accent: "var(--accent)",
    feat: "var(--k-feat)",
    perf: "var(--k-perf)",
    infra: "var(--k-infra)",
    fix: "var(--k-fix)",
  })[t];

/** A tone washed into the paper colour, for filled shapes. */
export const wash = (t: Tone, pct = 12) => `color-mix(in srgb, ${tone(t)} ${pct}%, var(--paper))`;

type Pt = readonly [number, number];

interface FigureProps {
  width?: number;
  height: number;
  label: string;
  children: ReactNode;
}

/**
 * Responsive SVG canvas. Below its natural width it scrolls sideways instead
 * of shrinking, so the 11–13px labels stay legible on phones.
 */
export function Figure({ width = 720, height, label, children }: FigureProps) {
  return (
    <div className="-mx-1 overflow-x-auto px-1">
      <svg
        viewBox={`0 0 ${width} ${height}`}
        role="img"
        aria-label={label}
        className="block h-auto w-full min-w-[560px] font-mono"
      >
        {children}
      </svg>
    </div>
  );
}

interface TextProps {
  x: number;
  y: number;
  children: ReactNode;
  size?: number;
  t?: Tone;
  anchor?: "start" | "middle" | "end";
  weight?: number;
  sans?: boolean;
}

export function Label({ x, y, children, size = 11, t = "muted", anchor = "start", weight, sans }: TextProps) {
  return (
    <text
      x={x}
      y={y}
      fontSize={size}
      textAnchor={anchor}
      fontWeight={weight}
      className={sans ? "font-sans" : undefined}
      style={{ fill: tone(t) }}
    >
      {children}
    </text>
  );
}

interface BoxProps {
  x: number;
  y: number;
  w: number;
  h: number;
  title: string;
  sub?: string[];
  t?: Tone;
  filled?: boolean;
  dashed?: boolean;
}

/** A labelled node: a bold title line with optional muted sub-lines, centred. */
export function Box({ x, y, w, h, title, sub = [], t = "ink", filled, dashed }: BoxProps) {
  const blockH = 15 + sub.length * 14;
  const top = y + (h - blockH) / 2 + 11;
  return (
    <g>
      <rect
        x={x}
        y={y}
        width={w}
        height={h}
        rx={8}
        strokeWidth={1.25}
        strokeDasharray={dashed ? "5 4" : undefined}
        style={{ fill: filled ? wash(t) : "var(--paper-raised)", stroke: t === "ink" ? "var(--rule-strong)" : tone(t) }}
      />
      <Label x={x + w / 2} y={top} size={12.5} t="ink" anchor="middle" weight={600} sans>
        {title}
      </Label>
      {sub.map((line, i) => (
        <Label key={i} x={x + w / 2} y={top + 16 + i * 14} anchor="middle" size={10.5}>
          {line}
        </Label>
      ))}
    </g>
  );
}

interface ArrowProps {
  pts: readonly Pt[];
  t?: Tone;
  dashed?: boolean;
  /** Marching-ants motion along the line, for figures that show flow. */
  flow?: boolean;
}

/** A polyline with an arrowhead on its last segment. */
export function Arrow({ pts, t = "muted", dashed, flow }: ArrowProps) {
  const [x2, y2] = pts[pts.length - 1];
  const [x1, y1] = pts[pts.length - 2];
  const a = Math.atan2(y2 - y1, x2 - x1);
  const s = 7;
  const head = [
    [x2, y2],
    [x2 - s * Math.cos(a - 0.45), y2 - s * Math.sin(a - 0.45)],
    [x2 - s * Math.cos(a + 0.45), y2 - s * Math.sin(a + 0.45)],
  ]
    .map((p) => p.map((n) => n.toFixed(1)).join(","))
    .join(" ");
  const body = [...pts.slice(0, -1), [x2 - s * 0.7 * Math.cos(a), y2 - s * 0.7 * Math.sin(a)]]
    .map((p) => p.map((n) => n.toFixed(1)).join(","))
    .join(" ");
  return (
    <g>
      <polyline
        points={body}
        fill="none"
        strokeWidth={1.4}
        strokeLinejoin="round"
        strokeDasharray={dashed ? "4 4" : undefined}
        className={flow ? "fig-flow" : undefined}
        style={{ stroke: tone(t) }}
      />
      <polygon points={head} style={{ fill: tone(t) }} />
    </g>
  );
}

/** Small uppercase heading used to label a region of a figure. */
export function Kicker({ x, y, children, t = "faint", anchor }: Omit<TextProps, "size">) {
  return (
    <Label x={x} y={y} size={10} t={t} anchor={anchor} weight={500}>
      {typeof children === "string" ? children.toUpperCase() : children}
    </Label>
  );
}
