# CLAUDE.md — Working Rules for This Repository

This file is read automatically by Claude Code at the start of a session. Follow it exactly. It exists because this build will span many separate prompts/sessions, and the biggest risks are context loss between sessions and quiet scope drift — not lack of Playwright knowledge.

## Before doing anything

1. Read `PRODUCT.md` in full.
2. Read `PROGRESS.md` in full (create it from the template below if it doesn't exist yet).
3. Identify which numbered step in `PROGRESS.md` is next. Do only that step. Do not jump ahead, and do not batch multiple steps into one turn even if it would be faster.

## While working

- **One step, one turn.** Each micro-prompt you're given corresponds to one unit of work. Finish it, verify it, log it, stop. Do not proceed to the next unit unprompted.
- **No invented scope.** If a task seems to need something not listed in `PRODUCT.md`'s in-scope section, stop and say so explicitly rather than adding it. Do not add libraries, config options, or files "while you're in there."
- **No guessing on external facts.** If you're unsure of a real selector, API response shape, or endpoint behavior on automationexercise.com or the-internet.herokuapp.com, fetch/inspect it (curl the API, or note that a live check is needed) rather than assuming a plausible-looking value. A wrong assumption here compounds into hard-to-debug test failures later.
- **Match the folder structure in PRODUCT.md exactly.** Don't rename directories or files for "clarity" — consistency across sessions matters more than any individual naming preference.
- **Every code change gets verified before being logged as done:**
  - New/changed TypeScript → `npm run typecheck`
  - Any file → `npm run lint`
  - Any test file → run that specific test, not the whole suite, unless the step says otherwise
  - Report actual command output (pass/fail), not an assumption that it would pass

## After finishing a step

Append an entry to `PROGRESS.md` (never rewrite prior entries) with:
```
## Step N — <short title> — DONE (or BLOCKED)
Files touched: <list>
Verification: <command> → <result>
Notes: <anything the next session needs to know, e.g. a selector that differs from assumption, a workaround taken>
```
Then stop and give the user a short status summary. Do not continue to the next step in the same turn.

## If something is BLOCKED

Log it as BLOCKED in `PROGRESS.md` with the reason, and say so plainly to the user instead of working around it silently. Examples of blocking issues: a site selector doesn't match what the brief assumed, an API endpoint returns a different shape than the schema expects, a package version conflict.

## Definition of done for the whole project

Check `PRODUCT.md`'s "Definition of done" section. Do not declare the project complete until every item there is verified true, with the verifying command/output referenced in `PROGRESS.md`.

## PROGRESS.md template (use this to create the file if missing)

```markdown
# PROGRESS.md — Argus QA Framework Build Log

Append-only. Each step logs what was done, how it was verified, and anything the next session needs to know.

## Step 0 — Repo initialized
Files touched: —
Verification: —
Notes: Log starts here.
```
