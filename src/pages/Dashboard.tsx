import React from "react";
import KPICard from "@/components/KPICard";
import EmptyDataState from "@/components/EmptyDataState";
import { useDataStore } from "@/store/dataStore";
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, Treemap
} from "recharts";
import { FileText } from "lucide-react";

const COLORS = [
  'hsl(173, 58%, 39%)',
  'hsl(210, 76%, 52%)',
  'hsl(262, 52%, 56%)',
  'hsl(38, 92%, 50%)',
  'hsl(0, 72%, 51%)',
];

const CustomTreemapContent = (props: any) => {
  const { x, y, width, height, name, fill } = props;
  if (width < 40 || height < 30) return null;
  return (
    <g>
      <rect x={x} y={y} width={width} height={height} fill={fill} rx={4} opacity={0.85} />
      <text x={x + width / 2} y={y + height / 2} textAnchor="middle" dominantBaseline="middle" fontSize={12} fontWeight={600} fill="#fff">
        {name}
      </text>
    </g>
  );
};

export default function Dashboard() {
  const { kpiData, monthlySalesData, categoryBreakdown, paymentMethods, dataSource, analysisTexts } = useDataStore();

  if (dataSource === 'mock') {
    return (
      <div className="animate-slide-in space-y-6">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Executive Overview</h1>
          <p className="text-sm text-muted-foreground">Real-time business health — FY 2025/26</p>
        </div>
        <EmptyDataState
          title="No Data Yet"
          description="Upload your sales data file (CSV or XLSX) to see KPIs, revenue trends, category breakdowns and more."
        />
      </div>
    );
  }

  const treemapData = categoryBreakdown.map((c, i) => ({
    name: c.name,
    size: c.revenue,
    fill: COLORS[i % COLORS.length],
  }));

  return (
    <div className="animate-slide-in space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Executive Overview</h1>
        <p className="text-sm text-muted-foreground">Real-time business health — FY 2025/26</p>
      </div>

      {/* KPI Grid */}
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-3 xl:grid-cols-6">
        {kpiData.map((kpi) => (
          <KPICard key={kpi.label} {...kpi} />
        ))}
      </div>

      {/* Charts Row */}
      <div className="grid gap-4 lg:grid-cols-3">
        {/* Revenue Trend */}
        <div className="col-span-2 rounded-lg border bg-card p-5">
          <h3 className="text-sm font-semibold text-card-foreground">Revenue Trend</h3>
          <p className="mb-4 text-xs text-muted-foreground">Monthly revenue performance</p>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={monthlySalesData}>
                <defs>
                  <linearGradient id="revenueGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="hsl(173, 58%, 39%)" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="hsl(173, 58%, 39%)" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(220, 13%, 90%)" />
                <XAxis dataKey="month" tick={{ fontSize: 11, fill: 'hsl(220, 10%, 46%)' }} />
                <YAxis tick={{ fontSize: 11, fill: 'hsl(220, 10%, 46%)' }} tickFormatter={(v) => `${(v / 1000).toFixed(0)}K`} />
                <Tooltip
                  contentStyle={{
                    background: 'hsl(0, 0%, 100%)',
                    border: '1px solid hsl(220, 13%, 90%)',
                    borderRadius: '8px',
                    fontSize: '12px',
                  }}
                  formatter={(value: number) => [`रू ${value.toLocaleString()}`, 'Revenue']}
                />
                <Area type="monotone" dataKey="revenue" stroke="hsl(173, 58%, 39%)" fill="url(#revenueGrad)" strokeWidth={2} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
          {analysisTexts?.revenue && (
            <div className="mt-4 rounded-md bg-muted/50 p-3 flex gap-2">
              <FileText className="h-4 w-4 text-primary shrink-0 mt-0.5" />
              <p className="text-xs text-muted-foreground leading-relaxed">{analysisTexts.revenue}</p>
            </div>
          )}
        </div>

        {/* Category Treemap */}
        <div className="rounded-lg border bg-card p-5">
          <h3 className="text-sm font-semibold text-card-foreground">Revenue by Category</h3>
          <p className="mb-4 text-xs text-muted-foreground">Product category distribution</p>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <Treemap
                data={treemapData}
                dataKey="size"
                nameKey="name"
                stroke="hsl(0, 0%, 100%)"
                content={<CustomTreemapContent />}
              />
            </ResponsiveContainer>
          </div>
          {analysisTexts?.category && (
            <div className="mt-4 rounded-md bg-muted/50 p-3 flex gap-2">
              <FileText className="h-4 w-4 text-primary shrink-0 mt-0.5" />
              <p className="text-xs text-muted-foreground leading-relaxed">{analysisTexts.category}</p>
            </div>
          )}
        </div>
      </div>

      {/* Payment Methods */}
      <div className="rounded-lg border bg-card p-5">
        <h3 className="text-sm font-semibold text-card-foreground">Payment Methods</h3>
        <p className="mb-4 text-xs text-muted-foreground">Transaction mode breakdown</p>
        <div className="flex items-center gap-6">
          <div className="h-40 w-40 shrink-0">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={paymentMethods}
                  cx="50%"
                  cy="50%"
                  innerRadius={35}
                  outerRadius={65}
                  dataKey="percentage"
                  paddingAngle={3}
                >
                  {paymentMethods.map((_, i) => (
                    <Cell key={i} fill={COLORS[i % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip formatter={(value: number) => [`${value}%`, 'Share']} />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="flex-1 space-y-3">
            {paymentMethods.map((pm, i) => (
              <div key={pm.method} className="flex items-center justify-between text-sm">
                <div className="flex items-center gap-2">
                  <div className="h-2.5 w-2.5 rounded-full" style={{ background: COLORS[i % COLORS.length] }} />
                  <span className="text-card-foreground">{pm.method}</span>
                </div>
                <span className="font-medium text-muted-foreground">{pm.percentage}%</span>
              </div>
            ))}
          </div>
        </div>
        {analysisTexts?.payment && (
          <div className="mt-4 rounded-md bg-muted/50 p-3 flex gap-2">
            <FileText className="h-4 w-4 text-primary shrink-0 mt-0.5" />
            <p className="text-xs text-muted-foreground leading-relaxed">{analysisTexts.payment}</p>
          </div>
        )}
      </div>
    </div>
  );
}
