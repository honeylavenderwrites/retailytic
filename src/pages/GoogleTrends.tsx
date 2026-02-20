import React, { useState } from "react";
import { TrendingUp, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

import blazerDressImg from "@/assets/trends/blazer-dress.jpg";
import maxiDressImg from "@/assets/trends/maxi-dress.jpg";
import jeansBlouseImg from "@/assets/trends/jeans-blouse.jpg";
import pantsuitImg from "@/assets/trends/pantsuit.jpg";
import midiSkirtImg from "@/assets/trends/midi-skirt.jpg";

const WOMEN_CLOTHING_TOPICS = [
  { label: "Blazer Dress", query: "blazer dress", image: blazerDressImg, type: "Formal" },
  { label: "Maxi Dress", query: "maxi dress", image: maxiDressImg, type: "Casual" },
  { label: "Jeans & Blouse", query: "women jeans blouse", image: jeansBlouseImg, type: "Casual" },
  { label: "Pantsuit", query: "women pantsuit", image: pantsuitImg, type: "Formal" },
  { label: "Midi Skirt", query: "midi skirt outfit", image: midiSkirtImg, type: "Casual" },
];

const EMBED_BASE = "https://trends.google.com/trends/embed/explore";

function buildTrendUrl(queries: string[], geo = "", type: "TIMESERIES" | "GEO_MAP" | "RELATED_QUERIES" = "TIMESERIES") {
  const comparisonItem = queries.map(q => ({
    keyword: q,
    geo,
    time: "today 12-m",
  }));
  const req = JSON.stringify({ comparisonItem, category: 0, property: "" });
  const params = new URLSearchParams({
    req,
    tz: "0",
    eq: `q=${queries.join(",")}&hl=en`,
  });
  return `${EMBED_BASE}/${type}?${params.toString()}`;
}

export default function GoogleTrends() {
  const [customQuery, setCustomQuery] = useState("");
  const [activeQueries, setActiveQueries] = useState<string[]>(
    WOMEN_CLOTHING_TOPICS.slice(0, 5).map(t => t.query)
  );

  const handleAddCustom = () => {
    const q = customQuery.trim();
    if (q && !activeQueries.includes(q.toLowerCase())) {
      setActiveQueries(prev => [...prev.slice(0, 4), q.toLowerCase()]);
      setCustomQuery("");
    }
  };

  const handlePreset = (query: string) => {
    if (activeQueries.includes(query)) {
      setActiveQueries(prev => prev.filter(q => q !== query));
    } else if (activeQueries.length < 5) {
      setActiveQueries(prev => [...prev, query]);
    }
  };

  return (
    <div className="animate-slide-in space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Google Trends — Western Women's Clothing</h1>
        <p className="text-sm text-muted-foreground">
          Real Google Trends data for western casual &amp; formal women's outfits
        </p>
      </div>

      {/* Category Cards with Images */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3">
        {WOMEN_CLOTHING_TOPICS.map(t => {
          const isActive = activeQueries.includes(t.query);
          return (
            <button
              key={t.query}
              onClick={() => handlePreset(t.query)}
              className={`group relative rounded-xl overflow-hidden border-2 transition-all ${
                isActive
                  ? "border-primary ring-2 ring-primary/20"
                  : "border-border hover:border-muted-foreground/40"
              }`}
            >
              <img
                src={t.image}
                alt={t.label}
                className="w-full aspect-square object-cover group-hover:scale-105 transition-transform duration-300"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent" />
              <div className="absolute bottom-0 left-0 right-0 p-2">
                <span className={`inline-block rounded-full px-2 py-0.5 text-[10px] font-semibold mb-1 ${
                  t.type === "Formal" ? "bg-primary text-primary-foreground" : "bg-accent text-accent-foreground"
                }`}>
                  {t.type}
                </span>
                <p className="text-xs font-semibold text-white">{t.label}</p>
              </div>
              {isActive && (
                <div className="absolute top-2 right-2 h-5 w-5 rounded-full bg-primary flex items-center justify-center">
                  <span className="text-primary-foreground text-xs">✓</span>
                </div>
              )}
            </button>
          );
        })}
      </div>

      {/* Custom keyword input */}
      <div className="rounded-lg border bg-card p-4">
        <div className="flex gap-2">
          <Input
            placeholder="Add custom keyword (e.g. 'wrap dress')"
            value={customQuery}
            onChange={e => setCustomQuery(e.target.value)}
            onKeyDown={e => e.key === "Enter" && handleAddCustom()}
            className="max-w-sm"
          />
          <Button variant="outline" size="sm" onClick={handleAddCustom} disabled={activeQueries.length >= 5}>
            <Search className="mr-1.5 h-3.5 w-3.5" />
            Add
          </Button>
        </div>
        {activeQueries.length > 0 && (
          <p className="mt-2 text-xs text-muted-foreground">
            Tracking: <strong>{activeQueries.join(", ")}</strong>
          </p>
        )}
      </div>

      {activeQueries.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-lg border bg-card py-20 text-center">
          <TrendingUp className="mb-4 h-12 w-12 text-muted-foreground/40" />
          <h3 className="text-lg font-semibold text-card-foreground">No Categories Selected</h3>
          <p className="mx-auto mt-1 max-w-md text-sm text-muted-foreground">
            Select at least one clothing category above to view real Google Trends data.
          </p>
        </div>
      ) : (
        <>
          <div className="rounded-lg border bg-card p-5">
            <h3 className="mb-3 text-sm font-semibold text-card-foreground">Interest Over Time (Past 12 Months)</h3>
            <iframe
              src={buildTrendUrl(activeQueries, "", "TIMESERIES")}
              className="w-full rounded-md border-0"
              style={{ height: 400 }}
              title="Google Trends - Interest Over Time"
              loading="lazy"
            />
          </div>

          <div className="rounded-lg border bg-card p-5">
            <h3 className="mb-3 text-sm font-semibold text-card-foreground">Interest by Region</h3>
            <iframe
              src={buildTrendUrl(activeQueries, "", "GEO_MAP")}
              className="w-full rounded-md border-0"
              style={{ height: 400 }}
              title="Google Trends - Interest by Region"
              loading="lazy"
            />
          </div>

          <div className="rounded-lg border bg-card p-5">
            <h3 className="mb-3 text-sm font-semibold text-card-foreground">Related Queries</h3>
            <iframe
              src={buildTrendUrl(activeQueries, "", "RELATED_QUERIES")}
              className="w-full rounded-md border-0"
              style={{ height: 500 }}
              title="Google Trends - Related Queries"
              loading="lazy"
            />
          </div>

          <div className="rounded-lg border bg-card p-4 text-center">
            <a
              href={`https://trends.google.com/trends/explore?q=${activeQueries.join(",")}&hl=en`}
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm font-medium text-primary hover:underline"
            >
              Open full Google Trends in new tab →
            </a>
          </div>
        </>
      )}
    </div>
  );
}
