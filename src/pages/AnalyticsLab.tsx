import { useDataStore } from "@/store/dataStore";
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  Line, ComposedChart,
} from "recharts";
import { FlaskConical } from "lucide-react";

const seasonalityData = [
  { month: 'Jan', index: 85 }, { month: 'Feb', index: 72 },
  { month: 'Mar', index: 88 }, { month: 'Apr', index: 95 },
  { month: 'May', index: 102 }, { month: 'Jun', index: 108 },
  { month: 'Jul', index: 92 }, { month: 'Aug', index: 98 },
  { month: 'Sep', index: 105 }, { month: 'Oct', index: 100 },
  { month: 'Nov', index: 115 }, { month: 'Dec', index: 140 },
];

const basketRules = [
  { antecedent: 'Silk Top', consequent: 'Belt Half Pant', confidence: 0.72, support: 0.15, lift: 2.4 },
  { antecedent: 'Shoes', consequent: 'Slipper', confidence: 0.58, support: 0.11, lift: 1.9 },
  { antecedent: 'Belly Jeans', consequent: 'Off Shoulder Top', confidence: 0.52, support: 0.09, lift: 1.7 },
  { antecedent: 'Corset', consequent: 'Halter Top', confidence: 0.48, support: 0.07, lift: 1.6 },
  { antecedent: 'Pearls Bow T-Shirt', consequent: 'Shirt', confidence: 0.45, support: 0.08, lift: 1.5 },
];

const momentumMetrics = [
  { label: 'Sales Velocity', value: '34.2 units/day', status: 'positive', change: '+8.4%' },
  { label: 'Trend Direction', value: 'Upward', status: 'positive', change: '3-month' },
  { label: 'Seasonal Phase', value: 'Post-Peak', status: 'neutral', change: 'Recovery' },
  { label: 'Forecast Accuracy', value: '89.2%', status: 'positive', change: 'MAPE: 10.8%' },
];

export default function AnalyticsLab() {
  const { monthlySalesData, forecastData } = useDataStore();

  const combinedForecast = [
    ...monthlySalesData.map(d => ({ month: d.month, actual: d.revenue, predicted: null as number | null, lower: null as number | null, upper: null as number | null })),
    ...forecastData.map(d => ({ month: d.month, actual: null as number | null, predicted: d.predicted, lower: d.lower, upper: d.upper })),
  ];

  return (
    <div className="animate-slide-in space-y-6">
      <div className="flex items-center gap-3">
        <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary/10">
          <FlaskConical className="h-5 w-5 text-primary" />
        </div>
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Analytics Lab</h1>
          <p className="text-sm text-muted-foreground">Forecasting, seasonality & market basket analysis</p>
        </div>
      </div>

      {/* Momentum Cards */}
      <div className="grid grid-cols-4 gap-4">
        {momentumMetrics.map((m) => (
          <div key={m.label} className="rounded-lg border bg-card p-4">
            <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">{m.label}</p>
            <p className="mt-1 text-lg font-bold text-card-foreground">{m.value}</p>
            <p className={`text-xs ${m.status === 'positive' ? 'text-success' : 'text-muted-foreground'}`}>{m.change}</p>
          </div>
        ))}
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
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        {/* Seasonality */}
        <div className="rounded-lg border bg-card p-5">
          <h3 className="text-sm font-semibold text-card-foreground">Seasonality Index</h3>
          <p className="mb-4 text-xs text-muted-foreground">Monthly demand pattern (100 = average)</p>
          <div className="h-48">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={seasonalityData}>
                <defs>
                  <linearGradient id="seasonGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="hsl(262, 52%, 56%)" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="hsl(262, 52%, 56%)" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(220, 13%, 90%)" />
                <XAxis dataKey="month" tick={{ fontSize: 10, fill: 'hsl(220, 10%, 46%)' }} />
                <YAxis tick={{ fontSize: 10, fill: 'hsl(220, 10%, 46%)' }} domain={[60, 150]} />
                <Tooltip />
                <Area type="monotone" dataKey="index" stroke="hsl(262, 52%, 56%)" fill="url(#seasonGrad)" strokeWidth={2} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Market Basket */}
        <div className="rounded-lg border bg-card p-5">
          <h3 className="text-sm font-semibold text-card-foreground">Market Basket Rules</h3>
          <p className="mb-4 text-xs text-muted-foreground">Frequently bought together — association rules</p>
          <div className="space-y-3">
            {basketRules.map((rule, i) => (
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
        </div>
      </div>
    </div>
  );
}
