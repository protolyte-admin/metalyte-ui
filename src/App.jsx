import {
    BrowserRouter,
    Routes,
    Route,
    Navigate
} from "react-router-dom";

import LoginPage from "./pages/LoginPage";
import InboxPage from "./pages/InboxPage";
import ContactsPage from "./pages/ContactsPage";
import ReportsPage from "./pages/ReportsPage";
import LogoutSuccess from "./pages/auth/LogoutSuccess";
import ProtectedRoute from "./components/auth/ProtectedRoute";
import PublicRoute from "./components/auth/PublicRoute";

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

                <Route
                    path="/logout"
                    element={<LogoutSuccess />}
                />

                <Route
                    path="/"
                    element={
                        <ProtectedRoute>
                            <InboxPage />
                        </ProtectedRoute>
                    }
                />

                <Route
                    path="/reports"
                    element={
                        <ProtectedRoute>
                            <ReportsPage />
                        </ProtectedRoute>
                    }
                />

                <Route
                    path="/contacts"
                    element={
                        <ProtectedRoute>
                            <ContactsPage />
                        </ProtectedRoute>
                    }
                />

                {/* Catch-all */}
                <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
        </BrowserRouter>
    );
}

export default App;
