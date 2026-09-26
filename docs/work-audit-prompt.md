# Work audit prompt — run on the company device

Paste everything below the line into Claude Code (or any agent with shell + `gh` access) on the machine that is logged in to your work GitHub account. It is **read-only**: it never pushes, comments, or edits anything. When it finishes, copy the file it writes (`~/Desktop/portfolio-ingest.md`) back to the portfolio session.

---

You are helping me build the "work" sections of my personal portfolio website. Your job is to audit everything I have done on GitHub at my current company and turn it into a **public-safe, evidence-backed** summary I can publish.

## Hard rules

1. **Read-only.** Use only read operations (`gh api` GET, `gh search`, `gh pr view`, `gh repo view`, `git log`). Never push, comment, review, label, star, or edit anything.
2. **No fabrication.** Every claim must be traceable to a PR, commit, issue, or release. If a metric (latency, %, $, users) is not literally stated in a PR description, commit message, issue, or linked doc you can read, do NOT invent one. Put `impact: null` and add it to the "questions" list instead.
3. **Public-safe output.** The final text will be published on the open web. In the publishable fields:
   - No secrets, tokens, internal hostnames/URLs, IPs, database names, customer or client names, employee names other than mine, pricing, revenue, or unreleased product/codename details.
   - Describe systems generically ("the billing service", "an internal analytics dashboard") unless the thing is already public (public repo, marketing site, public docs, launched product).
   - Keep PR links, repo names, and anything sensitive **only** in the separate `evidence` / `private_notes` fields, which I will not publish.
4. If a command fails because of permissions or rate limits, note it and continue with what you can access. Do not ask me for tokens.

## Step 1 — Identify me and my scope

- `gh api user` → my login, name, created date.
- `gh api user/orgs` and `gh api user/memberships/orgs` → orgs I belong to. Treat the company org(s) (likely Strique) as the primary scope; also include personal repos I own if they contain real work.
- Find my start date at the company: the date of my earliest authored commit or PR in the company org(s).
- Record: my role/title if it appears anywhere (GitHub profile, CODEOWNERS, team memberships via `gh api orgs/{org}/teams` + `gh api orgs/{org}/teams/{team}/memberships/{login}`), and which teams I'm on.

## Step 2 — Collect raw activity (company org(s), since my start date)

Run these and save the raw JSON to `~/portfolio-audit/raw/` so you can re-read it without re-querying:

- Merged PRs I authored:
  `gh search prs --author=@me --merged --owner=<ORG> --limit 1000 --json number,title,repository,createdAt,closedAt,url,labels,body`
  (If there are more than 1000, split by date ranges with `--created=YYYY-MM-DD..YYYY-MM-DD`.)
- For each merged PR (batch it; skip trivial ones like version bumps/typos): `gh pr view <num> -R <owner/repo> --json title,body,additions,deletions,changedFiles,files,mergedAt,labels,closingIssuesReferences,commits`
- PRs I reviewed: `gh search prs --reviewed-by=@me --owner=<ORG> --limit 1000 --json number,repository,closedAt` (count only, plus which repos).
- Issues I opened / closed: `gh search issues --author=@me --owner=<ORG> --limit 500 --json number,title,repository,state,closedAt,labels`
- Releases/tags where my PRs landed, if the repo uses releases: `gh release list -R <owner/repo> --limit 50`.
- Per repo I touched: `gh repo view <owner/repo> --json name,description,primaryLanguage,languages,isPrivate,homepageUrl,repositoryTopics`
- If repos are cloned locally (check `~/code`, `~/work`, `~/dev`, `~/Documents/GitHub`, `~/src`, `~/projects`), also run `git log --author="<my email or name>" --since=<start> --pretty=format:'%h|%ad|%s' --date=short --numstat` for commit counts and lines changed. Use every email I've committed with (check `git config user.email` and the commit history).

## Step 3 — Turn activity into "shipped things"

A portfolio reader does not care about 400 PRs; they care about the 10–25 things I shipped. So:

1. Cluster PRs/commits into **initiatives**: a feature, a migration, a new service, a performance push, an infra/tooling change, a reliability or on-call improvement. Use PR titles, branch names, linked issues, labels, and file paths to group them. One initiative usually spans several PRs.
2. For each initiative, decide:
   - `kind`: one of `feat` (new user-facing or product capability), `perf` (faster/cheaper/leaner), `infra` (platform, CI/CD, pipelines, tooling, DX, data infrastructure), `fix` (reliability, incident follow-ups, bug-bash, observability, on-call).
   - `date`: `YYYY-MM` of when it shipped (last merged PR in the cluster).
   - `when`: a human label, e.g. `"Mar 2025"` or `"Jan – Apr 2025"`.
   - My role: did I lead it, build most of it, or contribute? Base this on the share of PRs/lines that are mine.
3. Rank initiatives by significance: scope, lines changed (as a rough signal only), number of PRs, whether it's user-facing, whether it touched money/data/reliability, and whether it's described as important in PR/issue text.

## Step 4 — Pick flagship projects

From the initiatives, pick the **3–5 strongest** as flagship "Selected work" entries. These get a richer write-up (see schema). Prefer things with a clear before/after, real users, or real technical depth.

## Step 5 — Write the output

Write a single Markdown file to `~/Desktop/portfolio-ingest.md` with exactly these sections:

### A. `portfolio-data` (fenced ```json block)

```json
{
  "profile": {
    "company": "Strique",
    "role": "<my title if found, else null>",
    "startDate": "YYYY-MM",
    "teams": ["..."],
    "oneLiner": "<one sentence, ≤ 25 words, what I do there — public-safe>"
  },
  "experience": {
    "company": "Strique",
    "role": "<title or best guess marked with (?)>",
    "period": "Mon YYYY – Present",
    "description": [
      "<4–6 bullets. Each starts with a strong verb, names the system generically, and states a result. Only include a number if it is evidenced.>"
    ]
  },
  "projects": [
    {
      "name": "<short public-safe name, 1–3 words>",
      "summary": "<≤ 7 words, e.g. 'Real-time campaign analytics pipeline'>",
      "techStack": ["..."],
      "year": "YYYY",
      "period": "Mon YYYY – Mon YYYY",
      "status": "Shipped | In production | In progress",
      "description": [
        "<2–3 sentences: the problem, what I built, the outcome. Public-safe.>"
      ],
      "evidence": ["<owner/repo#PR>", "..."],
      "private_notes": "<anything I should know but must not publish>"
    }
  ],
  "shipLog": [
    {
      "date": "YYYY-MM",
      "when": "Mon YYYY",
      "kind": "feat | perf | infra | fix",
      "title": "<≤ 8 words, like a great changelog headline>",
      "org": "<public-safe area/product name, 1–2 words, e.g. 'Billing', 'Analytics', 'Platform'>",
      "summary": "<1 sentence, ≤ 25 words, public-safe>",
      "impact": "<short evidenced metric, e.g. '−40% p95 latency', or null>",
      "tags": ["<2–4 technologies>"],
      "role": "led | built | contributed",
      "evidence": ["<owner/repo#PR>", "..."],
      "confidence": "high | medium | low"
    }
  ],
  "skills": {
    "Languages": ["<ordered by how much I actually wrote, from diffs>"],
    "Frameworks": ["..."],
    "Data": ["<databases, queues, warehouses>"],
    "Tools": ["<cloud, CI/CD, observability, infra-as-code>"]
  },
  "stats": {
    "mergedPRs": 0,
    "reviewsGiven": 0,
    "reposContributed": 0,
    "commits": 0,
    "linesAdded": 0,
    "linesRemoved": 0,
    "issuesClosed": 0,
    "firstContribution": "YYYY-MM-DD",
    "mostActiveRepos": ["<public-safe descriptions, not names>"]
  }
}
```

Aim for **12–25 shipLog entries**, newest first, covering my whole tenure, with a healthy mix of kinds. Exclude trivial work (dependency bumps, typo fixes, reverts) unless part of a larger initiative.

### B. `Highlights` (Markdown)

5–8 bullets I could use as résumé lines: strongest, most concrete, public-safe, evidenced.

### C. `Questions for me` (Markdown)

A numbered list of things you could not verify but that would make the portfolio stronger, e.g. "PR #812 says the new cache 'massively' cut load — do you have a number?", "Is <product> public, so I can name it?", "What is your exact title?"

### D. `Redaction log` (Markdown)

List every category of thing you deliberately left out or generalised (e.g. "replaced 3 customer names with 'enterprise clients'", "omitted internal service names"), so I can double-check nothing sensitive slipped through.

## Style for all publishable text

- Plain, confident, specific. Past tense for shipped work. No buzzwords ("leveraged", "synergy", "cutting-edge", "robust").
- Name the technology when it matters ("moved event ingestion from cron jobs to a Kafka consumer group").
- Numbers only when evidenced; use the Unicode minus (−) and % like `−35% p95 latency`, `+18% conversion`.
- British or American spelling — pick one and be consistent.

When done, print the path to the file and a 5-line summary of what you found (tenure, number of initiatives, top 3 highlights).
