
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import Dashboard from "./pages/Dashboard";
import IdeaDetail from "./pages/IdeaDetail";
import NewIdea from "./pages/NewIdea";
import EditIdea from "./pages/EditIdea";
import Ideas from "./pages/Ideas";
import NotFound from "./pages/NotFound";
import Auth from "./pages/Auth";
import { AuthProvider } from "./contexts/AuthContext";
import AuthGuard from "./components/auth/AuthGuard";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/auth" element={<Auth />} />
            <Route path="/dashboard" element={
              <AuthGuard>
                <Dashboard />
              </AuthGuard>
            } />
            <Route path="/idea/:id" element={
              <AuthGuard>
                <IdeaDetail />
              </AuthGuard>
            } />
            <Route path="/edit/:id" element={
              <AuthGuard>
                <EditIdea />
              </AuthGuard>
            } />
            <Route path="/new" element={
              <AuthGuard>
                <NewIdea />
              </AuthGuard>
            } />
            <Route path="/ideas" element={
              <AuthGuard>
                <Ideas />
              </AuthGuard>
            } />
            {/* 请在上面的通配符 "*" 路由之前添加所有自定义路由 */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
