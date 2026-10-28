"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

/** year -> make -> [model name, make slug, model slug][] */
export type FinderIndex = Record<string, Record<string, [string, string, string][]>>;

export default function Finder({ index }: { index: FinderIndex }) {
  const router = useRouter();
  const [year, setYear] = useState("");
  const [make, setMake] = useState("");
  const [model, setModel] = useState("");

  const years = Object.keys(index).sort((a, b) => +b - +a);
  const makes = year ? Object.keys(index[year]).sort() : [];
  const models = year && make ? index[year][make] : [];
  const pick = models.find((m) => m[2] === model);

  return (
    <form
      className="finder"
      onSubmit={(e) => {
        e.preventDefault();
        if (pick) router.push(`/${pick[1]}/${pick[2]}/${year}/`);
      }}
    >
      <label>
        Year
        <select value={year} onChange={(e) => (setYear(e.target.value), setMake(""), setModel(""))}>
          <option value="">Select year</option>
          {years.map((y) => (
            <option key={y}>{y}</option>
          ))}
        </select>
      </label>
      <label>
        Make
        <select value={make} disabled={!year} onChange={(e) => (setMake(e.target.value), setModel(""))}>
          <option value="">Select make</option>
          {makes.map((m) => (
            <option key={m}>{m}</option>
          ))}
        </select>
      </label>
      <label>
        Model
        <select value={model} disabled={!make} onChange={(e) => setModel(e.target.value)}>
          <option value="">Select model</option>
          {models.map(([name, , slug]) => (
            <option key={slug} value={slug}>
              {name}
            </option>
          ))}
        </select>
      </label>
      <button className="btn" type="submit" disabled={!pick}>
        Show sizes
      </button>
    </form>
  );
}
