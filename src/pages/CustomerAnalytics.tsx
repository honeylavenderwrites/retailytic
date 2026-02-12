import { useDataStore } from "@/store/dataStore";
import {
  ScatterChart, Scatter, XAxis, YAxis, ZAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell,
} from "recharts";

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
  const { customers, rfmSegments, cohortData } = useDataStore();

  const clusterData = customers.map((c) => ({
    name: c.name,
    x: c.totalOrders,
    y: c.avgOrderValue,
    z: c.totalSpend / 100,
    segment: c.segment,
  }));

  return (
    <div className="animate-slide-in space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Customer Analytics</h1>
        <p className="text-sm text-muted-foreground">Segmentation, lifetime value & churn intelligence</p>
      </div>

      {/* RFM Segments */}
      <div className="grid gap-4 lg:grid-cols-6">
        {rfmSegments.map((seg) => (
          <div key={seg.segment} className="rounded-lg border bg-card p-4">
            <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">{seg.segment}</p>
            <p className="mt-1 text-xl font-bold text-card-foreground">{seg.count}</p>
            <p className="text-xs text-muted-foreground">{seg.percentage}% of base</p>
            <p className="mt-1 text-xs text-primary">Avg रू {seg.avgSpend.toLocaleString()}</p>
          </div>
        ))}
      </div>

      {/* Cluster Scatter */}
      <div className="rounded-lg border bg-card p-5">
        <h3 className="text-sm font-semibold text-card-foreground">Customer Segmentation Scatter</h3>
        <p className="mb-4 text-xs text-muted-foreground">Orders vs. Avg Order Value — sized by total spend</p>
        <div className="h-72">
          <ResponsiveContainer width="100%" height="100%">
            <ScatterChart>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(220, 13%, 90%)" />
              <XAxis dataKey="x" name="Orders" tick={{ fontSize: 11, fill: 'hsl(220, 10%, 46%)' }} label={{ value: 'Total Orders', position: 'bottom', fontSize: 11, fill: 'hsl(220, 10%, 46%)' }} />
              <YAxis dataKey="y" name="AOV" tick={{ fontSize: 11, fill: 'hsl(220, 10%, 46%)' }} label={{ value: 'Avg Order Value', angle: -90, position: 'insideLeft', fontSize: 11, fill: 'hsl(220, 10%, 46%)' }} />
              <ZAxis dataKey="z" range={[40, 300]} />
              <Tooltip
                formatter={(value: number, name: string) => [
                  name === 'AOV' ? `रू ${value.toLocaleString()}` : value,
                  name === 'x' ? 'Orders' : 'AOV'
                ]}
                labelFormatter={(_, payload) => payload?.[0]?.payload?.name || ''}
              />
              <Scatter data={clusterData}>
                {clusterData.map((entry, i) => (
                  <Cell key={i} fill={SEGMENT_COLORS[entry.segment] || 'hsl(220, 10%, 46%)'} opacity={0.8} />
                ))}
              </Scatter>
            </ScatterChart>
          </ResponsiveContainer>
        </div>
        <div className="mt-3 flex flex-wrap gap-3">
          {Object.entries(SEGMENT_COLORS).map(([seg, color]) => (
            <div key={seg} className="flex items-center gap-1.5 text-xs text-muted-foreground">
              <div className="h-2.5 w-2.5 rounded-full" style={{ background: color }} />
              {seg}
            </div>
          ))}
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
