import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { Navigation } from "./components/Navigation";
import { useDevToolsProtection } from "./hooks/useDevToolsProtection";
import Index from "./pages/Index";
import Channels from "./pages/Channels";
import Movies from "./pages/Movies";
import TVSeries from "./pages/TVSeries";
import Comments from "./pages/Comments";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => {
  useDevToolsProtection();
  
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Navigation />
          <Routes>
            <Route path="/" element={<Index />} />
            <Route index element={<Index />} />
            <Route path="/channels" element={<Channels />} />
            <Route path="/movies" element={<Movies />} />
            <Route path="/tv-series" element={<TVSeries />} />
            <Route path="/comments" element={<Comments />} />
            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;
