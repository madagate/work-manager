
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import CustomerFollowUp from "./pages/CustomerFollowUp";
import SupplierFollowUp from "./pages/SupplierFollowUp";
import SalesPage from "./pages/SalesPage";
import VouchersPage from "./pages/VouchersPage";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/customer-followup" element={<CustomerFollowUp />} />
          <Route path="/supplier-followup" element={<SupplierFollowUp />} />
          <Route path="/sales" element={<SalesPage />} />
          <Route path="/vouchers" element={<VouchersPage />} />
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
