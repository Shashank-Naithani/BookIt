import { useEffect } from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { useDispatch } from "react-redux";
import { getCurrentUser } from "./services/auth.service";
import { setUser, clearUser } from "./store/slices/authSlice";

import ProtectedRoute from "./components/ProtectedRoute";
import PublicRoute from "./components/PublicRoute";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import LandingPage from "./pages/LandingPage";

// Bootstraps auth state by calling /auth/me on app load.
// If the cookie is valid the user is silently logged in; otherwise we clear state.
const AuthBootstrap = () => {
  const dispatch = useDispatch();

  const { data, isSuccess, isError, isLoading } = useQuery({
    queryKey: ["auth", "me"],
    queryFn: getCurrentUser,
    retry: false,           // don't retry on 401 — user is simply not logged in
    staleTime: Infinity,    // session is managed by the server cookie, not by staleness
  });

  useEffect(() => {
    if (isSuccess && !isLoading) {
      dispatch(setUser(data.data));
    }
    if (isError && !isLoading) {
      dispatch(clearUser());
    }
  }, [isSuccess, isError, data, dispatch]);

  return null;
};

const App = () => {
  return (
    <BrowserRouter>
      <AuthBootstrap />
      <Routes>
        {/* Public-only routes — redirect to / if already logged in */}
        <Route element={<PublicRoute />}>
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
        </Route>

        {/* Public landing page — handles auth state internally */}
        <Route path="/" element={<LandingPage />} />

        {/* Catch-all */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
};

export default App;