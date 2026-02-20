import React, { useState } from "react";
import { TrendingUp, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

const WOMEN_CLOTHING_TOPICS = [
  { label: "Saree", query: "saree" },
  { label: "Kurti", query: "kurti" },
  { label: "Lehenga", query: "lehenga" },
  { label: "Salwar Kameez", query: "salwar kameez" },
  { label: "Women Dress", query: "women dress" },
];

const EMBED_BASE = "https://trends.google.com/trends/embed/explore";

function buildTrendUrl(queries: string[], geo = "NP", type: "TIMESERIES" | "GEO_MAP" | "RELATED_QUERIES" = "TIMESERIES") {
  const comparisonItem = queries.map(q => ({
    keyword: q,
    geo,
    time: "today 12-m",
  }));
  const req = JSON.stringify({ comparisonItem, category: 0, property: "" });
  const params = new URLSearchParams({
    req,
    tz: "-345",
    eq: `geo=${geo}&q=${queries.join(",")}&hl=en`,
  });
  if (type === "TIMESERIES") {
    return `${EMBED_BASE}/TIMESERIES?${params.toString()}`;
  }
  if (type === "GEO_MAP") {
    return `${EMBED_BASE}/GEO_MAP?${params.toString()}`;
  }
  return `${EMBED_BASE}/RELATED_QUERIES?${params.toString()}`;
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
        <h1 className="text-2xl font-bold tracking-tight">Google Trends — Women's Clothing</h1>
        <p className="text-sm text-muted-foreground">
          Real Google Trends data for women's clothing items in Nepal
        </p>
      </div>

      {/* Controls */}
      <div className="rounded-lg border bg-card p-5 space-y-4">
        <h3 className="text-sm font-semibold text-card-foreground">Select Categories (max 5)</h3>
        <div className="flex flex-wrap gap-2">
          {WOMEN_CLOTHING_TOPICS.map(t => (
            <button
              key={t.query}
              onClick={() => handlePreset(t.query)}
              className={`rounded-full px-3 py-1.5 text-xs font-medium transition-colors ${
                activeQueries.includes(t.query)
                  ? "bg-primary text-primary-foreground"
                  : "bg-muted text-muted-foreground hover:bg-muted/80"
              }`}
            >
              {t.label}
            </button>
          ))}
        </div>
        <div className="flex gap-2">
          <Input
            placeholder="Add custom keyword (e.g. 'anarkali suit')"
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
          <p className="text-xs text-muted-foreground">
            Tracking: <strong>{activeQueries.join(", ")}</strong>
          </p>
        )}
      </div>

      {activeQueries.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-lg border bg-card py-20 text-center">
          <TrendingUp className="mb-4 h-12 w-12 text-muted-foreground/40" />
          <h3 className="text-lg font-semibold text-card-foreground">No Categories Selected</h3>
          <p className="mx-auto mt-1 max-w-md text-sm text-muted-foreground">
            Select at least one women's clothing category above to view real Google Trends data.
          </p>
        </div>
      ) : (
        <>
          {/* Interest Over Time */}
          <div className="rounded-lg border bg-card p-5">
            <h3 className="mb-3 text-sm font-semibold text-card-foreground">Interest Over Time (Past 12 Months)</h3>
            <iframe
              src={buildTrendUrl(activeQueries, "NP", "TIMESERIES")}
              className="w-full rounded-md border-0"
              style={{ height: 400 }}
              title="Google Trends - Interest Over Time"
              loading="lazy"
            />
          </div>

          {/* Interest by Region */}
          <div className="rounded-lg border bg-card p-5">
            <h3 className="mb-3 text-sm font-semibold text-card-foreground">Interest by Region</h3>
            <iframe
              src={buildTrendUrl(activeQueries, "NP", "GEO_MAP")}
              className="w-full rounded-md border-0"
              style={{ height: 400 }}
              title="Google Trends - Interest by Region"
              loading="lazy"
            />
          </div>

          {/* Related Queries */}
          <div className="rounded-lg border bg-card p-5">
            <h3 className="mb-3 text-sm font-semibold text-card-foreground">Related Queries</h3>
            <iframe
              src={buildTrendUrl(activeQueries, "NP", "RELATED_QUERIES")}
              className="w-full rounded-md border-0"
              style={{ height: 500 }}
              title="Google Trends - Related Queries"
              loading="lazy"
            />
          </div>

          {/* Direct Link */}
          <div className="rounded-lg border bg-card p-4 text-center">
            <a
              href={`https://trends.google.com/trends/explore?geo=NP&q=${activeQueries.join(",")}&hl=en`}
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
