
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "@/context/AuthContext";
import { ProtectedRoute } from "@/components/ProtectedRoute";
import { Layout } from "@/components/layout/Layout";
import { Login } from "@/pages/Login";
import { Dashboard } from "@/pages/Dashboard";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import Clients from "./pages/Clients";
import ClientDetails from "./pages/ClientDetails";
import ClientNew from "./pages/ClientNew";
import ClientEdit from "./pages/ClientEdit";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <AuthProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/" element={<Navigate to="/dashboard" replace />} />
            <Route
              path="/dashboard"
              element={
                <ProtectedRoute>
                  <Layout>
                    <Dashboard />
                  </Layout>
                </ProtectedRoute>
              }
            />
            <Route
              path="/clients"
              element={
                <ProtectedRoute>
                  <Layout>
                    <Clients />
                  </Layout>
                </ProtectedRoute>
              }
            />
            <Route
              path="/clients/new"
              element={
                <ProtectedRoute>
                  <Layout>
                    <ClientNew />
                  </Layout>
                </ProtectedRoute>
              }
            />
            <Route
              path="/clients/:id"
              element={
                <ProtectedRoute>
                  <Layout>
                    <ClientDetails />
                  </Layout>
                </ProtectedRoute>
              }
            />
            <Route
              path="/clients/:id/edit"
              element={
                <ProtectedRoute>
                  <Layout>
                    <ClientEdit />
                  </Layout>
                </ProtectedRoute>
              }
            />
            {/* Placeholder routes for future features */}
            <Route
              path="/appointments"
              element={
                <ProtectedRoute>
                  <Layout>
                    <div className="p-8">
                      <h1 className="text-2xl font-bold">Appointments</h1>
                      <p className="text-muted-foreground">Appointment scheduling coming soon...</p>
                    </div>
                  </Layout>
                </ProtectedRoute>
              }
            />
            <Route
              path="/telehealth"
              element={
                <ProtectedRoute>
                  <Layout>
                    <div className="p-8">
                      <h1 className="text-2xl font-bold">Telehealth</h1>
                      <p className="text-muted-foreground">Telehealth sessions coming soon...</p>
                    </div>
                  </Layout>
                </ProtectedRoute>
              }
            />
            <Route
              path="/documentation"
              element={
                <ProtectedRoute>
                  <Layout>
                    <div className="p-8">
                      <h1 className="text-2xl font-bold">Documentation</h1>
                      <p className="text-muted-foreground">Documentation tools coming soon...</p>
                    </div>
                  </Layout>
                </ProtectedRoute>
              }
            />
            <Route
              path="/billing"
              element={
                <ProtectedRoute>
                  <Layout>
                    <div className="p-8">
                      <h1 className="text-2xl font-bold">Billing</h1>
                      <p className="text-muted-foreground">Billing management coming soon...</p>
                    </div>
                  </Layout>
                </ProtectedRoute>
              }
            />
            <Route
              path="/reports"
              element={
                <ProtectedRoute>
                  <Layout>
                    <div className="p-8">
                      <h1 className="text-2xl font-bold">Reports</h1>
                      <p className="text-muted-foreground">Reports and analytics coming soon...</p>
                    </div>
                  </Layout>
                </ProtectedRoute>
              }
            />
            <Route
              path="/settings"
              element={
                <ProtectedRoute>
                  <Layout>
                    <div className="p-8">
                      <h1 className="text-2xl font-bold">Settings</h1>
                      <p className="text-muted-foreground">Settings and configuration coming soon...</p>
                    </div>
                  </Layout>
                </ProtectedRoute>
              }
            />
            {/* Keep the original index route as fallback */}
            <Route path="/welcome" element={<Index />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </AuthProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
