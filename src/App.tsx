
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import { ProtectedRoute } from "./components/ProtectedRoute";
import { Layout } from "./components/layout/Layout";
import Index from "./pages/Index";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Dashboard from "./pages/Dashboard";
import Profile from "./pages/Profile";
import Clients from "./pages/Clients";
import ClientNew from "./pages/ClientNew";
import ClientEdit from "./pages/ClientEdit";
import ClientDetails from "./pages/ClientDetails";
import Appointments from "./pages/Appointments";
import AppointmentNew from "./pages/AppointmentNew";
import TelehealthSession from "./pages/TelehealthSession";
import AdminUserCreation from "./pages/AdminUserCreation";
import NotFound from "./pages/NotFound";

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
              <Route path="/admin/create-user" element={<AdminUserCreation />} />
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
              <Route path="/clients" element={
                <ProtectedRoute>
                  <Layout>
                    <Clients />
                  </Layout>
                </ProtectedRoute>
              } />
              <Route path="/clients/new" element={
                <ProtectedRoute>
                  <Layout>
                    <ClientNew />
                  </Layout>
                </ProtectedRoute>
              } />
              <Route path="/clients/:id/edit" element={
                <ProtectedRoute>
                  <Layout>
                    <ClientEdit />
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
              <Route path="/appointments" element={
                <ProtectedRoute>
                  <Layout>
                    <Appointments />
                  </Layout>
                </ProtectedRoute>
              } />
              <Route path="/appointments/new" element={
                <ProtectedRoute>
                  <Layout>
                    <AppointmentNew />
                  </Layout>
                </ProtectedRoute>
              } />
              <Route path="/telehealth/:appointmentId" element={
                <ProtectedRoute>
                  <TelehealthSession />
                </ProtectedRoute>
              } />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </AuthProvider>
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
