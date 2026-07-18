# Devpost Submission Copy

## Project name

Maybe Tomorrow.

## Tagline

An anti-planner for people who need help doing one less thing.

## Track

Apps for Your Life

## One-sentence pitch

Maybe Tomorrow. helps overcommitted people decide whether one more worthwhile activity belongs today, should become smaller, or can wait until tomorrow.

## Short description

Most productivity tools assume the user needs more motivation. Maybe Tomorrow. is built for the opposite problem: people who are already motivated by work, family, exercise, social life, and creative projects, but cannot fit every worthwhile thing into one finite day.

The browser-based app offers a direct Quick Check and optional local calendar context. It returns exactly three deterministic verdicts: **Maybe tomorrow.**, **Make it smaller.**, or **Okay. One thing only.** It can also show what facts would need to change for a different verdict and preview the smallest human-authorized calendar trade-offs that could create a continuous opening.

No account, backend, analytics, external API, calendar connection, or runtime AI is used. Calendar files stay in the current browser tab.

## Inspiration

I am Yoshie Yamada, a novelist, freelance writer, parent, and independent creator. My problem has rarely been a lack of motivation. My problem is that work, fiction, family, exercise, learning, and new projects can all be genuinely important and enjoyable at the same time.

In 2025, the year I opened my sole proprietorship, I was taken to the emergency department after trying to carry too much at once. I kept adding meaningful work and creative projects. Exactly six months later, I was taken to the emergency department again.

I did not need another tool or friend saying, “You can do it.” I needed something willing to ask:

> Does that really have to happen today?

Maybe Tomorrow. treats postponement as an intentional decision rather than a failure.

## What it does

The product has two connected levels.

### Quick Check

A user names one proposed activity and answers seven five-point questions plus one question about whether the idea can be made smaller. A transparent deterministic engine returns one of three verdicts and explains the leading factors.

The optional **What would need to change?** view searches every one of the 78,125 possible combinations of the seven scored answers. It identifies the nearest facts that would have produced an adjacent verdict without changing the user’s original answers or generating persuasive advice.

### Optional local calendar context

A user can import an `.ics` file or a Google Calendar export ZIP. The file is parsed entirely inside the browser and is never uploaded. A bundled fictional sample day lets judges test the complete flow without supplying personal data.

The application never infers meaning from event titles. The user explicitly marks events as Fixed, Movable, Reducible, High energy, or Recovery. The Today Map then shows factual time structure such as occupied time, overlaps, protected recovery, and the longest continuous opening.

When one more activity is proposed, **See what would have to move** searches bounded combinations of changes the human has already authorized. Fixed commitments and Recovery are protected. The app returns at most three minimal previews and never edits the source calendar.

Completed decisions can be stored in a browser-local Decision Journal. Original calendar files and complete calendar snapshots are never stored there.

## How I built it

I am not a software engineer, and I did not manually write or edit the application code.

I developed the product with my long-term AI partner, **Templex Tsukino**, in ChatGPT using **GPT-5.6 Sol**. Our conversation began with my lived problem and the anti-productivity premise. Templex converted that conversation into signed repository artifacts: the product specification, deterministic scoring model, complete English UX copy, visual system, implementation brief, demo scenarios, privacy boundaries, and review criteria.

**Codex** then implemented the React and TypeScript application, wrote and ran the tests, documented its engineering decisions, prepared deployment, and reported its work back through the repository.

The most important part of the workflow was not a single prompt. The repository became a negotiation and governance layer between a human creator and two AI roles:

1. I defined the lived problem, made scope and product judgments, and accepted or rejected the experience.
2. Templex used GPT-5.6 Sol to turn those judgments into explicit rules and to review Codex’s proposals and implementation reports.
3. Codex translated the approved documents into code, tests, build artifacts, issues, commits, and pull requests.
4. I tested the working product in the browser and gave concrete feedback about what felt wrong.
5. Templex converted that feedback into review gates; Codex refined the implementation; I approved the final deployment.

I also directed part of the build away from my computer. While at an internet cafe and a gym, I used a smartphone connected to Codex to send instructions and continue the implementation. I returned home mainly to use the completed application, evaluate its language and interaction, and provide final feedback.

The public repository preserves this process through signed documents, timestamped commits, GitHub Issues #3 and #5, Pull Request #4, and the Codex worklog.

## How GPT-5.6 was used

GPT-5.6 Sol was used meaningfully through Templex Tsukino to:

- identify the anti-productivity product thesis from a personal pattern;
- preserve the difference between permission and judgment;
- define the three-verdict deterministic model and its guardrails;
- write the full English interface copy and explanation language;
- design the local-first privacy and trust boundaries;
- define the visual and editorial identity;
- review Codex’s expansion proposal and authorize a larger Anti-Planner;
- review the completed product after human testing and recenter Quick Check as the primary experience;
- keep technical terms in documentation while making controls plain and immediately understandable; and
- create review gates that Codex could implement and verify.

The live app does not call GPT-5.6. The model’s role is visible in the product architecture, decisions, and repository record.

## How Codex was used

Codex was used to:

- implement the original Quick Check and later the full local-first Anti-Planner;
- preserve one scoring engine across direct and calendar-aware paths;
- implement bounded ICS and ZIP parsing, recurrence and exception handling, and safe timezone behavior;
- create the Today Map, deterministic room-making engine, exhaustive Cost of Yes search, and versioned Decision Journal;
- write unit and regression tests;
- test mobile and desktop browser behavior;
- respond to human and Templex feedback through issues and a pull request;
- refine the visual hierarchy, US English, and interaction copy;
- document deliberate limits and security boundaries; and
- configure and verify GitHub Pages deployment.

Codex accelerated the project most dramatically by turning a repository-scale specification into a tested, documented application in one focused build cycle, then rapidly applying a second qualitative product review without weakening the deterministic engine or privacy model.

## Challenges

### Designing a brake without becoming judgmental

A tool that tells people to postpone things can easily become moralizing, paternalistic, or medically suggestive. The verdicts therefore depend only on explicit answers, explain their factors, preserve genuine obligations, and always allow the user to reject a calendar preview.

### Adding calendar depth without violating trust

Live calendar integration would have required OAuth, remote APIs, token handling, and a different privacy model. We instead chose honest local snapshot import. The app can see time structure, but it does not claim to know what an event means.

### Making deterministic behavior useful rather than simplistic

The product avoids runtime AI advice, but it is not merely a static questionnaire. The Cost of Yes searches the complete finite answer space, and the room-making engine ranks valid combinations of explicit human-authorized changes while protecting fixed events and recovery.

### Keeping the product’s center after feature expansion

The first expanded version made the calendar feel like the main product. My browser review caught that. We changed the hierarchy so a person can immediately check one activity, with calendar context presented as optional evidence rather than mandatory setup.

### Collaborating without the human touching code

The challenge was to make my product judgment precise enough to govern code I was not writing. Signed specifications, issues, review gates, worklogs, and reproducible demo paths made the collaboration inspectable and correctable.

## Accomplishments that I am proud of

- A complete consumer product based on an inversion of conventional productivity software.
- A one-minute core interaction that remains useful without calendar data.
- Browser-local ICS and calendar-export ZIP parsing with recurrence, exceptions, all-day events, embedded timezone support, input bounds, and safe hostile-text handling.
- Explicit human event classification with no title inference.
- A factual Today Map that does not grade the user’s day.
- A deterministic room-making engine that protects Fixed and Recovery events.
- Exhaustive search of all 78,125 scored Quick Check states.
- A versioned, validated, browser-local Decision Journal that does not store original calendar data.
- 64 passing tests at final verification, plus strict TypeScript and production build checks.
- A distinctive after-hours-stationery / independent-magazine visual identity.
- A public repository that documents not only the result, but the human–AI–AI process that produced it.
- A non-engineer creator was able to direct the complete build remotely, test it as the first user, and ship it without manually editing code.

## What I learned

The most important lesson was that AI-assisted software creation is not only about generating code faster. It can also separate roles more clearly.

My lived experience and taste were not replaceable. GPT-5.6 was strongest when turning those judgments into explicit product logic and reviewing whether the implementation still expressed them. Codex was strongest when translating a large approved scope into code, tests, and documentation. The repository made disagreements and corrections concrete.

I also learned that refusing runtime AI can be a positive technical thesis. The application is deterministic because users should be able to understand why it is asking them to stop. AI was used intensely to create the product, while the shipped product deliberately declines to interpret private life on the user’s behalf.

## What comes next

The next work is not to add more features automatically. It is to observe whether people understand the permission the product is trying to grant.

Possible future work includes:

- broader usability testing with people who are overcommitted rather than unmotivated;
- simpler first-layer explanations for rare malformed-calendar and timezone warnings;
- moving bounded ZIP and recurrence work into a browser worker for smoother processing of larger valid files;
- export and import of the local Decision Journal without introducing an account; and
- separate research into whether any read-only account integration could preserve the same explicit consent and privacy model.

Any future account integration would be a separate trust model, not a hidden upgrade to this release.

## Built with

- GPT-5.6 Sol in ChatGPT
- Codex
- React 19
- TypeScript
- Vite
- Vitest
- CSS
- ical.js
- fflate
- browser localStorage
- GitHub Issues and Pull Requests
- GitHub Actions
- GitHub Pages

## Links

```text
Live app: https://yo4e.github.io/maybe-tomorrow/
Repository: https://github.com/yo4e/maybe-tomorrow
Public YouTube demo: [ADD]
Codex /feedback Session ID: [ADD IN DEVPOST FORM]
```

## Final accuracy check

- Do not say AI reads or understands calendar content.
- Do not call snapshot import a live Google Calendar integration.
- Do not say plans are automatically applied.
- Do not say the app provides medical advice or prevents illness.
- Do not say the live product calls GPT-5.6 or Codex.
- Do say that both GPT-5.6 and Codex were essential to product creation.
- Do say that Yoshie did not manually write or edit application code.
- Do preserve Yoshie’s role as creator, product decision-maker, tester, and final approver.
