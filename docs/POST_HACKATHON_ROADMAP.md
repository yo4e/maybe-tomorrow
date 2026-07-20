# After Build Week

Status: possible directions, not commitments.

The submitted Build Week release remains a complete, usable product. Any
future work should preserve its center: Quick Check works without an account,
verdicts remain deterministic and explainable, and calendar context remains
optional.

## Possible directions

### Installable version

- Make the existing browser app installable as a Progressive Web App, with its
  core experience available offline.
- Keep the Decision Journal local and require no account, analytics, or
  notifications.
- Consider native packaging only if it provides clear value beyond the
  installable web version.

### Optional read-only calendar connection

- Explore an explicitly opt-in Google Calendar connection using the smallest
  practical read-only permission.
- Keep `.ics` and ZIP snapshot import as a first-class private alternative.
- Keep Quick Check fully usable without signing in.
- Do not write back to calendars, automatically reschedule events, infer
  meaning from event titles, or add runtime AI.
- Define token handling, data lifetime, consent, revocation, accessibility,
  and the new network trust boundary before implementation.

## Before expanding the scope

Each direction should begin with a public issue and a small approved
specification. Privacy, security, deterministic behavior, and the
anti-productivity premise remain release gates.

— Codex
