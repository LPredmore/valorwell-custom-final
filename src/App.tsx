
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import { ProtectedRoute } from "./components/ProtectedRoute";
import { Layout } from "./components/layout/Layout";
import Index from "./pages/Index";
import { Login } from "./pages/Login";
import { Signup } from "./pages/Signup";
import { Dashboard } from "./pages/Dashboard";
import { Profile } from "./pages/Profile";
import { ClinicianProfile } from "./pages/ClinicianProfile";
import Calendar from "./pages/Calendar";
import Clients from "./pages/Clients";
import ClientDetails from "./pages/ClientDetails";
import Settings from "./pages/Settings";
import NotFound from "./pages/NotFound";
import NylasCallback from "./pages/NylasCallback";
import { TemplatesPage } from "./features/templates/pages/TemplatesPage";
import { CreateTemplatePage } from "./features/templates/pages/CreateTemplatePage";
import { EditTemplatePage } from "./features/templates/pages/EditTemplatePage";

const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <AuthProvider>
            <Routes>
              <Route path="/" element={<Index />} />
              <Route path="/login" element={<Login />} />
              <Route path="/signup" element={<Signup />} />
              <Route path="/dashboard" element={
                <ProtectedRoute>
                  <Layout>
                    <Dashboard />
                  </Layout>
                </ProtectedRoute>
              } />
              <Route path="/profile" element={
                <ProtectedRoute>
                  <Layout>
                    <Profile />
                  </Layout>
                </ProtectedRoute>
              } />
              <Route path="/clinicianprof" element={
                <ProtectedRoute>
                  <Layout>
                    <ClinicianProfile />
                  </Layout>
                </ProtectedRoute>
              } />
              <Route path="/calendar" element={
                <ProtectedRoute>
                  <Layout>
                    <Calendar />
                  </Layout>
                </ProtectedRoute>
              } />
              <Route path="/myclients" element={
                <ProtectedRoute>
                  <Layout>
                    <Clients />
                  </Layout>
                </ProtectedRoute>
              } />
              <Route path="/clients/:id" element={
                <ProtectedRoute>
                  <Layout>
                    <ClientDetails />
                  </Layout>
                </ProtectedRoute>
              } />
              <Route path="/settings" element={
                <ProtectedRoute>
                  <Layout>
                    <Settings />
                  </Layout>
                </ProtectedRoute>
              } />
              <Route path="/templates" element={
                <ProtectedRoute>
                  <Layout>
                    <TemplatesPage />
                  </Layout>
                </ProtectedRoute>
              } />
              <Route path="/templates/create" element={
                <ProtectedRoute>
                  <Layout>
                    <CreateTemplatePage />
                  </Layout>
                </ProtectedRoute>
              } />
              <Route path="/templates/edit/:id" element={
                <ProtectedRoute>
                  <Layout>
                    <EditTemplatePage />
                  </Layout>
                </ProtectedRoute>
              } />
              <Route path="/nylas/callback" element={<NylasCallback />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </AuthProvider>
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
