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
