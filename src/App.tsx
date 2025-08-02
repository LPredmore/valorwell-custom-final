
import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { AuthProvider } from '@/context/AuthContext';
import { Toaster } from '@/components/ui/toaster';
import { Layout } from '@/components/layout/Layout';
import { ProtectedRoute } from '@/components/ProtectedRoute';
import { RoleGuard } from '@/components/RoleGuard';
import { ErrorBoundary } from '@/components/ErrorBoundary';

// Page imports
import Index from '@/pages/Index';
import { Login } from '@/pages/Login';
import { Signup } from '@/pages/Signup';
import { Dashboard } from '@/pages/Dashboard';
import Clients from '@/pages/Clients';
import ClientDetails from '@/pages/ClientDetails';
import Calendar from '@/pages/Calendar';
import { Profile } from '@/pages/Profile';
import { ClinicianProfile } from '@/pages/ClinicianProfile';
import Settings from '@/pages/Settings';
import NotFound from '@/pages/NotFound';
import { SessionDocumentation } from '@/pages/SessionDocumentation';
import { AddClientInfo } from '@/pages/AddClientInfo';
import ClientDashboard from '@/pages/ClientDashboard';

// Template page imports
import { TemplatesPage } from '@/features/templates/pages/TemplatesPage';
import { CreateTemplatePage } from '@/features/templates/pages/CreateTemplatePage';
import { EditTemplatePage } from '@/features/templates/pages/EditTemplatePage';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
});

function App() {
  return (
    <ErrorBoundary context="App Root">
      <QueryClientProvider client={queryClient}>
        <AuthProvider>
          <BrowserRouter>
            <Toaster />
            <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
            <Route path="/add-client-info" element={
              <ProtectedRoute>
                <AddClientInfo />
              </ProtectedRoute>
            } />
            
            <Route path="/" element={
              <ProtectedRoute>
                <Layout>
                  <Index />
                </Layout>
              </ProtectedRoute>
            } />
            
            <Route path="/dashboard" element={
              <ProtectedRoute>
                <Layout>
                  <Dashboard />
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
            
            <Route path="/clients/:id" element={
              <ProtectedRoute>
                <Layout>
                  <ClientDetails />
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
            
            <Route path="/templates" element={
              <ProtectedRoute>
                <RoleGuard allowedRoles={['clinician', 'admin']}>
                  <Layout>
                    <TemplatesPage />
                  </Layout>
                </RoleGuard>
              </ProtectedRoute>
            } />
            
            <Route path="/templates/create" element={
              <ProtectedRoute>
                <RoleGuard allowedRoles={['clinician', 'admin']}>
                  <Layout>
                    <CreateTemplatePage />
                  </Layout>
                </RoleGuard>
              </ProtectedRoute>
            } />
            
            <Route path="/templates/:id/edit" element={
              <ProtectedRoute>
                <RoleGuard allowedRoles={['clinician', 'admin']}>
                  <Layout>
                    <EditTemplatePage />
                  </Layout>
                </RoleGuard>
              </ProtectedRoute>
            } />

            <Route path="/templates/session-documentation" element={
              <ProtectedRoute>
                <RoleGuard allowedRoles={['clinician', 'admin']}>
                  <Layout>
                    <SessionDocumentation />
                  </Layout>
                </RoleGuard>
              </ProtectedRoute>
            } />
            
            <Route path="/profile" element={
              <ProtectedRoute>
                <Layout>
                  <Profile />
                </Layout>
              </ProtectedRoute>
            } />
            
            <Route path="/clinician-profile" element={
              <ProtectedRoute>
                <RoleGuard allowedRoles={['clinician', 'admin']}>
                  <Layout>
                    <ClinicianProfile />
                  </Layout>
                </RoleGuard>
              </ProtectedRoute>
            } />
            
            <Route path="/settings" element={
              <ProtectedRoute>
                <Layout>
                  <Settings />
                </Layout>
              </ProtectedRoute>
            } />

            <Route path="/client-dashboard" element={
              <ProtectedRoute>
                <RoleGuard allowedRoles={['client']}>
                  <ClientDashboard />
                </RoleGuard>
              </ProtectedRoute>
            } />
            
            <Route path="*" element={<NotFound />} />
            </Routes>
          </BrowserRouter>
        </AuthProvider>
      </QueryClientProvider>
    </ErrorBoundary>
  );
}

export default App;
