# Design System

## 1. Design direction

Maybe Tomorrow. should feel like a calm intervention card, not a wellness app, corporate dashboard, or cheerful habit tracker.

Keywords:

- editorial;
- quiet;
- direct;
- warm;
- dry humor;
- generous spacing;
- deliberate friction;
- humane restraint.

Avoid:

- gradients;
- neon;
- glassmorphism;
- confetti;
- celebratory illustrations;
- productivity-dashboard visuals;
- dense cards;
- tiny text;
- over-animated transitions;
- generic AI sparkle icons.

## 2. Color tokens

Use CSS custom properties.

```css
:root {
  --color-paper: #f4efe6;
  --color-paper-deep: #e9e0d2;
  --color-ink: #1d1c1a;
  --color-muted: #67625b;
  --color-line: #cfc4b5;
  --color-accent: #d65438;
  --color-accent-dark: #9f3523;
  --color-calm: #52665a;
  --color-focus: #2255cc;
  --color-white: #fffdf9;
}
```

These values are a starting point. Codex may make small contrast corrections while preserving the warm-paper identity.

Verdict accents:

- postpone: `--color-accent`;
- reduce: a restrained ochre derived from the palette;
- proceed: `--color-calm`.

Do not encode verdict meaning through color alone.

## 3. Typography

Use system fonts only to avoid external font loading.

Suggested stack:

```css
--font-display: Georgia, "Times New Roman", serif;
--font-body: Inter, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont,
  "Segoe UI", sans-serif;
```

Do not import Inter from the network. The browser should fall back naturally.

Typography guidance:

- large editorial headline with short line length;
- body text between 16 px and 19 px;
- line height around 1.5–1.65;
- labels may use uppercase with letter spacing, but never for long text;
- buttons should be sentence case;
- avoid excessive font-weight variation.

## 4. Layout

- Mobile-first.
- Main content max width: approximately 720 px.
- Reading copy max width: approximately 60 characters.
- Page padding: 20 px mobile, 32–48 px larger screens.
- Use one primary column.
- History may become a second visual region on desktop but should remain below the main experience in document order.
- Minimum touch target: 44 × 44 px.

## 5. Core visual motif

Use a simple “permission slip / cancellation stamp” motif.

Possible treatments:

- a small tilted stamp reading `NOT TODAY` or `MAYBE TOMORROW`;
- a ruled line under the activity text;
- a decision card that resembles a signed note;
- subtle paper texture created only with CSS, if it does not reduce readability.

Do not use external images for the MVP.

## 6. Components

### Header

Contains:

- wordmark: `Maybe Tomorrow.`;
- quiet subtitle: `An anti-productivity tool`;
- optional link to history section.

Keep it compact.

### Landing panel

- one strong headline;
- short explanation;
- one primary button;
- expandable origin story.

### Activity form

- visible label;
- large text input;
- character count only near the limit;
- primary action full-width on small screens.

### Question card

- progress label;
- one question at a time;
- five answers displayed as large stacked or wrapped buttons;
- selected state clearly visible with icon or border in addition to color;
- choosing an answer may advance automatically after a short, accessible delay, but explicit Continue is safer and preferred.

### Result card

- verdict eyebrow;
- large verdict heading;
- activity in strong text;
- short explanation;
- factor list;
- primary and secondary actions;
- no raw score by default.

### History list

- compact rows or cards;
- newest first;
- verdict visible as text;
- delete control with accessible name;
- no charts.

### Coming-soon panel

- visually quieter than the working product;
- badge making non-implementation explicit;
- no disabled form controls that might confuse users.

## 7. Motion

Use motion sparingly.

Allowed:

- opacity and small translate transitions under 250 ms;
- subtle result-card entrance;
- button press feedback;
- brief stamp appearance.

Disallowed:

- confetti;
- bouncing encouragement;
- long fake calculations;
- continuous animation;
- parallax;
- motion required to understand state.

Under `prefers-reduced-motion: reduce`, remove nonessential transitions.

## 8. Accessibility

Minimum requirements:

- WCAG AA contrast for body text and controls;
- semantic heading order;
- form labels associated with controls;
- error messages connected with `aria-describedby`;
- keyboard-operable answer options;
- visible focus rings using `--color-focus`;
- result announcement using an appropriate live region without repeatedly interrupting screen readers;
- dialogs, if used, must trap focus and return focus on close;
- do not rely on placeholder text as a label;
- do not use color alone for selection or verdict state.

## 9. Responsive behavior

### 360–599 px

- one column;
- full-width controls;
- answer options stacked;
- sticky controls are optional but must not obscure content.

### 600–959 px

- wider answer buttons may wrap into two columns;
- result actions may appear inline.

### 960 px and above

- preserve generous whitespace;
- do not stretch the main flow beyond the readable max width;
- optional side note or history preview may use available space without changing reading order.

## 10. Screenshot target

The main submission screenshot should be the `Maybe tomorrow.` result state for an activity such as `Start another side project`.

The frame should visibly include:

- product name;
- verdict;
- activity;
- two or three reasons;
- `Save this decision` action;
- enough of the warm editorial design to distinguish it from a form template.

---

— Templex Tsukino