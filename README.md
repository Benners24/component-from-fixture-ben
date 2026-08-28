# component-from-fixture-ben

Throwaway repo for the ticket **component-from-fixture-ben** (deadline 2026-08-31).

## What it is

`ReadingCard` / `ReadingList` — a presentational React component that renders entirely from a
fixture file, modeled on the shape of tala-app's `fixtures/readings.json`. No fetch, no state,
no side effects: props in, markup out.

## The two proofs the ticket asks for

1. **Renders from the fixture.** `fixtures/readings.json` has five rows: one complete, three
   with fields deleted (missing `headline`, missing `elements`, missing `body`), and one
   degenerate row with only `cellKey`. All five render without throwing.
2. **Still renders when half the fields are deleted.** Every field on `Reading` except
   `cellKey` is optional in `src/types.ts`, and every place `ReadingCard` reads one of those
   fields either falls back to a stated placeholder or omits the element entirely — it never
   defaults missing data into a claim the fixture didn't make.

The empty-array case is also covered: `ReadingList` renders one calm sentence instead of a
blank when there's nothing to show.

## Why the build step

Node's `--experimental-strip-types` strips TypeScript type annotations but does not transform
JSX — confirmed directly (`node --experimental-strip-types` on a bare `<div>` throws
`SyntaxError: Unexpected token '<'`). So `npm test` runs `tsc` first (emits to `dist/`), then
runs Node's built-in `node:test` against the compiled output. No Vitest, no jsdom, no Testing
Library — same zero-DOM-library approach tala-app's own suite uses.

## Commands

```
npm install
npm test      # builds with tsc, then runs the suite
```

9 tests, 0 failures. A mutation check (removing the `elements` guard) was run manually during
development and confirmed 3 of the 9 tests go red for exactly the reason expected, then the
guard was restored — not wired into `npm test` since this is a one-off proof, not a repo like
tala-app that repeats it on every full-check run.
