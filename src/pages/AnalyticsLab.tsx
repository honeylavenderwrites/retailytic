import { useDataStore } from "@/store/dataStore";
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  Line, ComposedChart,
} from "recharts";
import { FlaskConical, FileText } from "lucide-react";
import EmptyDataState from "@/components/EmptyDataState";

export default function AnalyticsLab() {
  const { monthlySalesData, forecastData, dataSource, marketBasketRules, analysisTexts } = useDataStore();

  if (dataSource === 'mock') {
    return (
      <div className="animate-slide-in space-y-6">
        <div className="flex items-center gap-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary/10">
            <FlaskConical className="h-5 w-5 text-primary" />
          </div>
          <div>
            <h1 className="text-2xl font-bold tracking-tight">Analytics Lab</h1>
            <p className="text-sm text-muted-foreground">Forecasting & market basket analysis</p>
          </div>
        </div>
        <EmptyDataState title="No Analytics Data" description="Upload your sales file to see revenue forecasts and market basket analysis." />
      </div>
    );
  }

  const combinedForecast = [
    ...monthlySalesData.map(d => ({ month: d.month, actual: d.revenue, predicted: null as number | null, lower: null as number | null, upper: null as number | null })),
    ...forecastData.map(d => ({ month: d.month, actual: null as number | null, predicted: d.predicted, lower: d.lower, upper: d.upper })),
  ];

  // Use actual computed rules from data, with fallback
  const rules = marketBasketRules.length > 0 ? marketBasketRules : [];

  return (
    <div className="animate-slide-in space-y-6">
      <div className="flex items-center gap-3">
        <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary/10">
          <FlaskConical className="h-5 w-5 text-primary" />
        </div>
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Analytics Lab</h1>
          <p className="text-sm text-muted-foreground">Forecasting & market basket analysis</p>
        </div>
      </div>

      {/* Forecast Chart */}
      <div className="rounded-lg border bg-card p-5">
        <h3 className="text-sm font-semibold text-card-foreground">Revenue Forecast</h3>
        <p className="mb-4 text-xs text-muted-foreground">Actual vs predicted with confidence intervals</p>
        <div className="h-72">
          <ResponsiveContainer width="100%" height="100%">
            <ComposedChart data={combinedForecast}>
              <defs>
                <linearGradient id="forecastGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="hsl(210, 76%, 52%)" stopOpacity={0.2} />
                  <stop offset="95%" stopColor="hsl(210, 76%, 52%)" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(220, 13%, 90%)" />
              <XAxis dataKey="month" tick={{ fontSize: 10, fill: 'hsl(220, 10%, 46%)' }} />
              <YAxis tick={{ fontSize: 10, fill: 'hsl(220, 10%, 46%)' }} tickFormatter={(v) => `${(v / 1000).toFixed(0)}K`} />
              <Tooltip formatter={(v: number | null) => v ? [`रू ${v.toLocaleString()}`, ''] : ['—', '']} />
              <Area type="monotone" dataKey="upper" stroke="none" fill="hsl(210, 76%, 52%)" fillOpacity={0.1} />
              <Area type="monotone" dataKey="lower" stroke="none" fill="hsl(0, 0%, 100%)" fillOpacity={1} />
              <Line type="monotone" dataKey="actual" stroke="hsl(173, 58%, 39%)" strokeWidth={2} dot={{ r: 3 }} connectNulls={false} />
              <Line type="monotone" dataKey="predicted" stroke="hsl(210, 76%, 52%)" strokeWidth={2} strokeDasharray="6 3" dot={{ r: 3 }} connectNulls={false} />
            </ComposedChart>
          </ResponsiveContainer>
        </div>
        {analysisTexts?.forecast && (
          <div className="mt-4 rounded-md bg-muted/50 p-3 flex gap-2">
            <FileText className="h-4 w-4 text-primary shrink-0 mt-0.5" />
            <p className="text-xs text-muted-foreground leading-relaxed">{analysisTexts.forecast}</p>
          </div>
        )}
      </div>

      {/* Market Basket */}
      <div className="rounded-lg border bg-card p-5">
        <h3 className="text-sm font-semibold text-card-foreground">Market Basket Rules</h3>
        <p className="mb-4 text-xs text-muted-foreground">Computed from actual multi-item transactions — association rules</p>
        {rules.length === 0 ? (
          <div className="py-8 text-center text-sm text-muted-foreground">
            Not enough multi-item transactions found to compute association rules.
          </div>
        ) : (
          <div className="space-y-3">
            {rules.map((rule, i) => (
              <div key={i} className="rounded-md border px-3 py-3">
                <div className="flex items-center gap-2 text-sm">
                  <span className="font-medium text-card-foreground">{rule.antecedent}</span>
                  <span className="text-muted-foreground">→</span>
                  <span className="font-medium text-primary">{rule.consequent}</span>
                </div>
                <div className="mt-1.5 flex gap-4 text-xs text-muted-foreground">
                  <span>Confidence: <span className="font-medium text-card-foreground">{(rule.confidence * 100).toFixed(0)}%</span></span>
                  <span>Support: <span className="font-medium text-card-foreground">{(rule.support * 100).toFixed(0)}%</span></span>
                  <span>Lift: <span className="font-medium text-card-foreground">{rule.lift.toFixed(1)}</span></span>
                </div>
              </div>
            ))}
          </div>
        )}
        {analysisTexts?.basket && (
          <div className="mt-4 rounded-md bg-muted/50 p-3 flex gap-2">
            <FileText className="h-4 w-4 text-primary shrink-0 mt-0.5" />
            <p className="text-xs text-muted-foreground leading-relaxed">{analysisTexts.basket}</p>
          </div>
        )}
      </div>
    </div>
  );
}
