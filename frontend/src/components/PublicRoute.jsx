import { useSelector } from "react-redux";
import { Navigate, Outlet } from "react-router-dom";

// Allows access only when NOT authenticated — redirects to / if already logged in.
// Waits for the auth bootstrap to finish before making any decision.
const PublicRoute = () => {
  const { isAuthenticated, isInitializing } = useSelector((state) => state.auth);

  if (isInitializing) {
    return (
      <div className="min-h-screen bg-bg-app flex items-center justify-center">
        <svg className="animate-spin w-8 h-8 text-primary-600" fill="none" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z" />
        </svg>
      </div>
    );
  }

  return isAuthenticated ? <Navigate to="/" replace /> : <Outlet />;
};

export default PublicRoute;
