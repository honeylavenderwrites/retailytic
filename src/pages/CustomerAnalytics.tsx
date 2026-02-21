import { useDataStore } from "@/store/dataStore";
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell, PieChart, Pie,
} from "recharts";
import { FileText } from "lucide-react";
import EmptyDataState from "@/components/EmptyDataState";

const SEGMENT_COLORS: Record<string, string> = {
  VIP: 'hsl(173, 58%, 39%)',
  Loyal: 'hsl(210, 76%, 52%)',
  Regular: 'hsl(262, 52%, 56%)',
  'At-Risk': 'hsl(38, 92%, 50%)',
  Lost: 'hsl(0, 72%, 51%)',
};

const cohortHeader = ['Cohort', 'M0', 'M1', 'M2', 'M3', 'M4', 'M5', 'M6'];

function getCohortColor(val: number | null): string {
  if (val === null) return 'transparent';
  if (val >= 70) return 'hsl(173, 58%, 39%)';
  if (val >= 50) return 'hsl(173, 58%, 50%)';
  if (val >= 30) return 'hsl(173, 58%, 65%)';
  return 'hsl(173, 58%, 80%)';
}

export default function CustomerAnalytics() {
  const { customers, rfmSegments, cohortData, dataSource, analysisTexts } = useDataStore();

  if (dataSource === 'mock') {
    return (
      <div className="animate-slide-in space-y-6">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Customer Analytics</h1>
          <p className="text-sm text-muted-foreground">Segmentation, lifetime value & churn intelligence</p>
        </div>
        <EmptyDataState title="No Customer Data" description="Upload your sales file to see customer segments, RFM analysis and retention cohorts." />
      </div>
    );
  }

  // Segment distribution for pie chart
  const segmentData = Object.entries(
    customers.reduce((acc, c) => {
      acc[c.segment] = (acc[c.segment] || 0) + 1;
      return acc;
    }, {} as Record<string, number>)
  ).map(([name, value]) => ({ name, value }));

  // Top customers bar chart
  const topCustomers = customers
    .filter(c => c.name !== 'Cash Party (Walk-in)')
    .slice(0, 10)
    .map(c => ({
      name: c.name.length > 12 ? c.name.slice(0, 12) + '…' : c.name,
      spend: c.totalSpend,
      segment: c.segment,
    }));

  return (
    <div className="animate-slide-in space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Customer Analytics</h1>
        <p className="text-sm text-muted-foreground">Segmentation, lifetime value & churn intelligence</p>
      </div>

      {/* RFM Segments */}
      <div className="grid gap-4 lg:grid-cols-5">
        {rfmSegments.filter(s => s.count > 0).map((seg) => (
          <div key={seg.segment} className="rounded-lg border bg-card p-4">
            <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">{seg.segment}</p>
            <p className="mt-1 text-xl font-bold text-card-foreground">{seg.count}</p>
            <p className="text-xs text-muted-foreground">{seg.percentage}% of base</p>
            <p className="mt-1 text-xs text-primary">Avg रू {seg.avgSpend.toLocaleString()}</p>
          </div>
        ))}
      </div>
      {analysisTexts?.segmentation && (
        <div className="rounded-md bg-muted/50 p-3 flex gap-2">
          <FileText className="h-4 w-4 text-primary shrink-0 mt-0.5" />
          <p className="text-xs text-muted-foreground leading-relaxed">{analysisTexts.segmentation}</p>
        </div>
      )}

      <div className="grid gap-4 lg:grid-cols-2">
        {/* Segment Distribution Pie */}
        <div className="rounded-lg border bg-card p-5">
          <h3 className="text-sm font-semibold text-card-foreground">Customer Segment Distribution</h3>
          <p className="mb-4 text-xs text-muted-foreground">Breakdown by RFM segment</p>
          <div className="flex items-center gap-6">
            <div className="h-48 w-48 shrink-0">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={segmentData}
                    cx="50%"
                    cy="50%"
                    innerRadius={40}
                    outerRadius={70}
                    dataKey="value"
                    paddingAngle={3}
                  >
                    {segmentData.map((entry) => (
                      <Cell key={entry.name} fill={SEGMENT_COLORS[entry.name] || 'hsl(220, 10%, 46%)'} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(value: number) => [value, 'Customers']} />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="flex-1 space-y-3">
              {segmentData.map((seg) => (
                <div key={seg.name} className="flex items-center justify-between text-sm">
                  <div className="flex items-center gap-2">
                    <div className="h-2.5 w-2.5 rounded-full" style={{ background: SEGMENT_COLORS[seg.name] || 'hsl(220, 10%, 46%)' }} />
                    <span className="text-card-foreground">{seg.name}</span>
                  </div>
                  <span className="font-medium text-muted-foreground">{seg.value}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Top Customers Bar */}
        <div className="rounded-lg border bg-card p-5">
          <h3 className="text-sm font-semibold text-card-foreground">Top 10 Customers by Spend</h3>
          <p className="mb-4 text-xs text-muted-foreground">Highest lifetime value (excl. walk-ins)</p>
          <div className="h-48">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={topCustomers} layout="vertical">
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(220, 13%, 90%)" />
                <XAxis type="number" tick={{ fontSize: 10, fill: 'hsl(220, 10%, 46%)' }} tickFormatter={(v) => `${(v / 1000).toFixed(0)}K`} />
                <YAxis type="category" dataKey="name" tick={{ fontSize: 10, fill: 'hsl(220, 10%, 46%)' }} width={100} />
                <Tooltip formatter={(value: number) => [`रू ${value.toLocaleString()}`, 'Total Spend']} />
                <Bar dataKey="spend" radius={[0, 4, 4, 0]}>
                  {topCustomers.map((entry, i) => (
                    <Cell key={i} fill={SEGMENT_COLORS[entry.segment] || 'hsl(220, 10%, 46%)'} opacity={0.85} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
      {analysisTexts?.customers && (
        <div className="rounded-md bg-muted/50 p-3 flex gap-2">
          <FileText className="h-4 w-4 text-primary shrink-0 mt-0.5" />
          <p className="text-xs text-muted-foreground leading-relaxed">{analysisTexts.customers}</p>
        </div>
      )}

      {/* Cohort Grid */}
      <div className="rounded-lg border bg-card p-5">
        <h3 className="text-sm font-semibold text-card-foreground">Retention Cohort Analysis</h3>
        <p className="mb-4 text-xs text-muted-foreground">Monthly retention rates (%)</p>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr>
                {cohortHeader.map((h) => (
                  <th key={h} className="px-3 py-2 text-center text-xs font-medium uppercase text-muted-foreground">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {cohortData.map((row) => (
                <tr key={row.cohort}>
                  <td className="px-3 py-2 text-xs font-medium text-card-foreground whitespace-nowrap">{row.cohort}</td>
                  {[row.m0, row.m1, row.m2, row.m3, row.m4, row.m5, row.m6].map((val, i) => (
                    <td key={i} className="px-1 py-1">
                      <div
                        className="mx-auto flex h-9 w-14 items-center justify-center rounded text-xs font-medium"
                        style={{
                          background: getCohortColor(val),
                          color: val !== null && val >= 30 ? '#fff' : val !== null ? 'hsl(220, 25%, 10%)' : 'transparent',
                        }}
                      >
                        {val !== null ? `${val}%` : ''}
                      </div>
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Customer Table */}
      <div className="rounded-lg border bg-card">
        <div className="border-b p-4">
          <h3 className="text-sm font-semibold text-card-foreground">Customer Directory</h3>
          <p className="text-xs text-muted-foreground">CLV, churn risk & RFM scores</p>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b text-xs uppercase text-muted-foreground">
                <th className="px-4 py-3 text-left font-medium">Customer</th>
                <th className="px-4 py-3 text-right font-medium">Total Spend</th>
                <th className="px-4 py-3 text-right font-medium">Orders</th>
                <th className="px-4 py-3 text-right font-medium">CLV</th>
                <th className="px-4 py-3 text-right font-medium">RFM</th>
                <th className="px-4 py-3 text-right font-medium">Churn Risk</th>
                <th className="px-4 py-3 text-center font-medium">Segment</th>
              </tr>
            </thead>
            <tbody>
              {customers.map((c) => (
                <tr key={c.id} className="border-b last:border-0 hover:bg-muted/50 transition-colors">
                  <td className="px-4 py-3 font-medium text-card-foreground">{c.name}</td>
                  <td className="px-4 py-3 text-right text-card-foreground">रू {c.totalSpend.toLocaleString()}</td>
                  <td className="px-4 py-3 text-right text-muted-foreground">{c.totalOrders}</td>
                  <td className="px-4 py-3 text-right font-medium text-primary">रू {c.clv.toLocaleString()}</td>
                  <td className="px-4 py-3 text-right text-card-foreground">{c.rfmScore}</td>
                  <td className="px-4 py-3 text-right">
                    <span className={c.churnRisk > 0.5 ? 'text-destructive' : c.churnRisk > 0.2 ? 'text-warning' : 'text-success'}>
                      {(c.churnRisk * 100).toFixed(0)}%
                    </span>
                  </td>
                  <td className="px-4 py-3 text-center">
                    <span
                      className="inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium"
                      style={{
                        background: `${SEGMENT_COLORS[c.segment]}20`,
                        color: SEGMENT_COLORS[c.segment],
                      }}
                    >
                      {c.segment}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
