import type { ShipKind } from "@/lib/data";

export type BlogBlock =
  | { type: "p"; text: string }
  | { type: "h2"; text: string }
  | { type: "quote"; text: string }
  | { type: "code"; lang?: string; code: string }
  | { type: "ul"; items: string[] };

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
        text: "Chat is a terrible medium for a fifty-row answer. Our assistant does marketing analytics, so the questions that matter come back as comparisons, trends and breakdowns — exactly the material that turns into porridge when it's streamed as prose with a few markdown tables. So we built a report canvas: a side panel that renders data-heavy answers as structured documents, with KPI cards, charts, tables, tabs and diagrams, generated entirely by the model and then owned by the user.",
      },
      {
        type: "p",
        text: "The first version generated the document as part of the chat response itself. It demoed beautifully and creaked in production. When a generation failed midway, users got half a document welded to half an answer. There was no clean boundary for validating the output, no natural place to version it, and every formatting quirk of the model leaked straight onto the page.",
      },
      { type: "h2", text: "Make it a tool" },
      {
        type: "p",
        text: "The rework moved generation into a dedicated tool call. The model decides a report is warranted and calls the tool with the document as structured content — a JSON spec of typed blocks, not markup. That one boundary bought three properties at once. Schema validation: a malformed document fails at generation time with a specific error, instead of rendering as something broken in front of the user. Versioned edits: the model modifies an explicit base version, so an edit is a new version rather than a mutation. And a hard time budget: a generation that cannot finish fails cleanly at the ceiling instead of hanging a conversation.",
      },
      {
        type: "code",
        lang: "json",
        code: `{
  "blocks": [
    { "type": "kpi_row",
      "items": [{ "label": "Spend", "value": "…", "delta": "−12%" }] },
    { "type": "chart", "id": "c1", "kind": "line", "series_ref": "s1" },
    { "type": "table", "id": "t1", "columns": ["…"], "rows_ref": "r1" }
  ]
}`,
      },
      {
        type: "p",
        text: "The spec is also a division of labour: the model owns content, the renderer owns presentation. The model never chooses fonts, spacing or layout — it says “this is a KPI row, this is a line chart over that series” and the canvas decides what that looks like. Which meant we could later add lazy-loaded report cards, a full-screen mode and new export targets without touching generation at all, and tune generation without breaking a single rendered document.",
      },
      {
        type: "ul",
        items: [
          "A schema moves failure earlier, and earlier failure is cheaper: a validation error at generation time beats a broken page in front of a user.",
          "Contracts beat conventions. The prompt can ask for well-formed documents; only the validator can insist.",
          "Separate content from presentation even when one model produces both — it is the seam every future feature will need.",
          "A hard time budget turns an unbounded worst case into a bounded, reportable one.",
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
        text: "When we sat down to fix the report canvas's reliability, the first step was boring bookkeeping: we took the recent generation failures and grouped them by root cause instead of by symptom. Fourteen failures, and seven of them were the same bug wearing different clothes — a dangling reference. A chart pointing at a data series that was never emitted. A block referring to an id that had been renamed three hundred lines earlier, or dropped in an edit, or simply invented.",
      },
      {
        type: "p",
        text: "This is a very LLM-shaped failure. Models are excellent at local coherence — any given block looks right — and unreliable at referential integrity across a long structured document. By the time the model writes block forty of a spec, the id it made up in block three is a distant memory it may misremember with total confidence. Ask for prose and nobody notices. Ask for a machine-readable document where blocks reference each other, and every lapse becomes a render failure.",
      },
      { type: "h2", text: "Validate like a linker" },
      {
        type: "p",
        text: "The fix was to treat the spec the way a linker treats object files: every symbol that is referenced must resolve, or the document does not ship. After schema validation, a pass walks every reference field in the document and checks it against the set of ids that actually exist. It is a cheap, total check — unlike “is this report good?”, “does `series_ref: s1` resolve?” has a definite answer — and it catches the whole class, not just the instances we had seen.",
      },
      {
        type: "p",
        text: "A resolvable failure also enables a sane recovery: a generation that fails the reference check can be repaired or retried with a specific complaint, rather than surfacing to the user as a broken page or a vague apology.",
      },
      { type: "h2", text: "The rest of the failure budget" },
      {
        type: "p",
        text: "The same reliability pass picked up the next causes on the list. Page limits that users set became enforced constraints instead of polite requests. And reporting date windows were made deterministic — a phrase like “last month” is resolved to concrete dates once, server-side, so the same question produces the same window every time instead of whatever the model felt that day.",
      },
      {
        type: "ul",
        items: [
          "Count failures by root cause, not by symptom. Ours looked like fourteen problems and were really about four — and half the pile was one bug.",
          "Referential integrity is checkable even when quality isn't. Validate everything that has a definite answer; save human judgement for what doesn't.",
          "Treat model output like untrusted input to a compiler: parse, validate, link — then render.",
          "Every input the model doesn't control is one less way two runs can differ. Determinism is something you deliberately take away from the model.",
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
        text: "The other escape hatch was worse: copy the content out into a real editor, at which point the structure — the charts, the KPI cards, the live tables — dies, and the canvas has demoted itself to a clipboard. If the document is the product, it has to be editable where it lives. So we made it one: in-panel rich-text editing, version history with restore, author attribution and a full-screen mode.",
      },
      { type: "h2", text: "Versions are what make editing safe" },
      {
        type: "p",
        text: "The mechanism underneath is the same one that made generation reliable: versions. Every change — the model's or a person's — produces a new version against an explicit base, and any version can be restored. That single property removes the fear from both directions of editing. A person can rework a generated document knowing the original is one click away, and the model can be asked to revise again without silently trampling human work, because its edit is just another version in the chain, attributed to its author.",
      },
      {
        type: "p",
        text: "Attribution sounds cosmetic and isn't. When a document has two kinds of author, “who wrote this?” is a trust question — a person deciding whether to forward a report wants to know which parts are machine-drafted and which parts a colleague already reviewed. Recording authorship per version made that answerable instead of vibes.",
      },
      { type: "h2", text: "Whose document is it?" },
      {
        type: "p",
        text: "The deeper shift was in how we thought about ownership. Before editing, a report belonged to the model, and the user was its audience. The first time a person touches the document, ownership flips — it is theirs now, and the model is a collaborator who drafted it. Most product decisions fell out of taking that flip seriously: edits must never be lost to a regeneration, history must show hands as well as changes, and restoring the past must be as easy as making the future.",
      },
      {
        type: "ul",
        items: [
          "Generated artefacts need a lifecycle, not just a render. If people will send it, sign it or defend it, they need to shape it first.",
          "Version history is trust infrastructure: people edit fearlessly exactly when undo is guaranteed.",
          "When two kinds of author share a document, record which hand wrote what — attribution is a feature, not metadata.",
          "The regeneration lottery is not an editing story. “Ask again” discards everything the user already approved.",
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
        text: "A report that lives only inside a chat panel is half a product. Reports exist to leave — they get attached to emails, dropped into decks, filed with clients, edited by people who will never open our app. So the canvas had to meet documents where documents actually live, and that meant one source of truth wearing five different bodies: the interactive panel, PDF, DOCX, Google Docs and Sheets, and Word and Excel.",
      },
      {
        type: "p",
        text: "The thing that made this tractable is that a canvas document is a JSON spec of typed blocks, not markup. Every export is a renderer over the same spec. The PDF path drives a headless browser with Playwright, reusing the same rendering that draws the panel, so what you print is what you saw. The DOCX path builds a native document with python-docx, block by block, because a Word file is not a web page and pretending otherwise produces documents that look pasted. The Google and Microsoft paths go over OAuth and create real files in the user's own account.",
      },
      { type: "h2", text: "Every surface lies differently" },
      {
        type: "p",
        text: "The discipline was resisting the shortcut of converting one output into another. Chained conversions compound each format's lies: pagination exists in PDF but not in a panel; DOCX has styles but no CSS; a spreadsheet wants your tables as data, not your layout as decoration. Each surface gets its own renderer from the spec, and each renderer is honest about what its format cannot say — instead of one canonical export degraded four ways.",
      },
      { type: "h2", text: "Exports that stay put" },
      {
        type: "p",
        text: "One small decision did outsized work: re-exporting updates the same external file instead of minting a copy. Report v3 lands in the same Google Doc that v2 created, so the link a user already shared quietly gets better, and nobody curates a folder of report-final-final-2. And because export-to-your-account means holding OAuth tokens, we treated ourselves as a credential custodian from day one: tokens encrypted at rest, scopes no wider than the job.",
      },
      {
        type: "ul",
        items: [
          "Export is a renderer, not an afterthought. Each target deserves a first-class mapping from the source of truth.",
          "Never chain conversions. Render every surface from the spec, or inherit the union of every format's compromises.",
          "Update-in-place beats attachment sprawl: the shared link improving quietly is a feature users feel without naming.",
          "The moment you store OAuth tokens you are in the credentials business — encrypt at rest and keep scopes narrow, before anyone asks.",
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
        text: "Give a language model a document tool and it will write you a document — at length. Ours had a particular failure mode users noticed immediately: they would ask for a brief report and receive a sprawling one, many times the length they requested. The prompt said to respect the requested length. The model, on the whole, did not. Politeness turned out to be our enforcement mechanism, which is to say we had none.",
      },
      { type: "h2", text: "Enforce, don't request" },
      {
        type: "p",
        text: "The fix was to reclassify the user's page limit from style guidance into a pipeline constraint. The prompt still asks — a model aimed at the right length produces better-shaped documents than one truncated after the fact — but the limit is now enforced where the document is built, not where it is requested. The general rule became one of the canvas's load-bearing principles: anything the user can set is checked by code, and the prompt is merely how we improve the odds of passing the check on the first try.",
      },
      { type: "h2", text: "Same question, same window" },
      {
        type: "p",
        text: "The second discipline was determinism. A reporting question is almost always a question about a date range, and “last month” is exactly the kind of phrase a model will happily resolve three different ways on three runs. So the model no longer resolves it. Date windows are computed server-side, once, deterministically, and the model receives concrete dates instead of the phrase. Two identical questions now describe the same slice of the world — which sounds small until you have tried to debug a report that disagrees with its own regeneration.",
      },
      { type: "h2", text: "Lead with the finding" },
      {
        type: "p",
        text: "The last change was editorial rather than mechanical. Models narrate: first the setup, then the method, then — eventually — the point. Busy readers work the other way round. So generated reports were restructured to lead with the finding: the headline number or conclusion first, the supporting evidence beneath it. Combined with the hard time budget on generation — a run that cannot finish fails cleanly at the ceiling instead of hanging — the canvas stopped testing its users' patience at both ends.",
      },
      {
        type: "ul",
        items: [
          "Prompts are requests; validators are guarantees. Anything a user can configure needs an enforcer, not an aspiration.",
          "Take determinism away from the model on purpose: resolve time, and every other resolvable input, before the model sees it.",
          "Structure is a quality lever that costs no accuracy — the same content, finding first, reads twice as well.",
          "Verbosity is not a personality flaw to scold out of a model; it is a constraint to engineer.",
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
