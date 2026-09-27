import type { ShipKind } from "@/lib/data";

export type FigureId =
  | "payload-diet"
  | "oom-expansion"
  | "webhook-order"
  | "stream-heartbeat"
  | "ci-injection"
  | "tool-pipeline"
  | "dangling-repair"
  | "version-pointer"
  | "five-surfaces"
  | "page-budget";

export type BlogBlock =
  | { type: "p"; text: string }
  | { type: "h2"; text: string }
  | { type: "quote"; text: string }
  | { type: "code"; lang?: string; code: string }
  | { type: "ul"; items: string[] }
  /** A diagram from `components/figures`, with a caption shown beneath it. */
  | { type: "figure"; figure: FigureId; caption: string };

export interface BlogPost {
  slug: string;
  title: string;
  /** One-sentence standfirst shown under the title and in link previews. */
  dek: string;
  /** YYYY-MM, used for ordering. */
  date: string;
  /** Human label, e.g. "Sep 2026". */
  when: string;
  kind: ShipKind;
  tags: string[];
  body: BlogBlock[];
}

/**
 * Field notes: longer write-ups of work the ship log only headlines.
 * All details are public-safe — systems described generically, numbers
 * only where they were actually measured.
 */
export const blogPosts: BlogPost[] = [
  {
    slug: "stream-only-what-you-render",
    title: "The 93.5% payload diet",
    dek: "Our chat UI was discarding most of what the server streamed at it. The fix was one policy: send the browser only what it renders.",
    date: "2026-09",
    when: "Sep 2026",
    kind: "perf",
    tags: ["Python", "SSE", "FastAPI"],
    body: [
      {
        type: "p",
        text: "Reopening an old conversation in our AI assistant had started to feel heavy. The interface was snappy everywhere else, but a conversation with a few big agent turns in it took noticeably long to load, and the network tab explained why: a single history reload could pull down megabytes of JSON for something that, on screen, was a handful of messages and cards.",
      },
      {
        type: "p",
        text: "The assistant is agentic, so an answer is usually several tool calls deep — ad-platform queries, web searches, file reads, chart builds. Each tool call produces output for the model to reason over, and our streaming pipeline forwarded that output to the browser as it happened. The UI, in turn, rendered a tidy card — “searched the web, 14 results” — and threw the rest away. We were shipping the full working state of the agent to every client so the browser could discard it on arrival.",
      },
      { type: "h2", text: "The browser is not the agent" },
      {
        type: "p",
        text: "The insight, once we said it out loud, was embarrassingly simple: the model and the UI are different consumers with different needs. The model needs complete tool output — every row, every snippet — because it reasons over it. The UI needs whatever its card renders: a title, a count, a status, occasionally a table. Conflating the two meant the heaviest consumer set the payload for both.",
      },
      {
        type: "p",
        text: "So instead of judgement calls scattered across tool handlers, we wrote the rule down once: a stream policy under which every tool declares what the client actually renders, and only that crosses the wire. The full output stays server-side with the conversation state, where the model can use it.",
      },
      {
        type: "figure",
        figure: "payload-diet",
        caption:
          "One policy, two consumers: the model keeps the full tool output, the browser gets only the view its card renders. Bars show the average payload per conversation before and after.",
      },
      {
        type: "code",
        lang: "python",
        code: `class WebSearchTool(Tool):
    def client_view(self, output: SearchOutput) -> dict:
        # What the chat UI renders — not what the model reads.
        return {
            "query": output.query,
            "result_count": len(output.results),
            "top_sources": [r.domain for r in output.results[:3]],
        }`,
      },
      {
        type: "p",
        text: "Crucially, the same policy runs in both paths: the live stream and the history reload are built from the same view of each event. A conversation replayed from history now looks exactly like it did when it streamed — which also flushed out a few places where the two paths had quietly drifted apart.",
      },
      { type: "h2", text: "Results, honestly labelled" },
      {
        type: "p",
        text: "Across seven real conversations we replayed as tests, the history reload payload fell by 93.5% on average, and the live stream by 76.6%. Those are test-bench numbers, not production percentiles — but when the mechanism is “stop sending data the client provably deletes”, the direction is not in doubt.",
      },
      {
        type: "ul",
        items: [
          "Payloads creep. Nobody decided to stream megabytes to the browser; it accumulated one reasonable-looking tool at a time. Audit what actually crosses the wire, per event type, every so often.",
          "Make the client contract explicit. The moment a tool has to declare its client view, “send everything, the UI will cope” stops being the default.",
          "Fix both paths with one policy. If live streaming and history reload share a definition, they cannot disagree.",
        ],
      },
    ],
  },
  {
    slug: "anatomy-of-an-oom",
    title: "Anatomy of an OOM: the 5.7 MB spreadsheet",
    dek: "A small upload kept crashing our chat server mid-reply. The fix was budgets on every file extractor and chunked cache reads.",
    date: "2026-09",
    when: "Sep 2026",
    kind: "fix",
    tags: ["Python", "Redis", "Kubernetes"],
    body: [
      {
        type: "p",
        text: "The bug report was the unsettling kind: a user uploads a spreadsheet, asks a question about it, and the assistant dies mid-answer. Kubernetes restarts the pod, the user retries, and it dies again — a perfectly reproducible crash loop, triggered by a 5.7 MB file.",
      },
      {
        type: "p",
        text: "The pod's memory limit was 1 GiB. A memory profile of the incident conversation showed the file-processing path retaining over 400 MB for that one upload — roughly a seventy-fold expansion of the file on disk. Two multipliers were stacking.",
      },
      {
        type: "p",
        text: "First, extraction was unbounded. A 5.7 MB spreadsheet is a compressed archive; decompressed and parsed, every cell becomes a Python object with per-object overhead, and a modest file explodes into hundreds of megabytes of live structures. Nothing in the pipeline ever asked whether it should stop.",
      },
      {
        type: "p",
        text: "Second, cache reads were all-or-nothing. The uploaded file was cached and read back as a single blob, so at peak the process held several full copies of the data at once — the raw bytes, the decompressed archive and the parsed rows, all alive at the same time.",
      },
      {
        type: "figure",
        figure: "oom-expansion",
        caption:
          "Square areas are to scale: a 5.7 MB upload became 414 MB of retained memory. Budgets and chunked reads bound the same file to effectively nothing.",
      },
      { type: "h2", text: "Budgets, not hope" },
      {
        type: "p",
        text: "The fix was to make every extractor run under an explicit budget — rows, cells and output size. When a file exceeds its budget, extraction truncates and tells the model it did, which turns a dead pod into a slightly shorter answer with a note attached. Cached reads switched from whole-blob to chunked, so peak memory no longer scales with file size at all.",
      },
      { type: "h2", text: "Proving it" },
      {
        type: "p",
        text: "Re-running the incident file after the fix, retained memory went from 414 MB to effectively zero. We then ran an A/B under production conditions in a 1 GiB pod: the old build was OOM-killed mid-reply, the new one completed with zero restarts. Test coverage on the extraction module went from 70% to 89% along the way, because every budget needed a test that crossed it.",
      },
      {
        type: "ul",
        items: [
          "“The file is small” is not a memory model. Compressed tabular formats expand by orders of magnitude, and object overhead multiplies that again.",
          "Every allocation on a user-controlled path needs a ceiling. If the user picks the input, the user picks your peak memory — unless you cap it.",
          "Fail partially. A truncated extract with an honest note beats a crash, every time.",
          "Reproduce, fix, then A/B under the real limit. Profiling on a dev machine with no memory limit tells you half the story.",
        ],
      },
    ],
  },
  {
    slug: "the-webhook-that-downgraded-a-customer",
    title: "The webhook that downgraded a paying customer",
    dek: "Payment webhooks arrive late, out of order and more than once. Our billing now assumes all three.",
    date: "2026-07",
    when: "Jul 2026",
    kind: "fix",
    tags: ["Stripe", "Webhooks", "PostgreSQL"],
    body: [
      {
        type: "p",
        text: "One morning a paying customer was on the free tier. No cancellation, no failed charge, no support ticket — the account had simply moved down a plan overnight. The trail led to our payment webhook handler, which had done exactly what we had told it to do.",
      },
      {
        type: "p",
        text: "A subscription-updated event had been delayed in delivery. By the time it arrived, newer events had already moved the account forward; the late event described an older state of the subscription, and our handler applied whatever arrived as though it were the latest word. A stale snapshot overwrote a current one, and a paid account became a free one.",
      },
      {
        type: "figure",
        figure: "webhook-order",
        caption:
          "Creation order is not delivery order. Applying each payload lets a late, stale event win; re-reading the subscription on every event makes arrival order irrelevant.",
      },
      { type: "h2", text: "Webhooks are notifications, not state" },
      {
        type: "p",
        text: "Treat a webhook as an assertion about current state and you will eventually persist the past over the present. Treat it as a doorbell — “something changed, come and look” — and this whole class of bug disappears. For the events that change what a customer pays or can do, we now re-read the subscription from the payment provider's API before writing anything. The webhook decides when to look; the API decides what is true.",
      },
      {
        type: "p",
        text: "We also made staleness explicit. Every event carries its creation time and describes some version of the world; anything older than what we have already applied is logged and dropped rather than processed. Delivery order stopped mattering because we stopped depending on it.",
      },
      { type: "h2", text: "Idempotency, almost for free" },
      {
        type: "p",
        text: "This hardening landed as part of rebuilding billing around an append-only credit ledger. Every grant, spend and refund is a ledger entry with an idempotency key, and a balance is just a fold over the entries. Redelivered events insert nothing new, retries are safe by construction, and any balance can be explained by reading its history — which turned several “why is this balance wrong?” conversations into short ones.",
      },
      {
        type: "p",
        text: "The same pass tightened checkout: upgrades now charge before they apply rather than the other way round, and payments that require 3-D Secure complete the challenge before any plan changes hands.",
      },
      {
        type: "ul",
        items: [
          "Delivery order is not creation order. Any handler that assumes otherwise is a time bomb with a long fuse.",
          "Re-read, don't apply. For state that matters, the provider's API is the source of truth; the webhook is only the trigger.",
          "An append-only ledger with idempotency keys makes the safe behaviour the default instead of a discipline.",
          "The worst billing bugs are quiet. A crash pages someone; a wrong downgrade waits for an angry email. Alert on the state change, not just on errors.",
        ],
      },
    ],
  },
  {
    slug: "keeping-long-streams-alive",
    title: "Keeping long-running AI streams alive",
    dek: "An agent turn can take many minutes. Everything between your server and the browser would prefer it didn't.",
    date: "2026-01",
    when: "Jan 2026",
    kind: "fix",
    tags: ["Python", "SSE", "asyncio"],
    body: [
      {
        type: "p",
        text: "Our assistant's failures were arriving as a generic “something went wrong”. The turns that failed had one thing in common: they were long — multi-step agent runs where the model plans, calls tools and waits on slow external services. Somewhere between server and browser, the stream had died during a stretch where nothing was being sent.",
      },
      {
        type: "p",
        text: "A server-sent-events connection looks like a long promise, but everything in the middle treats it as a short one. Load balancers apply idle timeouts. Proxies buffer or cut quiet connections. Browsers eventually give up on a silent response. During a long tool call we could go minutes without emitting a byte, and to every intermediary that is indistinguishable from a dead connection.",
      },
      {
        type: "figure",
        figure: "stream-heartbeat",
        caption:
          "The failure lives in the silence. Without traffic, an intermediary's idle timeout ends the stream mid-turn; small heartbeat events during the quiet stretch keep every hop open.",
      },
      { type: "h2", text: "Pay rent on the connection" },
      {
        type: "p",
        text: "The first fix was the boring one: heartbeat events. During quiet stretches the server emits a small keep-alive event that the UI silently ignores. Intermediaries see traffic, timeouts never fire, and the largest class of dropped streams disappeared for the price of a few bytes a minute. If you own a long-lived stream, keep-alive is part of your protocol, not an optimisation.",
      },
      { type: "h2", text: "Never block the loop" },
      {
        type: "p",
        text: "The second class was self-inflicted. Some media tools — image fetching, chart generation — ran blocking work on the event loop, and while they ran, nothing else could be written to the stream, heartbeats included. We had built a keep-alive system our own tools could starve. Those tools became non-blocking, with the heavy work moved off the loop, so the stream stays live while they run.",
      },
      { type: "h2", text: "Fail specifically" },
      {
        type: "p",
        text: "Finally, we stopped collapsing every failure into one message. Transport errors, model errors and tool errors now take different paths: some recover mid-stream, and the rest surface as specific, actionable errors. “Something went wrong” turned out to be three distinct failure modes wearing the same coat, and we could only fix them once we could tell them apart.",
      },
      {
        type: "ul",
        items: [
          "A stream is only as alive as its quietest stretch. Design for the silence, not the throughput.",
          "Keep-alive belongs to you. No intermediary is obliged to respect a connection you let go quiet.",
          "One blocking call anywhere on the loop defeats every keep-alive downstream of it.",
          "Generic error messages are unpaid telemetry debt — each one hides the several real bugs behind it.",
        ],
      },
    ],
  },
  {
    slug: "your-pr-title-just-ran-in-ci",
    title: "Your PR title just ran in our CI",
    dek: "A release workflow interpolated pull-request text straight into a shell script. Fixing the vulnerability also fixed the outage.",
    date: "2026-05",
    when: "May 2026",
    kind: "infra",
    tags: ["GitHub Actions", "Bash", "Security"],
    body: [
      {
        type: "p",
        text: "A release was failing with a shell syntax error. The workflow log pointed at the step that collects the batch of pull-request titles going out in the release, and one of those titles contained punctuation the shell cared about. Which is an odd thing for a title to be able to do — unless the shell is executing it.",
      },
      {
        type: "p",
        text: "It was. In GitHub Actions, template expressions are expanded before the shell ever sees the script, so interpolating event text into a run block pastes untrusted input directly into code. A pull-request title is attacker-controlled, and a title shaped like a command substitution runs as one — on a release runner, with a release runner's secrets and permissions.",
      },
      {
        type: "code",
        lang: "yaml",
        code: `# Vulnerable: the title is pasted into the script before bash runs it
- run: echo "Releasing: \${{ github.event.pull_request.title }}"

# Fixed: the title travels as data, in an environment variable
- env:
    PR_TITLE: \${{ github.event.pull_request.title }}
  run: echo "Releasing: $PR_TITLE"`,
      },
      {
        type: "figure",
        figure: "ci-injection",
        caption:
          "The difference is ordering. Interpolation pastes the title into the script before bash parses it; an environment variable is only expanded after parsing, so the title can never become code.",
      },
      { type: "h2", text: "The outage was the proof of concept" },
      {
        type: "p",
        text: "The broken release was, in effect, an accidental security report: an ordinary title with awkward punctuation had already altered what the shell executed. Anyone who could open a pull request could have done the same thing deliberately, with a payload instead of a typo. The fix — moving every piece of event text into environment variables and quoting it — closed the injection and unblocked the release in the same change.",
      },
      {
        type: "p",
        text: "Environment variables fix this because the runner sets them after the script is already parsed. The text arrives as data in a variable rather than as characters in the code, and the shell never gets the chance to interpret it.",
      },
      {
        type: "ul",
        items: [
          "Treat everything under github.event as untrusted input: titles, bodies, branch names, commit messages, usernames.",
          "Never interpolate expressions into run blocks. Pass them through env and quote the variable.",
          "Release workflows deserve the most paranoia — they hold the credentials that matter most.",
          "A workflow that breaks on punctuation is a security finding, not a flake. The difference between an outage and a compromise is who typed the title.",
        ],
      },
    ],
  },
  {
    slug: "a-document-is-a-tool-call",
    title: "A document is a tool call",
    dek: "The report canvas got reliable the day generation stopped being part of the chat answer and became a validated tool call.",
    date: "2026-07",
    when: "Jul 2026",
    kind: "feat",
    tags: ["Python", "LiteLLM", "JSON Schema", "React"],
    body: [
      {
        type: "p",
        text: "Chat is a terrible medium for a fifty-row answer. Our assistant does marketing analytics, so the questions that matter come back as comparisons, trends and breakdowns — exactly the material that turns into porridge when it streams as prose with a few markdown tables. So we built a report canvas: a side panel that renders data-heavy answers as structured documents — KPI cards, charts, tables, tabs, diagrams — generated entirely by the model and then owned by the user.",
      },
      {
        type: "p",
        text: "For the first three months, generation lived inside the chat answer itself. The orchestrating agent wrote the whole document inline in its streamed reply, wrapped in a tag carrying a title and a format; when the stream ended, the server scanned the text for those tags and persisted what it found, deciding “new document or new version?” by matching titles.",
      },
      {
        type: "p",
        text: "It demoed beautifully and creaked in production, in ways worth listing because each one drove a design decision. A malformed or truncated document reached the browser mid-stream, with no place to catch it and retry. Every number had to survive the orchestrator's context window on its way into the document, and under length pressure the model would substitute placeholder prose for data or quietly drop a whole research section. And title matching created duplicate documents and false versions — ask for a revision, get a stranger.",
      },
      { type: "h2", text: "Make it a tool" },
      {
        type: "p",
        text: "The rework moved generation into a dedicated tool. The orchestrator now passes only a small brief — a title, one of five formats, a one-sentence intent, optional section names, optionally the id of an existing document to edit, and a page cap only when the user actually stated one. Everything else the tool does for itself.",
      },
      {
        type: "code",
        lang: "text",
        code: `report_tool(title, format ∈ {rich, markdown, html, code, csv},
            intent: one sentence, sections?, source_refs?,
            document_id?,        # edits only
            max_pages?)          # only if the user set one
  → ok:     {status: "ok", id, title, format}
  → failed: {status: "failed", error: timeout | generation | validation}`,
      },
      {
        type: "p",
        text: "Crucially, the tool does not trust the orchestrator to relay the data. It reads the conversation record directly and classifies what it finds: the user's messages and the research memos from specialist sub-agents are protected findings; raw intermediate tool output is filler, truncated first when space runs out. Then one isolated, non-streaming, tool-less model call runs — the schema contract as its system prompt, the brief plus source as the user message — followed by validation, one retry with the exact validator error appended, and a tiered recovery path (drop the raw data, then split the findings into parts generated in parallel and merged deterministically), all under a single hard time ceiling.",
      },
      {
        type: "figure",
        figure: "tool-pipeline",
        caption:
          "A brief goes in and an id comes out. The document is only written after the reply commits, and the browser fetches it by the server's id, never the one the model typed.",
      },
      {
        type: "p",
        text: "The tool hands back only an id — the document body never rides the chat stream. The validated document is held in memory and written to the database only after the reply row commits, so a message can never reference a row that does not exist. And the server rewrites every document tag in the reply with the authoritative id, because we learned that a model asked to echo a 36-character id will occasionally add a letter: one extra character, one 404, one confused user staring at an empty panel. The rule that came out of it: never look anything up by an identifier the model typed.",
      },
      {
        type: "p",
        text: "Failure is part of the contract too. When the tool fails, the orchestrator answers inline with the full data, as if the tool did not exist, and never mentions the failure. No half-documents, no apology cards.",
      },
      {
        type: "ul",
        items: [
          "A schema moves failure earlier, and earlier failure is cheaper: a validation error inside a tool beats a broken page in front of a user.",
          "The agent that talks to the user should not also typeset the data. Every number it relays by hand has to survive its context window; a tool can go back to the source.",
          "Never trust a model-transcribed identifier. Rewrite it from the authoritative record, or fail closed.",
          "Design the failure path first. “Answer inline as if the tool doesn't exist” meant reliability work could ship without ever stranding a user.",
        ],
      },
    ],
  },
  {
    slug: "the-dangling-reference",
    title: "The dangling reference",
    dek: "Half of our recent report-generation failures turned out to be one bug: the model referring to things it never created.",
    date: "2026-08",
    when: "Aug 2026",
    kind: "fix",
    tags: ["Python", "LLM", "JSON validation"],
    body: [
      {
        type: "p",
        text: "When we sat down to fix the report canvas's reliability, the first step was boring bookkeeping: we pulled the recent generation failures and grouped them by root cause instead of by symptom. Fourteen failures, and seven were the same bug in different clothes — a dangling reference.",
      },
      {
        type: "p",
        text: "A structured report here is one JSON object: a flat map of elements, where each container lists its children by key. The failing documents had containers naming keys that did not exist. The model would plan a section — put its key in a parent's child list — and then never write the element. Or write it under a punctuation variant: `sales-section` in the plan, `sales_section` in the map.",
      },
      {
        type: "p",
        text: "This is a very LLM-shaped failure. Models are excellent at local coherence — any given element looks right — and unreliable at referential integrity across a long structured document. By element forty, the key invented at element three is a distant memory the model misremembers with total confidence. Ask for prose and nobody notices. Ask for a machine-readable document whose parts reference each other, and every lapse is a render failure.",
      },
      {
        type: "p",
        text: "It was also an expensive failure. The validator rejected the whole document at the first missing key, the automatic regeneration usually failed the same way, and the user — who had waited minutes for a long agent run — lost the entire artefact over a reference that carried no content at all.",
      },
      { type: "h2", text: "Repair like a linker, then validate" },
      {
        type: "p",
        text: "So the fix was not better detection; it was repair. Before the strict checks run, a pass walks every child reference that fails to resolve. It normalises the key — lower-case, punctuation stripped — and looks for an existing element with the same normal form. If one exists, the reference is rewired to it; if nothing matches, the reference is pruned. Tabs and accordions pair labels to children by position, so pruning a child also drops its label — otherwise every later tab is mislabelled by one.",
      },
      {
        type: "figure",
        figure: "dangling-repair",
        caption:
          "Keys are illustrative. A near-miss key is rewired to the unmounted element it normalises to; a key with no match at all is pruned. Either way the document survives.",
      },
      {
        type: "p",
        text: "“Rewire if safe” is where it got interesting, because a careless repair can build a worse document than the one it fixes. Three vetoes: never rewire onto an element another container already mounts, which would trade a missing-reference failure for a duplicate-render one; never onto the element itself; and never onto an element that can already reach this one through the child graph — because that closes a cycle. That last veto exists because a reviewer proved the first version could rewire two near-miss keys into root → a → root, a shape the validator would pass and the renderer would recurse on forever. And if a repair would leave only empty layout containers reachable, the repair is discarded and the strict failure stands — a hollow skeleton is worse than a retry.",
      },
      {
        type: "p",
        text: "The strict checks still run on whatever survives repair: every reference resolves, every element is mounted exactly once, nothing is orphaned. And every repair logs a warning, so repairs are countable — a validator that silently fixes things is just a bug with better manners.",
      },
      { type: "h2", text: "Same bug, other costumes" },
      {
        type: "p",
        text: "Once we saw the shape — a model-typed identifier used as a lookup key — it was everywhere. The mistyped 36-character document id, fixed by rewriting from the server's record. The placeholder id: a model passing the literal string “null” as a document id, stranding a document no database row would ever match and leaving the panel's loader spinning — fixed by normalising placeholders and demoting the edit to a new document. And retyped preview links: a link one character off a real one is well-formed and opens nothing, so a link now ships only if it appears verbatim in the source material the generator was given. Fail closed.",
      },
      {
        type: "ul",
        items: [
          "Count failures by root cause, not by symptom. Ours looked like fourteen problems and half the pile was one bug.",
          "Repair beats rejection when the repair is deterministic — but every rewire needs a proof it cannot create a worse document. Ours needed three vetoes and a skeleton guard.",
          "Referential integrity is checkable even when quality isn't. Validate everything that has a definite answer; save judgement for what doesn't.",
          "Any identifier a model types will eventually be mistyped. Correct it from the authoritative record, or drop it — never trust it.",
        ],
      },
    ],
  },
  {
    slug: "ai-writes-the-first-draft",
    title: "The AI writes the first draft, you keep the pen",
    dek: "Generated reports became documents people trust only once they could edit them, version them and take them back.",
    date: "2026-09",
    when: "Sep 2026",
    kind: "feat",
    tags: ["React", "Tiptap", "FastAPI", "PostgreSQL"],
    body: [
      {
        type: "p",
        text: "A generated report is a first draft, no matter how good the generation gets. The numbers may be right and the structure sound, and the user will still want to soften a sentence, cut a section, or add the one line of context the model could not know — because the report is going to their client or their boss with their name near it. For a while our canvas had no answer to that except the regeneration lottery: ask again, hope the next document keeps everything you liked and fixes the one thing you didn't.",
      },
      {
        type: "p",
        text: "The other escape hatch was worse: copy the content out into a real editor, at which point the structure — the charts, the KPI cards, the live tables — dies, and the canvas has demoted itself to a clipboard. If the document is the product, it has to be editable where it lives.",
      },
      { type: "h2", text: "Versions are pointers, not copies" },
      {
        type: "p",
        text: "The machinery underneath is deliberately dull: an append-only list of full snapshots plus a “current version” pointer. Every change — the model's or a person's — appends a snapshot; readers see whatever the pointer names. Restore is a pointer move: nothing is copied, created or deleted. That choice came from arithmetic, not elegance — each document keeps at most fifty versions, and if restore duplicated the restored body as a new snapshot, anyone who restores often would burn the budget on copies of the same content. The first version and the current one are never pruned.",
      },
      {
        type: "p",
        text: "One numbering rule does quiet, load-bearing work: a new version is numbered from the highest number that exists, not from the pointer. Restore v2 of five versions and then save an edit, and you get v6 — history branches forward, and v3 through v5 remain exactly where they were, still restorable. Nothing you did before a restore can be destroyed by what you do after it.",
      },
      {
        type: "figure",
        figure: "version-pointer",
        caption:
          "Restore moves the pointer; editing afterwards appends past the highest version. The AI and your own edits share one chain, and every link stays restorable.",
      },
      {
        type: "p",
        text: "Versioning also fixed a small, maddening UI wrong: every chat card for a document used to open the latest body, so older versions were unreachable. But each generated version already records which assistant message produced it, and each card knows its own message — match the two, and every card opens the version it announced. No schema change, and it worked retroactively for every old conversation.",
      },
      { type: "h2", text: "Two kinds of author" },
      {
        type: "p",
        text: "Attribution sounds cosmetic and isn't. Each version records whether a model or a person made it, and for people, who. The first cut accepted the editor's display name from the request body — until review pointed out that any authenticated caller could stamp a teammate's name onto an edit. The name is now resolved server-side from the session, and whatever the client sends is ignored. Attribution is a trust feature, which makes it a security surface.",
      },
      {
        type: "p",
        text: "The editing itself converts the model's component spec into a rich-text document: prose becomes ordinary editable text, while charts, KPI cards and tables ride along as atomic embedded blocks that re-render through the same components and stay editable in place. One guard worth stealing: a chart's data table is sometimes derived — long-tail series folded into an “Other” row — and those render read-only in edit mode, because writing an edit back by row index into folded data would silently hit the wrong source row.",
      },
      {
        type: "p",
        text: "And when the model edits after a human has edited, it loads whatever the pointer names — the human's content is the authoritative base, and the instruction is to change only what was asked. Both kinds of author write through the same version machinery, so nothing human-made can be silently trampled, and anything can be taken back.",
      },
      {
        type: "ul",
        items: [
          "Generated artefacts need a lifecycle, not just a render. If people will send it, sign it or defend it, they need to shape it first.",
          "Restore as a pointer move makes undo free — and guaranteed undo is what makes people edit machine output fearlessly.",
          "Number new versions past the highest that exists, and a restore can never destroy the future it rewound.",
          "Attribution is a feature and an attack surface: resolve identity from the session, never from the payload.",
        ],
      },
    ],
  },
  {
    slug: "one-spec-five-surfaces",
    title: "One spec, five surfaces",
    dek: "The same JSON document renders in the app, prints to PDF, exports to DOCX and opens in Google Docs, Sheets, Word and Excel.",
    date: "2026-08",
    when: "Aug 2026",
    kind: "feat",
    tags: ["Playwright", "python-docx", "OAuth 2.0", "Google Drive API", "Microsoft Graph"],
    body: [
      {
        type: "p",
        text: "A report that lives only inside a chat panel is half a product. Reports exist to leave — they get attached to emails, dropped into decks, filed with clients, edited by people who will never open our app. So the canvas had to meet documents where documents live, and that meant one source of truth wearing five bodies: the interactive panel, PDF, DOCX, spreadsheets, and files in the reader's own Google Drive or OneDrive.",
      },
      {
        type: "figure",
        figure: "five-surfaces",
        caption:
          "Every surface has its own renderer reading the same spec. Nothing is converted from another export, so no format inherits another's compromises.",
      },
      {
        type: "p",
        text: "Our first PDF was honest about being version one: rasterise the rendered panel and slice the bitmap into A4-height strips. No selectable text, and tables guillotined mid-row wherever a page happened to end. Within a week it was replaced by the shipped design: a server-side HTML print template rendered by headless Chromium via Playwright, with charts pre-rendered to images — because a real print engine honours “don't split this element”, so tables and KPI cards survive page breaks intact.",
      },
      {
        type: "p",
        text: "The other surfaces got native treatment rather than conversions. DOCX is built element by element with python-docx, since a Word file is not a web page and pretending otherwise produces documents that look pasted. Spreadsheet exports become typed workbooks: currency strings, thousands separators and percentages are parsed into real numbers with matching formats, because a grid of text that Excel cannot sum is not a spreadsheet, it is a picture of one.",
      },
      { type: "h2", text: "Every surface lies differently" },
      {
        type: "p",
        text: "The discipline was refusing the shortcut of converting one output into another, because chained conversions compound each format's compromises. Each surface renders from the spec and is honest about what it cannot say: charts become images, tabs become headed sections, diagrams ship as their source text in Word rather than as a broken picture.",
      },
      {
        type: "p",
        text: "The bugs were format-specific and educational. The rupee sign printed as boxes because the headless browser's container image had no font carrying that glyph — fixed by loading a web font and allow-listing only that host in the export's otherwise-total network blocker. A seven-column table clipped off the right edge of portrait A4, so wide tables now rotate the whole document to landscape. DOCX silently dropped every tab's content, because tab labels live in one list and tab bodies in another, paired only by position — the exporter looked for children nested under each label and found nothing. And Word's built-in header styles carry a centre tab stop that Word ignores but Google Docs' importer honours, so the same file looked right in Word and collapsed in Docs until the styles themselves were rewritten.",
      },
      { type: "h2", text: "Exports that stay put" },
      {
        type: "p",
        text: "One small decision did outsized work: a mapping keyed by document, user and target, so a re-export overwrites the same external file instead of minting a copy. Report v3 lands in the same Google Doc v2 created, the link the user already shared quietly gets better, and nobody curates report-final-final-2. If the reader deleted the file, the export recreates it and updates the mapping; two users exporting the same document each get their own file.",
      },
      {
        type: "p",
        text: "Because export-to-your-account means holding OAuth grants, that part was built paranoid. The scope is the narrowest one that works — per-file access to files the app itself creates. The OAuth state parameter is signed, bound to the signed-in user and spent exactly once, after a review of the first design showed a classic login-CSRF: an attacker could start the flow with their own account and hand the callback to a victim, grafting the attacker's drive onto the victim's workspace. Tokens are encrypted at rest and the system fails closed — no valid key, no token operations, never plaintext. And one hard-won rule of API clients: never retry a failed file-create, because the provider may have committed the file before returning the error, and a retry mints duplicates. Updates retry; creates do not.",
      },
      {
        type: "ul",
        items: [
          "Export is a renderer, not an afterthought. Each target deserves a first-class mapping from the source of truth.",
          "Never chain conversions. Render every surface from the spec, or inherit the union of every format's compromises.",
          "Update-in-place beats attachment sprawl: a shared link that quietly improves is a feature users feel without naming.",
          "OAuth state is an attack surface. Sign it, bind it to the user, spend it once — and encrypt every token you store, failing closed without the key.",
        ],
      },
    ],
  },
  {
    slug: "teaching-the-model-to-stop",
    title: "Teaching the model when to stop",
    dek: "Reports that respect a page limit, resolve dates the same way twice and lead with the finding — none of it came from asking nicely.",
    date: "2026-09",
    when: "Sep 2026",
    kind: "fix",
    tags: ["Python", "LLM", "Prompting"],
    body: [
      {
        type: "p",
        text: "Give a language model a document tool and it will write you a document — at length. Users would ask for a brief report and receive a sprawling one, many times the requested size, and when we reproduced it in an internal evaluation across several models, every single one ignored the cap. The best exhibit: one model wrote itself a generation brief asking for a two-page report “retaining all metrics and tables”. The contradiction was right there in its own words. The prompt asked for brevity; nothing enforced it; politeness was our enforcement mechanism, which is to say we had none.",
      },
      { type: "h2", text: "Enforce, don't request" },
      {
        type: "p",
        text: "A document has no pages until it is exported, so enforcement starts with an estimator: visible characters per page plus a fixed weight per element — a chart costs about a third of a page, a table a sliver per row. A draft that exceeds the user's cap by more than a 1.3× tolerance gets exactly one condensation retry. The tolerance exists because borderline documents would otherwise retry-loop; the real failures weren't borderline, they were several times over.",
      },
      {
        type: "p",
        text: "Review reshaped the rule in an important way. The first version said the budget outranks completeness; a teammate pushed back that this would truncate data the agent had already gathered. The rule that shipped is “condense, never truncate”: aggregate to coarser granularity, compress analysis to conclusions, and if the content genuinely cannot fit, completeness wins and the reply says so. A limit should change the shape of the answer, not its truth.",
      },
      { type: "h2", text: "Then the model invented a cap" },
      {
        type: "p",
        text: "Four days after enforcement shipped, a request with no length limit at all failed: the model had made up a two-page cap on its own, the estimator honestly rejected the honestly-sized draft, the retry could not fit a seven-section audit into two pages, and the document was lost. The prompt already said “never invent a cap”. Of course it did.",
      },
      {
        type: "p",
        text: "We built two provenance checks and deleted both. A regex that derived the cap from the user's message missed natural follow-ups like “make it 2 pages”. Quote-verification — the model must pass the user's own words, and a match gates enforcement — worked when the model quoted, but in production it sometimes passed a real cap without the quote, so genuine limits went silently unenforced. The final design trusts the cap at face value and makes being wrong cheap instead: an over-budget document that is structurally valid ships anyway, flagged, and the reply must admit it ran longer than asked. Now an invented cap costs one wasted retry and an apologetic sentence; a missed real cap would have brought the original bug back.",
      },
      {
        type: "figure",
        figure: "page-budget",
        caption:
          "Every path ends in a document. An over-budget draft that is structurally valid still ships, and it's flagged so the reply has to own the overrun.",
      },
      {
        type: "p",
        text: "One more collision taught us about instruction design. “Make it two pages” on an existing document used to combine the edit rules — keep every element exactly as it is — with the budget rules — condense — in a single message, and the model would refuse, or return the body unchanged. No amount of emphasis fixed it. Splitting it into a dedicated budgeted-edit instruction did: it separates what never shrinks (findings, citations, caveats) from what condenses (data granularity). When two rules collide, the model picks one; resolve the collision structurally, don't shout.",
      },
      { type: "h2", text: "Same question, same window" },
      {
        type: "p",
        text: "The date bug was quieter and worse. The date tool precomputed only a few preset look-backs; for anything else the model did its own calendar arithmetic, with an undocumented convention about where windows end — so a 28-day audit ran on a window shifted by one day, split into weekly buckets on the wrong days. First fix: the tool resolves any look-back length itself, deterministically, and the resolved window is frozen across every data call, bucket and label. Then the convention itself got reversed: “last N days” now excludes today by default, because today is a partial day, and comparing it against full days manufactures an apparent drop in every metric. Today joins the window only when the user explicitly asks, labelled as partial. And windows anchor to the ad account's own timezone — a UTC “yesterday” is still an unfinished day for an account west of UTC.",
      },
      { type: "h2", text: "Lead with the finding" },
      {
        type: "p",
        text: "The last discipline is editorial. Models narrate — setup, method, then eventually the point; busy readers work the other way round. So every data-bearing answer leads with what changed and why it matters before the document, and next actions come after it. And one carve-out to “you're a formatter, don't re-analyse”: arithmetic is not analysis. When both operands are in the source, the document computes the delta or the rate — a report that prints “not provided” next to two numbers it could subtract has stopped too soon.",
      },
      {
        type: "ul",
        items: [
          "Prompts are requests; validators are guarantees. Anything a user can set needs an enforcer, not an aspiration.",
          "When a check can be silently wrong, redesign so that being wrong is cheap — a flagged overrun made trusting the model safe.",
          "Take determinism away from the model on purpose: resolve time — in the right timezone — before the model ever sees it.",
          "Two rules that collide in one message make the model pick one. Separate them structurally instead of repeating them louder.",
        ],
      },
    ],
  },
];

export const getPost = (slug: string) => blogPosts.find((p) => p.slug === slug);

const blockWords = (block: BlogBlock): number => {
  switch (block.type) {
    case "p":
    case "h2":
    case "quote":
      return block.text.split(/\s+/).length;
    case "figure":
      return block.caption.split(/\s+/).length;
    case "ul":
      return block.items.join(" ").split(/\s+/).length;
    case "code":
      return block.code.split(/\s+/).length;
  }
};

/** Estimated reading time in whole minutes, at ~200 words per minute. */
export function readingTime(post: BlogPost): number {
  const words = post.body.reduce((n, b) => n + blockWords(b), post.dek.split(/\s+/).length);
  return Math.max(2, Math.round(words / 200));
}
