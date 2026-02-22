// Mock data derived from Ambassador Designs sales book structure

export interface SalesTransaction {
  id: string;
  date: string;
  voucherNo: string;
  customerName: string;
  productName: string;
  productCode: string;
  transactionMode: string;
  quantity: number;
  rate: number;
  gross: number;
  discount: number;
  taxableAmt: number;
  vatAmt: number;
  netAmt: number;
  unit: string;
}

export interface Product {
  productCode: string;
  productName: string;
  category: string;
  totalQuantitySold: number;
  totalRevenue: number;
  totalProfit: number;
  avgPrice: number;
  stockLevel: number;
  reorderPoint: number;
  abcClass: 'A' | 'B' | 'C';
}

export interface Customer {
  id: string;
  name: string;
  totalSpend: number;
  totalOrders: number;
  avgOrderValue: number;
  lastPurchase: string;
  segment: 'VIP' | 'Loyal' | 'Regular' | 'At-Risk' | 'Lost';
  rfmScore: number;
  clv: number;
  churnRisk: number;
  preferredPayment?: string;
}

export interface KPI {
  label: string;
  value: string;
  change: number;
  trend: 'up' | 'down';
  icon: string;
}

export const kpiData: KPI[] = [
  { label: 'Total Revenue', value: 'रू 28,45,320', change: 12.4, trend: 'up', icon: 'revenue' },
  { label: 'Orders Processed', value: '1,247', change: 8.2, trend: 'up', icon: 'orders' },
  { label: 'Avg. Order Value', value: 'रू 2,281', change: -3.1, trend: 'down', icon: 'aov' },
  { label: 'Active Customers', value: '438', change: 15.7, trend: 'up', icon: 'customers' },
  { label: 'Inventory Turnover', value: '4.2x', change: 6.3, trend: 'up', icon: 'inventory' },
  { label: 'Gross Margin', value: '42.8%', change: 1.8, trend: 'up', icon: 'margin' },
];

export const products: Product[] = [
  { productCode: '9002', productName: 'Belt Half Pant', category: 'Bottoms', totalQuantitySold: 89, totalRevenue: 160645, totalProfit: 48193, avgPrice: 1805, stockLevel: 34, reorderPoint: 20, abcClass: 'A' },
  { productCode: '6112-2', productName: 'Silk Top', category: 'Tops', totalQuantitySold: 67, totalRevenue: 180805, totalProfit: 54241, avgPrice: 2699, stockLevel: 12, reorderPoint: 15, abcClass: 'A' },
  { productCode: '7415', productName: 'Pearls Bow T-Shirt', category: 'Tops', totalQuantitySold: 54, totalRevenue: 136194, totalProfit: 40858, avgPrice: 2522, stockLevel: 28, reorderPoint: 12, abcClass: 'A' },
  { productCode: '7612-1', productName: 'Belly Jeans', category: 'Bottoms', totalQuantitySold: 45, totalRevenue: 133128, totalProfit: 39938, avgPrice: 2958, stockLevel: 8, reorderPoint: 10, abcClass: 'B' },
  { productCode: '9806-2', productName: 'Shoes', category: 'Footwear', totalQuantitySold: 78, totalRevenue: 250290, totalProfit: 75087, avgPrice: 3209, stockLevel: 45, reorderPoint: 18, abcClass: 'A' },
  { productCode: '3831', productName: 'Shirt', category: 'Tops', totalQuantitySold: 62, totalRevenue: 172832, totalProfit: 51850, avgPrice: 2788, stockLevel: 22, reorderPoint: 14, abcClass: 'A' },
  { productCode: '72907', productName: 'Corset', category: 'Tops', totalQuantitySold: 31, totalRevenue: 81498, totalProfit: 24449, avgPrice: 2628, stockLevel: 5, reorderPoint: 8, abcClass: 'B' },
  { productCode: 'B591', productName: 'Top', category: 'Tops', totalQuantitySold: 28, totalRevenue: 66903, totalProfit: 20071, avgPrice: 2389, stockLevel: 19, reorderPoint: 7, abcClass: 'B' },
  { productCode: 'B-563', productName: 'Shoulder Wrap Top', category: 'Tops', totalQuantitySold: 22, totalRevenue: 50619, totalProfit: 15186, avgPrice: 2301, stockLevel: 3, reorderPoint: 6, abcClass: 'C' },
  { productCode: '15085', productName: 'Off Shoulder Top', category: 'Tops', totalQuantitySold: 41, totalRevenue: 102500, totalProfit: 30750, avgPrice: 2500, stockLevel: 15, reorderPoint: 10, abcClass: 'B' },
  { productCode: 'T15', productName: 'One Sided Top', category: 'Tops', totalQuantitySold: 19, totalRevenue: 50274, totalProfit: 15082, avgPrice: 2646, stockLevel: 11, reorderPoint: 5, abcClass: 'C' },
  { productCode: 'F30', productName: 'Halter Top', category: 'Tops', totalQuantitySold: 35, totalRevenue: 85487, totalProfit: 25646, avgPrice: 2442, stockLevel: 7, reorderPoint: 8, abcClass: 'B' },
  { productCode: '6602', productName: 'Shoes (Casual)', category: 'Footwear', totalQuantitySold: 52, totalRevenue: 145186, totalProfit: 43556, avgPrice: 2792, stockLevel: 30, reorderPoint: 12, abcClass: 'A' },
  { productCode: 'V-8', productName: 'Slipper', category: 'Footwear', totalQuantitySold: 25, totalRevenue: 88009, totalProfit: 26403, avgPrice: 3520, stockLevel: 18, reorderPoint: 6, abcClass: 'B' },
  { productCode: '2566-9', productName: 'Shoes (Formal)', category: 'Footwear', totalQuantitySold: 38, totalRevenue: 114000, totalProfit: 34200, avgPrice: 3000, stockLevel: 25, reorderPoint: 9, abcClass: 'B' },
];

export const customers: Customer[] = [
  { id: 'C001', name: 'Anusmriti', totalSpend: 45230, totalOrders: 12, avgOrderValue: 3769, lastPurchase: '2026-02-08', segment: 'VIP', rfmScore: 92, clv: 135690, churnRisk: 0.05 },
  { id: 'C002', name: 'Shruti', totalSpend: 38450, totalOrders: 10, avgOrderValue: 3845, lastPurchase: '2026-02-05', segment: 'VIP', rfmScore: 88, clv: 115350, churnRisk: 0.08 },
  { id: 'C003', name: 'Pratisara', totalSpend: 28900, totalOrders: 8, avgOrderValue: 3613, lastPurchase: '2026-01-28', segment: 'Loyal', rfmScore: 76, clv: 86700, churnRisk: 0.12 },
  { id: 'C004', name: 'Anupama', totalSpend: 22100, totalOrders: 6, avgOrderValue: 3683, lastPurchase: '2026-01-15', segment: 'Loyal', rfmScore: 68, clv: 66300, churnRisk: 0.18 },
  { id: 'C005', name: 'Goma Poudel', totalSpend: 18750, totalOrders: 5, avgOrderValue: 3750, lastPurchase: '2026-01-20', segment: 'Regular', rfmScore: 55, clv: 56250, churnRisk: 0.25 },
  { id: 'C006', name: 'Sujata Thapa', totalSpend: 15200, totalOrders: 4, avgOrderValue: 3800, lastPurchase: '2025-12-10', segment: 'At-Risk', rfmScore: 38, clv: 45600, churnRisk: 0.55 },
  { id: 'C007', name: 'Binita Shrestha', totalSpend: 12800, totalOrders: 4, avgOrderValue: 3200, lastPurchase: '2025-11-20', segment: 'At-Risk', rfmScore: 32, clv: 38400, churnRisk: 0.62 },
  { id: 'C008', name: 'Manisha KC', totalSpend: 8900, totalOrders: 2, avgOrderValue: 4450, lastPurchase: '2025-10-05', segment: 'Lost', rfmScore: 18, clv: 26700, churnRisk: 0.85 },
  { id: 'C009', name: 'Roshani Adhikari', totalSpend: 31200, totalOrders: 9, avgOrderValue: 3467, lastPurchase: '2026-02-10', segment: 'VIP', rfmScore: 85, clv: 93600, churnRisk: 0.06 },
  { id: 'C010', name: 'Nisha Gurung', totalSpend: 19800, totalOrders: 6, avgOrderValue: 3300, lastPurchase: '2026-01-22', segment: 'Regular', rfmScore: 52, clv: 59400, churnRisk: 0.28 },
];

export const monthlySalesData = [
  { month: 'Aug 2025', revenue: 385420, orders: 168, avgOrder: 2294 },
  { month: 'Sep 2025', revenue: 412350, orders: 185, avgOrder: 2229 },
  { month: 'Oct 2025', revenue: 398700, orders: 172, avgOrder: 2318 },
  { month: 'Nov 2025', revenue: 445200, orders: 198, avgOrder: 2249 },
  { month: 'Dec 2025', revenue: 528900, orders: 245, avgOrder: 2159 },
  { month: 'Jan 2026', revenue: 378400, orders: 162, avgOrder: 2336 },
  { month: 'Feb 2026', revenue: 296350, orders: 117, avgOrder: 2533 },
];

export const categoryBreakdown = [
  { name: 'Tops', value: 45, revenue: 748113 },
  { name: 'Bottoms', value: 22, revenue: 293773 },
  { name: 'Footwear', value: 28, revenue: 597485 },
  { name: 'Accessories', value: 5, revenue: 85230 },
];

export const paymentMethods = [
  { method: 'Cash', percentage: 38, amount: 1081222 },
  { method: 'FonePay', percentage: 42, amount: 1195035 },
  { method: 'Credit Card', percentage: 15, amount: 426798 },
  { method: 'Other', percentage: 5, amount: 142266 },
];

export const inventoryAlerts = [
  { productCode: 'B-563', productName: 'Shoulder Wrap Top', stockLevel: 3, reorderPoint: 6, daysUntilStockout: 4, severity: 'critical' as const },
  { productCode: '72907', productName: 'Corset', stockLevel: 5, reorderPoint: 8, daysUntilStockout: 7, severity: 'critical' as const },
  { productCode: 'F30', productName: 'Halter Top', stockLevel: 7, reorderPoint: 8, daysUntilStockout: 10, severity: 'warning' as const },
  { productCode: '7612-1', productName: 'Belly Jeans', stockLevel: 8, reorderPoint: 10, daysUntilStockout: 12, severity: 'warning' as const },
  { productCode: '6112-2', productName: 'Silk Top', stockLevel: 12, reorderPoint: 15, daysUntilStockout: 15, severity: 'warning' as const },
];

export const forecastData = [
  { month: 'Mar 2026', predicted: 342000, lower: 298000, upper: 386000 },
  { month: 'Apr 2026', predicted: 378000, lower: 325000, upper: 431000 },
  { month: 'May 2026', predicted: 395000, lower: 338000, upper: 452000 },
  { month: 'Jun 2026', predicted: 412000, lower: 350000, upper: 474000 },
];

export const rfmSegments = [
  { segment: 'Champions', count: 42, percentage: 9.6, avgSpend: 48500 },
  { segment: 'Loyal', count: 78, percentage: 17.8, avgSpend: 32100 },
  { segment: 'Potential', count: 95, percentage: 21.7, avgSpend: 18900 },
  { segment: 'New Customers', count: 68, percentage: 15.5, avgSpend: 8200 },
  { segment: 'At Risk', count: 85, percentage: 19.4, avgSpend: 14300 },
  { segment: 'Lost', count: 70, percentage: 16.0, avgSpend: 6800 },
];

export const cohortData = [
  { cohort: 'Aug 2025', m0: 100, m1: 62, m2: 48, m3: 35, m4: 28, m5: 22, m6: 18 },
  { cohort: 'Sep 2025', m0: 100, m1: 58, m2: 45, m3: 32, m4: 25, m5: 20, m6: null },
  { cohort: 'Oct 2025', m0: 100, m1: 65, m2: 50, m3: 38, m4: 30, m5: null, m6: null },
  { cohort: 'Nov 2025', m0: 100, m1: 70, m2: 55, m3: 42, m4: null, m5: null, m6: null },
  { cohort: 'Dec 2025', m0: 100, m1: 72, m2: 58, m3: null, m4: null, m5: null, m6: null },
  { cohort: 'Jan 2026', m0: 100, m1: 60, m2: null, m3: null, m4: null, m5: null, m6: null },
  { cohort: 'Feb 2026', m0: 100, m1: null, m2: null, m3: null, m4: null, m5: null, m6: null },
];
