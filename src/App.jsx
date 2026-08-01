import {
  BrowserRouter,
  Routes,
  Route,
  Navigate,
} from 'react-router-dom';

import LoginPage from './pages/LoginPage';
import InboxPage from './pages/InboxPage';
import ContactsPage from './pages/ContactsPage';
import ReportsPage from './pages/ReportsPage';
import BillingPage from './pages/BillingPage';
import LogoutSuccess from './pages/auth/LogoutSuccess';
import ProtectedRoute from './components/auth/ProtectedRoute';
import PublicRoute from './components/auth/PublicRoute';
import AntdLayout from './layout/AntdLayout';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route
          path="/login"
          element={
            <PublicRoute>
              <LoginPage />
            </PublicRoute>
          }
        />

        <Route path="/logout" element={<LogoutSuccess />} />

        <Route
          element={
            <ProtectedRoute>
              <AntdLayout />
            </ProtectedRoute>
          }
        >
          <Route index element={<InboxPage />} />
          <Route path="reports" element={<ReportsPage />} />
          <Route path="contacts" element={<ContactsPage />} />
          <Route path="billing" element={<BillingPage />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
