# Devpost Final Copy

This is the consolidated paste-ready source. Devpost may combine or split
these sections after Yoshie joins the challenge; preserve the headings and
meaning when matching them to the live form.

## Project name

```text
Maybe Tomorrow.
```

## Tagline

```text
An anti-planner for people who need help doing one less thing.
```

## Track

```text
Apps for Your Life
```

## One-sentence pitch

```text
Maybe Tomorrow. helps overcommitted people decide whether one more worthwhile activity belongs today, should become smaller, or can wait until tomorrow.
```

## Short description

Most productivity tools assume the user needs more motivation. Maybe
Tomorrow. is built for the opposite problem: people who are already motivated
by work, family, exercise, social life, and creative projects, but cannot fit
every worthwhile thing into one finite day.

The browser-based app begins with a Quick Check and offers optional local
calendar context. It returns exactly three deterministic verdicts: **Maybe
tomorrow.**, **Make it smaller.**, or **Okay. One thing only.** It can show the
smallest answer changes that would have changed a verdict and preview bounded,
human-authorized calendar trade-offs that create a continuous opening.

No account, backend, analytics, external API, calendar connection, or runtime
AI is used. Calendar snapshot files stay in the current browser tab.

## Inspiration

I am Yoshie Yamada, a novelist, freelance writer, parent, and independent
creator. My problem has rarely been a lack of motivation. Work, fiction,
family, exercise, learning, and new projects can all be genuinely important
and enjoyable at the same time.

In 2025, the year I opened my sole proprietorship, I was taken to the emergency
department after trying to carry too much at once. I kept adding meaningful
work and creative projects. Exactly six months later, I was taken to the
emergency department again.

I did not need another tool or friend saying, “You can do it.” I needed
something willing to ask:

> Does that really have to happen today?

Maybe Tomorrow. treats postponement as an intentional decision rather than a
failure. It makes no medical claim.

## What it does

### Check one thing

A user names one proposed activity and answers seven five-point questions plus
one question about whether the idea can be made smaller. A transparent,
deterministic engine returns one of three verdicts and explains the leading
factors. The core interaction is designed to take under a minute and requires
no calendar.

The optional **What would need to change?** view checks all 78,125 combinations
of the seven scored answers. It identifies the nearest facts that would have
produced an adjacent verdict without changing the user's answers or generating
persuasive advice.

### Add optional calendar context

A user can import an `.ics` file or a Google Calendar export ZIP. The file is
parsed entirely in the current browser tab and is never uploaded. A bundled
fictional sample day lets judges test the complete flow without personal data.

The application never infers meaning from event titles. The user explicitly
marks events as Must stay, Can move, Can be shorter, Takes a lot of energy, or
Protected recovery. The Today Map reports occupied time, overlapping time,
protected recovery, and the longest continuous opening without grading the
day.

For a proposed activity, **See what would have to move** searches documented
bounds of changes the human has authorized. Fixed commitments and recovery are
protected. The app returns at most three smallest previews within that search
and never edits the source calendar.

Completed decisions can be stored in a browser-local Decision Journal.
Original files and complete calendar snapshots are never stored there.

## How I built it

I am not a software engineer, and I did not manually write or edit the
application code.

I developed the product with my long-term AI partner, **Templex Tsukino**, in
ChatGPT using **GPT-5.6 Sol**. Our conversation began with my lived problem and
the anti-productivity premise. Templex converted it into signed repository
artifacts: product specifications, deterministic scoring rules, English UX
copy, visual direction, privacy boundaries, implementation briefs, demo
scenarios, and review criteria.

**Codex** implemented the React and TypeScript application, wrote and ran the
tests, documented engineering decisions, configured deployment, and reported
the work through the repository.

The repository became a governance layer between a human creator and two AI
roles:

1. I defined the lived problem, made product and trust decisions, tested the
   experience, and held final approval.
2. Templex used GPT-5.6 Sol to turn those judgments into explicit rules and
   review gates.
3. Codex translated approved documents into code, tests, issues, commits, pull
   requests, deployment, and evidence.
4. I used the working product and reported where it was wrong.
5. Templex reviewed the feedback; Codex refined the implementation; I approved
   release.

I directed part of the build away from my computer. At an internet cafe and a
gym, I used a smartphone connected to Codex to continue giving instructions. I
returned home to use the application, evaluate its language and interaction,
and provide final review.

The public repository preserves this process through signed documents,
timestamped commits, GitHub Issues #3 and #5, Pull Request #4, and the Codex
worklog. This was not one-prompt generation. It was a documented human–AI–AI
software-development loop.

## How GPT-5.6 was used

GPT-5.6 Sol was used through Templex Tsukino to:

- identify the anti-productivity thesis from a personal pattern;
- define the exactly-three-verdict deterministic model and guardrails;
- write interface copy and explanation language;
- design the local-first privacy and trust boundaries;
- define the editorial visual identity;
- review Codex's larger Anti-Planner proposal in Issue #3;
- review the completed product after human testing and restore Quick Check as
  the primary experience in Issue #5; and
- create review gates that Codex could implement and verify.

The live app does not call GPT-5.6. The model's contribution is visible in the
product architecture, decisions, signed documents, and review history.

## How Codex was used

Codex was used to:

- implement the original Quick Check and the full local-first Anti-Planner;
- preserve one scoring engine across direct and calendar-aware paths;
- implement bounded ICS and ZIP parsing, recurrence and exception handling,
  and safe timezone behavior;
- create Today Map, the bounded room-making engine, the exhaustive Cost of Yes
  search, and the versioned Decision Journal;
- write deterministic unit and regression tests;
- test mobile and desktop browser behavior;
- respond to Yoshie and Templex review through issues and a pull request;
- refine the visual hierarchy, US English, and interaction copy; and
- document and deploy the finished application.

Codex accelerated the project by turning a repository-scale specification into
a tested application in one focused cycle, then applying qualitative human
review without weakening the deterministic engine or privacy boundary.

## Challenges

### Designing a brake without becoming judgmental

A tool that tells people to postpone things can become paternalistic or
medically suggestive. The verdicts depend only on explicit answers, explain
their factors, preserve genuine obligations, and allow the user to reject any
calendar preview.

### Adding calendar depth without violating trust

Live integration would have required OAuth, remote APIs, token handling, and a
different privacy model. We chose honest local snapshot import. The app can see
time structure, but it does not claim to know what an event means.

### Making deterministic behavior useful

The product avoids runtime AI advice, but it is not a static questionnaire.
Cost of Yes checks the complete finite answer space. The room-making engine
ranks valid combinations of explicit human-authorized changes while protecting
fixed events and recovery.

### Keeping the product's center after expansion

The first expanded version made calendar context look like the main product.
My browser review caught that. We restored a direct one-activity check as the
first action and made calendar context visibly optional.

### Collaborating without the human touching code

The challenge was making my product judgment precise enough to govern code I
was not writing. Signed specifications, issues, review gates, worklogs, and
reproducible demo paths made the collaboration inspectable and correctable.

## Accomplishments

- A complete consumer product based on an inversion of productivity software.
- A core interaction designed for under a minute without calendar data.
- Browser-local ICS and calendar-export ZIP parsing with recurrence,
  exceptions, all-day events, embedded timezone support, limits, and safe text
  handling.
- Explicit human event classification with no title inference.
- A factual Today Map that does not grade the user's day.
- A deterministic room-making engine that protects fixed and recovery events.
- Exhaustive search of all 78,125 scored Quick Check states.
- A validated browser-local Decision Journal that excludes original calendar
  data.
- 71 tests passing across 10 files, plus strict TypeScript and production build
  checks.
- A distinctive after-hours-stationery / independent-magazine visual identity.
- A public repository documenting both the result and the human–AI–AI process.
- A non-engineer creator directed part of the build remotely, tested it as the
  first user, and shipped without manually editing application code.

## What I learned

AI-assisted software creation is not only about generating code faster. It can
separate roles more clearly. My lived experience and taste were not
replaceable. GPT-5.6 was strongest when turning those judgments into explicit
product logic and review criteria. Codex was strongest when translating a
large approved scope into code, tests, evidence, and deployment. The repository
made disagreements and corrections concrete.

Refusing runtime AI can also be a positive technical thesis. Users should be
able to understand why this product asks them to stop. AI was used intensely
to create it, while the shipped software declines to interpret private life on
the user's behalf.

## What comes next

The next work is not automatic feature growth. It is observing whether people
understand the permission the product is trying to grant. Possible research
includes broader usability testing, simpler explanations for rare import
warnings, moving bounded parsing work into a browser worker, and Decision
Journal export without accounts. Any read-only account integration would be a
separate trust model, not a hidden upgrade to this release.

## Built with

- GPT-5.6 Sol in ChatGPT
- Codex
- React 19 and TypeScript
- Vite and Vitest
- plain CSS
- ical.js and fflate
- browser localStorage
- GitHub Issues, Pull Requests, Actions, and Pages

## Public links

```text
Live app: https://yo4e.github.io/maybe-tomorrow/
Repository: https://github.com/yo4e/maybe-tomorrow
OpenAI Build Week: https://openai.devpost.com/
Public YouTube demo: https://www.youtube.com/watch?v=l8Zu30-sUvQ
Public Devpost project: https://devpost.com/software/maybe-tomorrow-6oau91
```

## Devpost-only private field

Paste this value only into the requested Devpost field. Do not add the real
value to public project copy.

```text
Codex /feedback Session ID: {{FEEDBACK_SESSION_ID}}
```

— Codex
