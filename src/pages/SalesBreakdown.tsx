import { useDataStore } from "@/store/dataStore";
import { useState } from "react";
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
} from "recharts";
import { Search, ArrowUpDown, FileText } from "lucide-react";
import EmptyDataState from "@/components/EmptyDataState";

export default function SalesBreakdown() {
  const { products, dataSource, analysisTexts } = useDataStore();
  const [search, setSearch] = useState("");
  const [sortKey, setSortKey] = useState<'totalRevenue' | 'totalQuantitySold'>('totalRevenue');

  const filtered = products
    .filter((p) =>
      p.productName.toLowerCase().includes(search.toLowerCase()) ||
      p.productCode.toLowerCase().includes(search.toLowerCase())
    )
    .sort((a, b) => b[sortKey] - a[sortKey]);

  // Top 15 products bar chart data
  const topProductsData = [...products]
    .sort((a, b) => b.totalRevenue - a.totalRevenue)
    .slice(0, 15)
    .map(p => ({
      name: p.productName.length > 15 ? p.productName.slice(0, 15) + '…' : p.productName,
      revenue: p.totalRevenue,
      quantity: p.totalQuantitySold,
    }));

  if (dataSource === 'mock') {
    return (
      <div className="animate-slide-in space-y-6">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Sales Breakdown</h1>
          <p className="text-sm text-muted-foreground">Product-code-wise revenue, quantity & profitability</p>
        </div>
        <EmptyDataState title="No Sales Data" description="Upload your sales file to see product-level revenue and ABC classification." />
      </div>
    );
  }

  return (
    <div className="animate-slide-in space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Sales Breakdown</h1>
        <p className="text-sm text-muted-foreground">Product-code-wise revenue, quantity & profitability</p>
      </div>

      {/* Top Products Chart */}
      <div className="rounded-lg border bg-card p-5">
        <h3 className="text-sm font-semibold text-card-foreground">Top Products by Revenue</h3>
        <p className="mb-4 text-xs text-muted-foreground">Top 15 revenue-generating products</p>
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={topProductsData} layout="vertical">
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(220, 13%, 90%)" />
              <XAxis type="number" tick={{ fontSize: 10, fill: 'hsl(220, 10%, 46%)' }} tickFormatter={(v) => `${(v / 1000).toFixed(0)}K`} />
              <YAxis type="category" dataKey="name" tick={{ fontSize: 10, fill: 'hsl(220, 10%, 46%)' }} width={120} />
              <Tooltip formatter={(value: number, name: string) => [
                name === 'revenue' ? `रू ${value.toLocaleString()}` : value,
                name === 'revenue' ? 'Revenue' : 'Quantity'
              ]} />
              <Bar dataKey="revenue" fill="hsl(173, 58%, 39%)" radius={[0, 4, 4, 0]} opacity={0.85} />
            </BarChart>
          </ResponsiveContainer>
        </div>
        {analysisTexts?.products && (
          <div className="mt-4 rounded-md bg-muted/50 p-3 flex gap-2">
            <FileText className="h-4 w-4 text-primary shrink-0 mt-0.5" />
            <p className="text-xs text-muted-foreground leading-relaxed">{analysisTexts.products}</p>
          </div>
        )}
      </div>

      {/* Product Table */}
      <div className="rounded-lg border bg-card">
        <div className="flex items-center gap-3 border-b p-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <input
              type="text"
              placeholder="Search by product name or code..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full rounded-md border bg-background py-2 pl-9 pr-4 text-sm outline-none focus:ring-1 focus:ring-ring"
            />
          </div>
          <button
            onClick={() => setSortKey(sortKey === 'totalRevenue' ? 'totalQuantitySold' : 'totalRevenue')}
            className="flex items-center gap-1.5 rounded-md border bg-background px-3 py-2 text-xs font-medium text-muted-foreground hover:text-foreground"
          >
            <ArrowUpDown className="h-3.5 w-3.5" />
            {sortKey === 'totalRevenue' ? 'By Revenue' : 'By Quantity'}
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b text-xs uppercase text-muted-foreground">
                <th className="px-4 py-3 text-left font-medium">Code</th>
                <th className="px-4 py-3 text-left font-medium">Product</th>
                <th className="px-4 py-3 text-left font-medium">Category</th>
                <th className="px-4 py-3 text-right font-medium">Qty Sold</th>
                <th className="px-4 py-3 text-right font-medium">Revenue</th>
                <th className="px-4 py-3 text-right font-medium">Profit</th>
                <th className="px-4 py-3 text-right font-medium">Avg Price</th>
                <th className="px-4 py-3 text-center font-medium">ABC</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((p) => (
                <tr key={p.productCode} className="border-b last:border-0 hover:bg-muted/50 transition-colors">
                  <td className="px-4 py-3 font-mono text-xs font-medium text-primary">{p.productCode}</td>
                  <td className="px-4 py-3 font-medium text-card-foreground">{p.productName}</td>
                  <td className="px-4 py-3 text-muted-foreground">{p.category}</td>
                  <td className="px-4 py-3 text-right text-card-foreground">{p.totalQuantitySold}</td>
                  <td className="px-4 py-3 text-right font-medium text-card-foreground">रू {p.totalRevenue.toLocaleString()}</td>
                  <td className="px-4 py-3 text-right text-success">रू {p.totalProfit.toLocaleString()}</td>
                  <td className="px-4 py-3 text-right text-muted-foreground">रू {p.avgPrice.toLocaleString()}</td>
                  <td className="px-4 py-3 text-center">
                    <span className={`inline-flex h-6 w-6 items-center justify-center rounded-full text-xs font-bold ${
                      p.abcClass === 'A' ? 'bg-primary/15 text-primary' :
                      p.abcClass === 'B' ? 'bg-info/15 text-info' :
                      'bg-muted text-muted-foreground'
                    }`}>
                      {p.abcClass}
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
