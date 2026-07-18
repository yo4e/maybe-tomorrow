# UX Copy

## 1. Voice

The product voice is calm, dry, humane, and slightly funny.

It is not:

- motivational;
- clinical;
- scolding;
- cute or childish;
- sarcastic toward the user;
- falsely certain.

The product should sound like a sensible friend who knows the user is capable and is therefore willing to say, “Not everything needs your capability today.”

## 2. Document title and metadata

Page title:

> Maybe Tomorrow. — An anti-productivity tool

Meta description:

> Decide what not to add today. Maybe Tomorrow. helps overproductive people postpone, reduce, or carefully proceed with one more activity.

## 3. Landing section

Eyebrow:

> AN ANTI-PRODUCTIVITY TOOL

Heading:

> You do not need help doing more.

Body:

> Productivity tools keep telling us to do more. Maybe Tomorrow. helps you decide what not to add today.

Primary action:

> Check one more thing

Secondary disclosure label:

> Why this exists

Expanded story:

> Yoshie Yamada is a writer, parent, independent worker, and creator. In 2025, after trying to carry work, family, and creative life at full speed, she was taken to the emergency department. She kept adding interesting work and projects anyway. Exactly six months later, it happened again.
>
> She did not need another voice saying, “You can do it.” She needed someone to ask, “Does that really have to happen today?”

## 4. Activity input

Heading:

> What are you about to add to today?

Supporting text:

> A task, outing, workout, drink, favor, idea, or entirely new project you suddenly believe is urgent.

Input label:

> The thing

Placeholder:

> Start another side project

Primary action:

> Question this decision

Validation messages:

- Empty: `Name the thing first. We cannot postpone a mystery.`
- Too long: `Keep it under 80 characters. The full project plan can wait too.`

## 5. Question flow

Progress label template:

> Question {current} of 8

Back action:

> Back

Continue action:

> Continue

Final action:

> Tell me to stop

Question copy and option labels are defined in `docs/PRODUCT_SPEC.md`. Use those labels exactly unless minor punctuation changes improve accessibility.

Binary follow-up:

Heading:

> Could you make it meaningfully smaller?

Supporting text:

> Shorter, closer, simpler, cheaper, or involving fewer people.

Options:

- `Yes, probably`
- `No, not really`

## 6. Loading transition

No artificial multi-second loading state is needed because the decision is local and deterministic.

A brief transition of no more than 400 ms may show:

> Removing unnecessary heroism…

Respect reduced-motion preferences and do not delay the result for theatrical effect.

## 7. Verdict copy

Use the activity text in sentence form. Escape it safely and do not alter its meaning.

### A. Postpone

Eyebrow:

> TODAY’S DECISION

Heading:

> Maybe tomorrow.

Primary statement template:

> **{activity}** does not need another piece of today.

Body option 1:

> Postponing this is a decision, not a failure.

Body option 2:

> You are not abandoning it. You are refusing to make today carry everything.

Primary action:

> Save this decision

Secondary action:

> Try another

Confirmation toast:

> Officially not happening today.

### B. Reduce

Eyebrow:

> TODAY’S DECISION

Heading:

> Make it smaller.

Primary statement template:

> **{activity}** may matter, but the full-size version does not own today.

If shrinkable:

> Keep the intention. Cut the time, distance, scope, or commitment.

If not shrinkable:

> If it cannot be made smaller, decide what it replaces.

Primary action:

> Save this decision

Secondary action:

> Try another

Confirmation toast:

> The smaller version has been approved.

### C. Proceed

Eyebrow:

> LIMITED PERMISSION

Heading:

> Okay. One thing only.

Primary statement template:

> **{activity}** may need to happen today.

Body:

> Do it, then stop adding things. This verdict is not permission to rebuild the entire schedule.

Primary action:

> Save this decision

Secondary action:

> Try another

Confirmation toast:

> Approved. One thing. We saw you.

## 8. Explanation-factor sentences

### Postponement factors

Map values 2–4 to increasingly strong language.

#### Day load

- 2: `Today is not empty.`
- 3: `Today is already full.`
- 4: `Today is already overfull.`

#### Recovery need

- 2: `Some recovery would be useful.`
- 3: `You need meaningful recovery today.`
- 4: `Recovery is already one of today’s jobs.`

#### Energy cost

- 2: `This will take noticeable energy.`
- 3: `This will take a lot of energy.`
- 4: `This asks for energy today may not have.`

#### Tomorrow flexibility

- 2: `This may be able to wait.`
- 3: `This can probably wait until tomorrow.`
- 4: `This can easily wait until tomorrow.`

### Today-necessity factors

#### Urgency

- 2: `There is some real urgency.`
- 3: `This is genuinely urgent.`
- 4: `This truly needs attention today.`

#### Commitment

- 2: `Someone else is somewhat affected.`
- 3: `Someone else is depending on you.`
- 4: `You have made a strong commitment to someone else.`

#### Desire

Because desire has half weight, keep its explanation modest.

- 2: `You are not indifferent to this.`
- 3: `You genuinely want to do this.`
- 4: `You genuinely want this — which is exactly why the decision is difficult.`

Explanation heading:

> What pushed the decision

## 9. History

Section heading:

> Things you did not automatically say yes to

Empty state:

> Nothing saved yet. A suspiciously productive situation.

History item verdict labels:

- `Maybe tomorrow.`
- `Made smaller.`
- `One thing only.`

Delete action accessible label template:

> Delete decision for {activity}

Clear-all action:

> Clear history

Clear confirmation heading:

> Clear all local decisions?

Clear confirmation body:

> This only removes history from this browser. It cannot be undone.

Confirm:

> Clear it

Cancel:

> Keep it

## 10. How it works

Heading:

> No AI is judging your life.

Body:

> The app compares urgency, responsibility, and genuine desire with energy cost, today’s load, recovery need, and whether the activity can wait. The result is deterministic, local, and explainable.

## 11. Coming soon

Heading:

> Coming later, not today

Body:

> Future versions may read calendars and to-do lists, score what is already there, and suggest what to cancel before you add one more thing.

Items:

- Google Calendar
- To-do list integrations
- Automatic postponement suggestions

Badge:

> NOT IMPLEMENTED, DELIBERATELY

## 12. Footer

Product line:

> Built for people whose problem is not a lack of motivation.

Safety note:

> Maybe Tomorrow. is not medical advice. If you are unwell or in immediate danger, contact an appropriate medical or emergency service.

Authorship line:

> Concept and product design: Yoshie Yamada + Templex Tsukino. Implementation: Codex.

## 13. Error and storage states

Generic unexpected error:

> Something went wrong. Unlike your schedule, the page can simply restart.

Storage unavailable:

> This browser cannot save history right now. The decision still counts.

Malformed saved history:

> Some saved decisions could not be read and were safely ignored.

---

— Templex Tsukino