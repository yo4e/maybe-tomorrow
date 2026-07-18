# Hackathon Submission Notes

## 1. One-sentence pitch

Maybe Tomorrow. is an anti-productivity tool that helps overproductive people decide whether one more activity should happen today, become smaller, or wait until tomorrow.

## 2. Short description

Most productivity apps assume people need motivation. Maybe Tomorrow. was created for the opposite problem: people who are already doing too much because work, family, exercise, social life, and creative projects all genuinely matter to them.

The browser-only app asks seven quick questions, applies a deterministic and explainable score, and returns one of three verdicts: **Maybe tomorrow**, **Make it smaller**, or **Okay. One thing only**. No account, API, backend, or runtime AI is required. Decisions may be saved locally in the browser.

## 3. Origin story

Yoshie Yamada is a writer, parent, independent worker, and creator. In 2025, the year she opened her sole proprietorship, she was taken to the emergency department after trying to carry work, family, and creative life at full speed. She continued increasing her work and music-label activities because the opportunities were meaningful and enjoyable. Exactly six months later, she was taken to the emergency department again.

She did not need more encouragement. She needed a tool willing to ask:

> Does that really have to happen today?

## 4. What makes it different

- It reverses the assumption behind productivity software.
- It treats postponement as an intentional decision, not a failure.
- It is designed for excess motivation rather than lack of motivation.
- It explains every verdict without pretending to know the user’s life.
- It works privately and locally in the browser.
- It is intentionally small enough to understand in seconds.

## 5. Category fit

Category: **Apps for Your Life**

Maybe Tomorrow. is directly grounded in the creator’s daily life and addresses a practical problem that conventional productivity tools often worsen: adding too many worthwhile activities to a finite day.

## 6. OpenAI and AI collaboration story

The shipped application intentionally uses no runtime AI. The AI contribution is visible in how the product was conceived and built.

- **Templex Tsukino**, Yoshie Yamada’s AI partner working through ChatGPT with GPT-5.6 Sol, helped transform a personal pattern into a focused product concept, deterministic scoring model, complete UX copy, design direction, safety boundaries, and implementation specification.
- **Codex** implements the repository specification, tests the scoring logic, prepares deployment, and records implementation decisions.
- Authorship signatures in the repository make the collaboration legible to judges rather than hiding it behind the final interface.

Do not claim that the live app uses AI. State clearly that GPT-5.6 Sol and Codex were used meaningfully in product design and development.

## 7. Suggested demo flow

Target length: 45–60 seconds.

1. Show the landing headline: `You do not need help doing more.`
2. Enter: `Start another side project`.
3. Answer the questions quickly with an overfull-day scenario.
4. Reveal: `Maybe tomorrow.`
5. Show the top factors and save the decision.
6. Briefly show local history.
7. Scroll to `Coming later, not today` and mention future calendar and to-do integrations.
8. End on the line: `Built for people whose problem is not a lack of motivation.`

## 8. Suggested screenshot set

1. Landing page with product premise.
2. Mid-question screen on mobile.
3. `Maybe tomorrow.` result for `Start another side project`.
4. Saved local history.
5. Repository screenshot showing Templex Tsukino and Codex signed artifacts.

## 9. Possible submission answers

### Inspiration

Most productivity tools kept encouraging Yoshie Yamada to do more, even though her real problem was already doing too much. After two emergency-department visits six months apart, she needed a tool that would not push her forward. She needed one that would ask whether the next worthwhile activity truly had to happen today.

### What it does

Maybe Tomorrow. asks users to name one activity and answer seven questions about urgency, responsibility, desire, energy, current load, recovery, and flexibility. A transparent local scoring model returns one of three verdicts: postpone it, make it smaller, or do only this one thing. Users can save decisions privately in their browser.

### How it was built

The app is built with React, TypeScript, Vite, CSS, and browser `localStorage`. The scoring engine is deterministic and covered by unit tests. GPT-5.6 Sol, through Yoshie’s AI partner Templex Tsukino, was used to define the concept, product behavior, scoring model, UX, and implementation specification. Codex was used to implement and test the product. The live app makes no model or API calls.

### Challenges

The central challenge was resisting feature growth. The project deliberately excludes accounts, APIs, calendar access, notifications, and AI-generated advice so that one decision remains fast, private, and explainable.

### Accomplishments

The product turns an anti-productivity idea into a useful one-minute interaction. It also makes AI collaboration visible through signed design and implementation artifacts in the public repository.

### What comes next

Future versions may read calendars and to-do lists, score existing commitments, and suggest what to postpone before users add one more thing. Those integrations are intentionally not part of the hackathon MVP.

## 10. Accuracy rules

Before submission:

- replace planned-language with completed-language only after verification;
- do not claim deployment until the URL works;
- do not claim accessibility certification;
- do not claim medical benefit or prevention;
- do not claim the app uses AI at runtime;
- list only tests and features that exist;
- preserve the personal story without adding unsupported medical detail.

---

— Templex Tsukino