/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { AppLayout } from './features/layout/AppLayout';
import { POSScreen } from './features/pos/POSScreen';
import { KanbanScreen } from './features/kanban/KanbanScreen';
import { QCScreen } from './features/qc/QCScreen';
import { AdminScreen } from './features/admin/AdminScreen';
import { HistoryScreen } from './features/history/HistoryScreen';
import { ServicesScreen } from './features/services/ServicesScreen';
import { CustomersScreen } from './features/customers/CustomersScreen';
import { AuthProvider, useAuth } from './AuthProvider';
import { LoginScreen } from './LoginScreen';

const queryClient = new QueryClient();

function ProtectedApp() {
  const { user, loading } = useAuth();

  if (loading) {
    return <LoginScreen />;
  }

  if (!user) {
    return <LoginScreen />;
  }

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<AppLayout />}>
          <Route index element={<POSScreen />} />
          <Route path="kanban" element={<KanbanScreen />} />
          <Route path="qc" element={<QCScreen />} />
          <Route path="history" element={<HistoryScreen />} />
          <Route path="customers" element={<CustomersScreen />} />
          <Route path="services" element={<ServicesScreen />} />
          <Route path="admin" element={<AdminScreen />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <ProtectedApp />
      </AuthProvider>
    </QueryClientProvider>
  );
}
