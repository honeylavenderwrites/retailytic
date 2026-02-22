import { useDataStore } from "@/store/dataStore";
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell,
  PieChart, Pie, RadarChart, Radar, PolarGrid, PolarAngleAxis, PolarRadiusAxis,
} from "recharts";
import { FileText, Users, AlertTriangle, Crown, Heart } from "lucide-react";
import EmptyDataState from "@/components/EmptyDataState";

const SEGMENT_COLORS: Record<string, string> = {
  VIP: 'hsl(173, 58%, 39%)',
  Loyal: 'hsl(210, 76%, 52%)',
  Regular: 'hsl(262, 52%, 56%)',
  'At-Risk': 'hsl(38, 92%, 50%)',
  Lost: 'hsl(0, 72%, 51%)',
};

const PAYMENT_COLORS = [
  'hsl(173, 58%, 39%)', 'hsl(210, 76%, 52%)', 'hsl(262, 52%, 56%)',
  'hsl(38, 92%, 50%)', 'hsl(340, 65%, 47%)', 'hsl(180, 40%, 50%)',
];

const cohortHeader = ['Cohort', 'M0', 'M1', 'M2', 'M3', 'M4', 'M5', 'M6'];

function getCohortColor(val: number | null): string {
  if (val === null) return 'transparent';
  if (val >= 70) return 'hsl(173, 58%, 39%)';
  if (val >= 50) return 'hsl(173, 58%, 50%)';
  if (val >= 30) return 'hsl(173, 58%, 65%)';
  return 'hsl(173, 58%, 80%)';
}

export default function CustomerAnalytics() {
  const { customers, rfmSegments, cohortData, dataSource, analysisTexts, paymentMethods } = useDataStore();

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

  // Top customers bar chart (exclude walk-ins)
  const realCustomers = customers.filter(c => c.name !== 'Cash Party (Walk-in)');
  const topCustomers = realCustomers
    .slice(0, 10)
    .map(c => ({
      name: c.name.length > 14 ? c.name.slice(0, 14) + '…' : c.name,
      spend: c.totalSpend,
      segment: c.segment,
    }));

  // Order frequency distribution
  const freqBuckets = [
    { label: '1 order', min: 1, max: 1 },
    { label: '2-3 orders', min: 2, max: 3 },
    { label: '4-5 orders', min: 4, max: 5 },
    { label: '6-10 orders', min: 6, max: 10 },
    { label: '10+ orders', min: 11, max: 9999 },
  ];
  const frequencyData = freqBuckets.map(b => ({
    name: b.label,
    count: realCustomers.filter(c => c.totalOrders >= b.min && c.totalOrders <= b.max).length,
  })).filter(d => d.count > 0);

  // Churn risk breakdown
  const churnBuckets = [
    { label: 'Low (<20%)', min: 0, max: 0.2, color: 'hsl(173, 58%, 39%)' },
    { label: 'Medium (20-50%)', min: 0.2, max: 0.5, color: 'hsl(38, 92%, 50%)' },
    { label: 'High (>50%)', min: 0.5, max: 1.01, color: 'hsl(0, 72%, 51%)' },
  ];
  const churnData = churnBuckets.map(b => ({
    name: b.label,
    count: realCustomers.filter(c => c.churnRisk >= b.min && c.churnRisk < b.max).length,
    color: b.color,
  }));

  // Payment preference among real customers
  const paymentPrefMap: Record<string, number> = {};
  for (const c of realCustomers) {
    const pm = c.preferredPayment || 'Cash';
    paymentPrefMap[pm] = (paymentPrefMap[pm] || 0) + 1;
  }
  const paymentPrefData = Object.entries(paymentPrefMap)
    .sort((a, b) => b[1] - a[1])
    .map(([name, value]) => ({ name, value }));

  // Segment radar (avg spend, orders, CLV by segment)
  const segmentRadar = Object.entries(
    realCustomers.reduce((acc, c) => {
      if (!acc[c.segment]) acc[c.segment] = { spend: 0, orders: 0, clv: 0, count: 0 };
      acc[c.segment].spend += c.totalSpend;
      acc[c.segment].orders += c.totalOrders;
      acc[c.segment].clv += c.clv;
      acc[c.segment].count += 1;
      return acc;
    }, {} as Record<string, { spend: number; orders: number; clv: number; count: number }>)
  ).map(([segment, d]) => ({
    segment,
    'Avg Spend': Math.round(d.spend / d.count / 100),
    'Avg Orders': Math.round((d.orders / d.count) * 10),
    'Avg CLV': Math.round(d.clv / d.count / 100),
  }));

  // Quick stat cards
  const totalCustomerSpend = realCustomers.reduce((s, c) => s + c.totalSpend, 0);
  const avgCLV = realCustomers.length > 0 ? Math.round(realCustomers.reduce((s, c) => s + c.clv, 0) / realCustomers.length) : 0;
  const vipCount = realCustomers.filter(c => c.segment === 'VIP').length;
  const atRiskCount = realCustomers.filter(c => c.segment === 'At-Risk' || c.segment === 'Lost').length;

  return (
    <div className="animate-slide-in space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Customer Analytics</h1>
        <p className="text-sm text-muted-foreground">Segmentation, lifetime value & churn intelligence</p>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="rounded-lg border bg-card p-4 flex items-start gap-3">
          <div className="h-9 w-9 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
            <Users className="h-4 w-4 text-primary" />
          </div>
          <div>
            <p className="text-xs text-muted-foreground">Total Customers</p>
            <p className="text-lg font-bold text-card-foreground">{realCustomers.length}</p>
          </div>
        </div>
        <div className="rounded-lg border bg-card p-4 flex items-start gap-3">
          <div className="h-9 w-9 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
            <Crown className="h-4 w-4 text-primary" />
          </div>
          <div>
            <p className="text-xs text-muted-foreground">VIP Customers</p>
            <p className="text-lg font-bold text-card-foreground">{vipCount}</p>
          </div>
        </div>
        <div className="rounded-lg border bg-card p-4 flex items-start gap-3">
          <div className="h-9 w-9 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
            <Heart className="h-4 w-4 text-primary" />
          </div>
          <div>
            <p className="text-xs text-muted-foreground">Avg CLV</p>
            <p className="text-lg font-bold text-card-foreground">रू {avgCLV.toLocaleString()}</p>
          </div>
        </div>
        <div className="rounded-lg border bg-card p-4 flex items-start gap-3">
          <div className="h-9 w-9 rounded-lg bg-destructive/10 flex items-center justify-center shrink-0">
            <AlertTriangle className="h-4 w-4 text-destructive" />
          </div>
          <div>
            <p className="text-xs text-muted-foreground">At-Risk / Lost</p>
            <p className="text-lg font-bold text-card-foreground">{atRiskCount}</p>
          </div>
        </div>
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
                  <Pie data={segmentData} cx="50%" cy="50%" innerRadius={40} outerRadius={70} dataKey="value" paddingAngle={3}>
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
                <YAxis type="category" dataKey="name" tick={{ fontSize: 10, fill: 'hsl(220, 10%, 46%)' }} width={110} />
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

      {/* New Charts Row */}
      <div className="grid gap-4 lg:grid-cols-3">
        {/* Order Frequency */}
        <div className="rounded-lg border bg-card p-5">
          <h3 className="text-sm font-semibold text-card-foreground">Order Frequency</h3>
          <p className="mb-4 text-xs text-muted-foreground">How often do customers buy?</p>
          <div className="h-48">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={frequencyData}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(220, 13%, 90%)" />
                <XAxis dataKey="name" tick={{ fontSize: 9, fill: 'hsl(220, 10%, 46%)' }} />
                <YAxis tick={{ fontSize: 10, fill: 'hsl(220, 10%, 46%)' }} />
                <Tooltip formatter={(value: number) => [value, 'Customers']} />
                <Bar dataKey="count" fill="hsl(210, 76%, 52%)" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Churn Risk */}
        <div className="rounded-lg border bg-card p-5">
          <h3 className="text-sm font-semibold text-card-foreground">Churn Risk Breakdown</h3>
          <p className="mb-4 text-xs text-muted-foreground">How many customers are at risk of leaving?</p>
          <div className="h-48">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={churnData} cx="50%" cy="50%" outerRadius={70} dataKey="count" label={({ name, count }) => `${name}: ${count}`} labelLine={false}>
                  {churnData.map((entry, i) => (
                    <Cell key={i} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip formatter={(value: number) => [value, 'Customers']} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Payment Preferences */}
        <div className="rounded-lg border bg-card p-5">
          <h3 className="text-sm font-semibold text-card-foreground">Preferred Payment Methods</h3>
          <p className="mb-4 text-xs text-muted-foreground">Most used by registered customers</p>
          <div className="h-48">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={paymentPrefData}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(220, 13%, 90%)" />
                <XAxis dataKey="name" tick={{ fontSize: 9, fill: 'hsl(220, 10%, 46%)' }} />
                <YAxis tick={{ fontSize: 10, fill: 'hsl(220, 10%, 46%)' }} />
                <Tooltip formatter={(value: number) => [value, 'Customers']} />
                <Bar dataKey="value" radius={[4, 4, 0, 0]}>
                  {paymentPrefData.map((_, i) => (
                    <Cell key={i} fill={PAYMENT_COLORS[i % PAYMENT_COLORS.length]} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

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
                <th className="px-4 py-3 text-right font-medium">Avg Order</th>
                <th className="px-4 py-3 text-right font-medium">CLV</th>
                <th className="px-4 py-3 text-right font-medium">RFM</th>
                <th className="px-4 py-3 text-right font-medium">Churn Risk</th>
                <th className="px-4 py-3 text-center font-medium">Payment</th>
                <th className="px-4 py-3 text-center font-medium">Segment</th>
              </tr>
            </thead>
            <tbody>
              {customers.map((c) => (
                <tr key={c.id} className="border-b last:border-0 hover:bg-muted/50 transition-colors">
                  <td className="px-4 py-3 font-medium text-card-foreground">{c.name}</td>
                  <td className="px-4 py-3 text-right text-card-foreground">रू {c.totalSpend.toLocaleString()}</td>
                  <td className="px-4 py-3 text-right text-muted-foreground">{c.totalOrders}</td>
                  <td className="px-4 py-3 text-right text-muted-foreground">रू {c.avgOrderValue.toLocaleString()}</td>
                  <td className="px-4 py-3 text-right font-medium text-primary">रू {c.clv.toLocaleString()}</td>
                  <td className="px-4 py-3 text-right text-card-foreground">{c.rfmScore}</td>
                  <td className="px-4 py-3 text-right">
                    <span className={c.churnRisk > 0.5 ? 'text-destructive' : c.churnRisk > 0.2 ? 'text-warning' : 'text-success'}>
                      {(c.churnRisk * 100).toFixed(0)}%
                    </span>
                  </td>
                  <td className="px-4 py-3 text-center text-xs text-muted-foreground">{c.preferredPayment}</td>
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
