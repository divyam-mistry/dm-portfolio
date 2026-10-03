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
    <Figure height={312} label="A 5.7 MB spreadsheet held 11.5 million characters that three code paths each kept in full, taking resident memory to 414 MB until a 1 GiB pod was OOM-killed; with budgets and chunked reads the same reads return memory.">
      <Kicker x={20} y={24}>Before</Kicker>
      <rect x={30} y={92} width={20} height={20} rx={3} style={{ fill: tone("ink") }} />
      <Label x={40} y={130} anchor="middle" size={10}>5.7 MB</Label>
      <Label x={198} y={58} anchor="middle">34.8 MB of XML → 11.5 M chars</Label>
      <Label x={198} y={74} anchor="middle">three paths hold it in full</Label>
      <Label x={198} y={90} anchor="middle">re-decoded on each of 16 reads</Label>
      <Arrow pts={[[62, 102], [338, 102]]} t="fix" />
      <rect x={345} y={20} width={170} height={170} rx={6} strokeWidth={1.5} style={{ fill: wash("fix", 18), stroke: tone("fix") }} />
      <Label x={430} y={100} anchor="middle" size={24} t="ink" weight={700} sans>
        414 MB
      </Label>
      <Label x={430} y={120} anchor="middle">resident after 16 reads</Label>
      <Label x={430} y={136} anchor="middle">(153 MB before the file)</Label>
      <Label x={540} y={80} size={12} t="ink" weight={600} sans>
        1 GiB pod
      </Label>
      <Label x={540} y={98} t="accent">OOM-killed mid-reply</Label>
      <Label x={540} y={114}>restart, retry, repeat</Label>

      <line x1={20} x2={700} y1={212} y2={212} style={{ stroke: "var(--rule)" }} />

      <Kicker x={20} y={236}>After</Kicker>
      <rect x={30} y={256} width={20} height={20} rx={3} style={{ fill: tone("ink") }} />
      <Label x={40} y={294} anchor="middle" size={10}>5.7 MB</Label>
      <Label x={198} y={256} anchor="middle">2 M-char budget · lazy extractors</Label>
      <Arrow pts={[[62, 266], [338, 266]]} t="perf" />
      <Label x={198} y={286} anchor="middle">each read fetches ≤ 2 chunks</Label>
      <rect x={345} y={259} width={14} height={14} rx={2} strokeDasharray="3 2" style={{ fill: "none", stroke: tone("perf") }} />
      <Label x={368} y={271} size={14} t="perf" weight={700} sans>
        −15 MB
      </Label>
      <Label x={368} y={288} size={10}>memory handed back</Label>
      <Label x={540} y={262} size={12} t="ink" weight={600} sans>
        same 1 GiB pod
      </Label>
      <Label x={540} y={280} t="perf">655 Mi peak, 0 restarts</Label>
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
      <Box x={x} y={36} w={320} h={58} title="PR text — anyone can write it" sub={["promotes `dev` to `main`"]} />
      <Arrow pts={[[x + 160, 94], [x + 160, 126]]} t={fixed ? "perf" : "accent"} />
      {fixed ? (
        <Box x={x} y={128} w={320} h={58} title="Runner sets env PR_BODY" sub={['run: echo "$PR_BODY"']} />
      ) : (
        <Box x={x} y={128} w={320} h={58} title="Actions expands ${{ … }} first" sub={['echo "promotes `dev` to `main`"']} />
      )}
      <Arrow pts={[[x + 160, 186], [x + 160, 218]]} t={fixed ? "perf" : "accent"} />
      {fixed ? (
        <Box x={x} y={220} w={320} h={58} title="bash parses, then expands" sub={["the text is only ever data ✓"]} t="perf" filled />
      ) : (
        <Box x={x} y={220} w={320} h={58} title="bash parses the pasted script" sub={["`dev` runs as a command ✗"]} t="accent" filled />
      )}
    </g>
  );
  return (
    <Figure height={290} label="Interpolating pull-request text into a run block pastes it into the script before bash parses it, so backticks run as command substitution; passing it through an environment variable keeps it as data.">
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
    { title: "Gather source", sub: ["reads the data", "itself"] },
    { title: "Isolated call", sub: ["one model,", "no tools"] },
    { title: "Validate", sub: ["repair, then", "check"] },
    { title: "Retry once", sub: ["with the", "exact error"] },
  ];
  const after = [
    { title: "Return an id", sub: ["the body never", "rides the chat"], t: "accent" as Tone },
    { title: "Store the document", sub: ["under the server's id"], t: "ink" as Tone },
    { title: "Client fetches by id", sub: ["never a model-typed id"], t: "perf" as Tone },
  ];
  return (
    <Figure height={326} label="The answering model calls a document tool with a short brief; the tool gathers its own source data, makes one isolated call, validates and retries once, then returns only an id that the client uses to fetch the stored document.">
      <Box x={20} y={48} w={150} h={62} title="Answering model" sub={["sends a short brief"]} />
      <Arrow pts={[[170, 79], [210, 79]]} t="accent" flow />
      <rect x={200} y={14} width={500} height={150} rx={10} strokeDasharray="5 4" style={{ fill: "none", stroke: "var(--rule-strong)" }} />
      <Kicker x={214} y={34}>Document tool</Kicker>
      {steps.map((s, i) => (
        <g key={s.title}>
          <Box x={214 + i * 122} y={48} w={110} h={62} title={s.title} sub={s.sub} t={i === 2 ? "fix" : "ink"} filled={i === 2} />
          {i < 3 && <Arrow pts={[[324 + i * 122, 79], [336 + i * 122, 79]]} />}
        </g>
      ))}
      <Label x={450} y={142} anchor="middle" size={10.5}>
        one hard time ceiling over all of it
      </Label>
      <Arrow pts={[[635, 110], [635, 180], [120, 180], [120, 196]]} t="accent" flow />
      {after.map((s, i) => (
        <g key={s.title}>
          <Box x={20 + i * 240} y={198} w={200} h={62} title={s.title} sub={s.sub} t={s.t} filled={s.t !== "ink"} />
          {i < 2 && <Arrow pts={[[220 + i * 240, 229], [258 + i * 240, 229]]} flow />}
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

/* ——— Fast alone, slow together ——— */

function QueryBars({ y, title, before, after, pct }: { y: number; title: string; before: number; after: number; pct: string }) {
  const x = 220;
  const k = 340 / 63.8;
  const bw = before * k;
  const aw = Math.max(after * k, 3);
  return (
    <g>
      <Label x={20} y={y + 23} size={12} t="ink" weight={600} sans>
        {title}
      </Label>
      <rect x={x} y={y + 4} width={bw} height={12} rx={3} style={{ fill: wash("muted", 35) }} />
      <Label x={x + bw + 8} y={y + 14} size={10}>{`${before} s`}</Label>
      <rect x={x} y={y + 22} width={aw} height={12} rx={3} style={{ fill: tone("perf") }} />
      <Label x={x + aw + 8} y={y + 32} size={10} t="perf">{`${after} s`}</Label>
      <Label x={700} y={y + 26} anchor="end" size={14} t="perf" weight={700} sans>
        {pct}
      </Label>
    </g>
  );
}

function QueryTuning() {
  return (
    <Figure height={306} label="Four slow queries fell by 80 to 98 percent in isolated runs after indexing and planner tuning, but under three concurrent users the tuned report query A doubled to 26.3 seconds because no parallel workers were launched.">
      <rect x={220} y={10} width={12} height={10} rx={2} style={{ fill: wash("muted", 35) }} />
      <Label x={238} y={19} size={10}>before</Label>
      <rect x={292} y={10} width={12} height={10} rx={2} style={{ fill: tone("perf") }} />
      <Label x={310} y={19} size={10}>after · isolated EXPLAIN ANALYZE</Label>
      <QueryBars y={34} title="Report query A" before={63.8} after={12.4} pct="−80.5%" />
      <QueryBars y={88} title="Report query B" before={37.6} after={6.9} pct="−81.7%" />
      <QueryBars y={142} title="Report query C" before={30.8} after={3.1} pct="−90.0%" />
      <QueryBars y={196} title="Catalogue query" before={35.4} after={0.78} pct="−97.8%" />
      <line x1={20} x2={700} y1={250} y2={250} style={{ stroke: "var(--rule)" }} />
      <Kicker x={20} y={274} t="accent">
        Under load
      </Kicker>
      <Label x={110} y={274}>3 concurrent users: the tuned 12.4 s query took 26.3 s</Label>
      <Label x={110} y={292} t="accent">
        the plan said Workers Planned: 2 · Workers Launched: 0
      </Label>
    </Figure>
  );
}

/* ——— Six Stripe assumptions ——— */

function PayThenApply() {
  return (
    <Figure height={306} label="Changing the plan before charging lets a cancelled 3-D Secure challenge keep the upgrade; a pending update applies the change only once the invoice is paid, and expires otherwise.">
      <Kicker x={20} y={22} t="accent">
        Before · change the plan, then charge
      </Kicker>
      <Box x={20} y={34} w={140} h={56} title="Update items" sub={["plan switches now"]} />
      <Arrow pts={[[160, 62], [198, 62]]} t="accent" />
      <Box x={200} y={34} w={140} h={56} title="Confirm payment" sub={["3-D Secure challenge"]} />
      <Arrow pts={[[340, 62], [378, 62]]} t="accent" />
      <Box x={380} y={34} w={140} h={56} title="User cancels" sub={["challenge abandoned"]} />
      <Arrow pts={[[520, 62], [558, 62]]} t="accent" />
      <Box x={560} y={34} w={140} h={56} title="Plan kept" sub={["nobody paid ✗"]} t="accent" filled />
      <line x1={20} x2={700} y1={116} y2={116} style={{ stroke: "var(--rule)" }} />
      <Kicker x={20} y={142} t="perf">
        After · pending_if_incomplete
      </Kicker>
      <Box x={20} y={176} w={140} h={56} title="Pending update" sub={["plan unchanged"]} />
      <Arrow pts={[[160, 204], [198, 204]]} t="perf" />
      <Box x={200} y={176} w={140} h={56} title="Confirm payment" sub={["3-D Secure challenge"]} />
      <Arrow pts={[[340, 196], [398, 175]]} t="perf" />
      <Arrow pts={[[340, 212], [398, 239]]} t="fix" />
      <Box x={400} y={150} w={300} h={50} title="Invoice paid → update applied" sub={["the plan changes only now ✓"]} t="perf" filled />
      <Box x={400} y={214} w={300} h={50} title="Not paid → pending update expires" sub={["the plan never changed ✓"]} t="fix" filled />
      <Label x={20} y={292} size={10} t="faint">
        default_incomplete is for creating subscriptions — on an update it applies the change immediately
      </Label>
    </Figure>
  );
}

/* ——— A server action is a public endpoint ——— */

function OneGate() {
  const doors = [
    { title: "Button in the UI", sub: "the path we click-test" },
    { title: "Direct POST to the action", sub: "anyone who loads the page" },
    { title: "Agent tool call", sub: "no controller involved" },
    { title: "Scheduled automation", sub: "no request at all" },
  ];
  return (
    <Figure height={280} label="Four ways in — a UI button, a direct call to the server action, an agent tool and a scheduled automation — all pass the same service-layer check before reaching data; a check in the UI guards only one of them.">
      {doors.map((d, i) => (
        <g key={d.title}>
          <Box x={20} y={16 + i * 62} w={210} h={50} title={d.title} sub={[d.sub]} />
          <Arrow pts={[[230, 41 + i * 62], [318, 116 + i * 14]]} t="perf" flow />
        </g>
      ))}
      <Label x={420} y={40} anchor="middle" t="accent" weight={600}>
        ✕ a check in the UI
      </Label>
      <Label x={420} y={56} anchor="middle" size={10.5}>
        guards one door of four
      </Label>
      <Box x={320} y={96} w={200} h={90} title="Service chokepoint" sub={["identity from the session", "authorisation", "plan entitlement"]} t="perf" filled />
      <Arrow pts={[[520, 141], [578, 141]]} t="perf" />
      <Box x={580} y={111} w={120} h={60} title="Data" sub={["one way in"]} />
      <Label x={20} y={272} size={10} t="faint">
        every door gets the same checks, as if the caller were hostile and no UI existed
      </Label>
    </Figure>
  );
}

/* ——— Every model call has a price ——— */

function MeteringChokepoint() {
  const paths: { title: string; sub: string; t: Tone }[] = [
    { title: "Main agent loop", sub: "metered from the start", t: "ink" },
    { title: "Side model calls", sub: "outside the loop: free", t: "accent" },
    { title: "Vision calls", sub: "was unmetered", t: "accent" },
    { title: "Image · video", sub: "4K tier priced at 0", t: "accent" },
  ];
  return (
    <Figure height={300} label="Every path that calls a model — the main agent loop, side model calls, vision calls and media generation — goes through one canonical model key, a cost catalogue where unknown never means zero, and a ledger row per charge.">
      {paths.map((p, i) => (
        <g key={p.title}>
          <Box x={20} y={14 + i * 56} w={190} h={46} title={p.title} sub={[p.sub]} t={p.t} />
          <Arrow pts={[[210, 37 + i * 56], [268, 92 + i * 12]]} t="infra" flow />
        </g>
      ))}
      <Box x={270} y={74} w={190} h={80} title="Canonical model key" sub={["gateway prefix stripped", "once, in one place"]} t="infra" filled />
      <Arrow pts={[[460, 100], [508, 60]]} t="infra" />
      <Box x={510} y={20} w={190} h={64} title="Cost catalogue" sub={["unknown → default rate,", "never zero"]} />
      <Arrow pts={[[605, 84], [605, 128]]} t="perf" />
      <Box x={510} y={130} w={190} h={64} title="Wallet + ledger" sub={["one row per charge"]} t="perf" filled />
      <line x1={20} x2={700} y1={246} y2={246} style={{ stroke: "var(--rule)" }} />
      <Kicker x={20} y={268}>Audits</Kicker>
      <Label x={90} y={268}>per model: every one that ran reconciled · 0 billing failures</Label>
      <Label x={90} y={288}>ledger vs traces, 62 conversations: 0 missed charges · cost ratio 1.000</Label>
    </Figure>
  );
}

/* ——— When your auth provider is slow ——— */

function HotPath() {
  return (
    <Figure height={262} label="Before, every AI request asked the identity provider's API about memberships and hung until a 60-second timeout during its incident; after, the route combines a client hint with a signed claim locally and makes no provider calls.">
      <Kicker x={20} y={22} t="accent">
        Before · ask the provider on every request
      </Kicker>
      <Box x={20} y={34} w={150} h={56} title="Browser" sub={["any AI request"]} />
      <Arrow pts={[[170, 62], [208, 62]]} />
      <Box x={210} y={34} w={170} h={56} title="AI route" sub={["needs memberships"]} />
      <Arrow pts={[[380, 62], [418, 62]]} t="accent" />
      <Box x={420} y={34} w={150} h={56} title="Provider API" sub={["membership lookup"]} t="accent" dashed />
      <Label x={582} y={56} t="accent" weight={600}>
        slow → hangs
      </Label>
      <Label x={582} y={74} size={10.5}>
        60 s timeout, 504
      </Label>
      <line x1={20} x2={700} y1={116} y2={116} style={{ stroke: "var(--rule)" }} />
      <Kicker x={20} y={142} t="perf">
        After · decide locally
      </Kicker>
      <Box x={20} y={154} w={150} h={56} title="Browser" sub={["sends a cached hint"]} />
      <Arrow pts={[[170, 182], [208, 182]]} t="perf" flow />
      <Box x={210} y={154} w={210} h={56} title="AI route" sub={["hint AND signed claim"]} t="perf" filled />
      <Arrow pts={[[420, 182], [468, 182]]} t="perf" flow />
      <Box x={470} y={154} w={230} h={56} title="Response" sub={["0 calls to the provider"]} t="perf" />
      <Label x={20} y={246} size={10.5}>
        no signed claim → the hint is ignored, whatever the client sends
      </Label>
    </Figure>
  );
}

/* ——— Three quiet React Query behaviours ——— */

function Screen({ x, kicker, kt, url, lines, msgs, verdict, vt }: { x: number; kicker: string; kt: Tone; url: string; lines: string[]; msgs?: Tone; verdict: string; vt: Tone }) {
  return (
    <g>
      <Kicker x={x} y={22} t={kt}>
        {kicker}
      </Kicker>
      <rect x={x} y={34} width={200} height={196} rx={8} strokeWidth={1.25} style={{ fill: "var(--paper-raised)", stroke: "var(--rule-strong)" }} />
      <Label x={x + 12} y={52} size={10.5} t="ink">
        {url}
      </Label>
      <line x1={x} x2={x + 200} y1={62} y2={62} style={{ stroke: "var(--rule)" }} />
      {lines.map((l, i) => (
        <Label key={l} x={x + 12} y={80 + i * 15} size={10}>
          {l}
        </Label>
      ))}
      {msgs ? (
        [0, 1, 2].map((i) => (
          <rect key={i} x={x + 12 + (i % 2) * 40} y={122 + i * 28} width={i % 2 ? 136 : 150} height={18} rx={5} style={{ fill: wash(msgs, 30) }} />
        ))
      ) : (
        <Label x={x + 100} y={170} anchor="middle" size={10} t="faint">
          (no messages yet)
        </Label>
      )}
      <Label x={x + 100} y={252} anchor="middle" size={11.5} t={vt} weight={600} sans>
        {verdict}
      </Label>
    </g>
  );
}

function PlaceholderLeak() {
  return (
    <Figure height={266} label="With bare keepPreviousData, clicking New chat disables the query and the previous conversation's messages stay on screen; scoping the placeholder to the conversation id shows an empty chat.">
      <Screen x={20} kicker="1 · chat A open" kt="faint" url="/chat/A" lines={["key [messages, A]", "query enabled"]} msgs="ink" verdict="shows A ✓" vt="perf" />
      <Arrow pts={[[222, 132], [258, 132]]} />
      <Screen
        x={260}
        kicker="2 · click New chat"
        kt="accent"
        url="/chat"
        lines={["key [messages, undefined]", "disabled: placeholder stays"]}
        msgs="accent"
        verdict="still shows A ✗"
        vt="accent"
      />
      <Arrow pts={[[462, 132], [498, 132]]} t="perf" />
      <Screen x={500} kicker="3 · placeholder scoped to id" kt="perf" url="/chat" lines={["previous id ≠ current id", "→ no placeholder"]} verdict="empty new chat ✓" vt="perf" />
    </Figure>
  );
}

/* ——— Eighteen links in, zero out ——— */

function LinkFunnel() {
  const hops: { title: string; n: string; sub: string; t: Tone }[] = [
    { title: "Source API", n: "18", sub: "preview links", t: "ink" },
    { title: "Summary step", n: "19", sub: "one repeated", t: "ink" },
    { title: "Document step", n: "0", sub: "never saw them", t: "accent" },
    { title: "Word export", n: "0", sub: "clickable links", t: "accent" },
  ];
  const fixes = [
    ["Name the field", "in tool descriptions"],
    ["Carry it through", "keep links on merge"],
    ["Corroborate", "exact match, or empty"],
    ["Real hyperlinks", "scheme allowlist"],
  ];
  return (
    <Figure height={272} label="One failing run: the source API returned 18 preview links, the summary step carried 19, the document step emitted 0 and the Word export had none clickable; each layer got its own deterministic fix.">
      <Kicker x={20} y={22}>One failing run, counted at every hop</Kicker>
      {hops.map((h, i) => {
        const x = 20 + i * 176;
        return (
          <g key={h.title}>
            <rect
              x={x}
              y={34}
              width={152}
              height={92}
              rx={8}
              strokeWidth={1.25}
              style={{ fill: h.t === "accent" ? wash("accent", 12) : "var(--paper-raised)", stroke: h.t === "accent" ? tone("accent") : "var(--rule-strong)" }}
            />
            <Label x={x + 76} y={56} anchor="middle" size={12} t="ink" weight={600} sans>
              {h.title}
            </Label>
            <Label x={x + 76} y={94} anchor="middle" size={28} t={h.t} weight={700} sans>
              {h.n}
            </Label>
            <Label x={x + 76} y={114} anchor="middle" size={10}>
              {h.sub}
            </Label>
            {i < 3 && <Arrow pts={[[x + 152, 80], [x + 174, 80]]} t={i === 1 ? "accent" : "muted"} />}
            <Arrow pts={[[x + 76, 126], [x + 76, 166]]} t="perf" dashed />
            <Box x={x} y={168} w={152} h={56} title={fixes[i][0]} sub={[fixes[i][1]]} t="perf" filled />
          </g>
        );
      })}
      <Label x={20} y={258} size={10.5} t="perf">
        after: a live generate → edit → export run kept 3 of 3 links in both the DOCX and the PDF
      </Label>
    </Figure>
  );
}

/* ——— LLM latency is an output-token budget ——— */

function TokenBudget() {
  const rows = [
    { label: "Markdown", w: 100, v: "1×" },
    { label: "compact JSON", w: 223, v: "2.23×" },
    { label: "pretty JSON", w: 278, v: "2.78×" },
  ];
  return (
    <Figure height={304} label="Wall-clock time is output tokens divided by throughput, so a typical report takes about a minute and a 160,000-token runaway about 31 minutes; nearly half of a JSON report's tokens are structure, and JSON costs 2.2 to 2.8 times the tokens of Markdown.">
      <Label x={360} y={26} anchor="middle" size={14} t="ink" weight={600} sans>
        wall-clock ≈ output tokens ÷ tokens per second
      </Label>
      <Label x={360} y={44} anchor="middle" size={10.5}>
        measured throughput ≈ 70–75 tok/s
      </Label>
      <Kicker x={20} y={79}>Typical report</Kicker>
      <rect x={200} y={69} width={14} height={14} rx={3} style={{ fill: tone("perf") }} />
      <Label x={222} y={80}>3–6k tokens → 40–80 s</Label>
      <Kicker x={20} y={107} t="accent">
        Runaway
      </Kicker>
      <rect x={200} y={97} width={440} height={14} rx={3} style={{ fill: tone("accent") }} />
      <Label x={648} y={108} t="accent">
        ~31 min
      </Label>
      <Label x={200} y={128} size={10.5}>
        ~160k tokens — before one hard ceiling and a matched output cap
      </Label>
      <line x1={20} x2={700} y1={146} y2={146} style={{ stroke: "var(--rule)" }} />
      <Kicker x={20} y={170}>Where a JSON report&apos;s tokens go</Kicker>
      <rect x={20} y={180} width={333} height={22} rx={3} style={{ fill: tone("perf") }} />
      <rect x={353} y={180} width={313} height={22} style={{ fill: tone("infra") }} />
      <rect x={666} y={180} width={34} height={22} rx={3} style={{ fill: tone("feat") }} />
      <Label x={20} y={220}>data rows 49%</Label>
      <Label x={353} y={220}>scaffolding 46%</Label>
      <Label x={700} y={220} anchor="end">
        narrative 5%
      </Label>
      <Kicker x={20} y={246}>Same content, relative tokens</Kicker>
      {rows.map((r, i) => (
        <g key={r.label}>
          <Label x={20} y={266 + i * 15} size={10}>
            {r.label}
          </Label>
          <rect x={130} y={258 + i * 15} width={r.w} height={10} rx={2} style={{ fill: i ? tone("infra") : tone("perf") }} />
          <Label x={138 + r.w} y={266 + i * 15} size={10} t="ink">
            {r.v}
          </Label>
        </g>
      ))}
    </Figure>
  );
}

/* ——— The listener that removed itself ——— */

function ListenerDeque() {
  const cells = ["audit_hook", "on_commit", "cache_hook"];
  return (
    <Figure height={298} label="During commit, SQLAlchemy iterates its after_commit listeners; the one-shot listener removed itself mid-loop, raising a builtin RuntimeError that slipped past a wrapper catching only SQLAlchemy errors and failed the turn.">
      <Box x={20} y={30} w={160} h={56} title="session.commit()" sub={["after_commit fires"]} />
      <Arrow pts={[[180, 58], [228, 58]]} />
      <Kicker x={230} y={22}>dispatch · for fn in listeners</Kicker>
      {cells.map((c, i) => (
        <g key={c}>
          <rect
            x={230 + i * 120}
            y={34}
            width={112}
            height={48}
            rx={6}
            strokeWidth={i === 1 ? 1.6 : 1.2}
            style={{ fill: i === 1 ? wash("accent", 16) : "var(--paper-raised)", stroke: i === 1 ? tone("accent") : "var(--rule-strong)" }}
          />
          <Label x={286 + i * 120} y={63} anchor="middle" size={11} t="ink">
            {c}
          </Label>
        </g>
      ))}
      <Label x={596} y={63} size={12} t="faint">
        …
      </Label>
      <Arrow pts={[[406, 82], [406, 98], [286, 98], [286, 86]]} t="accent" />
      <Label x={418} y={102} size={10.5} t="accent">
        event.remove(self) mid-loop
      </Label>
      <Arrow pts={[[315, 104], [315, 128]]} t="accent" />
      <Box x={230} y={130} w={350} h={50} title="RuntimeError" sub={["deque mutated during iteration"]} t="accent" filled />
      <Arrow pts={[[315, 180], [315, 206]]} t="accent" />
      <Box x={230} y={208} w={170} h={56} title="Session wrapper" sub={["catches SQLAlchemyError"]} />
      <Arrow pts={[[400, 236], [448, 236]]} t="accent" />
      <Box x={450} y={208} w={250} h={56} title="Builtin error escapes" sub={["turn fails · charge not saved"]} t="accent" filled />
      <Label x={20} y={150} t="ink" weight={600} sans>
        fails every time
      </Label>
      <Label x={20} y={168}>a threshold is crossed —</Label>
      <Label x={20} y={184}>rare enough to look random</Label>
      <Label x={20} y={288} t="perf" weight={600}>
        fix: event.listen(session, &quot;after_commit&quot;, fn, once=True)
      </Label>
    </Figure>
  );
}

/* ——— Tell the agent what it didn't read ——— */

function PartialRead() {
  return (
    <Figure height={282} label="A tool result capped silently leads the agent to answer from part of the data as if it were the whole; a result that carries truncation metadata lets the agent say what it covered.">
      <Kicker x={20} y={22} t="accent">
        Before · capped silently
      </Kicker>
      <Box x={20} y={34} w={250} h={62} title="Tool result" sub={["first 30k characters", "nothing says it was cut"]} />
      <Arrow pts={[[270, 65], [318, 65]]} t="accent" />
      <Box x={320} y={34} w={380} h={62} title="Agent's answer" sub={["reads a part as the whole", "confident and wrong ✗"]} t="accent" filled />
      <line x1={20} x2={700} y1={120} y2={120} style={{ stroke: "var(--rule)" }} />
      <Kicker x={20} y={146} t="perf">
        After · partial results say so
      </Kicker>
      <Box x={20} y={158} w={250} h={80} title="Tool result + metadata" sub={["truncated: true", "pages_omitted: …", "original_chars: …"]} />
      <Arrow pts={[[270, 198], [318, 198]]} t="perf" />
      <Box x={320} y={158} w={380} h={80} title="Agent's answer" sub={["says what it covered", "offers to read the rest ✓"]} t="perf" filled />
      <Label x={20} y={268} size={10.5}>
        same contract for files (partial flag), audits (read 5 of 26 → PARTIAL), empty results (no data ≠ 0)
      </Label>
    </Figure>
  );
}

/* ——— One 429, two meanings ——— */

function Aimd() {
  const climb = [
    [70, 228],
    [90, 222],
    [110, 212],
    [130, 198],
    [150, 180],
    [170, 158],
    [170, 194],
    [210, 187],
    [250, 180],
    [290, 173],
    [330, 166],
    [370, 158],
    [370, 194],
    [410, 187],
    [450, 180],
    [480, 180],
    [500, 190],
    [520, 200],
    [540, 210],
    [556, 230],
  ];
  const path = climb.map((p) => p.join(",")).join(" ");
  const refused = [
    [170, 158],
    [370, 158],
    [490, 184],
    [510, 195],
    [530, 205],
  ];
  return (
    <Figure height={284} label="The publisher's in-flight requests climb from one, halve on each refusal and climb again; when refused writes stop landing for two minutes the account is marked saturated and the run stops with that reason recorded.">
      <rect x={476} y={38} width={224} height={192} rx={6} style={{ fill: wash("accent", 8) }} />
      <line x1={60} x2={60} y1={36} y2={230} style={{ stroke: "var(--rule-strong)" }} />
      <line x1={60} x2={700} y1={230} y2={230} style={{ stroke: "var(--rule-strong)" }} />
      <Label x={68} y={48} size={10} t="faint">
        requests in flight
      </Label>
      <Label x={700} y={248} anchor="end" size={10} t="faint">
        time →
      </Label>
      <polyline points={path} fill="none" strokeWidth={2} strokeLinejoin="round" style={{ stroke: tone("perf") }} />
      {refused.map(([x, y]) => (
        <path key={x} d={`M${x - 4} ${y - 4} l8 8 M${x + 4} ${y - 4} l-8 8`} strokeWidth={1.8} style={{ stroke: tone("accent") }} />
      ))}
      <Label x={72} y={120} size={10.5}>
        slow start: +1 per success
      </Label>
      <Label x={180} y={148} size={10.5} t="accent">
        refused: halve, back off
      </Label>
      <Label x={250} y={212} size={10.5}>
        additive increase
      </Label>
      <Label x={488} y={62} size={10.5} t="ink" weight={600} sans>
        Same 429, product ceiling
      </Label>
      <Label x={488} y={80} size={10.5}>
        refused writes never land
      </Label>
      <Label x={488} y={96} size={10.5} t="accent">
        no landings → saturated
      </Label>
      <Label x={488} y={112} size={10.5}>
        reason stored on the run
      </Label>
      <Label x={20} y={272} size={10} t="faint">
        a refusal counts once per burst · backoff with jitter, capped at 30 s · one pacer per account
      </Label>
    </Figure>
  );
}

/* ——— Upgrades that fail without an error ——— */

function LifecycleRow({ y, title, sub, start, update, t }: { y: number; title: string; sub: string; start: string; update?: [string, string, Tone]; t: Tone }) {
  return (
    <g>
      <Label x={20} y={y - 4} size={12} t="ink" weight={600} sans>
        {title}
      </Label>
      <Label x={20} y={y + 12} size={10}>
        {sub}
      </Label>
      <line x1={200} x2={700} y1={y} y2={y} style={{ stroke: "var(--rule-strong)" }} />
      <circle cx={240} cy={y} r={6} strokeWidth={1.4} style={{ fill: "var(--paper)", stroke: tone("ink") }} />
      <Label x={240} y={y - 14} anchor="middle" size={10} t="ink">
        {start}
      </Label>
      {update && (
        <>
          <circle cx={470} cy={y} r={6} strokeWidth={1.4} style={{ fill: "var(--paper)", stroke: tone(update[2]) }} />
          <Label x={470} y={y - 14} anchor="middle" size={10} t="ink">
            onUpdate · 3 items
          </Label>
          <Label x={470} y={y + 22} anchor="middle" size={10.5} t={update[2]}>
            {update[1]}
          </Label>
        </>
      )}
      <Label x={240} y={y + 22} anchor="middle" size={10.5} t={t}>
        {update ? update[0] : "popup built ✓"}
      </Label>
    </g>
  );
}

function SuggestionLifecycle() {
  return (
    <Figure height={256} label="In Tiptap v2 suggestion items arrive with onStart; in v3 they resolve later, so a renderer that builds its popup only in onStart never shows one; a lazy renderer builds it when items arrive.">
      <LifecycleRow y={50} title="Tiptap v2" sub="items() is synchronous" start="onStart · 3 items" t="perf" />
      <LifecycleRow y={132} title="v3, v2-style renderer" sub="items() resolves later" start="onStart · 0 items" update={["no items, no popup", "nothing to update ✗", "accent"]} t="faint" />
      <LifecycleRow y={214} title="v3, lazy renderer" sub="the fix" start="onStart · 0 items" update={["stay mounted, wait", "build popup now ✓", "perf"]} t="faint" />
    </Figure>
  );
}

/* ——— Handing an agent an email tool ——— */

function SafeFetch() {
  return (
    <Figure height={296} label="The attachment fetcher checks that a URL is public, fetches with automatic redirects off, re-validates every redirect hop up to three, refuses private addresses such as the metadata endpoint, and streams the body under a size cap.">
      <Box x={20} y={40} w={150} h={56} title="URL" sub={["from the model,", "or the next hop"]} />
      <Arrow pts={[[170, 68], [198, 68]]} />
      <Box x={200} y={40} w={170} h={56} title="Public host?" sub={["no private or", "link-local range"]} />
      <Arrow pts={[[370, 68], [418, 68]]} t="perf" />
      <Label x={394} y={60} anchor="middle" size={10} t="perf">
        yes
      </Label>
      <Box x={420} y={40} w={150} h={56} title="GET" sub={["redirects off"]} />
      <Arrow pts={[[495, 96], [495, 128]]} />
      <Box x={420} y={130} w={150} h={56} title="Redirect?" sub={["at most 3 hops"]} />
      <Arrow pts={[[420, 158], [285, 158], [285, 98]]} t="infra" />
      <Label x={296} y={150} size={10} t="infra">
        yes: check again
      </Label>
      <Arrow pts={[[570, 158], [598, 158]]} t="perf" />
      <Box x={600} y={130} w={100} h={56} title="Stream" sub={["cap 15 MB"]} t="perf" filled />
      <Arrow pts={[[240, 96], [240, 208]]} t="accent" />
      <Label x={248} y={132} size={10} t="accent">
        no
      </Label>
      <Box x={160} y={210} w={170} h={52} title="Refuse" sub={["e.g. 169.254.169.254"]} t="accent" filled />
      <Label x={20} y={286} size={10} t="faint">
        the first version checked only the first URL, then let the HTTP client follow redirects
      </Label>
    </Figure>
  );
}

export const FIGURES: Record<FigureId, () => ReactElement> = {
  "query-tuning": QueryTuning,
  "pay-then-apply": PayThenApply,
  "one-gate": OneGate,
  "metering-chokepoint": MeteringChokepoint,
  "hot-path": HotPath,
  "placeholder-leak": PlaceholderLeak,
  "link-funnel": LinkFunnel,
  "token-budget": TokenBudget,
  "listener-deque": ListenerDeque,
  "partial-read": PartialRead,
  aimd: Aimd,
  "suggestion-lifecycle": SuggestionLifecycle,
  "safe-fetch": SafeFetch,
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
