import { useSelector } from "react-redux";
import { Navigate, Outlet } from "react-router-dom";

// Allows access only when authenticated — redirects to /login otherwise
const ProtectedRoute = () => {
  const { isAuthenticated } = useSelector((state) => state.auth);

  return isAuthenticated ? <Outlet /> : <Navigate to="/login" replace />;
};

export default ProtectedRoute;
