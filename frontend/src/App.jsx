import { useEffect } from "react";
import { BrowserRouter, Routes, Route, Navigate, Outlet } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { useDispatch } from "react-redux";
import { getCurrentUser } from "./services/auth.service";
import { setUser, clearUser } from "./store/slices/authSlice";

import Navbar from "./components/Navbar";
import ProtectedRoute from "./components/ProtectedRoute";
import PublicRoute from "./components/PublicRoute";
import OrganizerRoute from "./components/OrganizerRoute";
import Spinner from "./components/Spinner";

import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import LandingPage from "./pages/LandingPage";
import EventsPage from "./pages/EventsPage";
import EventDetailPage from "./pages/EventDetailPage";
import OrganizerDashboard from "./pages/OrganizerDashboard";
import MyBookingsPage from "./pages/MyBookingsPage";
import { useSelector } from "react-redux";

// Bootstraps auth state by calling /auth/me on app load.
// If the cookie is valid the user is silently logged in; otherwise we clear state.
const AuthBootstrap = () => {
  const dispatch = useDispatch();

  const { data, isSuccess, isError, isLoading } = useQuery({
    queryKey: ["auth", "me"],
    queryFn: getCurrentUser,
    retry: false,        // don't retry on 401 — user is simply not logged in
    staleTime: Infinity, // session is managed by the server cookie, not by staleness
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

// Full-page loading spinner shown while /auth/me is resolving
const AppLoader = () => {
  const { isInitializing } = useSelector((state) => state.auth);
  if (!isInitializing) return null;
  return (
    <div className="fixed inset-0 z-[100] bg-bg-app flex items-center justify-center">
      <Spinner size="lg" />
    </div>
  );
};

// Layout wrapper — renders Navbar above the current route's page
const MainLayout = () => (
  <div className="min-h-screen bg-bg-app flex flex-col">
    <Navbar />
    <main className="flex-1">
      <Outlet />
    </main>
  </div>
);

const App = () => {
  return (
    <BrowserRouter>
      <AuthBootstrap />
      <AppLoader />
      <Routes>
        {/* Auth-only pages — no navbar, redirect to / if already logged in */}
        <Route element={<PublicRoute />}>
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
        </Route>

        {/* All pages that share the Navbar layout */}
        <Route element={<MainLayout />}>
          {/* Public pages */}
          <Route path="/" element={<LandingPage />} />
          <Route path="/events" element={<EventsPage />} />
          <Route path="/events/:id" element={<EventDetailPage />} />

          {/* Authenticated user pages */}
          <Route element={<ProtectedRoute />}>
            <Route path="/my-bookings" element={<MyBookingsPage />} />
          </Route>

          {/* Organizer-only pages */}
          <Route element={<OrganizerRoute />}>
            <Route path="/organizer" element={<OrganizerDashboard />} />
          </Route>
        </Route>

        {/* Catch-all */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
};

export default App;