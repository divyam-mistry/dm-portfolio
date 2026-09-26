export interface Experience {
  company: string;
  role: string;
  period: string;
  location?: string;
  description: string[];
}

export interface ProjectLink {
  label: string;
  href: string;
}

export type ProjectCover = "canvas" | "billing" | "stream" | "merchant" | "compliance" | "dashboards";

export interface Project {
  name: string;
  /** Which illustrated cover the Work card draws */
  cover: ProjectCover;
  summary: string;
  org?: string;
  techStack: string[];
  period?: string;
  year: string;
  description: string[];
  status?: string;
  links?: ProjectLink[];
}

export type ShipKind = "feat" | "perf" | "infra" | "fix";

export interface ShipLogEntry {
  /** YYYY-MM, used for ordering and year grouping */
  date: string;
  /** Human label shown next to the entry */
  when: string;
  kind: ShipKind;
  title: string;
  org: string;
  summary: string;
  impact?: string;
  role?: "led" | "built" | "contributed";
  tags?: string[];
  /** Public link (e.g. a merged PR) when the work is open source */
  href?: string;
}

export interface SkillCategory {
  category: string;
  technologies: string[];
}

export interface Achievement {
  mark: string;
  title: string;
  description: string;
}

export interface Certification {
  name: string;
  issuer: string;
  url?: string;
}

export interface Education {
  degree: string;
  institution: string;
  location: string;
  graduation: string;
  cgpa?: string;
  coursework?: string[];
}

export interface Stat {
  value: string;
  label: string;
}

export const profile = {
  name: "Divyam Mistry",
  role: "Software Engineer",
  timezone: "Asia/Kolkata",
  timezoneLabel: "IST",
  base: "Mumbai, India",
  baseShort: "MUM, IND",
  about:
    "I'm a full-stack engineer at Strique, where I've spent two and a half years on an agentic AI marketing platform: streaming chat, AI-generated reports, credit billing and product-feed pipelines. Before that I shipped GST compliance features to India Compliance, an open-source app for ERPNext, and built payment integrations and booking webhooks at Simulas. I care about systems that hold up under real load, and interfaces that make them feel effortless.",
  shippedAt: ["Strique", "Resilient Tech", "ERPNext", "Simulas", "Nearlikes"],
  now: {
    company: "Strique",
    role: "Software Engineer",
  },
};

export const experiences: Experience[] = [
  {
    company: "Strique",
    role: "Software Engineer",
    period: "Apr 2024 – Present",
    location: "Mumbai · Agentic AI marketing platform",
    description: [
      "Co-built the streaming chat backend for an agentic AI marketing assistant, then added live multi-step plan tracking, slash commands and custom team commands.",
      "Designed and shipped an AI report canvas that renders answers as versioned, editable documents, exportable to PDF and DOCX and openable in Google Docs, Sheets, Word or Excel.",
      "Rebuilt billing around tiered plans and an append-only credit ledger with per-model cost metering, prepaid top-ups, admin usage alerts and hardened Stripe webhooks.",
      "Cut chat history reload payloads by 93.5% on average in testing, and fixed an out-of-memory crash on large uploads by bounding file extraction and chunking cached reads.",
      "Built a Go and Temporal pipeline that publishes product catalogues to Google Merchant Center and turns Google's listing issues into one-click fixes.",
      "Earlier, built the analytics app's component library, dashboards and reporting widgets, plus the Java services that compute cross-platform marketing metrics.",
    ],
  },
  {
    company: "Resilient Tech",
    role: "Software Engineer",
    period: "Jul 2023 – Apr 2024",
    location: "Vadodara · Intern → full-time",
    description: [
      "Shipped 11 merged pull requests to India Compliance, the open-source GST compliance app for ERPNext, across GSTR-1 reporting, e-Waybill and purchase reconciliation.",
      "Added one-click GSTR-1 Excel export with the HSN summary built into the report, and aligned the export's headers and precision with the government filing format.",
      "Let users schedule e-Waybill validity extensions from the Extend Validity dialog, with each scheduled extension recorded in the e-Waybill log.",
      "Surfaced reconciliation gaps where accountants work: alerts for missing GSTR-2B downloads, and warnings on payment entries that reference unreconciled purchase invoices.",
      "Upstreamed a fix to ERPNext so item tax templates are chosen on the base-currency net rate, which stops foreign-currency invoices from getting the wrong GST slab.",
      "Reworked the theme of the documentation site and added a Steps component for walkthroughs.",
      "Started as an intern: learned the Frappe framework and built the frontend of Janseva Labs, a client project, with Next.js and Tailwind CSS.",
    ],
  },
  {
    company: "EzyInn Technologies (Simulas)",
    role: "Trainee Backend Intern",
    period: "Dec 2022 – May 2023",
    description: [
      "Coded efficient and reusable REST APIs using Node.js and Express, and implemented complex webhooks for bookings from Online Travel Agencies, reducing processing time by 30%.",
      "Integrated Stripe Elements and APIs, as well as Shift4 iframes, to enhance payment processing — a 20% increase in successful transactions.",
      "Handled primary on-calls to support, troubleshoot, monitor, and optimize production systems.",
      "Collaborated with the frontend team to ensure seamless integration between backend and frontend components.",
    ],
  },
  {
    company: "Evolveinno Inc. (Nearlikes)",
    role: "Junior Flutter Developer",
    period: "Sep 2021 – Nov 2021",
    description: [
      "Integrated backend APIs into a Flutter application, reducing API response time by 25%.",
      "Implemented new features and bug fixes, contributing to a 15% increase in user engagement.",
    ],
  },
];

export const projects: Project[] = [
  {
    name: "AI Report Canvas",
    cover: "canvas",
    summary: "Editable, exportable documents from AI answers",
    org: "Strique",
    techStack: ["TypeScript", "React", "Next.js", "Python", "FastAPI", "PostgreSQL", "Tiptap", "Playwright", "LiteLLM"],
    year: "2026",
    period: "Apr – Sep 2026",
    status: "In production",
    description: [
      "A side panel that renders data-heavy AI answers as structured reports — KPI cards, charts, tables, tabs and diagrams — from JSON specs, with versioning and server-side PDF and DOCX export.",
      "Generation moved into a dedicated tool call with schema validation, versioned edits and a hard time budget, and a fix for the dangling-reference bug behind 7 of 14 recent generation failures.",
      "In-panel editing with version history and restore, plus one-click export to Google Docs, Sheets, Word and Excel over OAuth, with tokens encrypted at rest.",
    ],
  },
  {
    name: "Credit Billing",
    cover: "billing",
    summary: "Usage-metered plans, credits and payments",
    org: "Strique",
    techStack: ["Python", "FastAPI", "PostgreSQL", "Stripe", "Next.js", "TypeScript", "PostHog", "Casbin"],
    year: "2026",
    period: "Jun – Jul 2026",
    status: "In production",
    description: [
      "Flat subscriptions replaced by tiered plans backed by an append-only credit ledger, per-organisation balances and a per-model cost catalogue, so every model call is metered.",
      "Prepaid top-up credits as a separate non-expiring balance with idempotent grants and refunds, admin emails at 50/75/90/95% usage, and an internal per-organisation usage dashboard.",
      "A hardened payment webhook: after a delayed, out-of-order event downgraded a paid account, stale events are dropped and state is re-read from the payment provider.",
    ],
  },
  {
    name: "Chat Reliability",
    cover: "stream",
    summary: "Leaner, steadier AI chat streaming",
    org: "Strique",
    techStack: ["Python", "FastAPI", "Server-Sent Events", "Redis", "PostgreSQL", "Kubernetes", "Next.js"],
    year: "2026",
    period: "Nov 2025 – Sep 2026",
    status: "In production",
    description: [
      "Co-built the assistant's streaming chat API, then added heartbeat events, non-blocking media tools and stream-error recovery so long agent turns stopped dropping.",
      "A stream policy that sends the browser only the tool output it renders — the history reload payload fell 93.5% and the live stream 76.6% on average across seven test conversations.",
      "Bounded file extraction and chunked cached reads, so a 5.7 MB spreadsheet that used to crash the chat server now finishes within its memory limit.",
    ],
  },
  {
    name: "Merchant Center Sync",
    cover: "merchant",
    summary: "Scheduled product-feed publishing to Google",
    org: "Strique",
    techStack: ["Go", "Temporal", "PostgreSQL", "GORM", "Google Merchant API", "Kubernetes CronJobs"],
    year: "2026",
    period: "Sep 2026",
    status: "In progress",
    description: [
      "Google Merchant Center as a catalogue destination through three scheduled jobs: publish changed products every four hours, pull review statuses daily, and delete products that left the feed.",
      "The publisher paces itself against Google's per-account rate limits, sends the full catalogue only when its data source is new, and keeps products served by other feeds out of its own ledger.",
      "Matching Google's real attribute spellings means a product missing age group, colour, gender and size shows four separate one-click fixes instead of one merged issue.",
    ],
  },
  {
    name: "India Compliance",
    cover: "compliance",
    summary: "Open-source GST compliance for ERPNext",
    org: "Resilient Tech",
    techStack: ["Python", "JavaScript", "Frappe", "ERPNext", "MariaDB"],
    year: "2024",
    period: "Nov 2023 – Apr 2024",
    status: "Merged upstream",
    description: [
      "India Compliance is Resilient Tech's open-source app that brings Indian GST filing, e-Invoicing and e-Waybill to ERPNext. I shipped 11 merged pull requests to it across reporting, logistics and reconciliation.",
      "GSTR-1 reporting: one-click Excel export with the HSN summary built in, headers and precision matched to the government format, and the first cut of the GSTR-1 filing UI, which the team then took to release.",
      "e-Waybill scheduled validity extensions, reconciliation alerts for missing GSTR-2B data, TCS GSTIN validation, plus an upstream ERPNext fix for tax templates on multi-currency invoices.",
    ],
    links: [
      {
        label: "My merged PRs",
        href: "https://github.com/resilient-tech/india-compliance/pulls?q=is%3Apr+author%3Adivyam-mistry+is%3Amerged",
      },
      { label: "Repository", href: "https://github.com/resilient-tech/india-compliance" },
      { label: "ERPNext fix", href: "https://github.com/frappe/erpnext/pull/39448" },
    ],
  },
  {
    name: "Reporting Dashboards",
    cover: "dashboards",
    summary: "Cross-platform marketing dashboards and reports",
    org: "Strique",
    techStack: [
      "TypeScript",
      "React",
      "Next.js",
      "Java",
      "Spring Boot",
      "Protocol Buffers",
      "TanStack Table",
      "Storybook",
    ],
    year: "2024",
    period: "May 2024 – May 2025",
    status: "Shipped · since retired",
    description: [
      "The web app's first component library — 18 components with Storybook stories and unit tests, including a data table with sorting, column pinning, resizing and drag-to-reorder.",
      "Dashboard and report widgets (tables, charts and scorecards) and the Java services that compute scorecard metrics from Meta, Google Ads, Amazon, Shopify and Google Analytics data.",
      "A lead-generation reporting mode across onboarding, dashboards and reports, and a PowerPoint export extended with trend-analysis and blended-chart slides.",
    ],
  },
];

/**
 * A changelog of things shipped. Order does not matter — the Ship Log
 * sorts by `date`.
 */
export const shipLog: ShipLogEntry[] = [
  {
    date: "2026-09",
    when: "Sep 2026",
    kind: "feat",
    title: "Product catalogue publishing to Merchant Center",
    org: "Strique · Commerce",
    summary:
      "Scheduled publish, review and deletion jobs that sync product catalogues to Google Merchant Center and flag issues merchants can fix.",
    tags: ["Go", "Temporal", "PostgreSQL"],
  },
  {
    date: "2026-09",
    when: "Sep 2026",
    kind: "perf",
    title: "Streamed only the tool output users see",
    org: "Strique · AI assistant",
    summary:
      "One policy for which tool data reaches the browser, dropping large outputs the chat UI discarded on arrival.",
    impact: "−93.5% avg reload payload (tested)",
    tags: ["Python", "SSE", "FastAPI"],
  },
  {
    date: "2026-09",
    when: "Sep 2026",
    kind: "fix",
    title: "Ended out-of-memory crashes on large uploads",
    org: "Strique · AI assistant",
    summary:
      "Budgeted every file extractor and cached reads in chunks, so a large spreadsheet no longer crashes the chat server mid-reply.",
    impact: "OOM-killed → 0 restarts in a 1 GiB pod test",
    tags: ["Python", "Redis", "Kubernetes"],
  },
  {
    date: "2026-09",
    when: "Sep 2026",
    kind: "fix",
    title: "Took auth lookups off the request path",
    org: "Strique · Platform",
    summary:
      "During an auth-provider slowdown, replaced a per-request API lookup with signed session claims so AI routes no longer wait on it.",
    tags: ["Next.js", "JWT", "React Query"],
  },
  {
    date: "2026-09",
    when: "Aug – Sep 2026",
    kind: "feat",
    title: "Editable AI reports with version history",
    org: "Strique · AI assistant",
    summary:
      "In-panel editing, version history with restore, author attribution and full-screen mode for AI-generated reports.",
    tags: ["React", "Tiptap", "FastAPI", "PostgreSQL"],
  },
  {
    date: "2026-08",
    when: "Aug 2026",
    kind: "feat",
    title: "Export reports to Docs, Sheets, Word, Excel",
    org: "Strique · AI assistant",
    summary:
      "AI reports open in Google Docs, Sheets, Word or Excel over OAuth, with encrypted tokens and re-exports that update the same file.",
    tags: ["OAuth 2.0", "Google Drive API", "Microsoft Graph"],
  },
  {
    date: "2026-08",
    when: "Aug – Sep 2026",
    kind: "fix",
    title: "Fixed the main causes of report failures",
    org: "Strique · AI assistant",
    summary:
      "Repaired the dangling-reference bug behind 7 of 14 recent failures, enforced user page limits and made reporting date windows deterministic.",
    tags: ["Python", "LLM", "JSON validation"],
  },
  {
    date: "2026-08",
    when: "Aug 2026",
    kind: "perf",
    title: "Parallelised settings and members page loads",
    org: "Strique · Platform",
    summary:
      "Ran server fetches concurrently, removed a client-side request waterfall and dropped unused permission checks on slow settings pages.",
    tags: ["Next.js", "React Query", "Casbin"],
  },
  {
    date: "2026-07",
    when: "Jun – Jul 2026",
    kind: "feat",
    title: "Tool-based AI report generation",
    org: "Strique · AI assistant",
    summary:
      "Report generation moved into a validated tool call with versioned edits, lazy-loaded report cards and a hard time budget.",
    tags: ["Python", "LiteLLM", "React"],
  },
  {
    date: "2026-07",
    when: "Jun – Jul 2026",
    kind: "fix",
    title: "Hardened payment webhooks and checkout",
    org: "Strique · Billing",
    summary:
      "Dropped stale out-of-order payment events that could downgrade paid accounts, charged upgrades only after payment, and handled 3-D Secure.",
    tags: ["Stripe", "Next.js", "Sentry"],
  },
  {
    date: "2026-07",
    when: "Jun – Jul 2026",
    kind: "feat",
    title: "Credit-metered plans, top-ups and usage alerts",
    org: "Strique · Billing",
    summary:
      "Tiered plans on an append-only credit ledger with per-model metering, prepaid top-ups, admin usage alerts and an internal usage dashboard.",
    tags: ["Python", "Stripe", "PostgreSQL", "PostHog"],
  },
  {
    date: "2026-05",
    when: "May 2026",
    kind: "feat",
    title: "Slash commands and custom team commands",
    org: "Strique · AI assistant",
    summary:
      "A / command picker with built-in workflows, per-organisation custom commands and an email-delivery command with SSRF-safe attachment fetching.",
    tags: ["Next.js", "FastAPI", "Tiptap"],
  },
  {
    date: "2026-05",
    when: "May 2026",
    kind: "infra",
    title: "Closed a script-injection hole in release CI",
    org: "Strique · Platform",
    summary:
      "Stopped PR titles and descriptions from running as shell code in the release workflow, which also unblocked a failing release.",
    tags: ["GitHub Actions", "Bash"],
  },
  {
    date: "2026-05",
    when: "Apr – May 2026",
    kind: "feat",
    title: "Launched the AI report canvas",
    org: "Strique · AI assistant",
    summary:
      "Data-heavy AI answers rendered as versioned rich documents with PDF and DOCX export, with answers that lead with the finding.",
    tags: ["React", "Playwright", "python-docx"],
  },
  {
    date: "2026-04",
    when: "Feb – Apr 2026",
    kind: "feat",
    title: "Live plan tracker for multi-step agent runs",
    org: "Strique · AI assistant",
    summary:
      "Per-task tool progress streamed from the agent, so users watch each step of a multi-task plan as it runs.",
    tags: ["SSE", "React", "Python"],
  },
  {
    date: "2026-01",
    when: "Dec 2025 – Jan 2026",
    kind: "fix",
    title: "Kept long-running AI streams alive",
    org: "Strique · AI assistant",
    summary:
      "Heartbeat events, non-blocking media tools and recovery for stream errors that surfaced as generic failures on slow agent turns.",
    tags: ["Python", "SSE", "asyncio"],
  },
  {
    date: "2025-12",
    when: "Nov – Dec 2025",
    kind: "feat",
    title: "Streaming chat API for the AI assistant",
    org: "Strique · AI assistant",
    summary:
      "Co-built the first streaming chat backend: JWT-authenticated endpoints, reasoning and web-search sources, persisted history and a base agent class.",
    tags: ["Python", "FastAPI", "OpenAI Agents SDK"],
  },
  {
    date: "2025-07",
    when: "Jun – Jul 2025",
    kind: "feat",
    title: "Product feed editor and feed-quality tools",
    org: "Strique · Commerce",
    summary:
      "Bulk category editing, a feed-quality view with how-to-fix links and a free checkout flow for the product catalogue tool.",
    role: "contributed",
    tags: ["Next.js", "TanStack Table", "Stripe"],
  },
  {
    date: "2025-07",
    when: "Nov 2024 – Jul 2025",
    kind: "infra",
    title: "Reworked subscription billing data model",
    org: "Strique · Billing",
    summary:
      "Prorated upgrades, plan state moved into a dedicated table synced from payment webhooks, and the legacy billing code removed.",
    tags: ["Java", "Spring Boot", "Stripe"],
  },
  {
    date: "2025-05",
    when: "Apr – May 2025",
    kind: "feat",
    title: "Richer PowerPoint report export",
    org: "Strique · Analytics",
    summary:
      "The report-to-PowerPoint generator extended with trend-analysis, blended-chart and new-store-platform slides, plus design fixes.",
    tags: ["Java", "Apache POI"],
  },
  {
    date: "2025-04",
    when: "Dec 2024 – Apr 2025",
    kind: "feat",
    title: "Lead-generation reporting mode",
    org: "Strique · Analytics",
    summary:
      "A lead-gen goal type across onboarding, dashboards and reports, with new ad-platform widgets and metric calculations.",
    tags: ["Java", "TypeScript", "Protocol Buffers"],
  },
  {
    date: "2025-02",
    when: "Nov 2024 – Feb 2025",
    kind: "fix",
    title: "Clean deletion of stores and integrations",
    org: "Strique · Analytics",
    summary: "Cascading cleanup of reports, layouts and widget data when a store or ad integration is removed.",
    tags: ["Java", "Spring Boot", "PostgreSQL"],
  },
  {
    date: "2024-12",
    when: "Sep – Dec 2024",
    kind: "feat",
    title: "Role-based access for teams",
    org: "Strique · Platform",
    summary:
      "Role-based permissions for members, report sharing, scheduling and downloads, enforced through Casbin policies.",
    tags: ["Next.js", "Casbin"],
  },
  {
    date: "2024-09",
    when: "May – Sep 2024",
    kind: "feat",
    title: "Cross-platform dashboards and report widgets",
    org: "Strique · Analytics",
    summary:
      "Dashboard tables, charts and scorecards, and the Java services that compute scorecard metrics from ad, store and analytics data.",
    tags: ["React", "Java", "Recharts"],
  },
  {
    date: "2024-08",
    when: "May – Aug 2024",
    kind: "infra",
    title: "Component library with Storybook and tests",
    org: "Strique · Platform",
    summary:
      "18 base UI components, including a data table with sorting, pinning, resizing and column reordering, each with stories and tests.",
    tags: ["React", "TypeScript", "Storybook"],
  },
  {
    date: "2024-04",
    when: "Mar – Apr 2024",
    kind: "feat",
    title: "First cut of the GSTR-1 filing UI",
    org: "Resilient · India Compliance",
    summary:
      "Opened the GSTR-1 filing interface, a dedicated view for preparing returns, which the team then carried through to release.",
    role: "contributed",
    tags: ["Frappe", "JavaScript", "Python"],
    href: "https://github.com/resilient-tech/india-compliance/pull/1910",
  },
  {
    date: "2024-03",
    when: "Feb – Mar 2024",
    kind: "fix",
    title: "GSTR-1 Excel matched to the government format",
    org: "Resilient · India Compliance",
    summary:
      "Re-ordered, added and renamed export headers to the official GSTR-1 layout, and set precision on the fields that feed the return.",
    tags: ["Python", "Excel"],
    href: "https://github.com/resilient-tech/india-compliance/pull/1684",
  },
  {
    date: "2024-02",
    when: "Feb 2024",
    kind: "fix",
    title: "Multi-currency tax templates, fixed upstream",
    org: "Frappe · ERPNext",
    summary:
      "Made ERPNext pick item tax templates on the base-currency net rate, so switching an invoice to USD no longer applied the wrong GST slab.",
    tags: ["Python", "ERPNext"],
    href: "https://github.com/frappe/erpnext/pull/39448",
  },
  {
    date: "2024-02",
    when: "Jan – Feb 2024",
    kind: "fix",
    title: "GST breakup decoupled from ERPNext's tax table",
    org: "Resilient · India Compliance",
    summary:
      "Rebuilt the GST breakup table so it no longer depends on ERPNext's generic tax breakup, and limited GSTIN fields in setup to Indian companies.",
    tags: ["Frappe", "JavaScript"],
    href: "https://github.com/resilient-tech/india-compliance/pull/1644",
  },
  {
    date: "2024-01",
    when: "Jan 2024",
    kind: "feat",
    title: "Scheduled e-Waybill validity extensions",
    org: "Resilient · India Compliance",
    summary:
      "A schedule option in the Extend Validity dialog, an already-scheduled state, and a log comment for every scheduled extension.",
    tags: ["Python", "Frappe", "e-Waybill"],
    href: "https://github.com/resilient-tech/india-compliance/pull/1508",
  },
  {
    date: "2024-01",
    when: "Jan – Mar 2024",
    kind: "infra",
    title: "Docs site theme and Steps component",
    org: "Resilient · Docs",
    summary:
      "Brought the documentation site's theme in line with the company site and added a Steps component for step-by-step setup guides.",
    tags: ["MDX", "CSS"],
    href: "https://github.com/resilient-tech/india-compliance-docs/pull/29",
  },
  {
    date: "2023-12",
    when: "Dec 2023",
    kind: "feat",
    title: "One-click GSTR-1 Excel export with HSN",
    org: "Resilient · India Compliance",
    summary: "Exported the whole GSTR-1 report to Excel in one click, with the HSN summary report built in.",
    tags: ["Python", "Excel"],
    href: "https://github.com/resilient-tech/india-compliance/pull/1448",
  },
  {
    date: "2023-12",
    when: "Nov – Dec 2023",
    kind: "feat",
    title: "Reconciliation nudges for purchase invoices",
    org: "Resilient · India Compliance",
    summary:
      "Warned on payment entries that reference unreconciled purchase invoices, and alerted users to missing GSTR-2B downloads in the reconciliation tool.",
    tags: ["JavaScript", "Frappe"],
    href: "https://github.com/resilient-tech/india-compliance/pull/1378",
  },
  {
    date: "2023-11",
    when: "Nov 2023",
    kind: "fix",
    title: "TCS GSTIN validation across documents",
    org: "Resilient · India Compliance",
    summary:
      "Validated tax-collector GSTINs on parties, addresses and transactions, and fixed e-Waybill barcode defaults.",
    tags: ["Python", "Frappe"],
    href: "https://github.com/resilient-tech/india-compliance/pull/1306",
  },
  {
    date: "2023-06",
    when: "Jun 2023",
    kind: "infra",
    title: "Kafka pipeline for Wikimedia change streams",
    org: "RealStream",
    summary: "Producers and consumers that move a high-volume public event stream between Spring Boot services.",
    tags: ["Kafka", "Spring Boot"],
  },
  {
    date: "2023-04",
    when: "Dec 2022 – May 2023",
    kind: "perf",
    title: "OTA booking webhooks",
    org: "Simulas",
    summary: "Webhook ingestion for bookings from online travel agencies, rebuilt on reusable Express APIs.",
    impact: "−30% processing time",
    tags: ["Node.js", "Express"],
  },
  {
    date: "2023-03",
    when: "Dec 2022 – May 2023",
    kind: "feat",
    title: "Stripe Elements + Shift4 payments",
    org: "Simulas",
    summary: "Card capture and payment flows integrated across two providers.",
    impact: "+20% successful transactions",
    tags: ["Stripe", "Shift4"],
  },
  {
    date: "2022-03",
    when: "Mar 2022",
    kind: "feat",
    title: "Mood-aware music recommendations",
    org: "Verbyl",
    summary: "A mood classifier feeding song recommendations and generated playlists in a Flutter streaming app.",
    impact: "85% accuracy · +25% retention",
    tags: ["Python", "Flask", "Flutter"],
  },
  {
    date: "2021-11",
    when: "Sep – Nov 2021",
    kind: "perf",
    title: "API layer for the Nearlikes app",
    org: "Nearlikes",
    summary: "Backend APIs wired into the Flutter client with leaner request handling.",
    impact: "−25% API response time",
    tags: ["Flutter"],
  },
  {
    date: "2021-08",
    when: "Aug 2021",
    kind: "feat",
    title: "ShopEra marketplace launch",
    org: "ShopEra",
    summary: "Search, filters, and secure checkout for a multi-vendor local commerce app.",
    tags: ["Flutter", "PHP"],
  },
];

export const skills: SkillCategory[] = [
  {
    category: "Languages",
    technologies: ["TypeScript", "Python", "Java", "Go", "SQL", "Protocol Buffers"],
  },
  {
    category: "Frameworks",
    technologies: [
      "Next.js",
      "React",
      "FastAPI",
      "Spring Boot",
      "Frappe",
      "Temporal",
      "OpenAI Agents SDK",
      "LiteLLM",
      "Tailwind CSS",
    ],
  },
  {
    category: "Data",
    technologies: ["PostgreSQL", "Redis", "Google Cloud Storage", "MongoDB", "Apache Kafka"],
  },
  {
    category: "Tools",
    technologies: ["Kubernetes", "Docker", "GitHub Actions", "Stripe", "Sentry", "PostHog", "Playwright", "Storybook"],
  },
];

export const achievements: Achievement[] = [
  {
    mark: "600+",
    title: "Competitive programming",
    description:
      "Problems solved across LeetCode, Codeforces, and CodeChef, consistently in the top 15% of participants.",
  },
  {
    mark: "Top 15",
    title: "CoviHacks, 48 hours",
    description: "Out of 50+ teams, with a mobile app that screens chest X-rays for COVID.",
  },
  {
    mark: "Captain",
    title: "State basketball",
    description: "Led the team to victory at the State Level Tournament in Baroda, Gujarat.",
  },
];

export const certifications: Certification[] = [
  { name: "Lyft Back-End Engineering Virtual Experience", issuer: "Forage" },
  { name: "The Complete Web Development Bootcamp", issuer: "Udemy" },
  { name: "Complete Flutter App Development Bootcamp", issuer: "Udemy" },
];

export const education: Education = {
  degree: "B.Tech, Information Technology",
  institution: "Dharmsinh Desai University",
  location: "Nadiad, Gujarat",
  graduation: "May 2023",
  cgpa: "8.86",
  coursework: [
    "Data Structures & Algorithms",
    "Database Systems",
    "Web Technologies",
    "Software Engineering",
    "Object-Oriented Programming",
  ],
};

export const stats: Stat[] = [
  { value: "3+ Yrs", label: "Shipping to production" },
  { value: "462", label: "PRs merged at Strique" },
  { value: "521", label: "Code reviews given" },
  { value: "600+", label: "DSA problems solved" },
];

export const contactInfo = {
  email: "divsmistry30@gmail.com",
  phone: "+91-72269-66419",
  // Links left as "#" are hidden across the site.
  github: "https://github.com/divyam-mistry",
  linkedin: "https://www.linkedin.com/in/divyammistry/",
  leetcode: "https://leetcode.com/u/divsmistry30/",
};

export const socialLinks = [
  { label: "GitHub", href: contactInfo.github },
  { label: "LinkedIn", href: contactInfo.linkedin },
  { label: "LeetCode", href: contactInfo.leetcode },
].filter((l) => l.href && l.href !== "#");

export const sections = [
  { id: "about", index: "01", label: "About", nav: "About" },
  { id: "work", index: "02", label: "Selected work", nav: "Work" },
  { id: "shiplog", index: "03", label: "Ship log", nav: "Ship log" },
  { id: "writing", index: "04", label: "Field notes", nav: "Writing" },
  { id: "experience", index: "05", label: "Experience", nav: "Experience" },
  { id: "toolkit", index: "06", label: "Toolkit", nav: null },
  { id: "record", index: "07", label: "Record", nav: null },
  { id: "contact", index: "08", label: "Contact", nav: "Contact" },
] as const;
