import type { ReactNode } from "react";
import type { ProjectCover as CoverKind } from "@/lib/data";
import { cn } from "@/lib/utils";

/*
 * Illustrated covers for the Work cards. Each is a small, abstract mock of the
 * product surface (skeleton lines rather than real data), set on a pastel
 * gradient in the manner of the reference site's cover images.
 */

const BACKDROPS: Record<CoverKind, string> = {
  canvas: "from-[#efeafe] via-[#ddd3fd] to-[#b9a8f7]",
  billing: "from-[#e6f7ee] via-[#c9eedb] to-[#8fd9b5]",
  stream: "from-[#e5eefc] via-[#c9dbfa] to-[#8db3f2]",
  merchant: "from-[#fdf3dc] via-[#fbe3a9] to-[#f3c667]",
  compliance: "from-[#fbe7ea] via-[#e9a9b5] to-[#8c2a45]",
  dashboards: "from-[#e1f6f3] via-[#bfeae3] to-[#78cfc1]",
};

function Window({ children, className, dark }: { children: ReactNode; className?: string; dark?: boolean }) {
  return (
    <div
      className={cn(
        "absolute overflow-hidden rounded-lg shadow-[0_18px_40px_-12px_rgb(30_20_60/0.35)] transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)]",
        dark ? "bg-[#17181c]" : "bg-white",
        className,
      )}
    >
      <div className={cn("flex h-[9%] min-h-3 items-center gap-1 px-2", dark ? "bg-[#23252b]" : "bg-[#f1f0f5]")}>
        {["#ff6159", "#ffbd2e", "#28c941"].map((c) => (
          <span key={c} className="h-1 w-1 rounded-full sm:h-1.5 sm:w-1.5" style={{ backgroundColor: c }} />
        ))}
      </div>
      <div className="h-[91%] p-[5%]">{children}</div>
    </div>
  );
}

const Line = ({ w, className }: { w: string; className?: string }) => (
  <span className={cn("block h-[5px] rounded-full bg-[#e7e5ee]", className)} style={{ width: w }} />
);

function Canvas() {
  return (
    <>
      <Window className="top-[22%] left-[7%] h-[62%] w-[34%] group-hover:-translate-y-1">
        <div className="flex h-full flex-col justify-end gap-[8%]">
          <div className="ml-auto w-[80%] rounded-md bg-[#6d5ae6] p-[6%]">
            <Line w="90%" className="bg-white/70" />
            <Line w="60%" className="mt-1 bg-white/50" />
          </div>
          <div className="w-[85%] space-y-1 rounded-md bg-[#f4f2fb] p-[6%]">
            <Line w="95%" />
            <Line w="70%" />
            <Line w="80%" />
          </div>
          <div className="rounded-full border border-[#e7e5ee] px-[6%] py-[4%]">
            <Line w="50%" />
          </div>
        </div>
      </Window>
      <Window className="top-[12%] right-[6%] h-[76%] w-[52%] group-hover:-translate-y-2">
        <Line w="45%" className="h-[6px] bg-[#cfc8f3]" />
        <div className="mt-[6%] grid grid-cols-3 gap-[5%]">
          {["#6d5ae6", "#22a06b", "#e8793c"].map((c) => (
            <div key={c} className="rounded-md border border-[#eeecf4] p-[10%]">
              <span className="block h-[3px] w-1/2 rounded-full bg-[#e7e5ee]" />
              <span className="mt-1.5 block h-[7px] w-3/4 rounded-sm" style={{ backgroundColor: c }} />
            </div>
          ))}
        </div>
        <div className="mt-[6%] flex h-[34%] items-end gap-[4%] rounded-md border border-[#eeecf4] p-[4%]">
          {[40, 65, 50, 85, 70, 95, 60].map((h, i) => (
            <span key={i} className="flex-1 rounded-t-sm bg-[#b9aef3]" style={{ height: `${h}%` }} />
          ))}
        </div>
        <div className="mt-[6%] space-y-1.5">
          <Line w="100%" />
          <Line w="88%" />
        </div>
      </Window>
    </>
  );
}

function Billing() {
  const rows = [
    { sign: "+", c: "#22a06b", w: "58%" },
    { sign: "−", c: "#e25b45", w: "42%" },
    { sign: "−", c: "#e25b45", w: "50%" },
    { sign: "+", c: "#22a06b", w: "36%" },
  ];
  return (
    <>
      <Window className="top-[14%] left-[8%] h-[72%] w-[56%] group-hover:-translate-y-1">
        <Line w="35%" className="h-[6px] bg-[#bfe5d2]" />
        <div className="mt-[7%] divide-y divide-[#f0eff4]">
          {rows.map((r, i) => (
            <div key={i} className="flex items-center gap-[5%] py-[3.5%]">
              <span
                className="flex h-3.5 w-3.5 shrink-0 items-center justify-center rounded-full text-[8px] font-bold text-white"
                style={{ backgroundColor: r.c }}
              >
                {r.sign}
              </span>
              <Line w={r.w} />
              <span className="ml-auto block h-[6px] w-[16%] rounded-full" style={{ backgroundColor: r.c, opacity: 0.7 }} />
            </div>
          ))}
        </div>
      </Window>
      <div className="absolute top-[26%] right-[7%] w-[36%] rounded-xl bg-white p-[3.5%] shadow-[0_18px_40px_-12px_rgb(20_60_40/0.35)] transition-transform duration-500 group-hover:-translate-y-2">
        <Line w="50%" className="bg-[#d9eee3]" />
        <div className="mt-3 h-2 w-full overflow-hidden rounded-full bg-[#eef6f1]">
          <span className="block h-full w-[72%] rounded-full bg-[#22a06b]" />
        </div>
        <div className="mt-3 flex gap-1">
          {["50", "75", "90", "95"].map((t) => (
            <span key={t} className="flex-1 rounded bg-[#f3f7f5] py-0.5 text-center font-mono text-[7px] text-[#4a7a62] sm:text-[8px]">
              {t}%
            </span>
          ))}
        </div>
      </div>
    </>
  );
}

function Stream() {
  const events = [
    { e: "delta", c: "#8db3f2" },
    { e: "tool.progress", c: "#e3c26b" },
    { e: "heartbeat", c: "#6fcf97" },
    { e: "delta", c: "#8db3f2" },
    { e: "heartbeat", c: "#6fcf97" },
    { e: "done", c: "#e8793c" },
  ];
  return (
    <>
      <Window dark className="top-[12%] left-[10%] h-[76%] w-[60%] group-hover:-translate-y-1">
        <div className="space-y-[3.5%] font-mono text-[7px] leading-none sm:text-[9px]">
          {events.map((ev, i) => (
            <p key={i} className="flex items-center gap-1.5 whitespace-nowrap text-[#8b8f99]">
              <span className="text-[#5b5f69]">{String(i + 1).padStart(2, "0")}</span>
              event: <span style={{ color: ev.c }}>{ev.e}</span>
            </p>
          ))}
        </div>
      </Window>
      <div className="absolute right-[6%] bottom-[16%] w-[42%] rounded-xl bg-white p-[3%] shadow-[0_18px_40px_-12px_rgb(20_40_90/0.35)] transition-transform duration-500 group-hover:-translate-y-2">
        <svg viewBox="0 0 120 36" className="w-full" aria-hidden>
          <polyline
            points="0,24 18,24 24,24 30,8 36,32 42,18 48,24 70,24 76,24 82,10 88,30 94,20 100,24 120,24"
            fill="none"
            stroke="#3f7be0"
            strokeWidth="2"
            strokeLinejoin="round"
            strokeLinecap="round"
          />
        </svg>
        <div className="mt-1 flex items-center gap-1.5">
          <span className="h-1.5 w-1.5 rounded-full bg-[#22a06b]" />
          <Line w="55%" />
        </div>
      </div>
    </>
  );
}

function Merchant() {
  const tiles = ["#f7c9a8", "#c9d8f7", "#cfeccf", "#f3d9f0", "#f7e3a8", "#d6d2f5"];
  return (
    <>
      <Window className="top-[12%] left-[8%] h-[76%] w-[62%] group-hover:-translate-y-1">
        <div className="grid h-full grid-cols-3 gap-[5%]">
          {tiles.map((c, i) => (
            <div key={i} className="flex flex-col rounded-md border border-[#f0eee8] p-[8%]">
              <span className="block flex-1 rounded-sm" style={{ backgroundColor: c }} />
              <div className="mt-1.5 flex items-center gap-1">
                <span className={cn("h-1.5 w-1.5 shrink-0 rounded-full", i === 4 ? "bg-[#e3a21a]" : "bg-[#22a06b]")} />
                <Line w="70%" />
              </div>
            </div>
          ))}
        </div>
      </Window>
      <div className="absolute top-[22%] right-[6%] w-[30%] space-y-2 transition-transform duration-500 group-hover:-translate-y-2">
        <div className="flex items-center gap-1.5 rounded-full bg-white px-2.5 py-1.5 shadow-lg">
          <span className="flex h-3 w-3 items-center justify-center rounded-full bg-[#22a06b] text-[7px] text-white">✓</span>
          <Line w="60%" />
        </div>
        <div className="rounded-lg bg-white p-2 shadow-lg">
          <span className="block h-[5px] w-2/3 rounded-full bg-[#fbe3a9]" />
          <span className="mt-1.5 block h-[5px] w-full rounded-full bg-[#eeece6]" />
          <span className="mt-1 block h-[5px] w-4/5 rounded-full bg-[#eeece6]" />
          <span className="mt-2 block h-3 w-1/2 rounded bg-[#e3a21a]" />
        </div>
      </div>
    </>
  );
}

function Compliance() {
  return (
    <Window className="top-[12%] left-1/2 h-[76%] w-[74%] -translate-x-1/2 group-hover:-translate-y-2">
      <div className="flex items-center justify-between">
        <span className="font-mono text-[8px] font-semibold text-[#8c2a45] sm:text-[10px]">GSTR-1</span>
        <span className="rounded bg-[#1d8a52] px-1.5 py-0.5 font-mono text-[6px] text-white sm:text-[8px]">Export .xlsx</span>
      </div>
      <div className="mt-[4%] overflow-hidden rounded-md border border-[#f0e3e6]">
        <div className="grid grid-cols-5 gap-[4%] bg-[#fbf1f3] px-[3%] py-[2.5%]">
          {[0, 1, 2, 3, 4].map((i) => (
            <Line key={i} w="80%" className="bg-[#e9a9b5]" />
          ))}
        </div>
        {[0, 1, 2, 3, 4].map((r) => (
          <div key={r} className="grid grid-cols-5 gap-[4%] border-t border-[#f5eef0] px-[3%] py-[2.5%]">
            {[70, 90, 55, 80, 60].map((w, i) => (
              <Line key={i} w={`${(w + r * 7) % 60 + 40}%`} />
            ))}
          </div>
        ))}
      </div>
    </Window>
  );
}

function Dashboards() {
  return (
    <Window className="top-[12%] left-1/2 h-[76%] w-[74%] -translate-x-1/2 group-hover:-translate-y-2">
      <div className="grid grid-cols-4 gap-[3%]">
        {["#2a9d8f", "#3f7be0", "#e8793c", "#9b5de5"].map((c) => (
          <div key={c} className="rounded-md border border-[#eef2f1] p-[8%]">
            <span className="block h-[3px] w-1/2 rounded-full bg-[#e7e5ee]" />
            <span className="mt-1.5 block h-[7px] w-2/3 rounded-sm" style={{ backgroundColor: c }} />
          </div>
        ))}
      </div>
      <div className="mt-[4%] rounded-md border border-[#eef2f1] p-[3%]">
        <svg viewBox="0 0 200 60" className="w-full" aria-hidden>
          <path d="M0 48 C 25 44, 35 30, 55 34 S 90 16, 110 22 S 150 8, 170 12 S 190 6, 200 4" fill="none" stroke="#2a9d8f" strokeWidth="2.5" />
          <path d="M0 54 C 30 52, 45 44, 65 46 S 100 36, 125 40 S 165 28, 200 26" fill="none" stroke="#9fd8cf" strokeWidth="2" />
        </svg>
      </div>
    </Window>
  );
}

const COVERS: Record<CoverKind, () => ReactNode> = {
  canvas: Canvas,
  billing: Billing,
  stream: Stream,
  merchant: Merchant,
  compliance: Compliance,
  dashboards: Dashboards,
};

export default function ProjectCover({ kind, className }: { kind: CoverKind; className?: string }) {
  const Art = COVERS[kind];
  return (
    <div
      aria-hidden
      className={cn(
        "relative aspect-[16/10] overflow-hidden rounded-2xl border border-rule bg-gradient-to-br",
        BACKDROPS[kind],
        className,
      )}
    >
      <Art />
    </div>
  );
}
