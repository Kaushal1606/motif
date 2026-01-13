import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
import { ProtectedRoute } from "@/components/ProtectedRoute";
import Index from "./pages/Index";
import Auth from "./pages/Auth";
import Dashboard from "./pages/Dashboard";
import Characters from "./pages/Characters";
import CharacterDetail from "./pages/CharacterDetail";
import CreateCharacter from "./pages/CreateCharacter";
import Scenes from "./pages/Scenes";
import CreateScene from "./pages/CreateScene";
import SceneDetail from "./pages/SceneDetail";
import Videos from "./pages/Videos";
import Pricing from "./pages/Pricing";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <AuthProvider>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/pricing" element={<Pricing />} />
            <Route path="/auth" element={<Auth />} />
            <Route
              path="/dashboard"
              element={
                <ProtectedRoute>
                  <Dashboard />
                </ProtectedRoute>
              }
            />
            <Route
              path="/characters"
              element={
                <ProtectedRoute>
                  <Characters />
                </ProtectedRoute>
              }
            />
            <Route
              path="/characters/new"
              element={
                <ProtectedRoute>
                  <CreateCharacter />
                </ProtectedRoute>
              }
            />
            <Route
              path="/characters/:id"
              element={
                <ProtectedRoute>
                  <CharacterDetail />
                </ProtectedRoute>
              }
            />
            <Route
              path="/scenes"
              element={
                <ProtectedRoute>
                  <Scenes />
                </ProtectedRoute>
              }
            />
            <Route
              path="/scenes/new"
              element={
                <ProtectedRoute>
                  <CreateScene />
                </ProtectedRoute>
              }
            />
            <Route
              path="/scenes/:id"
              element={
                <ProtectedRoute>
                  <SceneDetail />
                </ProtectedRoute>
              }
            />
            <Route
              path="/videos"
              element={
                <ProtectedRoute>
                  <Videos />
                </ProtectedRoute>
              }
            />
            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </AuthProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
