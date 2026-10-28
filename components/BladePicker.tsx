"use client";

import { useState } from "react";
import { IconCheck } from "./ui";
import type { BladeType, Card, Tab } from "@/lib/products";

const TYPE_NAME: Record<BladeType, string> = {
  beam: "Beam blade",
  hybrid: "Hybrid blade",
  conventional: "Conventional blade",
  rear: "Rear blade",
};

// Top view of a car with the glass the tab covers filled in.
function CarIcon({ front, rear }: { front: boolean; rear: boolean }) {
  return (
    <svg width="28" height="48" viewBox="0 0 28 48" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true">
      <rect x="3" y="2" width="22" height="44" rx="8" />
      <path d="M6 15c5-3 11-3 16 0l-2 6H8z" fill={front ? "var(--link)" : "none"} />
      <path d="M8 36h12l2 4c-5 2-11 2-16 0z" fill={rear ? "var(--link)" : "none"} />
    </svg>
  );
}

// Blades drawn to scale against a 32" width, styled by type.
function BladeArt({ type, blades }: { type: BladeType; blades: number[] }) {
  const h = 18;
  return (
    <svg className="pick-art" viewBox={`0 0 200 ${blades.length * h + 8}`} aria-hidden="true">
      {blades.map((s, i) => {
        const w = (s / 32) * 184;
        const y = i * h + 10;
        const isRear = type === "rear" || i === 2;
        return (
          <g key={i} stroke={isRear ? "var(--link)" : "var(--blade)"} strokeLinecap="round">
            <line x1="8" y1={y} x2={8 + w} y2={y} strokeWidth={type === "conventional" ? 2 : 5} />
            {type === "conventional" && (
              <path d={`M8 ${y}l${w / 4} -5l${w / 4} 5l${w / 4} -5l${w / 4} 5`} fill="none" strokeWidth="1.6" />
            )}
            <rect x={8 + w / 2 - 6} y={y - 5} width="12" height="7" rx="2" fill="var(--accent)" stroke="none" />
          </g>
        );
      })}
    </svg>
  );
}

function PickCard({ c, fits }: { c: Card; fits: string }) {
  return (
    <div className="pick-card">
      <BladeArt type={c.type} blades={c.blades} />
      <div>
        <strong className="pick-brand">{c.brand}</strong>
        <h3>{c.title}</h3>
        <span className="muted">{TYPE_NAME[c.type]}</span>
      </div>
      <details className="pick-more">
        <summary>Show key features</summary>
        <ul>
          {c.features.map((f) => <li key={f}>{f}</li>)}
        </ul>
      </details>
      <details className="pick-more">
        <summary>Show sizes</summary>
        <dl>
          {c.sizes.map((s) => (
            <div key={s.label}>
              <dt>{s.label}</dt>
              <dd className="num">{s.value}</dd>
            </div>
          ))}
        </dl>
      </details>
      <span className="pick-fit"><IconCheck /> {fits}</span>
      {c.links.map((l, i) => (
        <a key={l.href} className={i ? "btn btn-ghost" : "btn"} href={l.href} rel="sponsored nofollow noopener" target="_blank">
          {l.label} <span aria-hidden="true">›</span>
        </a>
      ))}
    </div>
  );
}

export default function BladePicker({ tabs, fits }: { tabs: Tab[]; fits: string }) {
  const [active, setActive] = useState(tabs[0].id);
  const tab = tabs.find((t) => t.id === active)!;
  return (
    <>
      <div className="pick-tabs" role="tablist">
        {tabs.map((t) => (
          <button
            key={t.id}
            role="tab"
            aria-selected={t.id === active}
            className="pick-tab"
            onClick={() => setActive(t.id)}
          >
            <CarIcon front={t.id !== "rear"} rear={t.id !== "pair"} />
            <span>
              <strong>{t.label}</strong>
              <span className="muted">{t.cards.length} options</span>
            </span>
          </button>
        ))}
      </div>
      <div className="pick-grid" role="tabpanel">
        {tab.cards.map((c) => <PickCard key={c.id} c={c} fits={fits} />)}
      </div>
    </>
  );
}
