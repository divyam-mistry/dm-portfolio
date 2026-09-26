# Canvas deep-dive prompt — run on the company device

Paste everything below the line into Claude Code (or any agent with shell + `gh` access) on the machine logged in to your work GitHub account. It is **read-only**: it never pushes, comments, or edits anything. It writes a folder of research files (`~/Desktop/canvas-ingest/`); copy the whole folder back to the portfolio session. These files are **research notes, not final copy** — they may contain private detail, but every fact must be tagged so the portfolio session knows what it may publish.

---

You are helping me research a 4–6 post engineering blog series about the AI report canvas I built at my current company: the feature that generates tailored, structured report documents from AI answers, which users can then edit manually. The posts will be published on the open web, but **your output is private research** that a later session will draw from — so include private detail where it explains the engineering, and tag it.

## Hard rules

1. **Read-only.** Use only read operations (`gh api` GET, `gh search`, `gh pr view`, `gh pr diff`, `gh issue view`, `git log`, `git show`). Never push, comment, review, label, star, or edit anything.
2. **No fabrication.** Every claim must be traceable to a PR, commit, issue, review thread, or code you actually read. Cite evidence inline as `(repo#PR)` or `(repo@commit)`. If you infer something rather than read it, write `[inference]` next to it. If a metric is not literally stated somewhere you read, do not invent one — add it to `07-questions.md` instead.
3. **Tag every fact.** Each bullet or paragraph carries one of:
   - `[public]` — safe to publish as-is: describes the system generically, no internal names, no unevidenced numbers.
   - `[private: <reason>]` — keep for context only. Reasons include: internal feature/agent/model names, prompt text, customer data, hostnames, IDs, unreleased work, figures I have not approved, teammate names.
   - When in doubt, tag private. The portfolio session will only publish `[public]` facts, so a wrong `[private]` tag costs nothing and a wrong `[public]` tag leaks.
4. **Depth over polish.** Write for an engineer reconstructing the system, not a recruiter. "Added validation" is useless; "the validator walks every `*_ref` field and fails generation if the id is not among emitted blocks" is what I need. Short sanitised code sketches are welcome — **rewrite** shapes and interfaces rather than pasting proprietary code, and tag any verbatim excerpt `[private]`.
5. If a command fails from permissions or rate limits, note it in the file and continue. Do not ask me for tokens.

## Scope and seeding

The subject is everything related to the report canvas: spec/schema, generation pipeline, validation, failures, editing, versioning, rendering, and export (PDF, DOCX, Google Docs/Sheets, Word/Excel).

- If `~/Desktop/portfolio-ingest.md` exists from the earlier audit, seed from the evidence lists under the "AI Report Canvas" project and the report-related shipLog entries (launch, tool-based generation, failure fixes, editable reports, exports).
- Then search beyond the seed: PR titles, branch names, labels and issue text matching report/canvas/document/export/version/docx/pdf themes across the org since 2026-01, in every repo I touched. Include closed-unmerged PRs (they show alternatives that were rejected) and issues that tracked failures.
- Include PRs I **reviewed** on this feature but did not author — note the author generically ("a teammate") and what the review discussion decided.
- For the most important PRs, read the body, linked issues, review threads, and the diff (at least file lists and key hunks). PR bodies and review comments often contain the "why" that titles do not.

## What to answer, per topic

For every topic file below, work through the same six questions:

1. **Problem** — what was broken or missing, and how did we know? (user reports, incident, metric, issue text)
2. **Mechanism** — how does the shipped thing actually work, step by step, at the level of data structures, control flow and API calls?
3. **Alternatives** — what did PR bodies and review threads consider or reject, and why?
4. **Failures** — what broke before, during, or after, and how was it detected and fixed?
5. **Numbers** — any counts, sizes, durations, percentages, coverage or usage figures, each with its exact source.
6. **My role** — did I design/build/review it; who else was involved (generically), and what share was mine (from commits)?

## Files to write

Create `~/Desktop/canvas-ingest/` and write these files. Start each with a 3-line summary. Use the tagging convention throughout.

### `00-overview.md`
What the canvas is end-to-end, in one narrative page: from a user question to an edited, exported document. An architecture map of the moving parts (name components generically in `[public]` text; real service/module names go in `[private]` brackets beside them). A full timeline table of every related PR: date, `repo#PR` `[private]`, one line on what it did, whether I authored or reviewed it. A short honest note on the team split: which parts were mine, which were teammates'.

### `01-spec-and-schema.md`
The document spec itself. Block types and their fields (KPI cards, charts, tables, tabs, diagrams, text — whatever exists). How the schema is defined and enforced (library, where validation runs). How the schema evolved — dated changes and why. A minimal sanitised example spec. What the model is allowed to produce versus what the renderer adds.

### `02-generation-pipeline.md`
How a request becomes a document: how the model decides to create a report, the tool-call interface, what context is assembled and fed in (kinds of data, not customer data), single-model or multi-agent structure, streaming and lazy-loading of report cards, the time budget mechanics (what enforces it, what happens at the ceiling), retries. Describe prompt techniques generically ("the tool description instructs X") — do not paste prompt text; if a technique is the interesting part, summarise it and tag `[private]` if it reveals internal names.

### `03-validation-and-failures.md`
The failure taxonomy, as completely as the record supports. The dangling-reference bug deserves its own section: what exactly dangled, a concrete (sanitised) example, how it was detected, what the fix checks, and the 7-of-14 accounting. Then: page-limit violations (what "asked for two pages, got many more" actually looked like), non-deterministic date windows, timeouts, and anything else the issues tracked. For each: user-visible symptom, root cause, fix, and whether the failure rate visibly changed after.

### `04-editing-and-versioning.md`
The data model for versions and edits. How rich-text editing maps back to the spec (or doesn't). What creating, editing, restoring and regenerating each do to the version chain. Author attribution — what is recorded and shown. What happens when the model edits after a human has edited. Any conflict, locking or last-write-wins behaviour.

### `05-rendering-and-export.md`
Each rendering surface, one section each: the in-app panel; PDF (how the headless-browser render works — same components or a print variant, pagination); DOCX (how spec blocks map to document elements); Google Docs/Sheets and Word/Excel (OAuth flow, scopes requested, how "re-export updates the same file" works, how tokens are stored and encrypted). What each surface cannot represent and what the export does about it.

### `06-numbers.md`
Every number found anywhere in the record, one line each: the figure, what it measures, exact source (`repo#PR`, issue, commit), how it was measured (production, test bench, one incident), and your public/private verdict with a one-word reason. Include analytics/instrumentation if the code shows events being tracked, but never customer-identifying values.

### `07-questions.md`
Numbered questions for me: metrics that would strengthen a post if I can supply or approve them, naming permissions (can the feature name be used publicly by now?), details you found only weak evidence for, and anything where the record contradicts itself.

### `08-redactions.md`
Categories of things you deliberately left out or generalised, so I can check nothing sensitive slipped through even in the private fields.

## Style

- Plain and specific; past tense for shipped work; no buzzwords.
- Prefer bullets with evidence over prose without it.
- British spelling.

When done, print the folder path and a 10-line summary: number of PRs covered, the five most blog-worthy mechanisms you found, and the three biggest open questions.
