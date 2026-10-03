import type { ShipKind } from "@/lib/data";

export type FigureId =
  | "query-tuning"
  | "pay-then-apply"
  | "one-gate"
  | "metering-chokepoint"
  | "hot-path"
  | "placeholder-leak"
  | "link-funnel"
  | "token-budget"
  | "listener-deque"
  | "partial-read"
  | "aimd"
  | "suggestion-lifecycle"
  | "safe-fetch"
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
  /**
   * One short paragraph of product context shown before the body, so a reader
   * who never worked on the product knows what the post is about.
   */
  setup: string;
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
 * All details are public-safe — the product is described generically, no
 * internal architecture is exposed, and numbers appear only where measured.
 */
export const blogPosts: BlogPost[] = [
  {
    slug: "a-server-action-is-a-public-endpoint",
    title: "A server action is a public endpoint",
    dek: "Hiding a button is not access control. Every server action, agent tool and scheduled job is a way in, so the check has to live where they all meet.",
    setup:
      "The product is a Next.js App Router app with a separate API behind it. The same operation can start from a button in the UI, from an AI agent acting on the user's behalf, or from a scheduled job — and this post is about giving all of those paths the same checks.",
    date: "2026-09",
    when: "Jun – Sep 2026",
    kind: "fix",
    tags: ["Next.js", "Security", "Authorization"],
    body: [
      {
        type: "p",
        text: "Marking a function `'use server'` and calling it from a component feels like calling a function. It isn't. Next.js turns it into an HTTP endpoint with an identifier the browser can see, and anyone who can load the page can call it with arguments of their own choosing. The component that renders the button is irrelevant: the endpoint exists whether or not the button does.",
      },
      {
        type: "p",
        text: "An audit of every entry point turned that from a known fact into a to-do list.",
      },
      { type: "h2", text: "What an entry-point audit turns up" },
      {
        type: "p",
        text: "The first find was a leftover: an action written for a one-off data migration, with no authentication check. It had done its job and nothing in the UI called it any more — which is exactly why nobody was looking at it. The second was an action that returned more data than the page using it needed, reachable by anyone who found it. Both were deleted rather than patched. An unused action is still a live URL.",
      },
      {
        type: "p",
        text: "The third was a design decision. For a staff-only admin capability we first built an HTTP route alongside a server action, then removed the route: a server action is already a public endpoint, so the route only added a second door to secure. The remaining action requires several independent factors at once, so no single leaked secret or misconfigured flag is enough on its own.",
      },
      {
        type: "figure",
        figure: "one-gate",
        caption:
          "Four ways in, one gate. A check that lives in the UI guards the only path you were ever going to click-test yourself.",
      },
      { type: "h2", text: "Controllers are not the only callers" },
      {
        type: "p",
        text: "In a product with an AI agent, checks in HTTP handlers aren't enough. An agent calls tools directly, and a scheduled job runs with no request at all; both bypass the controller. So plan entitlements live in the service layer — the one function every path has to call to create the thing — and the controller's only job is to turn a refusal into a 403.",
      },
      {
        type: "p",
        text: "Identity has the same trap. The first version of an author-attribution feature took the author's display name from the request body, so any signed-in caller could have put a teammate's name on an edit. Review caught it. The name now comes from the session, and whatever the client sends is ignored.",
      },
      { type: "h2", text: "Audit by entry point, not by page" },
      {
        type: "p",
        text: "The practical change is in how we review. Instead of asking “can a user reach this screen?”, list the entry points — every `'use server'` export, every route handler, every tool the agent can call, every scheduled job — and ask what each one checks by itself, assuming the caller is hostile and the UI doesn't exist.",
      },
      {
        type: "ul",
        items: [
          "`'use server'` publishes an endpoint. Authenticate and authorise inside the action, every time, as if no UI existed.",
          "Delete dead server actions. Unreferenced is not unreachable.",
          "Put entitlement checks where every caller converges — the service layer — not where one caller happens to arrive.",
          "Identity comes from the session, never from the payload.",
          "Fewer doors beat better locks. Remove the redundant route instead of securing two.",
        ],
      },
    ],
  },
  {
    slug: "eighteen-links-in-zero-out",
    title: "Eighteen links in, zero out",
    dek: "Our generated ad reports kept losing their preview links. Two rounds of stronger prompt wording failed; counting the links at every hop found four separate bugs.",
    setup:
      "The product turns ad-platform data into reports through a multi-step LLM pipeline: data is fetched through tools, summarised by one model step, laid out as a structured document by another, then exported to Word or PDF. Every ad comes with a shareable preview link, and readers want those links in the report.",
    date: "2026-09",
    when: "Aug – Sep 2026",
    kind: "fix",
    tags: ["LLM", "Python", "DOCX"],
    body: [
      {
        type: "p",
        text: "One failing run made the problem precise: the ad platform's API returned 18 preview links, the intermediate summary carried 19 (one repeated), and the finished report contained zero.",
      },
      { type: "h2", text: "Two rounds of asking harder" },
      {
        type: "p",
        text: "The first fix was the obvious one: an instruction to the document step that a table whose rows are ads must carry a Preview column. It failed. The model had framed its tables as “classification evidence”, decided they weren't about ads, and declined the rule. The second attempt made the trigger structural — if a table has an ad ID or ad name column, add Preview — and that failed too: 18 rows, zero links. Two passing runs along the way had been misleading, because the input for those runs happened to mention previews.",
      },
      {
        type: "p",
        text: "At that point we stopped, deliberately. Two failed attempts at the same fix means the hypothesis is wrong, not the wording, and the note written at that stop is blunt about it: don't add a third round of stronger wording — measure what actually reaches the model.",
      },
      { type: "h2", text: "Count it at every hop" },
      {
        type: "p",
        text: "Counting links at each stage found not one bug but four. The document step never saw most of the links: they were dropped when intermediate results were merged into its input, and a model can't cite what isn't in its context. When links did arrive, the Preview column landed last of ten, off the right edge of the screen. The model occasionally retyped a link — one generated link was a single character off the adjacent row's real one, which is worse than no link, because it's well-formed and opens the wrong ad. And the Word exporter flattened every link to dead text, because it wrote strings, not hyperlinks.",
      },
      {
        type: "figure",
        figure: "link-funnel",
        caption:
          "The count that ended the prompt-tweaking: 18 → 19 → 0. Each stage then got a fix that doesn't depend on the model's cooperation.",
      },
      { type: "h2", text: "Deterministic checks instead of stronger words" },
      {
        type: "p",
        text: "Every URL the document step emits is now corroborated against the source data — exact set membership on host and token — and anything that doesn't match is dropped, leaving an empty cell. A model cannot verify its own transcription, but this check is exact. One wrinkle: the platform regenerates the shareable link on every request, so two different links for the same ad across two reads are not corruption. Corroboration has to be against the data this run actually fetched.",
      },
      {
        type: "p",
        text: "Column placement became post-processing, not an instruction: the Preview column is promoted into the first four. And the Word exporter now writes real hyperlinks with proper document relationships, behind a URL-scheme allowlist — turning model-authored text into live links inside a document people forward to clients is a security surface, not a formatting detail.",
      },
      {
        type: "p",
        text: "Upstream, the ads tool's description had been steering the model towards a 64×64 thumbnail image as the “preview”, because nothing told it which field was the real rendered ad. Tool descriptions are prompts too. They now name the right field, and say plainly that the thumbnail is not one.",
      },
      {
        type: "p",
        text: "With deterministic checks carrying the load, the relevant prompt text shrank from 1,237 words to 625, and the contract tests assert invariants instead of exact phrasing. A live generate → edit → export run kept all three of its preview links in both the Word file — three hyperlink relationships, no raw URLs in the text — and the PDF.",
      },
      {
        type: "ul",
        items: [
          "After two failed prompt fixes, stop rewording and start measuring. The problem is usually context, not phrasing.",
          "Count the data at every hop. “18 → 19 → 0” pointed at the broken stage immediately.",
          "Trigger rules on structure, and test them with inputs that don't mention the feature — otherwise a lucky phrasing passes for you.",
          "Never ship an identifier a model retyped. Corroborate it against the source, and fail closed to an empty cell.",
          "Tool descriptions steer tool choice. Name the right field, and say what the wrong one isn't.",
        ],
      },
    ],
  },
  {
    slug: "when-your-auth-provider-is-slow",
    title: "When your auth provider is slow, so are you",
    dek: "One membership lookup on every AI request turned a third-party latency incident into our outage. The fix was to stop asking.",
    setup:
      "The product's web app runs on serverless functions, with sign-in, sessions and organisation membership handled by a hosted identity provider. Every request to its AI features passes through a route that authorises the caller first.",
    date: "2026-09",
    when: "Sep 2026",
    kind: "fix",
    tags: ["Next.js", "JWT", "React Query"],
    body: [
      {
        type: "p",
        text: "When our identity provider had an elevated-latency incident, our AI routes — chat history, generated reports, downloads — started returning 504s. Nothing in our code had changed. Every one of those routes was waiting on the provider, until the platform's 60-second function timeout gave up on its behalf.",
      },
      {
        type: "p",
        text: "The call they were waiting on was a small one. One authorisation rule needed the caller's organisation memberships, so the route fetched them from the provider's API — on every AI request, for every user, although the rule only ever changed the outcome for a handful of internal users.",
      },
      { type: "h2", text: "A dependency on the hot path is an outage you don't control" },
      {
        type: "p",
        text: "That call had always been fast enough to ignore, which is how it ended up on the hot path. The incident showed its real cost: our availability had quietly become the provider's availability, for a rule most requests didn't need.",
      },
      {
        type: "p",
        text: "The fix stopped asking. The part of the decision that depends on who the user is now comes from a claim in the signed session token — a local read, no network. The part that depends on membership comes from the client, which already had those memberships cached, as a hint. The server only acts on the hint when the signed claim already allows it, so a forged hint gains nothing, and every user the rule doesn't apply to resolves instantly, with no added latency.",
      },
      {
        type: "figure",
        figure: "hot-path",
        caption:
          "The decision moved from a network call to a token read. The client's hint only matters when a claim it can't forge already agrees.",
      },
      { type: "h2", text: "Hold, don't guess" },
      {
        type: "p",
        text: "Moving part of the decision to the client created a subtler problem: timing. While authentication is still loading, the client doesn't yet know the user's role. If it guessed and fetched, a wrong 404 would be cached — and would stick after the role resolved. So role-gated queries hold until the claim is known, and the role is part of the query key, so responses for different roles never share a cache entry. An optimistic cache insert is skipped during that window for the same reason: it would have written under the wrong key.",
      },
      { type: "h2", text: "Negative conditions age badly" },
      {
        type: "p",
        text: "A week later the rule itself turned out to be wrong. It had the shape “has the role AND is NOT a member”, carried over from the old code — so users who were both lost access they should have had, and got a 404 for content the server would happily have served. The fix simplified everything: the signed claim alone decides, and membership can only ever add access. Two more network fetches disappeared from the first render.",
      },
      {
        type: "p",
        text: "The pull request went up the day after the incident and was in production within two days. We didn't capture latency percentiles before and after, so the honest claim is the structural one: the AI routes no longer make a single call to the identity provider's API.",
      },
      {
        type: "ul",
        items: [
          "Audit the hot path for third-party calls. Each one puts a ceiling on your availability.",
          "Prefer signed claims to lookups. A token you can verify locally is a decision you can make without the network.",
          "Client hints are fine when the server ANDs them with something the client can't forge.",
          "Don't cache a guess. Hold requests until identity resolves, and put the deciding flag in the query key.",
          "Prefer conditions that grant over conditions that restrict. “NOT a member” broke the moment someone was both.",
        ],
      },
    ],
  },
  {
    slug: "stream-only-what-you-render",
    title: "The 93.5% payload diet",
    dek: "Our chat UI was discarding most of what the server streamed at it. The fix was one policy: send the browser only what it renders.",
    setup:
      "The product is an AI assistant that answers by calling tools — ad-data queries, web scrapes, file reads — and streams its answer over SSE, with an event per tool call so the UI can show progress. Reopening a conversation reloads its full history as JSON.",
    date: "2026-09",
    when: "Sep 2026",
    kind: "perf",
    tags: ["Python", "SSE", "FastAPI"],
    body: [
      {
        type: "p",
        text: "Reopening an old conversation had started to feel heavy. The interface was snappy everywhere else, but a conversation with a few big agent turns took noticeably long to load, and the network tab explained why: one history reload for a multi-platform audit weighed 714 KB of JSON for something that, on screen, was a handful of messages and cards.",
      },
      {
        type: "p",
        text: "An answer is usually several tool calls deep, and the streaming pipeline forwarded every tool's output to the browser, verbatim. The UI rendered the output of about a dozen tools. For every other tool it showed a name and a spinner, and the component that received the output returned nothing. We were shipping scrapes of up to 160,000 characters, long intermediate research notes and whole instruction documents so that the browser could discard them on arrival.",
      },
      {
        type: "p",
        text: "The reload path was worse. It returns the whole history, and the front end invalidated that query after every completed turn with a stale time of zero — so the same dead payload was re-serialised out of Postgres and re-downloaded after every single answer.",
      },
      { type: "h2", text: "The browser is not the agent" },
      {
        type: "p",
        text: "The insight, once we said it out loud, was embarrassingly simple: the model and the UI are different consumers with different needs. The model needs complete tool output — every row, every snippet — because it reasons over it. The UI needs whatever its card renders. Conflating the two meant the heaviest consumer set the payload for both.",
      },
      {
        type: "p",
        text: "So instead of judgement calls scattered through the code, the rule is written down once, in a single policy with three classes of tool: the ones the UI renders stream unchanged; large structured objects are projected down to the few fields the UI shows; everything else becomes a stub.",
      },
      {
        type: "code",
        lang: "python",
        code: `RENDERED = {"image", "video", ...}                     # the UI draws these

def client_view(tool: str, output):
    if tool in RENDERED:
        return output                                    # stream unchanged
    if tool in PROJECTED:
        return project(output, PROJECTED[tool])          # the fields the UI reads
    return {"status": "done", "output_streamed": False}  # everything else`,
      },
      {
        type: "figure",
        figure: "payload-diet",
        caption:
          "One policy, two consumers: the model keeps the full tool output, the browser gets only the view its card renders. Bars show the average payload per conversation before and after.",
      },
      {
        type: "p",
        text: "Full outputs stay server-side, where debugging and tracing still read them. And the model never read the browser stream in the first place, so agent behaviour didn't change at all.",
      },
      { type: "h2", text: "Keep the event, drop the body" },
      {
        type: "p",
        text: "Two details decided whether this was safe. First, the tool-output event still fires for stubbed tools: the UI clears its progress spinner when that event arrives, so suppressing the event rather than emptying it would have left phantom spinners. Second, the policy has to own every path. One tool emitted its result through a separate path that bypassed the filtering, and the stream de-duplicates on tool-call id plus payload — so a filtered and an unfiltered copy counted as two different events, and the second replaced the rendered image. Routing every emission through the same policy makes them identical by construction.",
      },
      {
        type: "p",
        text: "Old conversations mattered too. Tools that had since been renamed still carried media URLs in stored history, and stubbing them would have removed images from old chats for good.",
      },
      { type: "h2", text: "Results, honestly labelled" },
      {
        type: "p",
        text: "Across seven real conversations, measured against their stored rows, the history reload fell by 93.5% on average and the live stream by 76.6%. The 71-tool-call audit went from 714 KB to 23 KB on reload. Those are measurements of seven conversations, not production percentiles — but when the mechanism is “stop sending data the client provably deletes”, the direction is not in doubt.",
      },
      {
        type: "p",
        text: "Hardening the parser turned up a latent bug on the way. The fallback that parses stored tool output used `ast.literal_eval`, which on a large non-literal blob raises `MemoryError` or `RecursionError`, not `SyntaxError`. Uncaught, it would have returned a 500 for any conversation that contained one.",
      },
      {
        type: "ul",
        items: [
          "Payloads creep. Nobody decides to stream hundreds of kilobytes of dead JSON to the browser; it accumulates one reasonable-looking tool at a time. Audit what crosses the wire, per event type.",
          "Allowlist what the client renders. A tool wrongly left off the list shows up at once as a missing card — a much louder failure than silently leaking bytes.",
          "Fix both paths with one policy. If live streaming and history reload share a definition, they cannot disagree.",
          "Measure what is left. After the fix, tool inputs were 56% of the remaining reload payload on the heaviest conversations — the next diet is already visible.",
        ],
      },
    ],
  },
  {
    slug: "anatomy-of-an-oom",
    title: "Anatomy of an OOM: the 5.7 MB spreadsheet",
    dek: "A small upload kept crashing our chat server mid-reply. Three code paths each held the whole file's text; the fix was budgets, chunks and a cheaper integrity check.",
    setup:
      "The product lets users attach spreadsheets, PDFs and slide decks to an AI chat. The server extracts each file's text and lets the agent read it page by page, since a large file won't fit in the model's context at once. It runs on Kubernetes with a 1 GiB memory limit per pod.",
    date: "2026-09",
    when: "Sep 2026",
    kind: "fix",
    tags: ["Python", "Redis"],
    body: [
      {
        type: "p",
        text: "The bug report was the unsettling kind: a user uploads a spreadsheet, asks a question about it, and the assistant dies mid-answer. Kubernetes restarts the pod, the user retries, and it dies again — a perfectly reproducible crash loop, triggered by a 5.7 MB file. Worse, a hard kill skips every cleanup handler, so the conversation stayed marked as streaming, and the user only saw “Response failed” about ten minutes later, when they reopened the chat.",
      },
      {
        type: "p",
        text: "The pod's baseline was already around 435 MB. Run locally against the real file, the process went from 153 MB to 414 MB resident. The workbook was 5.7 MB on disk, but it held 34.8 MB of uncompressed XML and extracted to 11.5 million characters of text — and three separate code paths each held or rebuilt that text in full.",
      },
      { type: "h2", text: "Three copies of the same text" },
      {
        type: "p",
        text: "The file-reading tool cached the whole extraction as one value and decoded all of it on every call, just to return a 40,000-character window. In the incident turn the agent paged through the file sixteen times, so it decoded roughly 11 MB sixteen times over.",
      },
      {
        type: "p",
        text: "Upload validation parsed the entire workbook a second time to answer a yes-or-no question — is this file corrupt? — and then threw the text away.",
      },
      {
        type: "p",
        text: "And extraction had no output limit at all. Tens of megabytes of Python strings were allocated, and in practice the allocator never handed that memory back to the operating system.",
      },
      {
        type: "figure",
        figure: "oom-expansion",
        caption:
          "A 5.7 MB upload held 11.5 million characters, and three code paths each kept all of them. Budgets and chunked reads bound the same sixteen reads so that memory is handed back.",
      },
      { type: "h2", text: "Budgets, chunks and a cheaper check" },
      {
        type: "p",
        text: "Each holder got its own fix. The cache became content-addressed chunks, so a paginated read fetches at most two of them, and identical uploads share storage for free. Validation moved down to the zip layer: stream every archive member through its CRC check without parsing any XML, under a decompression ceiling against zip bombs. Its cost became flat in row count — no measurable growth at 30,000 rows, 1.1 MB at 120,000. And every extractor — PDF, DOCX, PPTX, XLSX, CSV and plain text — became a lazy generator under one shared character budget. A 1,600-page PDF over the budget now parses 1,288 pages and stops, which the tests assert by counting calls.",
      },
      { type: "h2", text: "Tell the model it is reading part of the file" },
      {
        type: "p",
        text: "A budget creates a new failure mode: a confident answer from a partial file. Before truncation was flagged, an agent that paged to the end of a capped file received a clean “whole file read” signal — so a question about a total over a 6 MB spreadsheet could be answered from its first 17%, with nothing looking wrong. Every read of a truncated file now says so, and the agent passes that on.",
      },
      {
        type: "p",
        text: "Building a 38-file fixture pack for manual testing turned up one more bug worth stealing. Users were occasionally told “Corruption check failed: error”. Python's `ZipFile.testzip()` only catches `BadZipFile`, so a `zlib.error` escaped into a generic handler that printed the exception's class name — which, for zlib, is literally `error`. The message now names the archive member that can't be read.",
      },
      { type: "h2", text: "Proving it" },
      {
        type: "p",
        text: "On the real file, the same sixteen-read sequence went from 414 MB retained to −15 MB: memory was handed back. Then we A/B-tested inside a real 1 GiB pod. The old build was OOM-killed about seven minutes in; the new one finished in 6.5 minutes at a 655 Mi peak, with zero restarts and a finalised stream. Coverage on the extraction module went from 70% to 89%, and reverting each fix in turn fails at least one test.",
      },
      {
        type: "ul",
        items: [
          "“The file is small” is not a memory model. Ours went from 5.7 MB compressed to 34.8 MB of XML to 11.5 million characters of text.",
          "Count the copies. Memory bugs are usually multiplication, and fixing one of three holders would have moved the crash, not removed it.",
          "Every allocation on a user-controlled path needs a ceiling. If the user picks the input, the user picks your peak memory — unless you cap it.",
          "A cap without a flag is a quiet wrong answer. Truncate honestly, and make the consumer say so.",
          "Reproduce, fix, then A/B under the real limit. Profiling on a laptop with no memory limit tells you half the story.",
        ],
      },
    ],
  },
  {
    slug: "the-webhook-that-downgraded-a-customer",
    title: "The webhook that downgraded a paying customer",
    dek: "Payment webhooks arrive late, out of order and more than once. Our billing now assumes all three.",
    setup:
      "The product sells subscriptions through Stripe and decides what each customer can use from the plan stored in its own database, which Stripe's webhooks keep in sync.",
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
        text: "A renewal event from two days earlier had failed its first delivery, and Stripe was retrying it — Stripe retries for up to three days, with no ordering guarantee. The retry arrived after the customer's upgrade event. It described an older state of the subscription, and our handler applied whatever arrived as though it were the latest word. A stale snapshot overwrote a current one, and a paid account became a free one.",
      },
      {
        type: "p",
        text: "The row itself gave it away once we looked: the plan said free while pointing at a paid subscription, with a billing period older than the one Stripe reported, and the audit log showed the write landing more than an hour after the event was created.",
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
        text: "Treat a webhook as an assertion about current state and you will eventually persist the past over the present. Treat it as a doorbell — “something changed, come and look” — and this whole class of bug disappears. For the events that change what a customer pays or can do, the handler now re-reads the subscription from Stripe's API before writing anything. The webhook decides when to look; the API decides what is true.",
      },
      {
        type: "p",
        text: "Staleness is explicit too. Every subscription event describes a billing period; if its period start is older than the one already stored, the event is logged and dropped. Delivery order stopped mattering because we stopped depending on it.",
      },
      {
        type: "p",
        text: "Manual fixes follow the same rule. Editing a plan directly in the database while Stripe still points at a different product is how you create the next inconsistent row: change it in Stripe, and let the webhook bring the database along.",
      },
      { type: "h2", text: "Idempotency, almost for free" },
      {
        type: "p",
        text: "The same pass moved usage billing onto an append-only ledger: every charge and every grant is a row that's never edited, and purchased usage is granted once per Stripe invoice, keyed on the invoice id under a row lock. A redelivered event grants nothing twice, retries are safe by construction, and any balance can be explained by reading its history — which turned several “why is this balance wrong?” conversations into short ones.",
      },
      {
        type: "p",
        text: "Checkout tightened as well: upgrades now charge before they apply rather than the other way round, and payments that need 3-D Secure complete the challenge before any plan changes hands.",
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
    setup:
      "The product is an AI assistant that streams answers over SSE. A single answer can take minutes: the agent plans, calls several tools and waits on slow services such as image and video generation before it writes anything.",
    date: "2026-01",
    when: "Jan 2026",
    kind: "fix",
    tags: ["Python", "SSE", "asyncio"],
    body: [
      {
        type: "p",
        text: "Failures were arriving as a generic “something went wrong”, and the turns that failed had one thing in common: they were long. Somewhere between server and browser, the stream had died during a stretch where nothing was being sent.",
      },
      {
        type: "p",
        text: "A server-sent-events connection looks like a long promise, but everything in the middle treats it as a short one. Load balancers apply idle timeouts. Proxies buffer or cut quiet connections. During a long tool call we could go minutes without emitting a byte, and to every intermediary that is indistinguishable from a dead connection.",
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
        text: "The first fix was the boring one: heartbeats. The agent's event generator and a small monitor run side by side; after 30 seconds without an event, the monitor injects one. It goes out as an application-level data event rather than an SSE comment, so the client library actually sees it — and the UI can use it to keep its “thinking” indicator honest. Intermediaries see traffic, idle timeouts never fire, and the largest class of dropped streams disappeared for a few bytes a minute. If you own a long-lived stream, keep-alive is part of your protocol, not an optimisation.",
      },
      { type: "h2", text: "Never block the loop" },
      {
        type: "p",
        text: "The second class was self-inflicted. The image and video generation tools waited on slow external services in a way that held the event loop, and while they did, nothing else could be written to the stream — heartbeats included. We had built a keep-alive our own tools could starve. Both became properly async, polling the provider without blocking, so the stream stays live while a video renders or a retry backs off.",
      },
      { type: "h2", text: "Heal the conversation, once" },
      {
        type: "p",
        text: "The third class wasn't the network at all. Some turns failed with errors from the model provider's side: “No tool output found for function call”, or a reasoning item that “was provided without its required following item”. The provider keeps conversation state between turns, and an interrupted turn could leave a reasoning item with nothing after it, or a tool call with no output. Every later turn in that conversation then failed the same way, and the user saw “Something went wrong” forever.",
      },
      {
        type: "p",
        text: "Those two signatures are now recognised explicitly. For the orphaned-reasoning case, the handler pulls the item's id out of the error, deletes that item from the stored conversation, and retries the user's turn — once. Anything else still fails loudly. A retry loop that swallows unknown errors doesn't fix bugs; it just hides the next one.",
      },
      {
        type: "ul",
        items: [
          "A stream is only as alive as its quietest stretch. Design for the silence, not the throughput.",
          "Keep-alive belongs to you. No intermediary is obliged to respect a connection you let go quiet.",
          "One blocking call anywhere on the loop defeats every keep-alive downstream of it.",
          "Recover from errors you can name, once. Match a specific signature, repair, retry a single time, and let everything else surface.",
        ],
      },
    ],
  },
  {
    slug: "your-pr-title-just-ran-in-ci",
    title: "Your PR description just ran in our CI",
    dek: "A release workflow interpolated pull-request text straight into a shell script. Fixing the vulnerability also fixed the outage.",
    setup:
      "The product's release workflow in GitHub Actions publishes each production release's pull-request description as its release notes.",
    date: "2026-05",
    when: "May 2026",
    kind: "infra",
    tags: ["GitHub Actions", "Bash", "Security"],
    body: [
      {
        type: "p",
        text: "A production release failed with three strange lines in the log: `dev: command not found`, `main: command not found` and `Matching delimiter not found 'EOF'`. The failing step turned the release pull request's description into release notes, and that description mentioned two branch names, each wrapped in backticks. Which is an odd thing for a description to be able to break. Unless the shell is executing it.",
      },
      {
        type: "p",
        text: "It was. In GitHub Actions, template expressions are expanded before the shell ever sees the script, so interpolating event text into a run block pastes untrusted input directly into code. Backticks are command substitution, so bash tried to run `dev` and `main`. Pull-request text is attacker-controlled, and the job held write access to the repository's contents and a token to use it.",
      },
      {
        type: "code",
        lang: "yaml",
        code: `# Vulnerable: the description is pasted into the script before bash runs it
- run: echo "\${{ github.event.pull_request.body }}" >> notes.md

# Fixed: the text travels as data, in an environment variable
- env:
    PR_BODY: \${{ github.event.pull_request.body }}
  run: echo "$PR_BODY" >> notes.md`,
      },
      {
        type: "figure",
        figure: "ci-injection",
        caption:
          "The difference is ordering. Interpolation pastes the text into the script before bash parses it; an environment variable is only expanded after parsing, so the text can never become code.",
      },
      { type: "h2", text: "The outage was the proof of concept" },
      {
        type: "p",
        text: "The broken release was, in effect, an accidental security report: an ordinary description with Markdown formatting had already altered what the shell executed. Anyone who could open a pull request could have done the same thing deliberately, with a payload instead of branch names. The fix covered the whole class rather than the one field: every piece of event text in every affected step moved into environment variables, and multi-line step outputs got a randomised heredoc delimiter, so no line of user text can close the block early. It closed the injection and unblocked the release in the same change.",
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
          "Multi-line outputs need an unguessable heredoc delimiter, or user text can end the block and write its own outputs.",
          "A workflow that breaks on punctuation is a security finding, not a flake. The difference between an outage and a compromise is who wrote the description.",
        ],
      },
    ],
  },
  {
    slug: "a-document-is-a-tool-call",
    title: "A document is a tool call",
    dek: "Generated reports got reliable the day generation stopped being part of the streamed chat answer and became its own validated step.",
    setup:
      "The product answers data-heavy questions with generated reports — KPI cards, charts, tables — rendered from a JSON document the model writes, shown in a side panel and exportable.",
    date: "2026-07",
    when: "Jul 2026",
    kind: "feat",
    tags: ["Python", "LiteLLM", "JSON Schema", "React"],
    body: [
      {
        type: "p",
        text: "Chat is a terrible medium for a fifty-row answer. When the questions are about marketing performance, the answers that matter are comparisons, trends and breakdowns — exactly the material that turns into porridge when it streams as prose with a few Markdown tables. So the assistant writes a structured report instead: a JSON document of typed elements that the app renders.",
      },
      {
        type: "p",
        text: "In the first version, the model wrote that document inline, as part of its streamed chat reply, and the server extracted it once the stream ended, deciding “new document or new version?” by matching titles.",
      },
      {
        type: "p",
        text: "It demoed beautifully and creaked in production, in ways worth listing because each one drove a design decision. A malformed or truncated document reached the browser mid-stream, with no place to catch it and retry. Every number had to survive the answering model's context on its way into the document, and under length pressure it would substitute placeholder prose for data or quietly drop a whole section. And title matching created duplicate documents and false versions — ask for a revision, get a stranger.",
      },
      { type: "h2", text: "Make it a tool" },
      {
        type: "p",
        text: "The rework moved generation into a tool that the answering model calls with a short brief: what the document is for, which format, and which existing document to edit, if any. The tool doesn't trust its caller to relay the data — it gathers the source material itself, makes one isolated model call, validates the result, and retries once with the exact validation error appended. The whole thing runs under a single hard time ceiling.",
      },
      {
        type: "figure",
        figure: "tool-pipeline",
        caption:
          "A brief goes in and an id comes out. The document body never rides the chat stream, and the client only ever fetches by the server's id.",
      },
      {
        type: "p",
        text: "The tool returns an id, not the document, so the body never rides the chat stream. And the id the client uses always comes from the server's record, never from the model's text — because a model asked to echo a 36-character id will occasionally add a letter: one extra character, one 404, one confused user staring at an empty panel. The rule that came out of it: never look anything up by an identifier the model typed.",
      },
      {
        type: "p",
        text: "Failure is part of the contract too. When the tool fails, the model answers inline with the full data, as if the tool didn't exist, and never mentions the failure. No half-documents, no apology cards.",
      },
      {
        type: "ul",
        items: [
          "A schema moves failure earlier, and earlier failure is cheaper: a validation error inside a tool beats a broken page in front of a user.",
          "The model that talks to the user shouldn't also typeset the data. Every number it relays by hand has to survive its context window; a tool can go back to the source.",
          "Never trust a model-transcribed identifier. Take it from the authoritative record, or fail closed.",
          "Design the failure path first. “Answer inline as if the tool doesn't exist” meant reliability work could ship without ever stranding a user.",
        ],
      },
    ],
  },
  {
    slug: "the-dangling-reference",
    title: "The dangling reference",
    dek: "Half of our recent report-generation failures turned out to be one bug: the model referring to things it never created.",
    setup:
      "The product renders generated reports from a JSON document written by a model: a flat map of elements, where containers list their children by key. The whole document is validated before it renders.",
    date: "2026-08",
    when: "Aug 2026",
    kind: "fix",
    tags: ["Python", "LLM", "JSON validation"],
    body: [
      {
        type: "p",
        text: "When we sat down to fix report generation's reliability, the first step was boring bookkeeping: pull the recent failures and group them by root cause instead of by symptom. Fourteen failures, and seven were the same bug in different clothes — a dangling reference.",
      },
      {
        type: "p",
        text: "The failing documents had containers naming keys that didn't exist. The model would plan a section — put its key in a parent's child list — and then never write the element. Or write it under a punctuation variant: `sales-section` in the plan, `sales_section` in the map.",
      },
      {
        type: "p",
        text: "This is a very LLM-shaped failure. Models are excellent at local coherence — any given element looks right — and unreliable at referential integrity across a long structured document. By element forty, the key invented at element three is a distant memory the model misremembers with total confidence. Ask for prose and nobody notices. Ask for a machine-readable document whose parts reference each other, and every lapse is a render failure.",
      },
      {
        type: "p",
        text: "It was also an expensive failure. The validator rejected the whole document at the first missing key, the automatic retry usually failed the same way, and the user — who had waited minutes for a long agent run — lost the entire artefact over a reference that carried no content at all.",
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
        text: "Once we saw the shape — a model-typed identifier used as a lookup key — it was everywhere. A mistyped 36-character document id, fixed by taking the id from the server's record instead. A placeholder id: the model passing the literal string “null” as the document to edit, stranding an edit no row would ever match — fixed by normalising placeholders and treating the edit as a new document. And retyped links: a link one character off a real one is well-formed and opens nothing useful, so a link now ships only if it appears verbatim in the source material. Fail closed.",
      },
      {
        type: "ul",
        items: [
          "Count failures by root cause, not by symptom. Ours looked like fourteen problems and half the pile was one bug.",
          "Repair beats rejection when the repair is deterministic — but every rewire needs a proof it can't create a worse document. Ours needed three vetoes and a skeleton guard.",
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
    setup:
      "The product generates reports as JSON documents that render into text, KPI cards, charts and tables. Users revise them by asking the model again — or, after this work, by editing them directly.",
    date: "2026-09",
    when: "Sep 2026",
    kind: "feat",
    tags: ["React", "Tiptap", "FastAPI", "PostgreSQL"],
    body: [
      {
        type: "p",
        text: "A generated report is a first draft, no matter how good the generation gets. The numbers may be right and the structure sound, and the user will still want to soften a sentence, cut a section, or add the one line of context the model couldn't know — because the report is going to their client or their boss with their name near it. For a while our reports had no answer to that except the regeneration lottery: ask again, and hope the next document keeps everything you liked and fixes the one thing you didn't.",
      },
      {
        type: "p",
        text: "The other escape hatch was worse: copy the content into a real editor, at which point the structure — the charts, the KPI cards, the live tables — dies, and the report panel has demoted itself to a clipboard. If the document is the product, it has to be editable where it lives.",
      },
      { type: "h2", text: "Versions are pointers, not copies" },
      {
        type: "p",
        text: "The machinery underneath is deliberately dull: an append-only list of full snapshots plus a “current version” pointer. Every change — the model's or a person's — appends a snapshot; readers see whatever the pointer names. Restore is a pointer move: nothing is copied, created or deleted. That choice came from arithmetic, not elegance — each document keeps a bounded number of versions, and if restore duplicated the restored body as a new snapshot, anyone who restores often would burn the budget on copies of the same content. The first version and the current one are never pruned.",
      },
      {
        type: "p",
        text: "One numbering rule does quiet, load-bearing work: a new version is numbered from the highest number that exists, not from the pointer. Restore v2 of five versions and then save an edit, and you get v6 — history branches forward, and v3 through v5 stay exactly where they were, still restorable. Nothing you did before a restore can be destroyed by what you do after it.",
      },
      {
        type: "figure",
        figure: "version-pointer",
        caption:
          "Restore moves the pointer; editing afterwards appends past the highest version. The AI and your own edits share one chain, and every link stays restorable.",
      },
      {
        type: "p",
        text: "Versioning also fixed a small, maddening UI wrong: every chat card for a document used to open the latest body, so older versions were unreachable. But each generated version already recorded which message produced it, and each card knows its own message — match the two, and every card opens the version it announced. No schema change, and it worked retroactively for every old conversation.",
      },
      { type: "h2", text: "Two kinds of author" },
      {
        type: "p",
        text: "Attribution sounds cosmetic and isn't. Each version records whether a model or a person made it, and for people, who. The first cut accepted the editor's display name from the request body — until review pointed out that any authenticated caller could stamp a teammate's name onto an edit. The name is now resolved server-side from the session, and whatever the client sends is ignored. Attribution is a trust feature, which makes it a security surface.",
      },
      {
        type: "p",
        text: "The editing itself converts the model's JSON into a rich-text document: prose becomes ordinary editable text, while charts, KPI cards and tables ride along as atomic embedded blocks that re-render through the same components and stay editable in place. One guard worth stealing: a chart's data table is sometimes derived — long-tail series folded into an “Other” row — and those render read-only in edit mode, because writing an edit back by row index into folded data would silently hit the wrong source row.",
      },
      {
        type: "p",
        text: "And when the model edits after a human has edited, it starts from whatever the pointer names — the human's content is the authoritative base, and the instruction is to change only what was asked. Both kinds of author write through the same version machinery, so nothing human-made can be silently trampled, and anything can be taken back.",
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
    setup:
      "The product's generated reports are JSON documents rendered in the app. Reports exist to be shared, so each one also has to export to PDF, Word and spreadsheets, and straight into the user's own Google Drive or OneDrive.",
    date: "2026-08",
    when: "Aug 2026",
    kind: "feat",
    tags: ["Playwright", "python-docx", "OAuth 2.0", "Google Drive API", "Microsoft Graph"],
    body: [
      {
        type: "p",
        text: "A report that lives only inside a chat panel is half a product. Reports exist to leave — they get attached to emails, dropped into decks, filed with clients, edited by people who will never open our app. So the report had to meet documents where documents live, and that meant one source of truth wearing five bodies: the interactive panel, PDF, DOCX, spreadsheets, and files in the reader's own Google Drive or OneDrive.",
      },
      {
        type: "figure",
        figure: "five-surfaces",
        caption:
          "Every surface has its own renderer reading the same spec. Nothing is converted from another export, so no format inherits another's compromises.",
      },
      {
        type: "p",
        text: "Our first PDF was honest about being version one: rasterise the rendered panel and slice the bitmap into A4-height strips. No selectable text, and tables guillotined mid-row wherever a page happened to end. Within a week it was replaced: a server-side HTML print template rendered by headless Chromium via Playwright, with charts pre-rendered to images — because a real print engine honours “don't split this element”, so tables and KPI cards survive page breaks intact.",
      },
      {
        type: "p",
        text: "The other surfaces got native treatment rather than conversions. DOCX is built element by element with python-docx, since a Word file is not a web page and pretending otherwise produces documents that look pasted. Spreadsheet exports become typed workbooks: currency strings, thousands separators and percentages are parsed into real numbers with matching formats, because a grid of text that Excel can't sum is not a spreadsheet, it is a picture of one.",
      },
      { type: "h2", text: "Every surface lies differently" },
      {
        type: "p",
        text: "The discipline was refusing the shortcut of converting one output into another, because chained conversions compound each format's compromises. Each surface renders from the spec and is honest about what it can't say: charts become images, tabs become headed sections, diagrams ship as their source text in Word rather than as a broken picture.",
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
        text: "Because export-to-your-account means holding OAuth grants, that part was built paranoid. The scope is the narrowest one that works. The OAuth state parameter is signed, bound to the signed-in user and spent exactly once, after a review of the first design showed a classic login-CSRF: an attacker could start the flow with their own account and hand the callback to a victim, grafting the attacker's drive onto the victim's workspace. Tokens are encrypted at rest and the system fails closed — no valid key, no token operations, never plaintext. And one hard-won rule of API clients: never retry a failed file-create, because the provider may have committed the file before returning the error, and a retry mints duplicates. Updates retry; creates don't.",
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
    setup:
      "The product's AI assistant analyses ad-account data and writes reports. Users set constraints — “two pages max”, “the last 28 days” — and expect them to hold every time.",
    date: "2026-09",
    when: "Sep 2026",
    kind: "fix",
    tags: ["Python", "LLM", "Prompting"],
    body: [
      {
        type: "p",
        text: "Give a language model a document tool and it will write you a document — at length. Users would ask for a brief report and receive a sprawling one, many times the requested size, and when we reproduced it in an internal evaluation across several models, every single one ignored the cap. The best exhibit: one model wrote its own generation instructions asking for a two-page report “retaining all metrics and tables”. The contradiction was right there in its own words. The prompt asked for brevity; nothing enforced it; politeness was our enforcement mechanism, which is to say we had none.",
      },
      { type: "h2", text: "Enforce, don't request" },
      {
        type: "p",
        text: "A document has no pages until it's exported, so enforcement starts with an estimator: visible characters per page plus a fixed weight per element — a chart costs about a third of a page, a table a sliver per row. A draft that exceeds the user's cap by more than a 1.3× tolerance gets exactly one condensation retry. The tolerance exists because borderline documents would otherwise retry-loop; the real failures weren't borderline, they were several times over.",
      },
      {
        type: "p",
        text: "Review reshaped the rule in an important way. The first version said the budget outranks completeness; a teammate pushed back that this would truncate data already gathered. The rule that shipped is “condense, never truncate”: aggregate to coarser granularity, compress analysis to conclusions, and if the content genuinely can't fit, completeness wins and the reply says so. A limit should change the shape of the answer, not its truth.",
      },
      { type: "h2", text: "Then the model invented a cap" },
      {
        type: "p",
        text: "Four days after enforcement shipped, a request with no length limit at all failed: the model had made up a two-page cap on its own, the estimator honestly rejected the honestly-sized draft, the retry couldn't fit a seven-section audit into two pages, and the document was lost. The prompt already said “never invent a cap”. Of course it did.",
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
        text: "The last discipline is editorial. Models narrate — setup, method, then eventually the point; busy readers work the other way round. So every data-bearing answer leads with what changed and why it matters, and next actions come after it. And one carve-out to “you're a formatter, don't re-analyse”: arithmetic is not analysis. When both operands are in the source, the document computes the delta or the rate — a report that prints “not provided” next to two numbers it could subtract has stopped too soon.",
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
  {
    slug: "react-query-quiet-defaults",
    title: "Three quiet React Query behaviours that bit us",
    dek: "Stale panels, leaked transcripts and cached 404s — each one was React Query doing exactly what its docs say.",
    setup:
      "The product's web app is a React front end for an AI chat, using TanStack Query to cache chat history, generated documents and permissions. Chat apps push a cache hard: people switch conversations mid-stream, open a blank “New chat”, and watch documents update in place.",
    date: "2026-09",
    when: "Jul – Sep 2026",
    kind: "fix",
    tags: ["React", "TanStack Query", "Next.js"],
    body: [
      {
        type: "p",
        text: "TanStack Query is the kind of library you stop thinking about, which is both its point and its danger. Three bugs came from behaviours that are documented, reasonable and easy to forget — and each one looked like something else entirely while we were debugging it.",
      },
      { type: "h2", text: "1. Invalidating a disabled query does nothing" },
      {
        type: "p",
        text: "When the assistant edited a document in place, the open panel kept showing the previous version. We invalidated the document's query after the edit, and nothing refetched. The query was disabled while the answer was streaming, and React Query doesn't refetch a disabled query: invalidation only marks it stale. When the query was enabled again, the already-mounted observer served its cached data. What worked was `resetQueries`, scoped to the ids that had just been saved and fired the moment streaming ends — it clears the data rather than marking it, so the next render has nothing stale to show.",
      },
      { type: "h2", text: "2. keepPreviousData leaks across entities" },
      {
        type: "p",
        text: "Chat history loads in pages, and “load earlier messages” grows the page size, which is part of the query key. Without a placeholder, every page load flashed the whole transcript to a skeleton, so `placeholderData: keepPreviousData` looked like the obvious fix. But it keeps previous data across every key change — and the conversation id is part of the key too. On “New chat” the id is undefined, the query is disabled, and a disabled query never overwrites its placeholder: users landed on an empty chat URL still reading the previous conversation. Switching between two chats showed chat A's messages under chat B's URL until B loaded.",
      },
      {
        type: "figure",
        figure: "placeholder-leak",
        caption:
          "The URL is right and the messages are wrong — which looks like a routing bug. The stale messages arrive straight from the query's placeholder.",
      },
      {
        type: "p",
        text: "The fix scopes the placeholder: keep the previous data only if it belongs to the same entity. The same guard went onto a paginated issues list, where one account's placeholder rows must never appear under another account's name.",
      },
      {
        type: "code",
        lang: "ts",
        code: `const keepPreviousWithin =
  (id: string | undefined) =>
  <T,>(previous: T | undefined, previousQuery?: { queryKey: readonly unknown[] }) =>
    id && previousQuery?.queryKey[1] === id ? previous : undefined;

useQuery({
  queryKey: ["conversation-messages", conversationId, { limit }],
  enabled: Boolean(conversationId),
  placeholderData: keepPreviousWithin(conversationId),
});`,
      },
      { type: "h2", text: "3. Don't cache a guess" },
      {
        type: "p",
        text: "The third came from a hotfix. Some queries depend on a role flag that resolves after authentication loads. A request fired before it resolved got a 404, the 404 was cached, and it stayed cached after the flag arrived. Role-gated queries now wait — `enabled: false` — until the flag is known, and the flag is part of the query key, so responses for different roles never share an entry.",
      },
      { type: "h2", text: "A lifecycle bug in the same family" },
      {
        type: "p",
        text: "One related bug wasn't React Query's, but it rhymes. The chat hook was keyed by conversation id, so switching chats tore the chat instance down and rebuilt it on the way back. Returning to a just-created chat seeded the new instance with an empty history and resumed into it — the user's message vanished. A background chat's finish handler wrote into the foreground chat, bleeding one stream into another. A registry that keeps one long-lived instance per conversation fixes the family; the diagnosis is the part worth keeping: it was component lifecycle, not the network.",
      },
      {
        type: "ul",
        items: [
          "Invalidate marks, reset clears. If a query might be disabled when you invalidate it, you probably wanted `resetQueries`.",
          "Never use bare `keepPreviousData` on a key that contains an entity id. Scope the placeholder to the entity.",
          "A disabled query never replaces its placeholder. “Disabled” and “empty” are different states.",
          "Put every input that changes the response into the query key — including who is asking.",
          "When the URL is right and the data is wrong, suspect the cache before the router.",
        ],
      },
    ],
  },
  {
    slug: "one-429-two-meanings",
    title: "One 429, two meanings",
    dek: "Publishing catalogues to Google Merchant Center meant pacing against an error that means two different things — and learning the API from a live account, not the docs.",
    setup:
      "The product syncs merchants' product catalogues to Google Merchant Center, where products become eligible for Shopping ads and listings. Google reviews every product and flags issues such as a missing colour or size, which merchants then fix.",
    date: "2026-09",
    when: "Sep 2026",
    kind: "infra",
    tags: ["Go", "Google Merchant API", "Rate limiting"],
    body: [
      {
        type: "p",
        text: "We rebuilt the sync against Google's Merchant API: publish products that changed, read back Google's review of every product, and delete what left the catalogue. The code was the easy part. The API's behaviour was not, and most of what we learned came from a live test account rather than the documentation.",
      },
      { type: "h2", text: "The same error, two different problems" },
      {
        type: "p",
        text: "Merchant Center refuses writes it doesn't want with `429 QUOTA_EXCEEDED_PRODUCT_LIMIT`. That single response covers two unrelated situations. One is a short-term burst guard: you're sending too fast, slow down and it will land. The other is an account-level ceiling on products: no pace will get these in today. Treat every 429 as the first and a saturated account hangs your job forever. Treat every 429 as the second and you give up on writes that would have succeeded a second later.",
      },
      {
        type: "p",
        text: "On our test account, per-product refusals inside a batch came with no `Retry-After`, and batching gave no quota relief — a hundred products in one batch counted as a hundred inserts. Four concurrent batches of 50 were refused 195 times in 200, while a single batch of 50 landed completely.",
      },
      { type: "h2", text: "Pace like TCP" },
      {
        type: "p",
        text: "So the publisher paces itself the way TCP handles congestion: additive increase, multiplicative decrease. It starts with one request in flight and adds one per success until the first refusal, halves on refusal and backs off with jitter, then climbs again by about one per round. A refusal counts once per burst, because requests already in flight were sent under the old limit and say nothing new.",
      },
      {
        type: "figure",
        figure: "aimd",
        caption:
          "The sawtooth finds each account's tolerance on its own. The shaded region is the other meaning of the same 429: refused writes that never land, so the run stops instead of hanging.",
      },
      {
        type: "p",
        text: "To tell the two meanings apart, the pacer watches whether refused products ever land on retry. If refusals keep coming with no landings, the account is marked saturated and the run stops cleanly with that reason recorded. The learned rate carries across pages of the catalogue rather than being rediscovered for each one. And one caveat worth passing on: the repeated product-limit refusals on that test account turned out to be caused by account-level issues Google had flagged, not normal behaviour. Check the account's own issues first.",
      },
      { type: "h2", text: "The fixtures said one thing, the API another" },
      {
        type: "p",
        text: "Unit tests passed for a duplicate-catalogue check that never fired live. The fixtures gave each product a landing-page link; the API returns no link at all for processed products. The tests were proving our code worked on data Google never sends.",
      },
      {
        type: "p",
        text: "Issues had the same problem in a different place. Merchant Center names issue attributes after the product spec, with spaces — “age group”, “image link” — rather than after API fields, and it sends several missing attributes under one shared issue code. Our camelCase lookups never matched, so fixable issues showed as unfixable, and four missing attributes collapsed into one issue. Folding spellings before lookup, and keying issues by code plus attribute, turned them into four separate one-click fixes. A read-only live check of a single product found it.",
      },
      { type: "h2", text: "Failures you can see" },
      {
        type: "p",
        text: "A revoked Google grant surfaced from the SDK as a network error, so it was retried as if it might fix itself. It's now classified as “reauthorise”, non-retryable, and fails in about four seconds with nothing written. Each run stores its real failure reason, because the question an operator actually asks is “why didn't it push?”, not “which step failed?”.",
      },
      {
        type: "p",
        text: "On the live test account, the first publish uploaded 1,685 products in 13 seconds and the review pass read them back in 10; killing the worker mid-run was absorbed by a heartbeat timeout and a retry.",
      },
      {
        type: "ul",
        items: [
          "An error code is not a diagnosis. When one response covers two conditions, find a signal that separates them — ours was whether refused writes ever land.",
          "Adaptive beats configured. A pacer that discovers each account's tolerance works on accounts you have never measured.",
          "Fixtures should come from the real API. Hand-written fixtures encode what you believe it returns.",
          "Classify auth failures as non-retryable. Retrying a revoked grant only delays the message the user needs.",
          "Store the reason, not the stack. Operators need “why”, in the product, where they look.",
        ],
      },
    ],
  },
  {
    slug: "upgrades-that-fail-silently",
    title: "Upgrades that fail without an error",
    dek: "Our worst front-end regressions after library upgrades had no console errors, no type errors and, in one case, a test run that reported success.",
    setup:
      "The product's web app is a large Next.js and React codebase with a few thousand unit tests. Over two months it went through major upgrades of Tiptap, Tailwind CSS, Radix UI and its Vitest setup — and every one compiled and passed type checks.",
    date: "2026-09",
    when: "Aug – Sep 2026",
    kind: "fix",
    tags: ["Tiptap", "Tailwind CSS", "Radix UI", "Vitest"],
    body: [
      {
        type: "p",
        text: "Major-version upgrades usually fail loudly: a type error, a removed export, a crash on load. The ones that cost us time did none of that. They changed behaviour quietly, and the only symptom was a feature that stopped working for users.",
      },
      { type: "h2", text: "Tiptap v3: the picker that never opened" },
      {
        type: "p",
        text: "We moved the whole app from Tiptap v2 to v3 because a new editor required it — ProseMirror has to be a single instance across an app. Afterwards, the chat input's `/` and `@` pickers simply stopped appearing. No errors. In v3, a suggestion's `items()` resolves asynchronously, so `onStart` always receives an empty list. Our renderer, written the v2 way, built its popup in `onStart` only when there were items — so it never built one.",
      },
      {
        type: "figure",
        figure: "suggestion-lifecycle",
        caption:
          "Same callbacks, different timing. A renderer that decides everything in onStart is correct in v2 and silently inert in v3.",
      },
      {
        type: "p",
        text: "The fix creates the popup lazily when items arrive, keeps it mounted through interim loading updates, and closes it only when the resolved list is empty. It also came with the picker's first regression tests, written to fail first. There had been none, which is how a silent break shipped in the first place. The same migration had a sibling: two copies of `prosemirror-state` in the dependency tree made `instanceof` checks fail between them. Pinning a single version with package-manager resolutions fixed it — rich-text stacks assume one copy of their core.",
      },
      { type: "h2", text: "Tailwind v4: classes that stopped meaning anything" },
      {
        type: "p",
        text: "Three v3-era patterns broke with no build error. `divide-y` moved its border to the other side of each child. Arbitrary values that referenced a CSS variable without `var()` — like `bg-[--color-bg]` — became no-ops, which left chart tooltip swatches unpainted. And v4's new `w-(--x)` shorthand isn't understood by tailwind-merge 2.x, so overrides passed through a `cn()` helper stopped de-duplicating and both classes applied. We now write `w-[var(--x)]` wherever an override goes through `cn()`, grep for leftover v3 variable syntax, and test for the absence of the default class, not just the presence of the override.",
      },
      { type: "h2", text: "Radix: a popover you couldn't click inside a dialog" },
      {
        type: "p",
        text: "A picker inside a dialog blocked every click and ignored the scroll wheel. The cause was one version of a Radix package that pulled in a duplicate copy of its dismissable-layer primitive, so the dialog and the popover each believed they were the top layer and each blocked the other. Pinning that transitive dependency to a single copy — a version already in the lockfile — fixed it without touching the component.",
      },
      { type: "h2", text: "Vitest: a green run with a failed file" },
      {
        type: "p",
        text: "After adding a Markdown streaming library, the test run reported 1,859 tests passing — and, one line further down, a test file that had failed to load at all, because the library, an ES module, used a named import from a CommonJS-only dependency. The line counting tests looked healthy; the line counting test files did not. Inlining the dependency in Vitest's server config fixed the import. The habit that matters: read the `Test Files` line, not just `Tests`.",
      },
      {
        type: "ul",
        items: [
          "Treat a major upgrade as a behaviour change, not a compile. Click through every feature that depends on it.",
          "Write the missing regression test before the upgrade, while the old behaviour still works.",
          "Duplicate copies of a core package break identity checks. Editors and layered UI primitives assume a single instance — ask your package manager why a second one exists.",
          "Grep for syntax the new version silently ignores, and test for what should be absent.",
          "A test runner's pass count can hide files that never ran.",
        ],
      },
    ],
  },
  {
    slug: "tell-the-agent-what-it-didnt-read",
    title: "Tell the agent what it didn't read",
    dek: "Every limit we put on an agent's tools created a new way to be confidently wrong. The fix each time was to make partial results say so.",
    setup:
      "The product is an AI assistant for marketers whose tools crawl websites, read uploaded files and pull campaign data from ad accounts. Every tool has to cap what it returns so the result fits in the model's context.",
    date: "2026-08",
    when: "Jun – Sep 2026",
    kind: "fix",
    tags: ["LLM", "Agents", "Python"],
    body: [
      {
        type: "p",
        text: "Agent tools need limits. A web crawl can return more text than the context window holds; a spreadsheet can extract to millions of characters; an ad account can have more campaigns than any audit reads in detail. So you cap them. And then the agent reads the capped result as the whole truth, and writes a confident answer from part of the evidence.",
      },
      {
        type: "p",
        text: "We hit this in four different tools. The fix had the same shape every time.",
      },
      { type: "h2", text: "A crawl that overflowed the context" },
      {
        type: "p",
        text: "A single website-crawl call could return enough Markdown to overflow the next model turn. A first attempt capped the output at 30,000 characters — roughly 7,500 to 10,000 tokens — which stopped the overflow and silently cut pages. The redesign split discovery from reading: map a site's URLs, scrape specific pages, and crawl only for genuine multi-page reads. Output is bounded on three axes — pages, characters per page and total characters — and every result carries metadata the model can reason about.",
      },
      {
        type: "code",
        lang: "json",
        code: `{
  "pages": [ ... ],
  "truncated": true,
  "pages_omitted": 12,
  "original_chars": 184213
}`,
      },
      { type: "h2", text: "A file answered from its first 17%" },
      {
        type: "p",
        text: "After file extraction was bounded to stop out-of-memory crashes, an agent that paged to the end of a capped file received a clean “whole file read” signal. A question about a total over a 6 MB spreadsheet could be answered from its first 17%, with nothing looking wrong. Every read of a truncated file now says it's partial, and the agent passes that on to the user.",
      },
      { type: "h2", text: "An audit graded complete after reading 5 of 26" },
      {
        type: "p",
        text: "An account audit read the detailed settings of 5 of 26 campaigns and 4 of 95 spending ad sets, then presented an account-wide scorecard as complete. Draining a paginated list is not coverage. We built a runtime classifier to catch this, and removed it in review, because it worked by parsing the model's prose — pattern-matching generated text can't prove a bug fixed, and it silently misses rephrasings. What shipped is a contract instead: audits declare coverage counters (“read 5 of 26”), mark themselves partial when coverage is incomplete, and scope every verdict to the evidence behind it.",
      },
      {
        type: "figure",
        figure: "partial-read",
        caption:
          "The cap stays; what changes is that the result describes itself. An agent can only admit what it didn't read if the tool tells it.",
      },
      { type: "h2", text: "Zeros that weren't measured" },
      {
        type: "p",
        text: "The quietest version: when the ad platform returned an empty record set for a period, one answer reported it as measured zeros — no spend, no clicks — rather than as no data. An empty result and a result of zero are different facts that lead to opposite conclusions, and the tool output has to say which one it is.",
      },
      {
        type: "ul",
        items: [
          "Every cap needs a flag. Truncation the consumer can't see is a wrong answer in waiting.",
          "Report what was omitted, not just that something was: counts, original size, what to call next.",
          "Coverage is a number. “Read 5 of 26” can be checked; “audit complete” is a claim.",
          "Don't validate model prose with regexes. Put the structure in the contract, where the model writes it and code can read it.",
          "Distinguish “no data” from “zero”.",
        ],
      },
    ],
  },
  {
    slug: "latency-is-an-output-token-budget",
    title: "LLM latency is an output-token budget",
    dek: "Report generation sometimes took twenty minutes. The fix started with one line of arithmetic: tokens out divided by tokens per second.",
    setup:
      "The product generates reports with a model call that writes an entire JSON document, which is validated before display and retried or simplified when validation fails. Users wait on this step before they see anything, so its latency is their latency.",
    date: "2026-08",
    when: "Jul – Aug 2026",
    kind: "perf",
    tags: ["Python", "asyncio", "LLM", "Structured outputs"],
    body: [
      {
        type: "p",
        text: "Users reported that generating a report could take twenty minutes — longer than the analysis behind it — and that it sometimes timed out at five minutes and sometimes ignored the timeout altogether. Traces put the worst cases between 10 and 40 minutes. One run produced about 160,000 output tokens. Another spent 40 minutes on a turn whose input included a 480 KB serialised object that should never have reached the model.",
      },
      { type: "h2", text: "Do the arithmetic first" },
      {
        type: "p",
        text: "For a generation-heavy call, wall-clock time is roughly output tokens divided by throughput. We measured about 70 to 75 tokens per second in live runs, so a typical report of 3,000 to 6,000 tokens takes 40 to 80 seconds, and a 130,000-token runaway takes half an hour. No amount of prompt tuning changes that equation. Only producing fewer tokens, or producing them faster, does.",
      },
      {
        type: "p",
        text: "So every limit has to agree with the others: `max_output_tokens ≈ per-call timeout × sustained tokens per second`. A 48,000-token cap at 70 tokens a second is an eleven-minute call; pair it with a five-minute timeout and every long output is killed after you've paid for most of it.",
      },
      {
        type: "figure",
        figure: "token-budget",
        caption:
          "Time follows tokens. The top half is the arithmetic; the bottom half is where a structured document's tokens actually went.",
      },
      { type: "h2", text: "Two timeouts, both mandatory" },
      {
        type: "p",
        text: "The runaways came from the recovery path: validate, retry with the error, then fall back to progressively simpler strategies. Each call had its own timeout, and the attempts stacked. The fix is two layers. An outer `asyncio.wait_for` puts one hard ceiling over the whole cascade, and inside it each call's timeout is clamped to whatever remains. Neither layer works alone: per-call caps let attempts stack, and an outer cap alone lets one call eat the whole budget before a cheaper fallback can run. Because `CancelledError` is a `BaseException`, recovery code that catches `Exception` can't accidentally swallow the outer cancellation.",
      },
      {
        type: "code",
        lang: "python",
        code: `async def generate(brief):
    loop = asyncio.get_running_loop()
    deadline = loop.time() + TOTAL_BUDGET_S

    async def call(prompt):
        remaining = deadline - loop.time()
        return await asyncio.wait_for(llm(prompt), timeout=min(PER_CALL_S, remaining))

    return await asyncio.wait_for(run_with_fallbacks(call, brief), timeout=TOTAL_BUDGET_S)`,
      },
      {
        type: "p",
        text: "The other half was not paying for thinking we didn't need. The generation call ran with reasoning enabled, and a reasoning pass on a formatting job was the 10 to 17 minutes in the worst traces. Laying out a document is formatting, not analysis — the analysis already happened — so it runs with reasoning off, whatever the global setting says.",
      },
      { type: "h2", text: "Where the tokens actually go" },
      {
        type: "p",
        text: "A research spike then measured what the tokens were. The same content as compact JSON cost 2.23 times the tokens of Markdown, and 2.78 times pretty-printed. Of the JSON's tokens, 49% were data rows, 46% structural scaffolding and 5% narrative. Nearly half the output time was brackets, keys and layout. The structured format stays for its guardrails, but it's now a measured trade-off rather than an assumption, and compact serialisation is the first lever.",
      },
      { type: "h2", text: "Strict schemas made it worse" },
      {
        type: "p",
        text: "Constrained decoding — forcing the output to match a JSON schema — sounds like pure upside for a structured document. We A/B-tested it, three runs per arm on the same payload. With the strict schema, two of three runs ran away to the token cap and produced none of the four requested KPI cards; freeform generation, validated afterwards, was clean in three of three with all four. On large payloads, one model degenerated in reproducible ways: reasoning consumed the entire output budget, or it emitted walls of whitespace, or it collapsed to a stub. Strict mode is now off by default, and any structured attempt that returns something that isn't JSON at all retries freeform.",
      },
      {
        type: "p",
        text: "A related provider quirk, found only in live runs: one provider rejects a call that asks for both tools and a JSON response format with a 400. The workaround is two phases — run with tools and free text first, then one call with no tools and the structured output — gated to that provider, so the other path stays a single call.",
      },
      {
        type: "ul",
        items: [
          "Latency ≈ output tokens ÷ throughput. Budget in tokens, and derive the timeouts from them.",
          "Put one hard ceiling over any retry cascade, and clamp each attempt to what's left.",
          "Don't pay for reasoning on formatting work.",
          "Measure your format's token overhead. Structure can cost as much as the content.",
          "A/B structured outputs before trusting them. “Guaranteed valid JSON” is not the same as “a good document”.",
        ],
      },
    ],
  },
  {
    slug: "every-model-call-has-a-price",
    title: "Every model call has a price",
    dek: "Usage-based billing for an AI product is only as honest as its metering. Ours leaked in the places that didn't look like model calls.",
    setup:
      "The product runs on many models across several providers, for chat, analysis, and image and video generation. Customers buy plans with a monthly usage allowance, and every model call is priced and deducted from their balance.",
    date: "2026-07",
    when: "Jun – Jul 2026",
    kind: "fix",
    tags: ["Python", "LiteLLM", "PostgreSQL", "Billing"],
    body: [
      {
        type: "p",
        text: "Usage billing is conventional on paper: a rate for every model and operation, a balance per customer, and an append-only record of every charge. Keeping it true is harder, because an agentic product calls models from far more places than its main loop.",
      },
      {
        type: "p",
        text: "One rule mattered more than any other: a model the rate catalogue doesn't know resolves to a default rate, never to zero.",
      },
      { type: "h2", text: "Where it leaked" },
      {
        type: "p",
        text: "Every leak was in a call that didn't go through the main agent loop. Features that made their own isolated model call bypassed the metering entirely, so their tokens were silently free; vision calls that analysed uploaded images were the same. Both now meter per attempt, with cached input tokens at the cached rate.",
      },
      {
        type: "p",
        text: "Then calls started being billed under the wrong model. Our LLM gateway routes with provider-prefixed names, `provider/model-name`, while the rate catalogue is keyed by the bare model id. The lookup missed and — faithfully following the never-zero rule — fell back to the default rate. Nobody was charged nothing; everybody was charged for a model they hadn't used. The fix strips the prefix in exactly one place, the function that canonicalises a model key, rather than at each caller. A transport string is not a catalogue key.",
      },
      {
        type: "p",
        text: "Video had its own version. A 4K request mapped to a resolution tier with no rate at all, priced at zero and skipped billing — an exception to the default rule nobody had noticed, because video is priced per resolution rather than per model. Requests now clamp to the nearest priced tier, with a regression test.",
      },
      {
        type: "figure",
        figure: "metering-chokepoint",
        caption:
          "The leaks were all side doors: calls that never passed through the path the main loop used. The fix routes every one through the same key, rate lookup and ledger.",
      },
      { type: "h2", text: "Audit it like an accountant" },
      {
        type: "p",
        text: "Unit tests prove the arithmetic. They can't prove that every model is billed under the right key in a real conversation. So we built an audit that starts the backend once per model, runs the same battery of chats, and reconciles every charge against the catalogue: cost equals tokens times the rate, the right model key is stamped, no run goes unbilled, nothing is billed twice. Every model that could run reconciled cleanly, with zero billing failures; the ones that couldn't failed for provider-side reasons, such as an exhausted account.",
      },
      {
        type: "p",
        text: "A second audit cross-checked the charge records against our observability traces for 62 conversations: zero missed charges, zero token mismatches, a cost ratio of exactly 1.000. It also showed the traces covering only 16% of the charged calls — which looked alarming until we traced it to spans lost when servers were killed. An observability gap, not a billing one. The charge records, written in the same transaction as the deduction, were the authoritative record; the traces were not.",
      },
      {
        type: "p",
        text: "The last piece was making spend explainable: an internal per-customer breakdown by model, operation, conversation and user, so “where did my usage go?” has an answer on one page.",
      },
      {
        type: "ul",
        items: [
          "Meter at a chokepoint, not at call sites. Every new path to a model is a new leak unless the path to the ledger is shared.",
          "Unknown should never mean free. Fall back to a default rate, and log that you did.",
          "Canonicalise identifiers once. Gateway routing names, provider prefixes and catalogue keys are three different things.",
          "Reconcile against an independent record. A ratio of exactly 1.000 is a much stronger claim than “the tests pass”.",
          "Know which record is authoritative. Traces are sampled and lossy; a charge written in its own transaction is not.",
        ],
      },
    ],
  },
  {
    slug: "six-stripe-assumptions",
    title: "Six Stripe assumptions that cost us",
    dek: "Billing bugs rarely crash. They charge the wrong amount, keep the wrong plan, or grant access nobody paid for — and each of ours started with an assumption about Stripe.",
    setup:
      "The product sells subscription plans through Stripe, each with a monthly usage allowance. Customers subscribe, upgrade in-app, buy extra usage and cancel, and the app reads the resulting plan from its own database to decide access — so Stripe is the source of truth for money, and our database for access.",
    date: "2026-07",
    when: "Jun – Jul 2026",
    kind: "fix",
    tags: ["Stripe", "Billing", "Next.js"],
    body: [
      {
        type: "p",
        text: "Once real checkout, upgrade and cancellation flows ran end to end against Stripe's test mode, a chain of failures surfaced. None of them threw an obvious error. Each came from something we believed about Stripe that was subtly wrong — and almost every one was Stripe and our database disagreeing.",
      },
      { type: "h2", text: "1. An upgrade can change the plan, then collect the money" },
      {
        type: "p",
        text: "Our in-place upgrade updated the subscription's items and then confirmed the payment. With 3-D Secure, that order is fatal: a user who abandoned the bank's challenge still got a success message, and Stripe showed the new plan while our app showed the old one. The fix is `payment_behavior: 'pending_if_incomplete'` on the update. Stripe holds the change as a pending update and applies it only once the invoice is paid. (`default_incomplete`, the value you use when creating a subscription, is wrong here: on an update it applies the change immediately and flips the status to past due, granting the plan before payment.) Pending updates reject a couple of parameters, including the default payment method, so those moved into a separate call beforehand.",
      },
      {
        type: "figure",
        figure: "pay-then-apply",
        caption:
          "Order is the whole fix. A pending update can't grant anything until the invoice is paid, and if it never is, it expires with the plan untouched.",
      },
      { type: "h2", text: "2. Resetting the billing cycle is a clean upgrade" },
      {
        type: "p",
        text: "We tried making upgrades start a fresh billing period with `billing_cycle_anchor: 'now'`. It immediately invoices the full new period — a second full charge on top of the prorated one — which then needed off-session authentication and left the subscription past due. We reverted it. Upgrades now prorate inside the existing cycle, and the usage allowance tops up to the higher plan on the next balance read, without clawing back anything already spent.",
      },
      { type: "h2", text: "3. The billing period moves every month" },
      {
        type: "p",
        text: "The allowance was re-granted whenever Stripe's `current_period_start` moved. For monthly plans, it moves monthly. For annual plans it moves once a year — so an annual subscriber would have received one month's allowance for the whole year, a twelvefold under-grant, caught before launch. The grant now computes its own monthly anchor, rolling forward to the latest monthly anniversary of the subscription start and clamping for short months, which also makes it immune to a late renewal webhook.",
      },
      { type: "h2", text: "4. A price has one currency" },
      {
        type: "p",
        text: "Our prices were multi-currency: one Price object with a base currency and `currency_options` for others. A Stripe customer is locked to the currency of its first activity, and our code compared the customer's currency with the price's base currency and threw. The first fix went looking for a sibling price in the customer's currency, which doesn't exist. The right call keeps the same price id and passes the customer's currency; Stripe resolves the amount from the options.",
      },
      { type: "h2", text: "5. A coupon knows which products it applies to" },
      {
        type: "p",
        text: "Stripe omits a coupon's `applies_to` unless you expand it. We didn't, so every product-restricted code looked unrestricted: a discount meant for one plan applied to another, and invalid codes appeared to succeed. Coupons are now expanded and checked for product eligibility on the server, with a specific error at checkout.",
      },
      { type: "h2", text: "6. A free trial is just a 100%-off coupon" },
      {
        type: "p",
        text: "For pilot customers we needed a paid plan for a week without a card. A 100%-off coupon looks equivalent and fails open: when a time-limited coupon lapses, the invoice fails, the subscription goes past due — which many access rules treat as still active — and the customer keeps the plan indefinitely. Tax can even make a “100% off” invoice non-zero in some jurisdictions. A trial with `missing_payment_method: 'cancel'` fails closed with no cron job: when the trial ends, Stripe cancels the subscription, the deletion webhook removes the plan, and access ends on its own.",
      },
      { type: "h2", text: "The ones that were ours" },
      {
        type: "p",
        text: "Two more failures looked like Stripe and weren't. After a successful charge, some users bounced back to the pricing page with no plan, because the function that saved the plan also synced an unrelated field with another service; a conflict there aborted it before the database write, and a wrapper returned 200 anyway. System writes now go straight to the database. And cancelling never removed access, because the update only upserted plan rows and skipped empty lists — so the deletion webhook's “no plans” was a no-op. It's now a full reconcile: upsert what's present, delete what's absent.",
      },
      {
        type: "p",
        text: "The seventh — a two-day-old webhook redelivered after an upgrade, which downgraded a paying customer — has a field note of its own. What finally made all of this trustworthy was driving real Stripe test-mode flows in a browser: a Playwright suite that walks checkout, 3-D Secure challenges, upgrades, downgrades and top-ups against a 47-case coverage map.",
      },
      {
        type: "ul",
        items: [
          "Pay, then apply. Any flow that changes entitlement before the payment settles will eventually grant something nobody paid for.",
          "Read what Stripe leaves out. Unexpanded fields are absent, not empty — and absence looks like “no restriction”.",
          "Prefer mechanisms that fail closed. A trial that cancels itself beats a coupon that lapses into an active-looking state.",
          "Anchor your own periods. Stripe's billing period is about invoicing; your grants may need a different clock.",
          "Never let a 200 wrap a failed write. The most expensive bug here was a success response around a save that never happened.",
        ],
      },
    ],
  },
  {
    slug: "the-listener-that-removed-itself",
    title: "The listener that removed itself",
    dek: "A usage alert meant to fire once per threshold crashed an unrelated commit and took the charge it was alerting about down with it.",
    setup:
      "The product's Python backend uses SQLAlchemy with PostgreSQL. Usage is deducted inside a transaction, and admins get an email when usage crosses 50, 75, 90 or 95% of the plan — sent only after the deducting transaction commits, so a rolled-back charge never produces an alert.",
    date: "2026-07",
    when: "Jul 2026",
    kind: "fix",
    tags: ["Python", "SQLAlchemy", "PostgreSQL"],
    body: [
      {
        type: "p",
        text: "“After the transaction commits” is an `after_commit` session event in SQLAlchemy. The alert should fire once, so the listener, after emitting, removed itself.",
      },
      {
        type: "code",
        lang: "python",
        code: `def on_commit(session):
    emit_threshold_event(org_id, bucket)
    event.remove(session, "after_commit", on_commit)   # the bug

event.listen(session, "after_commit", on_commit)`,
      },
      { type: "h2", text: "An intermittent bug that wasn't" },
      {
        type: "p",
        text: "Every so often a chat turn failed at the very end with `RuntimeError: deque mutated during iteration`, from a traceback pointing at unrelated persistence code — nothing to do with billing. It looked intermittent. It wasn't. SQLAlchemy dispatches event listeners by iterating over a collection, and removing a listener from inside its own callback mutates that collection mid-iteration. It failed every single time, even with one listener — but only on the commit where a customer crossed a threshold, which is rare enough to look random.",
      },
      {
        type: "figure",
        figure: "listener-deque",
        caption:
          "The error was deterministic; the trigger was rare. And because it was a builtin exception, it walked straight past a handler that only knew about database errors.",
      },
      { type: "h2", text: "Why the blast radius was large" },
      {
        type: "p",
        text: "The error fired inside commit dispatch and left the session stuck in a committed-but-unfinished state that nothing downstream could use. Our session wrapper existed precisely to contain database failures — but it caught `SQLAlchemyError`, and `RuntimeError` is a builtin, so it sailed straight past. The turn failed without finalising its response or cleanly committing the deduction that had triggered the alert in the first place.",
      },
      { type: "h2", text: "The fix is one keyword" },
      {
        type: "code",
        lang: "python",
        code: `event.listen(session, "after_commit", on_commit, once=True)`,
      },
      {
        type: "p",
        text: "SQLAlchemy already supports fire-once listeners, and `once=True` handles the removal safely. We proved the fix on the same flow that broke: a turn that crosses the 50% threshold reproduces the exact error on the old code, and on the new code finalises its response and commits the deduction cleanly.",
      },
      {
        type: "p",
        text: "The rest of the alert design held up. Detection lives in the backend because an email platform can send emails but can't know that a customer “just crossed 90%” — that's stateful, backend-only knowledge. Alerts de-duplicate per customer and billing period, then fan out to every admin. A deduction that jumps several thresholds at once sends only the highest. And none of it can block a charge. The one defence noted and not yet built: widening the session wrapper to catch any exception at commit, not only database ones.",
      },
      {
        type: "ul",
        items: [
          "Never mutate a collection of callbacks from inside a callback. Use the library's fire-once option.",
          "“Intermittent” often means “deterministic, on a rare path”. Find the condition before reaching for timing theories.",
          "A traceback shows where an exception surfaced, not where it started.",
          "A safety wrapper that catches only your library's exceptions lets everything else through. Decide deliberately what it catches.",
          "Reproduce on the old code, on the same flow, then fix. It's the only proof you fixed the bug you think you fixed.",
        ],
      },
    ],
  },
  {
    slug: "handing-an-agent-an-email-tool",
    title: "Handing an agent an email tool",
    dek: "A tool that fetches URLs and sends email on a model's instructions is an SSRF and spam engine — unless you design it as one.",
    setup:
      "The product's AI assistant can run saved multi-step analyses on request. We added a way to email the result to a team with the report attached — which meant giving the agent a tool that sends email and fetches attachments from URLs, called at the model's discretion.",
    date: "2026-05",
    when: "May 2026",
    kind: "feat",
    tags: ["Python", "Security", "SSRF", "LLM"],
    body: [
      {
        type: "p",
        text: "The model decides when to call a tool and with what arguments, based on everything it reads — user messages, web pages, third-party data. Every input to an email tool therefore has to be treated as hostile, because through prompt injection, any of them can be.",
      },
      { type: "h2", text: "Fetching URLs for a model" },
      {
        type: "p",
        text: "Attachments can come from a URL, and a server that fetches arbitrary URLs is a textbook server-side request forgery target: point it at the cloud metadata endpoint or an internal service and it will cheerfully fetch credentials for you. The first version validated the URL, then let the HTTP client follow redirects. Review caught it: a public URL that redirects to `169.254.169.254` passes the check and lands inside. The fixed fetcher turns automatic redirects off and re-validates every hop against the same rules — public addresses only, private and link-local ranges blocked — for at most three hops.",
      },
      {
        type: "code",
        lang: "python",
        code: `for _ in range(MAX_HOPS + 1):
    if not is_safe_external_url(url):          # public host, no private ranges
        raise UnsafeURL(url)
    resp = await client.get(url, follow_redirects=False)
    if resp.is_redirect:
        url = urljoin(url, resp.headers["location"])
        continue                               # checked again at the top
    return await read_capped(resp, MAX_ATTACHMENT_BYTES)
raise TooManyRedirects(url)`,
      },
      {
        type: "figure",
        figure: "safe-fetch",
        caption:
          "Validate the URL you're about to fetch, every time — not the one you were given. A redirect is just a new, unvalidated URL.",
      },
      {
        type: "p",
        text: "Size is the other half. The fetcher checks `Content-Length` before downloading and aborts the stream if the body exceeds the cap anyway, because the header can lie. Per-attachment and total caps keep the encoded email under the 25 MB most mail providers accept.",
      },
      { type: "h2", text: "Everything else the model writes" },
      {
        type: "p",
        text: "The body is Markdown written by the model, converted to HTML and sanitised against an allowlist before sending. Subjects have carriage returns and line feeds stripped, because a newline in a header is how you inject new headers. Recipients are validated. Sends are rate-limited per user per hour, so a prompt-injected loop can't turn the product into a spam relay. And there are two modes: when email is the wrap-up the user explicitly asked for, it sends; when the model decides on its own that an email would be helpful, a human approval is mandatory.",
      },
      { type: "h2", text: "The capability you didn't mean to grant" },
      {
        type: "p",
        text: "The last hole was in the parser, not the tool. A command typed in a message can enable a capability for that turn — a slash command turns on email. A pasted URL with `?action=/email` in its query string looked like a command to the parser, because the guard for slashes inside URLs only protected the host part. Every parser now detects URL spans and skips any token inside one. The client parses for display; the server re-parses, and only the server decides.",
      },
      {
        type: "ul",
        items: [
          "Validate every redirect hop, not just the first URL. Turn off automatic redirects in any fetcher a model can point.",
          "Cap bytes while streaming, not only by header.",
          "Strip CR and LF from anything that becomes a header, and sanitise any HTML a model writes.",
          "Rate-limit side effects per user. A model in a loop is a very fast user.",
          "Parse on the server, authoritatively. The client's parse is for chips and highlighting, never for permissions.",
        ],
      },
    ],
  },
  {
    slug: "fast-alone-slow-together",
    title: "Fast alone, slow together",
    dek: "Our analytics queries were slow in production and much slower under load. A bigger database didn't help; reading the query plans did.",
    setup:
      "The product had a reporting dashboard and a catalogue view, both backed by a managed PostgreSQL database. In mid-2025 both were slow — and much slower when several customers used them at once.",
    date: "2025-09",
    when: "Aug – Sep 2025",
    kind: "perf",
    tags: ["PostgreSQL", "EXPLAIN ANALYZE", "pgbench"],
    body: [
      {
        type: "p",
        text: "Report widgets and the catalogue's product list were taking tens of seconds to load, and got dramatically worse under concurrent use. The first response was the usual one: scale the database up to a fixed, larger instance. It made no significant difference. The queries were tolerable alone and awful together, which meant there were two problems, not one: what each query cost on its own, and what happened when they competed.",
      },
      { type: "h2", text: "Separate cost from contention" },
      {
        type: "p",
        text: "So the investigation split along that line. For isolated cost: pull the four worst queries and capture `EXPLAIN (ANALYZE, BUFFERS, SETTINGS)` before and after every change. For contention: load-test at two layers — `pgbench` replaying a real report query with per-transaction logs, and an API-level collection hitting the report endpoint across date ranges — then capture the same query's plan during load, and sample `pg_stat_activity` for wait events while it ran.",
      },
      { type: "h2", text: "What the plans said" },
      {
        type: "p",
        text: "The worst reporting query was a parallel sequential scan over a large table that threw away 13.7 million rows to keep the few it needed, read 1.3 million buffers from storage, and spilled its aggregation and sorts to disk. With an index on the two columns every widget filters by and a planner willing to use it, it became a bitmap index scan that read 92.5% fewer buffers, did no temp I/O at all, and aggregated in memory in a single batch.",
      },
      {
        type: "p",
        text: "The catalogue query was sneakier. A correlated lookup ran as a sequential scan per row: 6,436 loops, each filtering out about 58,000 rows to find one. `pg_stat_user_tables` made the pattern unmissable — a table of about 18,600 live rows had been sequentially scanned over four million times, reading 39 billion tuples in total. With an index on the lookup column, each loop became a lookup of a few microseconds, and total buffer touches fell 95%.",
      },
      {
        type: "p",
        text: "Two settings mattered as much as the indexes. The default `work_mem` was small enough that sorts and hash aggregates spilled to disk; at 32 MB, the worst query's spills disappeared. And the default `random_page_cost` of 4 assumes spinning disks. On SSD-backed storage, 1.5 is much closer to the truth, and at that value the planner stopped preferring full parallel scans over the index paths now available to it.",
      },
      {
        type: "figure",
        figure: "query-tuning",
        caption:
          "Isolated EXPLAIN ANALYZE runs, before and after. Benchmarks from captured plans, not production percentiles — and the bottom line is what the same tuned query did under load.",
      },
      { type: "h2", text: "What load did to the same plan" },
      {
        type: "p",
        text: "Contention told a different story. The tuned query, 12.4 seconds alone, took 26.3 seconds with just three concurrent users, and the plan captured under load said why: `Workers Planned: 2`, `Workers Launched: 0`. The cluster's pool of parallel workers was small, and a complex query wanted several for its sorts and hashes, so under load the parallel plan quietly ran as a single process. The planner had costed a plan the executor couldn't deliver.",
      },
      {
        type: "p",
        text: "The wait-event sample finished the picture: of 88 sampled sessions, about three quarters were waiting on buffer I/O or buffer and cache locks rather than executing. Shared buffers were a small fraction of RAM, and temp files grew by roughly 19.6 GB over two rounds of load testing. That's not something more vCPUs fix.",
      },
      {
        type: "p",
        text: "So the output was an evidence pack for the database provider rather than a request for a bigger instance: plans, wait events, temp growth, and specific questions about shared buffers, a connection limit set far above anything the app ever used, and the parallel-worker ceiling. A duplicate client request that loaded the catalogue page twice, and an N-times authorisation check on a list page, went in the same pass.",
      },
      {
        type: "ul",
        items: [
          "“Fast alone” and “slow together” are two different bugs. Measure isolated cost and contention separately, or you'll tune the wrong one.",
          "Read `BUFFERS` and `Rows Removed by Filter`, not just the time. They tell you what a query did, not only how long it took.",
          "Check `pg_stat_user_tables` for absurd sequential-scan counts. A small table scanned millions of times is a missing index hiding behind a fast query.",
          "Capture plans during load. `Workers Launched: 0` never appears in an isolated EXPLAIN.",
          "Defaults encode assumptions about hardware. `random_page_cost = 4` and a small `work_mem` describe a machine you probably don't run.",
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
  const intro = `${post.dek} ${post.setup}`.split(/\s+/).length;
  const words = post.body.reduce((n, b) => n + blockWords(b), intro);
  return Math.max(2, Math.round(words / 200));
}
