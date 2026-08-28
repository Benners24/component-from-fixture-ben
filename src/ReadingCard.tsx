import type { Reading } from "./types.js";

const ELEMENT_ORDER = ["wood", "fire", "earth", "metal", "water"] as const;

function ElementBar({ reading }: { reading: Reading }) {
  if (!reading.elements) return null;

  const { elements } = reading;
  return (
    <ul className="element-bar" data-testid="element-bar">
      {ELEMENT_ORDER.map((key) => {
        const value = elements[key];
        if (value === undefined) return null;
        return (
          <li key={key} data-testid={`element-${key}`}>
            {key}: {value}
          </li>
        );
      })}
    </ul>
  );
}

function ClashNote({ clash }: { clash: Reading["clash"] }) {
  if (clash === undefined) {
    return <p className="clash-note">Clash status: not recorded</p>;
  }
  return <p className="clash-note">Clash: {clash ? "yes" : "no"}</p>;
}

export function ReadingCard({ reading }: { reading: Reading }) {
  return (
    <article className="reading-card" data-cell-key={reading.cellKey}>
      <h2>{reading.headline ?? "No headline available"}</h2>

      <p className="meta">
        {reading.date ?? "Date unknown"}
        {reading.todayLabel ? ` \u00b7 ${reading.todayLabel}` : ""}
        {reading.animalOfDay ? ` \u00b7 ${reading.animalOfDay}` : ""}
      </p>

      {reading.relation && <p className="relation">{reading.relation}</p>}

      {reading.favourableDirection && (
        <p className="direction">Favourable direction: {reading.favourableDirection}</p>
      )}

      <ClashNote clash={reading.clash} />

      {reading.body && <p className="body">{reading.body}</p>}

      <ElementBar reading={reading} />
    </article>
  );
}

export function ReadingList({ readings }: { readings: Reading[] }) {
  if (readings.length === 0) {
    return <p className="empty-state">No readings for this day.</p>;
  }

  return (
    <div className="reading-list">
      {readings.map((reading) => (
        <ReadingCard key={reading.cellKey} reading={reading} />
      ))}
    </div>
  );
}
