import { create } from 'zustand';
import * as mock from '@/data/mockData';

interface MarketBasketRule {
  antecedent: string;
  consequent: string;
  confidence: number;
  support: number;
  lift: number;
}

interface AnalysisTexts {
  revenue: string;
  category: string;
  payment: string;
  customers: string;
  segmentation: string;
  forecast: string;
  basket: string;
  products: string;
}

interface DataState {
  dataSource: 'mock' | 'uploaded';
  kpiData: mock.KPI[];
  products: mock.Product[];
  customers: mock.Customer[];
  monthlySalesData: typeof mock.monthlySalesData;
  categoryBreakdown: typeof mock.categoryBreakdown;
  paymentMethods: typeof mock.paymentMethods;
  inventoryAlerts: typeof mock.inventoryAlerts;
  forecastData: typeof mock.forecastData;
  rfmSegments: typeof mock.rfmSegments;
  cohortData: typeof mock.cohortData;
  marketBasketRules: MarketBasketRule[];
  analysisTexts: AnalysisTexts | null;
  rawSummary: any;
  setAnalysisData: (data: any) => void;
  resetToMock: () => void;
}

export const useDataStore = create<DataState>((set) => ({
  dataSource: 'mock',
  kpiData: mock.kpiData,
  products: mock.products,
  customers: mock.customers,
  monthlySalesData: mock.monthlySalesData,
  categoryBreakdown: mock.categoryBreakdown,
  paymentMethods: mock.paymentMethods,
  inventoryAlerts: mock.inventoryAlerts,
  forecastData: mock.forecastData,
  rfmSegments: mock.rfmSegments,
  cohortData: mock.cohortData,
  marketBasketRules: [],
  analysisTexts: null,
  rawSummary: null,

  setAnalysisData: (data: any) => {
    set({
      dataSource: 'uploaded',
      kpiData: data.kpiData ?? mock.kpiData,
      products: data.products ?? mock.products,
      customers: data.customers ?? mock.customers,
      monthlySalesData: data.monthlySalesData ?? mock.monthlySalesData,
      categoryBreakdown: data.categoryBreakdown ?? mock.categoryBreakdown,
      paymentMethods: data.paymentMethods ?? mock.paymentMethods,
      inventoryAlerts: data.inventoryAlerts ?? mock.inventoryAlerts,
      forecastData: data.forecastData ?? mock.forecastData,
      rfmSegments: data.rfmSegments ?? mock.rfmSegments,
      cohortData: data.cohortData ?? mock.cohortData,
      marketBasketRules: data.marketBasketRules ?? [],
      analysisTexts: data.analysisTexts ?? null,
      rawSummary: data.summary ?? null,
    });
  },

  resetToMock: () => {
    set({
      dataSource: 'mock',
      kpiData: mock.kpiData,
      products: mock.products,
      customers: mock.customers,
      monthlySalesData: mock.monthlySalesData,
      categoryBreakdown: mock.categoryBreakdown,
      paymentMethods: mock.paymentMethods,
      inventoryAlerts: mock.inventoryAlerts,
      forecastData: mock.forecastData,
      rfmSegments: mock.rfmSegments,
      cohortData: mock.cohortData,
      marketBasketRules: [],
      analysisTexts: null,
      rawSummary: null,
    });
  },
}));
