# Product Specification

## 1. Product summary

**Maybe Tomorrow.** is an anti-productivity decision tool for people who are highly motivated, highly curious, and prone to adding one more thing to an already full day.

The product does not tell users to become less ambitious. It helps them decide whether a specific activity needs to happen **today**.

The app is intentionally small. A complete decision should take less than one minute.

## 2. Problem

Most life and productivity tools assume the user needs motivation, discipline, reminders, or optimization.

Some users have the opposite problem. They already work, care, create, exercise, socialize, and volunteer too much. For them, encouragement can become pressure. They need an externalized brake: a small mechanism that can say, “That matters, but does it have to happen today?”

## 3. Primary user

The first user is Yoshie Yamada: a writer, parent, sole proprietor, and creator with more worthwhile activities than one body can safely complete.

The broader audience is:

- freelancers and independent workers;
- parents balancing paid and unpaid work;
- creators with many parallel projects;
- people who overcommit because activities are genuinely appealing;
- people who need permission to postpone without interpreting postponement as failure.

## 4. Product promise

> In under one minute, turn “I should probably do this too” into an intentional decision: postpone it, reduce it, or do only this one thing.

## 5. Core experience

The application uses a single-page, step-based flow.

### Step A: Name the activity

Prompt:

> What are you about to add to today?

The user enters a short activity, for example:

- Go to the gym
- Attend the festival
- Start a new side project
- Go out for drinks
- Finish a client task

Requirements:

- 1–80 characters after trimming;
- submit with the primary button or Enter where appropriate;
- retain the text throughout the decision flow;
- do not classify or interpret the text.

### Step B: Answer seven questions

Each question uses five clear options scored 0–4. Labels must be understandable without numeric values. The UI may display the values internally but should emphasize language, not numbers.

1. **How urgent is this, really?**
   - 0: Not urgent
   - 1: Barely
   - 2: Somewhat
   - 3: Quite urgent
   - 4: Must happen today

2. **Is someone else depending on you?**
   - 0: No
   - 1: Not really
   - 2: A little
   - 3: Yes
   - 4: Strong commitment

3. **How much do you genuinely want to do it?**
   - 0: I do not
   - 1: Not much
   - 2: Mixed
   - 3: I want to
   - 4: Very much

4. **How much energy will it take?**
   - 0: Almost none
   - 1: A little
   - 2: Moderate
   - 3: A lot
   - 4: A great deal

5. **How full is today already?**
   - 0: Wide open
   - 1: Light
   - 2: Normal
   - 3: Full
   - 4: Overfull

6. **How much recovery do you need today?**
   - 0: Very little
   - 1: A little
   - 2: Some
   - 3: Quite a lot
   - 4: A lot

7. **Could this realistically wait until tomorrow?**
   - 0: No
   - 1: Probably not
   - 2: Maybe
   - 3: Probably
   - 4: Easily

After these seven questions, ask one binary follow-up:

> Could you make it meaningfully smaller?

Options:

- Yes
- No

This binary answer does not change the core score. It chooses the most useful middle-verdict wording and suggested reduced action.

### Step C: Show one verdict

There are exactly three verdict categories.

#### Verdict 1: Maybe tomorrow.

Use when postponement pressure clearly outweighs today-necessity.

The result must:

- explicitly name the activity;
- state that postponement is an intentional decision;
- show the two or three strongest factors;
- offer a `Save this decision` action;
- offer a `Try another` action.

#### Verdict 2: Make it smaller.

Use when the decision is genuinely mixed or when high need and high overload coexist.

If the user answered that the activity can be made smaller, suggest reducing duration, distance, scope, or social commitment without inventing specifics.

If the user answered no, use wording such as:

> If it cannot be made smaller, decide which existing thing it replaces.

#### Verdict 3: Okay. One thing only.

Use when urgency or commitment outweighs postponement pressure.

The product must not celebrate or energize the user. It should grant limited permission:

> This may need to happen today. Do it, then stop adding things.

### Step D: Optional local history

The user may save a completed decision.

Each history item contains:

- unique local ID;
- activity text;
- verdict category;
- total postpone score;
- the seven input values;
- shrinkable boolean;
- timestamp.

History requirements:

- stored only in `localStorage`;
- newest first;
- display activity, verdict, and local date/time;
- allow individual deletion;
- allow clearing all history with confirmation;
- app remains fully usable when storage is unavailable.

## 6. Result explanation

Every verdict must provide a short explanation based on deterministic factors, not generated text.

Show a heading such as:

> What pushed the decision

Then show up to three factors selected from the strongest relevant inputs, for example:

- Today is already overfull.
- This will take a great deal of energy.
- It can easily wait until tomorrow.
- Someone else is strongly depending on you.
- It truly must happen today.

Never display a fake precision percentage, medical warning score, or claim that the algorithm knows what is best for the user.

## 7. Landing-page story

The landing page should communicate the idea quickly, with optional expandable context.

Required concise copy:

> Productivity tools keep telling us to do more. Maybe Tomorrow. helps you decide what not to add today.

Required story element:

> Created for Yoshie Yamada, a writer, parent, and independent worker who was taken to the emergency department twice after repeatedly carrying too much. She did not need more encouragement. She needed someone to ask, “Does that really have to happen today?”

Keep this personal but not melodramatic. Do not imply that the app prevents medical emergencies.

## 8. Coming soon

Include a small, clearly non-functional section near the bottom:

### Coming later, not today

- Google Calendar integration
- To-do list integration
- Suggestions about what to postpone before adding one more thing

This section is product storytelling, not an interactive roadmap.

## 9. Safety and boundaries

The app is a lifestyle decision aid, not a medical tool.

Required footer note:

> Maybe Tomorrow. is not medical advice. If you are unwell or in immediate danger, contact an appropriate medical or emergency service.

Do not ask about symptoms, diagnoses, medication, disability, or mental-health status.

## 10. Success criteria

The MVP succeeds when:

- a first-time visitor understands the reversal of productivity culture within ten seconds;
- a decision can be completed in under one minute;
- the result feels specific despite using no AI;
- the scoring is explainable and testable;
- a mobile user can complete the flow comfortably with one hand;
- the experience is gently funny without mocking the user;
- the project is demonstrable in a short hackathon video.

## 11. Explicitly out of scope

- accounts;
- cloud sync;
- external integrations;
- runtime AI;
- calendar access;
- to-do imports;
- weather;
- health tracking;
- habit tracking;
- streaks;
- notifications;
- localization;
- social features;
- configurable algorithms;
- monetization.

---

— Templex Tsukino