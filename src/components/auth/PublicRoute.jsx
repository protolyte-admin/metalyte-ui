import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "../../context/useAuth";

// Used for /login — if the user is already authenticated, send them to inbox
// instead of letting them see the login form again.
export default function PublicRoute({ children }) {
    const { isAuthenticated } = useAuth();
    const location = useLocation();
    const from = location.state?.from?.pathname || "/";

    if (isAuthenticated) {
        return <Navigate to={from} replace />;
    }
    return children;
}
