import type { CSSProperties, ReactElement } from "react";
import type { FigureId } from "@/lib/blog";
import { Arrow, Box, Figure, Kicker, Label, tone, wash, type Tone } from "./primitives";

/* ——— The 93.5% payload diet ——— */

function Metric({ y, title, pct }: { y: number; title: string; pct: number }) {
  const x = 190;
  const w = 430;
  const after = w * (1 - pct / 100);
  return (
    <g>
      <Label x={20} y={y} size={12} t="ink" weight={600} sans>
        {title}
      </Label>
      <Label x={180} y={y + 21} anchor="end" size={10}>
        before
      </Label>
      <rect x={x} y={y + 10} width={w} height={14} rx={3} style={{ fill: wash("muted", 35) }} />
      <Label x={180} y={y + 41} anchor="end" size={10}>
        after
      </Label>
      <rect
        x={x}
        y={y + 30}
        width={after}
        height={14}
        rx={3}
        className="fig-shrink"
        style={{ fill: tone("perf"), "--from": w / after } as CSSProperties}
      />
      <Label x={x + w + 20} y={y + 41} size={14} t="perf" weight={700} sans>
        −{pct}%
      </Label>
    </g>
  );
}

function PayloadDiet() {
  return (
    <Figure height={350} label="One stream policy sends the model the full tool output and the browser only what it renders; the history reload payload fell 93.5% and the live stream 76.6%.">
      <Box x={20} y={36} w={150} h={58} title="Tool output" sub={["rows, snippets, JSON"]} />
      <Box x={290} y={10} w={200} h={52} title="Model context" sub={["full output · every row"]} t="infra" />
      <Box x={290} y={82} w={200} h={52} title="Browser" sub={["only what the card shows"]} t="perf" filled />
      <Arrow pts={[[170, 56], [288, 38]]} t="infra" />
      <Arrow pts={[[170, 74], [288, 106]]} t="perf" flow />
      <Kicker x={512} y={46}>
        Stream policy
      </Kicker>
      <Label x={512} y={64}>one definition builds both</Label>
      <Label x={512} y={79}>the live stream and the</Label>
      <Label x={512} y={94}>history reload</Label>
      <line x1={20} x2={700} y1={160} y2={160} strokeWidth={1} style={{ stroke: "var(--rule)" }} />
      <Metric y={194} title="History reload" pct={93.5} />
      <Metric y={266} title="Live stream" pct={76.6} />
      <Label x={20} y={338} size={10} t="faint">
        Mean per conversation across seven replayed test conversations — test bench, not production.
      </Label>
    </Figure>
  );
}

/* ——— Anatomy of an OOM ——— */

function OomExpansion() {
  return (
    <Figure height={312} label="A 5.7 MB spreadsheet expanded to 414 MB retained in memory and was OOM-killed in a 1 GiB pod; with budgets and chunked reads it retains roughly nothing.">
      <Kicker x={20} y={24}>Before</Kicker>
      <rect x={30} y={92} width={20} height={20} rx={3} style={{ fill: tone("ink") }} />
      <Label x={40} y={130} anchor="middle" size={10}>5.7 MB</Label>
      <Label x={198} y={58} anchor="middle">decompress the archive</Label>
      <Label x={198} y={74} anchor="middle">every cell → a Python object</Label>
      <Label x={198} y={90} anchor="middle">several copies alive at once</Label>
      <Arrow pts={[[62, 102], [338, 102]]} t="fix" />
      <rect x={345} y={20} width={170} height={170} rx={6} strokeWidth={1.5} style={{ fill: wash("fix", 18), stroke: tone("fix") }} />
      <Label x={430} y={100} anchor="middle" size={24} t="ink" weight={700} sans>
        414 MB
      </Label>
      <Label x={430} y={120} anchor="middle">retained for one upload</Label>
      <Label x={430} y={136} anchor="middle">≈ 70× the file on disk</Label>
      <Label x={540} y={80} size={12} t="ink" weight={600} sans>
        1 GiB pod
      </Label>
      <Label x={540} y={98} t="accent">OOM-killed mid-reply</Label>
      <Label x={540} y={114}>restart, retry, repeat</Label>

      <line x1={20} x2={700} y1={212} y2={212} style={{ stroke: "var(--rule)" }} />

      <Kicker x={20} y={236}>After</Kicker>
      <rect x={30} y={256} width={20} height={20} rx={3} style={{ fill: tone("ink") }} />
      <Label x={40} y={294} anchor="middle" size={10}>5.7 MB</Label>
      <Label x={198} y={256} anchor="middle">budget rows · cells · output size</Label>
      <Arrow pts={[[62, 266], [338, 266]]} t="perf" />
      <Label x={198} y={286} anchor="middle">read the cache in chunks</Label>
      <rect x={345} y={259} width={14} height={14} rx={2} strokeDasharray="3 2" style={{ fill: "none", stroke: tone("perf") }} />
      <Label x={368} y={271} size={14} t="perf" weight={700} sans>
        ≈ 0 retained
      </Label>
      <Label x={540} y={262} size={12} t="ink" weight={600} sans>
        same 1 GiB pod
      </Label>
      <Label x={540} y={280} t="perf">0 restarts, reply completes</Label>
    </Figure>
  );
}

/* ——— The webhook that downgraded a customer ——— */

function Event({ x, y, n, t }: { x: number; y: number; n: string; t: Tone }) {
  return (
    <g>
      <circle cx={x} cy={y} r={11} strokeWidth={1.4} style={{ fill: "var(--paper)", stroke: tone(t) }} />
      <Label x={x} y={y + 4} anchor="middle" size={11} t="ink" weight={600}>
        {n}
      </Label>
    </g>
  );
}

function WebhookOrder() {
  return (
    <Figure height={322} label="Two subscription events arrive in the opposite order to how they were created. Applying payloads downgrades the customer; re-reading the subscription keeps them on Pro.">
      <Label x={700} y={20} anchor="end" size={10} t="faint">time →</Label>
      <Kicker x={20} y={48}>Created</Kicker>
      <line x1={110} x2={700} y1={44} y2={44} style={{ stroke: "var(--rule-strong)" }} />
      <Kicker x={20} y={128}>Delivered</Kicker>
      <line x1={110} x2={700} y1={124} y2={124} style={{ stroke: "var(--rule-strong)" }} />

      <Arrow pts={[[226, 54], [553, 115]]} t="accent" dashed />
      <Arrow pts={[[327, 55], [303, 113]]} t="infra" dashed />
      <Event x={220} y={44} n="1" t="muted" />
      <Event x={330} y={44} n="2" t="infra" />
      <Label x={220} y={24} anchor="middle" size={10}>plan = Free</Label>
      <Label x={330} y={24} anchor="middle" size={10}>plan = Pro</Label>
      <Event x={300} y={124} n="2" t="infra" />
      <Event x={560} y={124} n="1" t="accent" />
      <Label x={300} y={152} anchor="middle" size={10}>on time</Label>
      <Label x={560} y={152} anchor="middle" size={10} t="accent">arrives late, still says Free</Label>

      <rect x={20} y={180} width={330} height={130} rx={8} style={{ fill: "var(--paper-raised)", stroke: "var(--rule-strong)" }} />
      <Kicker x={36} y={204} t="accent">Before · apply the payload</Kicker>
      <Label x={36} y={232} size={11.5} t="ink">apply 2  →  plan = Pro</Label>
      <Label x={36} y={254} size={11.5} t="ink">apply 1  →  plan = Free</Label>
      <Label x={36} y={288} size={12} t="accent" weight={600} sans>
        Paying customer downgraded ✗
      </Label>

      <rect x={370} y={180} width={330} height={130} rx={8} style={{ fill: "var(--paper-raised)", stroke: "var(--rule-strong)" }} />
      <Kicker x={386} y={204} t="perf">After · treat it as a doorbell</Kicker>
      <Label x={386} y={232} size={11.5} t="ink">2  →  re-read subscription: Pro</Label>
      <Label x={386} y={254} size={11.5} t="ink">1  →  older than applied: dropped</Label>
      <Label x={386} y={288} size={12} t="perf" weight={600} sans>
        Plan stays Pro ✓
      </Label>
    </Figure>
  );
}

/* ——— Keeping long-running AI streams alive ——— */

function Tokens({ from, to, y }: { from: number; to: number; y: number }) {
  const bars = [];
  for (let x = from, i = 0; x <= to; x += 6, i++) {
    const h = 6 + ((i * 7) % 9) * 1.4;
    bars.push(<rect key={x} x={x} y={y - h / 2} width={3} height={h} rx={1} style={{ fill: tone("ink"), opacity: 0.7 }} />);
  }
  return <g>{bars}</g>;
}

function StreamHeartbeat() {
  const before = 78;
  const after = 178;
  return (
    <Figure height={226} label="During a long silent tool call, a proxy idle timeout cuts the stream; with heartbeat events every hop stays awake and the reply completes.">
      <line x1={270} x2={550} y1={30} y2={30} style={{ stroke: "var(--faint)" }} />
      <line x1={270} x2={270} y1={30} y2={37} style={{ stroke: "var(--faint)" }} />
      <line x1={550} x2={550} y1={30} y2={37} style={{ stroke: "var(--faint)" }} />
      <Label x={410} y={22} anchor="middle" size={10.5}>slow tool call — minutes with nothing to send</Label>

      <Kicker x={20} y={before + 4}>Before</Kicker>
      <Tokens from={112} to={262} y={before} />
      <line x1={266} x2={424} y1={before} y2={before} style={{ stroke: "var(--rule-strong)" }} />
      <path d={`M424 ${before - 7} l14 14 M438 ${before - 7} l-14 14`} strokeWidth={2} style={{ stroke: tone("accent") }} />
      <line x1={446} x2={700} y1={before} y2={before} strokeDasharray="3 5" style={{ stroke: "var(--faint)" }} />
      <Label x={431} y={before + 28} anchor="middle" t="accent">idle timeout — stream cut</Label>
      <Label x={620} y={before + 28} anchor="middle" t="faint">reply never arrives</Label>

      <Kicker x={20} y={after + 4}>After</Kicker>
      <Tokens from={112} to={262} y={after} />
      <line x1={266} x2={552} y1={after} y2={after} style={{ stroke: "var(--rule-strong)" }} />
      {[290, 330, 370, 410, 450, 490, 530].map((x, i) => (
        <circle
          key={x}
          cx={x}
          cy={after}
          r={4.5}
          className="fig-pulse"
          style={{ fill: tone("perf"), animationDelay: `${i * 0.25}s` }}
        />
      ))}
      <Tokens from={556} to={700} y={after} />
      <Label x={410} y={after + 28} anchor="middle" t="perf">heartbeats keep every hop awake</Label>
      <Label x={628} y={after + 28} anchor="middle" t="perf">reply completes ✓</Label>
    </Figure>
  );
}

/* ——— Your PR title just ran in our CI ——— */

function CiInjection() {
  const col = (x: number, fixed: boolean) => (
    <g>
      <Box x={x} y={36} w={320} h={58} title="PR title — anyone can write it" sub={["fix: $(whoami)"]} />
      <Arrow pts={[[x + 160, 94], [x + 160, 126]]} t={fixed ? "perf" : "accent"} />
      {fixed ? (
        <Box x={x} y={128} w={320} h={58} title="Runner sets env PR_TITLE" sub={['run: echo "Releasing: $PR_TITLE"']} />
      ) : (
        <Box x={x} y={128} w={320} h={58} title="Actions expands ${{ … }} first" sub={['echo "Releasing: fix: $(whoami)"']} />
      )}
      <Arrow pts={[[x + 160, 186], [x + 160, 218]]} t={fixed ? "perf" : "accent"} />
      {fixed ? (
        <Box x={x} y={220} w={320} h={58} title="bash parses, then expands" sub={["the title is only ever data ✓"]} t="perf" filled />
      ) : (
        <Box x={x} y={220} w={320} h={58} title="bash parses the pasted script" sub={["$(whoami) runs as a command ✗"]} t="accent" filled />
      )}
    </g>
  );
  return (
    <Figure height={290} label="Interpolating a PR title into a run block pastes it into the script before bash parses it, so a command substitution executes; passing it through an environment variable keeps it as data.">
      <Kicker x={20} y={22} t="accent">Interpolated · vulnerable</Kicker>
      <Kicker x={380} y={22} t="perf">Through env · fixed</Kicker>
      {col(20, false)}
      {col(380, true)}
    </Figure>
  );
}

/* ——— A document is a tool call ——— */

function ToolPipeline() {
  const steps = [
    { title: "Pull findings", sub: ["from the", "conversation"] },
    { title: "Isolated call", sub: ["one model,", "no tools"] },
    { title: "Validate", sub: ["repair, then", "check"] },
    { title: "Retry once", sub: ["with the", "exact error"] },
  ];
  const after = [
    { title: "Return only an id", sub: ["the body never", "rides the chat"], t: "accent" as Tone },
    { title: "Reply row commits", sub: ["the message is saved"], t: "ink" as Tone },
    { title: "Persist + rewrite tag", sub: ["true id replaces", "the typed one"], t: "ink" as Tone },
    { title: "Browser fetches by id", sub: ["after the turn ends"], t: "perf" as Tone },
  ];
  return (
    <Figure height={326} label="The orchestrator sends a brief to the report tool, which pulls findings, makes one isolated call, validates and retries once, then returns only an id; the document is persisted after the reply commits and fetched by id.">
      <Box x={20} y={48} w={150} h={62} title="Orchestrator" sub={["writes a small brief"]} />
      <Arrow pts={[[170, 79], [210, 79]]} t="accent" flow />
      <Label x={190} y={70} anchor="middle" size={9.5}>brief</Label>
      <rect x={200} y={14} width={500} height={150} rx={10} strokeDasharray="5 4" style={{ fill: "none", stroke: "var(--rule-strong)" }} />
      <Kicker x={214} y={34}>Report tool</Kicker>
      {steps.map((s, i) => (
        <g key={s.title}>
          <Box x={214 + i * 122} y={48} w={110} h={62} title={s.title} sub={s.sub} t={i === 2 ? "fix" : "ink"} filled={i === 2} />
          {i < 3 && <Arrow pts={[[324 + i * 122, 79], [336 + i * 122, 79]]} />}
        </g>
      ))}
      <Label x={450} y={142} anchor="middle" size={10.5}>
        tiered recovery if it overflows · one hard time ceiling over all of it
      </Label>
      <Arrow pts={[[635, 110], [635, 180], [95, 180], [95, 196]]} t="accent" flow />
      {after.map((s, i) => (
        <g key={s.title}>
          <Box x={20 + i * 176} y={198} w={150} h={62} title={s.title} sub={s.sub} t={s.t} filled={s.t !== "ink"} />
          {i < 3 && <Arrow pts={[[170 + i * 176, 229], [196 + i * 176, 229]]} flow />}
        </g>
      ))}
      <rect x={20} y={280} width={680} height={34} rx={8} strokeDasharray="5 4" style={{ fill: wash("accent", 6), stroke: tone("accent") }} />
      <Label x={36} y={301} t="accent" weight={600}>✕ on failure</Label>
      <Label x={140} y={301}>answer inline with the full data — no half-documents, no apology</Label>
    </Figure>
  );
}

/* ——— The dangling reference ——— */

function Node({ x, y, w, text, t = "ink", dashed, filled, struck }: { x: number; y: number; w: number; text: string; t?: Tone; dashed?: boolean; filled?: boolean; struck?: boolean }) {
  return (
    <g>
      <rect
        x={x}
        y={y}
        width={w}
        height={30}
        rx={6}
        strokeWidth={1.3}
        strokeDasharray={dashed ? "4 3" : undefined}
        style={{ fill: filled ? wash(t, 14) : "var(--paper-raised)", stroke: t === "ink" ? "var(--rule-strong)" : tone(t) }}
      />
      <Label x={x + w / 2} y={y + 19} anchor="middle" size={11.5} t={t === "faint" ? "faint" : t === "ink" ? "ink" : t}>
        {text}
      </Label>
      {struck && <line x1={x + 10} x2={x + w - 10} y1={y + 15} y2={y + 15} style={{ stroke: tone("faint") }} />}
    </g>
  );
}

function Graph({ ox, repaired }: { ox: number; repaired: boolean }) {
  const top: readonly [number, number] = [ox + 165, 118];
  return (
    <g>
      <Node x={ox + 110} y={88} w={110} text="page" />
      <Arrow pts={[top, [ox + 45, 160]]} />
      <Arrow pts={[top, [ox + 165, 160]]} t={repaired ? "perf" : "accent"} />
      <Arrow pts={[top, [ox + 280, 160]]} t={repaired ? "faint" : "accent"} dashed={repaired} />
      <Node x={ox} y={162} w={90} text="kpis" />
      {repaired ? (
        <>
          <Node x={ox + 105} y={162} w={120} text="spend_section" t="perf" filled />
          <Label x={ox + 165} y={208} anchor="middle" size={10} t="perf">rewired</Label>
          <Node x={ox + 240} y={162} w={80} text="notes" t="faint" dashed struck />
          <Label x={ox + 280} y={208} anchor="middle" size={10} t="faint">pruned</Label>
          <Label x={ox} y={244}>rewire only if the target is</Label>
          <Label x={ox} y={260}>not mounted elsewhere, not itself,</Label>
          <Label x={ox} y={276}>and can’t reach back (no cycle)</Label>
          <Label x={ox} y={298} t="faint">skeleton-only result → keep the failure</Label>
        </>
      ) : (
        <>
          <Node x={ox + 105} y={162} w={120} text="spend-section" t="accent" dashed />
          <Node x={ox + 240} y={162} w={80} text="notes" t="accent" dashed />
          <Label x={ox + 280} y={208} anchor="middle" size={10} t="accent">missing</Label>
          <line x1={ox + 165} x2={ox + 165} y1={193} y2={236} strokeDasharray="2 3" style={{ stroke: "var(--faint)" }} />
          <Label x={ox + 173} y={222} size={10} t="faint">same key, normalised</Label>
          <Node x={ox + 105} y={238} w={120} text="spend_section" t="muted" />
          <Label x={ox + 165} y={286} anchor="middle" size={10}>exists · never mounted</Label>
        </>
      )}
    </g>
  );
}

function DanglingRepair() {
  return (
    <Figure height={308} label="Seven of fourteen recent failures were dangling references. A near-miss key is rewired to the existing element and a key with no match is pruned.">
      {Array.from({ length: 14 }, (_, i) => (
        <rect
          key={i}
          x={20 + i * 24}
          y={14}
          width={18}
          height={18}
          rx={3}
          strokeWidth={1.2}
          style={i < 7 ? { fill: tone("accent") } : { fill: "none", stroke: "var(--rule-strong)" }}
        />
      ))}
      <Label x={366} y={28} size={12} t="ink" weight={600} sans>
        7 of 14 recent failures: one bug
      </Label>
      <Kicker x={20} y={72}>As generated</Kicker>
      <Kicker x={380} y={72}>After repair</Kicker>
      <Graph ox={20} repaired={false} />
      <Graph ox={380} repaired />
    </Figure>
  );
}

/* ——— The AI writes the first draft ——— */

type Chip = { n: number; who: "AI" | "you"; fresh?: boolean };

function VersionRow({ r, title, sub, chips, current, note }: { r: number; title: string; sub: string; chips: Chip[]; current: number; note: string }) {
  return (
    <g>
      <Label x={20} y={r + 36} size={12} t="ink" weight={600} sans>
        {title}
      </Label>
      <Label x={20} y={r + 51} size={10.5}>
        {sub}
      </Label>
      {chips.map((c, i) => {
        const x = 150 + i * 84;
        const cx = x + 33;
        const t: Tone = c.fresh ? "perf" : c.who === "AI" ? "infra" : "feat";
        return (
          <g key={c.n}>
            {i === current && (
              <>
                <Label x={cx} y={r + 10} anchor="middle" size={9.5} t="accent">current</Label>
                <polygon points={`${cx - 5},${r + 13} ${cx + 5},${r + 13} ${cx},${r + 19}`} style={{ fill: tone("accent") }} />
              </>
            )}
            <rect
              x={x}
              y={r + 22}
              width={66}
              height={34}
              rx={6}
              strokeWidth={i === current ? 1.8 : 1.2}
              style={{ fill: i === current || c.fresh ? wash(t, 16) : "var(--paper-raised)", stroke: tone(t) }}
            />
            <Label x={cx} y={r + 37} anchor="middle" size={12} t="ink" weight={600} sans>
              {`v${c.n}`}
            </Label>
            <Label x={cx} y={r + 50} anchor="middle" size={9.5}>
              {c.fresh ? "v2 + edit" : c.who}
            </Label>
          </g>
        );
      })}
      <Label x={150} y={r + 74} size={10.5}>
        {note}
      </Label>
    </g>
  );
}

function VersionPointer() {
  const five: Chip[] = [
    { n: 1, who: "AI" },
    { n: 2, who: "AI" },
    { n: 3, who: "you" },
    { n: 4, who: "AI" },
    { n: 5, who: "you" },
  ];
  return (
    <Figure height={290} label="Five versions with v5 current; restoring v2 only moves the pointer; editing after the restore creates v6 and leaves v3 to v5 in place.">
      <rect x={596} y={8} width={10} height={10} rx={2} strokeWidth={1.2} style={{ fill: "none", stroke: tone("infra") }} />
      <Label x={612} y={17} size={10}>AI</Label>
      <rect x={638} y={8} width={10} height={10} rx={2} strokeWidth={1.2} style={{ fill: "none", stroke: tone("feat") }} />
      <Label x={654} y={17} size={10}>person</Label>
      <VersionRow r={10} title="Five versions" sub="v5 is current" chips={five} current={4} note="every change, model or person, appends a full snapshot" />
      <VersionRow r={105} title="Restore v2" sub="a pointer move" chips={five} current={1} note="nothing copied, nothing deleted — v3 to v5 stay put" />
      <VersionRow
        r={200}
        title="Edit after restore"
        sub="numbered max + 1"
        chips={[...five, { n: 6, who: "you", fresh: true }]}
        current={5}
        note="history branches forward; nothing after the restore is lost"
      />
    </Figure>
  );
}

/* ——— One spec, five surfaces ——— */

function FiveSurfaces() {
  return (
    <Figure height={316} label="One JSON spec renders separately into the in-app panel, PDF, DOCX, typed spreadsheets and files in the user's own drive, with no chained conversions.">
      <Label x={360} y={34} anchor="middle" t="accent" weight={600}>✕ no chained conversions</Label>
      <Label x={360} y={50} anchor="middle" size={10.5}>every surface renders from the spec</Label>
      <Box x={280} y={120} w={160} h={74} title="One JSON spec" sub={["typed blocks,", "not markup"]} t="accent" filled />
      <Box x={20} y={24} w={200} h={62} title="In-app panel" sub={["live charts ⇄ tables"]} t="infra" />
      <Box x={20} y={236} w={200} h={62} title="PDF" sub={["print template,", "headless Chromium"]} t="infra" />
      <Box x={500} y={24} w={200} h={62} title="DOCX" sub={["native Word elements"]} t="infra" />
      <Box x={500} y={236} w={200} h={62} title="Excel · Google Sheets" sub={["typed cells: numbers, not text"]} t="infra" />
      <Box x={250} y={244} w={220} h={58} title="Your Drive / OneDrive" sub={["re-export updates the same file"]} t="perf" filled />
      <Arrow pts={[[280, 138], [222, 70]]} t="infra" flow />
      <Arrow pts={[[280, 178], [222, 258]]} t="infra" flow />
      <Arrow pts={[[440, 138], [498, 70]]} t="infra" flow />
      <Arrow pts={[[440, 178], [498, 258]]} t="infra" flow />
      <Arrow pts={[[360, 194], [360, 242]]} t="perf" flow />
    </Figure>
  );
}

/* ——— Teaching the model when to stop ——— */

function Diamond({ cx, cy, hw, hh }: { cx: number; cy: number; hw: number; hh: number }) {
  return (
    <g>
      <polygon
        points={`${cx - hw},${cy} ${cx},${cy - hh} ${cx + hw},${cy} ${cx},${cy + hh}`}
        strokeWidth={1.25}
        style={{ fill: "var(--paper-raised)", stroke: "var(--rule-strong)" }}
      />
      <Label x={cx} y={cy + 4} anchor="middle" size={11} t="ink">
        ≤ cap × 1.3?
      </Label>
    </g>
  );
}

function PageBudget() {
  return (
    <Figure height={292} label="A draft's pages are estimated; within 1.3 times the cap it ships, otherwise it gets one condense retry, and if still over it ships flagged with the reply admitting the overrun.">
      <Box x={20} y={30} w={110} h={56} title="Draft" sub={["from the model"]} />
      <Arrow pts={[[130, 58], [150, 58]]} />
      <Box x={152} y={30} w={170} h={56} title="Estimate pages" sub={["chars per page +", "weight per block"]} />
      <Arrow pts={[[322, 58], [338, 58]]} />
      <Diamond cx={395} cy={58} hw={55} hh={36} />
      <Arrow pts={[[450, 58], [558, 58]]} t="perf" />
      <Label x={505} y={50} anchor="middle" t="perf">yes</Label>
      <Box x={560} y={30} w={140} h={56} title="Ship" sub={["within budget ✓"]} t="perf" filled />
      <Arrow pts={[[395, 94], [395, 128]]} t="accent" />
      <Label x={404} y={116} t="accent">no</Label>
      <Box x={315} y={130} w={160} h={56} title="One condense retry" sub={["condense, never truncate"]} />
      <Arrow pts={[[475, 158], [548, 158]]} />
      <Diamond cx={600} cy={158} hw={50} hh={34} />
      <Arrow pts={[[600, 124], [600, 88]]} t="perf" />
      <Label x={608} y={110} t="perf">yes</Label>
      <Arrow pts={[[600, 192], [600, 212]]} t="accent" />
      <Label x={608} y={206} t="accent">no</Label>
      <Box x={500} y={214} w={200} h={56} title="Ship flagged" sub={["the reply admits it ran long"]} t="fix" filled />
      <Kicker x={20} y={232}>Why this shape</Kicker>
      <Label x={20} y={250}>the cap is trusted at face value:</Label>
      <Label x={20} y={266}>an invented cap costs one retry,</Label>
      <Label x={20} y={282}>a missed real cap costs the bug</Label>
    </Figure>
  );
}

export const FIGURES: Record<FigureId, () => ReactElement> = {
  "payload-diet": PayloadDiet,
  "oom-expansion": OomExpansion,
  "webhook-order": WebhookOrder,
  "stream-heartbeat": StreamHeartbeat,
  "ci-injection": CiInjection,
  "tool-pipeline": ToolPipeline,
  "dangling-repair": DanglingRepair,
  "version-pointer": VersionPointer,
  "five-surfaces": FiveSurfaces,
  "page-budget": PageBudget,
};
