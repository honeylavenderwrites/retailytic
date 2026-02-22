import React, { useState, useEffect } from "react";
import { TrendingUp, Search, Sparkles, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { supabase } from "@/integrations/supabase/client";

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

function buildTrendUrl(queries: string[], geo = "", type: "TIMESERIES" = "TIMESERIES") {
  const comparisonItem = queries.map(q => ({
    keyword: q,
    geo,
    time: "today 12-m",
  }));
  const req = { comparisonItem, category: 0, property: "" };
  const encodedReq = encodeURIComponent(JSON.stringify(req));
  const q = queries.map(encodeURIComponent).join(",");
  return `${EMBED_BASE}/${type}?req=${encodedReq}&tz=-345&eq=q%3D${q}%26date%3Dtoday%2012-m`;
}

interface SummerTrend {
  name: string;
  category: string;
  reason: string;
  image: string | null;
}

export default function GoogleTrends() {
  const [customQuery, setCustomQuery] = useState("");
  const [activeQueries, setActiveQueries] = useState<string[]>(
    WOMEN_CLOTHING_TOPICS.slice(0, 5).map(t => t.query)
  );
  const [summerTrends, setSummerTrends] = useState<SummerTrend[]>([]);
  const [loadingTrends, setLoadingTrends] = useState(false);
  const [trendsError, setTrendsError] = useState<string | null>(null);

  const fetchSummerTrends = async () => {
    setLoadingTrends(true);
    setTrendsError(null);
    try {
      const { data, error } = await supabase.functions.invoke("summer-trends");
      if (error) throw error;
      setSummerTrends(data.trends || []);
    } catch (err: any) {
      console.error("Failed to fetch summer trends:", err);
      setTrendsError("Failed to load trend predictions. Please try again.");
    } finally {
      setLoadingTrends(false);
    }
  };

  useEffect(() => {
    fetchSummerTrends();
  }, []);

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
          Real Google Trends data &amp; AI-powered summer trend predictions
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

      {/* Upcoming Summer Trends — AI Section */}
      <div className="rounded-lg border bg-card p-5">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <Sparkles className="h-5 w-5 text-primary" />
            <h3 className="text-sm font-semibold text-card-foreground">
              Upcoming Summer Trends — AI Predicted
            </h3>
          </div>
          <Button variant="outline" size="sm" onClick={fetchSummerTrends} disabled={loadingTrends}>
            {loadingTrends ? <Loader2 className="h-3.5 w-3.5 animate-spin mr-1.5" /> : <Sparkles className="h-3.5 w-3.5 mr-1.5" />}
            {loadingTrends ? "Generating..." : "Refresh"}
          </Button>
        </div>

        {loadingTrends && summerTrends.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16">
            <Loader2 className="h-10 w-10 animate-spin text-primary mb-4" />
            <p className="text-sm text-muted-foreground">Analyzing fashion trends & generating images…</p>
            <p className="text-xs text-muted-foreground mt-1">This may take a moment</p>
          </div>
        ) : trendsError ? (
          <div className="flex flex-col items-center justify-center py-16 text-center">
            <TrendingUp className="mb-4 h-10 w-10 text-muted-foreground/40" />
            <p className="text-sm text-destructive">{trendsError}</p>
            <Button variant="outline" size="sm" className="mt-3" onClick={fetchSummerTrends}>
              Try Again
            </Button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {summerTrends.map((trend, i) => (
              <div
                key={i}
                className="rounded-xl border bg-background overflow-hidden group hover:shadow-md transition-shadow"
              >
                {trend.image ? (
                  <div className="relative aspect-[3/4] overflow-hidden bg-muted">
                    <img
                      src={trend.image}
                      alt={trend.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    <div className="absolute top-2 left-2">
                      <span className={`inline-block rounded-full px-2.5 py-1 text-[10px] font-semibold ${
                        trend.category === "Formal"
                          ? "bg-primary text-primary-foreground"
                          : "bg-accent text-accent-foreground"
                      }`}>
                        {trend.category}
                      </span>
                    </div>
                  </div>
                ) : (
                  <div className="aspect-[3/4] bg-muted flex items-center justify-center">
                    <TrendingUp className="h-10 w-10 text-muted-foreground/30" />
                  </div>
                )}
                <div className="p-3.5">
                  <h4 className="font-semibold text-sm text-card-foreground">{trend.name}</h4>
                  <p className="text-xs text-muted-foreground mt-1.5 leading-relaxed">{trend.reason}</p>
                </div>
              </div>
            ))}
          </div>
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
          {/* Interest Over Time */}
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

          {/* Direct Link */}
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
