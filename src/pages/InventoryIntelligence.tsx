import { useDataStore } from "@/store/dataStore";
import { AlertTriangle, CheckCircle, TrendingDown } from "lucide-react";
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell,
} from "recharts";

export default function InventoryIntelligence() {
  const { products, inventoryAlerts } = useDataStore();

  const abcData = [
    { class: 'A', count: products.filter(p => p.abcClass === 'A').length, color: 'hsl(173, 58%, 39%)' },
    { class: 'B', count: products.filter(p => p.abcClass === 'B').length, color: 'hsl(210, 76%, 52%)' },
    { class: 'C', count: products.filter(p => p.abcClass === 'C').length, color: 'hsl(220, 10%, 46%)' },
  ];

  const stockLevelData = products.map(p => ({
    name: p.productCode,
    stock: p.stockLevel,
    reorder: p.reorderPoint,
    healthy: p.stockLevel > p.reorderPoint,
  })).sort((a, b) => a.stock - b.stock);

  const deadStockProducts = [
    { code: 'OLD-112', name: 'Vintage Scarf', daysSinceLastSale: 92, stock: 45, estimatedLoss: 67500 },
    { code: 'OLD-88', name: 'Classic Belt', daysSinceLastSale: 78, stock: 30, estimatedLoss: 42000 },
    { code: 'OLD-205', name: 'Formal Clutch', daysSinceLastSale: 65, stock: 22, estimatedLoss: 38500 },
  ];

  const criticalCount = inventoryAlerts.filter(a => a.severity === 'critical').length;
  const warningCount = inventoryAlerts.filter(a => a.severity === 'warning').length;
  const healthyCount = products.length - criticalCount - warningCount;

  return (
    <div className="animate-slide-in space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Inventory Intelligence</h1>
        <p className="text-sm text-muted-foreground">Stock monitoring, ABC classification & dead stock analysis</p>
      </div>

      {/* Status Cards */}
      <div className="grid grid-cols-3 gap-4">
        <div className="flex items-center gap-4 rounded-lg border bg-card p-5">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-success/10">
            <CheckCircle className="h-5 w-5 text-success" />
          </div>
          <div>
            <p className="text-2xl font-bold text-card-foreground">{healthyCount}</p>
            <p className="text-xs text-muted-foreground">Healthy Stock</p>
          </div>
        </div>
        <div className="flex items-center gap-4 rounded-lg border bg-card p-5">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-warning/10">
            <AlertTriangle className="h-5 w-5 text-warning" />
          </div>
          <div>
            <p className="text-2xl font-bold text-card-foreground">{warningCount}</p>
            <p className="text-xs text-muted-foreground">Low Stock Warning</p>
          </div>
        </div>
        <div className="flex items-center gap-4 rounded-lg border bg-card p-5">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-destructive/10">
            <TrendingDown className="h-5 w-5 text-destructive" />
          </div>
          <div>
            <p className="text-2xl font-bold text-card-foreground">{criticalCount}</p>
            <p className="text-xs text-muted-foreground">Critical / Stockout Risk</p>
          </div>
        </div>
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        {/* Stock Levels */}
        <div className="rounded-lg border bg-card p-5">
          <h3 className="text-sm font-semibold text-card-foreground">Stock Levels vs Reorder Points</h3>
          <p className="mb-4 text-xs text-muted-foreground">Current inventory by product code</p>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={stockLevelData} layout="vertical">
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(220, 13%, 90%)" />
                <XAxis type="number" tick={{ fontSize: 10, fill: 'hsl(220, 10%, 46%)' }} />
                <YAxis type="category" dataKey="name" tick={{ fontSize: 10, fill: 'hsl(220, 10%, 46%)' }} width={50} />
                <Tooltip />
                <Bar dataKey="stock" radius={[0, 4, 4, 0]}>
                  {stockLevelData.map((entry, i) => (
                    <Cell key={i} fill={entry.healthy ? 'hsl(173, 58%, 39%)' : 'hsl(0, 72%, 51%)'} opacity={0.8} />
                  ))}
                </Bar>
                <Bar dataKey="reorder" fill="hsl(220, 13%, 90%)" radius={[0, 4, 4, 0]} opacity={0.5} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* ABC Classification */}
        <div className="rounded-lg border bg-card p-5">
          <h3 className="text-sm font-semibold text-card-foreground">ABC Classification</h3>
          <p className="mb-6 text-xs text-muted-foreground">Inventory value classification</p>
          <div className="space-y-6">
            {abcData.map((item) => (
              <div key={item.class}>
                <div className="mb-2 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="flex h-8 w-8 items-center justify-center rounded-full text-sm font-bold" style={{ background: `${item.color}20`, color: item.color }}>
                      {item.class}
                    </span>
                    <span className="text-sm font-medium text-card-foreground">
                      Class {item.class} — {item.class === 'A' ? 'High Value' : item.class === 'B' ? 'Medium Value' : 'Low Value'}
                    </span>
                  </div>
                  <span className="text-sm font-bold text-card-foreground">{item.count} SKUs</span>
                </div>
                <div className="h-2 rounded-full bg-muted">
                  <div className="h-2 rounded-full" style={{ width: `${(item.count / products.length) * 100}%`, background: item.color }} />
                </div>
              </div>
            ))}
          </div>

          <div className="mt-8">
            <h4 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Dead Stock Monitor</h4>
            <div className="mt-3 space-y-2">
              {deadStockProducts.map((d) => (
                <div key={d.code} className="flex items-center justify-between rounded-md border border-destructive/20 bg-destructive/5 px-3 py-2">
                  <div>
                    <p className="text-sm font-medium text-card-foreground">{d.name} <span className="font-mono text-xs text-muted-foreground">{d.code}</span></p>
                    <p className="text-xs text-muted-foreground">{d.daysSinceLastSale} days since last sale</p>
                  </div>
                  <p className="text-sm font-semibold text-destructive">रू {d.estimatedLoss.toLocaleString()}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
