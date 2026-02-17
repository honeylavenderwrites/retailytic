import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import AppLayout from "@/components/AppLayout";
import Dashboard from "@/pages/Dashboard";
import SalesBreakdown from "@/pages/SalesBreakdown";
import CustomerAnalytics from "@/pages/CustomerAnalytics";
import InventoryIntelligence from "@/pages/InventoryIntelligence";
import AnalyticsLab from "@/pages/AnalyticsLab";
import GoogleTrends from "@/pages/GoogleTrends";
import DataManagement from "@/pages/DataManagement";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<AppLayout><Dashboard /></AppLayout>} />
          <Route path="/sales" element={<AppLayout><SalesBreakdown /></AppLayout>} />
          <Route path="/customers" element={<AppLayout><CustomerAnalytics /></AppLayout>} />
          <Route path="/inventory" element={<AppLayout><InventoryIntelligence /></AppLayout>} />
          <Route path="/analytics" element={<AppLayout><AnalyticsLab /></AppLayout>} />
          <Route path="/trends" element={<AppLayout><GoogleTrends /></AppLayout>} />
          <Route path="/data" element={<AppLayout><DataManagement /></AppLayout>} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
