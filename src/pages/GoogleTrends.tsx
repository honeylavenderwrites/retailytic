import React, { useState, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend,
} from "recharts";
import {
  TrendingUp, TrendingDown, RefreshCcw, Loader2, ShoppingBag, Sun, Snowflake, Leaf, CloudSun,
  ArrowUpRight, ArrowDownRight, AlertCircle, Package,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";

const COLORS = [
  'hsl(173, 58%, 39%)',
  'hsl(210, 76%, 52%)',
  'hsl(262, 52%, 56%)',
  'hsl(38, 92%, 50%)',
  'hsl(0, 72%, 51%)',
];

interface TrendLine {
  category: string;
  data: { month: string; interest: number }[];
}
interface RisingTrend {
  keyword: string; category: string; growth: number; currentInterest: number; recommendation: string;
}
interface DecliningTrend {
  keyword: string; category: string; decline: number; currentInterest: number; recommendation: string;
}
interface SeasonalInsight {
  season: string; topProducts: string[]; peakMonth: string; advice: string;
}
interface RestockRec {
  product: string; action: string; urgency: string; reason: string;
}

const SEASON_ICONS: Record<string, React.ReactNode> = {
  Spring: <Leaf className="h-4 w-4" />,
  Summer: <Sun className="h-4 w-4" />,
  Autumn: <CloudSun className="h-4 w-4" />,
  Winter: <Snowflake className="h-4 w-4" />,
};

export default function GoogleTrends() {
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [trendLines, setTrendLines] = useState<TrendLine[]>([]);
  const [risingTrends, setRisingTrends] = useState<RisingTrend[]>([]);
  const [decliningTrends, setDecliningTrends] = useState<DecliningTrend[]>([]);
  const [seasonalInsights, setSeasonalInsights] = useState<SeasonalInsight[]>([]);
  const [restockRecs, setRestockRecs] = useState<RestockRec[]>([]);
  const [hasData, setHasData] = useState(false);

  const fetchTrends = useCallback(async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke('google-trends', {
        body: {
          categories: ['Dresses', 'Sneakers', 'Denim', 'Ethnic Wear', 'Accessories'],
          context: 'Nepal fashion retail',
        },
      });

      if (error) throw error;
      if (!data?.success) throw new Error(data?.error || 'Failed to fetch trend data');

      setTrendLines(data.trendLines || []);
      setRisingTrends(data.risingTrends || []);
      setDecliningTrends(data.decliningTrends || []);
      setSeasonalInsights(data.seasonalInsights || []);
      setRestockRecs(data.restockRecommendations || []);
      setHasData(true);
      toast({ title: 'Trends Updated', description: 'Fashion trend data has been refreshed.' });
    } catch (err: any) {
      console.error(err);
      toast({ title: 'Error', description: err.message || 'Failed to fetch trends', variant: 'destructive' });
    } finally {
      setLoading(false);
    }
  }, [toast]);

  // Merge trend line data into a single chart-friendly array
  const chartData = React.useMemo(() => {
    if (!trendLines.length) return [];
    const months = trendLines[0]?.data?.map(d => d.month) || [];
    return months.map((month, i) => {
      const point: Record<string, any> = { month };
      trendLines.forEach(tl => {
        point[tl.category] = tl.data[i]?.interest ?? 0;
      });
      return point;
    });
  }, [trendLines]);

  const urgencyColor = (u: string) =>
    u === 'high' ? 'bg-destructive/10 text-destructive' :
    u === 'medium' ? 'bg-warning/15 text-warning' :
    'bg-muted text-muted-foreground';

  return (
    <div className="animate-slide-in space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Google Trends — Fashion Intelligence</h1>
          <p className="text-sm text-muted-foreground">
            Track product & design popularity to plan smarter restocking
          </p>
        </div>
        <Button onClick={fetchTrends} disabled={loading}>
          {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <RefreshCcw className="mr-2 h-4 w-4" />}
          {hasData ? 'Refresh Trends' : 'Fetch Trends'}
        </Button>
      </div>

      {!hasData && !loading && (
        <div className="flex flex-col items-center justify-center rounded-lg border bg-card py-20 text-center">
          <TrendingUp className="mb-4 h-12 w-12 text-muted-foreground/40" />
          <h3 className="text-lg font-semibold text-card-foreground">No Trend Data Yet</h3>
          <p className="mx-auto mt-1 max-w-md text-sm text-muted-foreground">
            Click <strong>Fetch Trends</strong> to generate AI-powered fashion trend insights based on Google Trends patterns for the Nepal retail market.
          </p>
        </div>
      )}

      {loading && (
        <div className="flex flex-col items-center justify-center rounded-lg border bg-card py-20">
          <Loader2 className="mb-4 h-10 w-10 animate-spin text-primary" />
          <p className="text-sm font-medium text-muted-foreground">Analyzing fashion trends…</p>
        </div>
      )}

      {hasData && !loading && (
        <>
          {/* Trend Lines Chart */}
          <div className="rounded-lg border bg-card p-5">
            <h3 className="text-sm font-semibold text-card-foreground">Product Category Interest Over Time</h3>
            <p className="mb-4 text-xs text-muted-foreground">Search interest index (0–100) by month</p>
            <div className="h-72">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(220, 13%, 90%)" />
                  <XAxis dataKey="month" tick={{ fontSize: 11, fill: 'hsl(220, 10%, 46%)' }} />
                  <YAxis domain={[0, 100]} tick={{ fontSize: 11, fill: 'hsl(220, 10%, 46%)' }} />
                  <Tooltip
                    contentStyle={{
                      background: 'hsl(0, 0%, 100%)',
                      border: '1px solid hsl(220, 13%, 90%)',
                      borderRadius: '8px',
                      fontSize: '12px',
                    }}
                  />
                  <Legend />
                  {trendLines.map((tl, i) => (
                    <Line
                      key={tl.category}
                      type="monotone"
                      dataKey={tl.category}
                      stroke={COLORS[i % COLORS.length]}
                      strokeWidth={2}
                      dot={false}
                      activeDot={{ r: 4 }}
                    />
                  ))}
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Rising & Declining Trends */}
          <div className="grid gap-4 lg:grid-cols-2">
            {/* Rising */}
            <div className="rounded-lg border bg-card p-5">
              <div className="mb-4 flex items-center gap-2">
                <TrendingUp className="h-4 w-4 text-primary" />
                <h3 className="text-sm font-semibold text-card-foreground">Rising Trends</h3>
              </div>
              <div className="space-y-3">
                {risingTrends.map((t, i) => (
                  <div key={i} className="flex items-start justify-between rounded-md border px-3 py-2.5">
                    <div className="flex-1">
                      <p className="text-sm font-medium text-card-foreground">{t.keyword}</p>
                      <p className="text-xs text-muted-foreground">{t.category}</p>
                      <p className="mt-1 text-xs text-muted-foreground">{t.recommendation}</p>
                    </div>
                    <div className="ml-3 flex items-center gap-1 text-sm font-semibold stat-up">
                      <ArrowUpRight className="h-3.5 w-3.5" />
                      +{t.growth}%
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Declining */}
            <div className="rounded-lg border bg-card p-5">
              <div className="mb-4 flex items-center gap-2">
                <TrendingDown className="h-4 w-4 text-destructive" />
                <h3 className="text-sm font-semibold text-card-foreground">Declining Trends</h3>
              </div>
              <div className="space-y-3">
                {decliningTrends.map((t, i) => (
                  <div key={i} className="flex items-start justify-between rounded-md border px-3 py-2.5">
                    <div className="flex-1">
                      <p className="text-sm font-medium text-card-foreground">{t.keyword}</p>
                      <p className="text-xs text-muted-foreground">{t.category}</p>
                      <p className="mt-1 text-xs text-muted-foreground">{t.recommendation}</p>
                    </div>
                    <div className="ml-3 flex items-center gap-1 text-sm font-semibold stat-down">
                      <ArrowDownRight className="h-3.5 w-3.5" />
                      {t.decline}%
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Seasonal Insights */}
          <div className="rounded-lg border bg-card p-5">
            <h3 className="mb-4 text-sm font-semibold text-card-foreground">Seasonal Insights</h3>
            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
              {seasonalInsights.map((s) => (
                <div key={s.season} className="rounded-md border p-4">
                  <div className="mb-2 flex items-center gap-2">
                    {SEASON_ICONS[s.season] || <Sun className="h-4 w-4" />}
                    <span className="text-sm font-semibold text-card-foreground">{s.season}</span>
                  </div>
                  <p className="text-xs text-muted-foreground">Peak: {s.peakMonth}</p>
                  <div className="mt-2 flex flex-wrap gap-1">
                    {s.topProducts.map((p) => (
                      <span key={p} className="rounded-full bg-primary/10 px-2 py-0.5 text-[10px] font-medium text-primary">
                        {p}
                      </span>
                    ))}
                  </div>
                  <p className="mt-2 text-xs text-muted-foreground">{s.advice}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Restock Recommendations */}
          <div className="rounded-lg border bg-card p-5">
            <div className="mb-4 flex items-center gap-2">
              <Package className="h-4 w-4 text-primary" />
              <h3 className="text-sm font-semibold text-card-foreground">Restock Recommendations</h3>
            </div>
            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {restockRecs.map((r, i) => (
                <div key={i} className="flex flex-col rounded-md border p-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-card-foreground">{r.product}</span>
                    <span className={`rounded-full px-2 py-0.5 text-[10px] font-semibold ${urgencyColor(r.urgency)}`}>
                      {r.urgency}
                    </span>
                  </div>
                  <span className="mt-1 text-xs font-semibold text-primary">{r.action}</span>
                  <p className="mt-1 text-xs text-muted-foreground">{r.reason}</p>
                </div>
              ))}
            </div>
          </div>
        </>
      )}
    </div>
  );
}
