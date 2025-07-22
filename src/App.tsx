
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import { Layout } from "./components/layout/Layout";
import { ProtectedRoute } from "./components/ProtectedRoute";
import { RoleGuard } from "./components/RoleGuard";
import Index from "./pages/Index";
import { Login } from "./pages/Login";
import { Signup } from "./pages/Signup";
import { Dashboard } from "./pages/Dashboard";
import Appointments from "./pages/Appointments";
import AppointmentNew from "./pages/AppointmentNew";
import Clients from "./pages/Clients";
import ClientNew from "./pages/ClientNew";
import ClientEdit from "./pages/ClientEdit";
import ClientDetailsPage from "./pages/ClientDetails";
import { Profile } from "./pages/Profile";
import TelehealthSession from "./pages/TelehealthSession";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <AuthProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <Routes>
              <Route path="/" element={<Index />} />
              <Route path="/login" element={<Login />} />
              <Route path="/signup" element={<Signup />} />
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
                path="/appointments"
                element={
                  <ProtectedRoute>
                    <RoleGuard allowedRoles={['clinician']}>
                      <Layout>
                        <Appointments />
                      </Layout>
                    </RoleGuard>
                  </ProtectedRoute>
                }
              />
              <Route
                path="/appointments/new"
                element={
                  <ProtectedRoute>
                    <RoleGuard allowedRoles={['clinician']}>
                      <Layout>
                        <AppointmentNew />
                      </Layout>
                    </RoleGuard>
                  </ProtectedRoute>
                }
              />
              <Route
                path="/telehealth/:appointmentId"
                element={
                  <ProtectedRoute>
                    <Layout>
                      <TelehealthSession />
                    </Layout>
                  </ProtectedRoute>
                }
              />
              <Route
                path="/clients"
                element={
                  <ProtectedRoute>
                    <RoleGuard allowedRoles={['clinician']}>
                      <Layout>
                        <Clients />
                      </Layout>
                    </RoleGuard>
                  </ProtectedRoute>
                }
              />
              <Route
                path="/clients/new"
                element={
                  <ProtectedRoute>
                    <RoleGuard allowedRoles={['clinician']}>
                      <Layout>
                        <ClientNew />
                      </Layout>
                    </RoleGuard>
                  </ProtectedRoute>
                }
              />
              <Route
                path="/clients/:id/edit"
                element={
                  <ProtectedRoute>
                    <RoleGuard allowedRoles={['clinician']}>
                      <Layout>
                        <ClientEdit />
                      </Layout>
                    </RoleGuard>
                  </ProtectedRoute>
                }
              />
              <Route
                path="/clients/:id"
                element={
                  <ProtectedRoute>
                    <RoleGuard allowedRoles={['clinician']}>
                      <Layout>
                        <ClientDetailsPage />
                      </Layout>
                    </RoleGuard>
                  </ProtectedRoute>
                }
              />
              <Route
                path="/profile"
                element={
                  <ProtectedRoute>
                    <Layout>
                      <Profile />
                    </Layout>
                  </ProtectedRoute>
                }
              />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </BrowserRouter>
        </AuthProvider>
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
