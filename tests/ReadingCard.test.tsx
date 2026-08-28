import { test } from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { renderToStaticMarkup } from "react-dom/server";
import { ReadingCard, ReadingList } from "../src/ReadingCard.js";
import type { Reading, ReadingsFixture } from "../src/types.js";

const fixture: ReadingsFixture = JSON.parse(
  readFileSync(new URL("../../fixtures/readings.json", import.meta.url), "utf-8"),
);

const [complete, halfStrippedNoHeadline, halfStrippedNoElements, neutralNoBody, degenerate] =
  fixture.readings;

test("shape check: fixture has the five rows this suite depends on", () => {
  assert.equal(fixture.readings.length, 5);
});

test("renders from the fixture: complete row shows headline, body, animal, elements", () => {
  const markup = renderToStaticMarkup(<ReadingCard reading={complete} />);
  assert.match(markup, /A day that holds you up without asking/);
  assert.match(markup, /Lean on what.{1,6}s already working/);
  assert.match(markup, /Snake/);
  assert.match(markup, /wood: 1\.5/);
});

test("missing headline: falls back to placeholder, does not crash", () => {
  assert.equal(halfStrippedNoHeadline.headline, undefined);
  const markup = renderToStaticMarkup(<ReadingCard reading={halfStrippedNoHeadline} />);
  assert.match(markup, /No headline available/);
});

test("missing elements: no element bar rendered, does not crash", () => {
  assert.equal(halfStrippedNoElements.elements, undefined);
  const markup = renderToStaticMarkup(<ReadingCard reading={halfStrippedNoElements} />);
  assert.doesNotMatch(markup, /element-bar/);
});

test("missing body: paragraph omitted, does not crash", () => {
  assert.equal(neutralNoBody.body, undefined);
  const markup = renderToStaticMarkup(<ReadingCard reading={neutralNoBody} />);
  assert.doesNotMatch(markup, /class="body"/);
});

test("missing clash: stated as not recorded, never assumed false", () => {
  const markup = renderToStaticMarkup(<ReadingCard reading={complete} />);
  assert.match(markup, /Clash: no/);

  const markupMissing = renderToStaticMarkup(<ReadingCard reading={halfStrippedNoElements} />);
  assert.match(markupMissing, /Clash status: not recorded/);
});

test("degenerate row with only cellKey: renders without crashing", () => {
  assert.deepEqual(Object.keys(degenerate), ["cellKey"]);
  const markup = renderToStaticMarkup(<ReadingCard reading={degenerate} />);
  assert.match(markup, /No headline available/);
  assert.match(markup, /Date unknown/);
});

test("done condition 2: half the fields deleted across the whole fixture, list still renders", () => {
  const halfDeleted: Reading[] = fixture.readings.map((r) => ({ cellKey: r.cellKey, date: r.date }));
  const markup = renderToStaticMarkup(<ReadingList readings={halfDeleted} />);
  assert.equal((markup.match(/reading-card/g) ?? []).length, 5);
});

test("empty case: zero readings renders one calm sentence, not a blank", () => {
  const markup = renderToStaticMarkup(<ReadingList readings={[]} />);
  assert.match(markup, /No readings for this day\./);
  assert.doesNotMatch(markup, /reading-card/);
});
