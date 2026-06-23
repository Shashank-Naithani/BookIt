import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { useLogout } from "../hooks/useAuth";

const LandingPage = () => {
  const { user, isAuthenticated, isInitializing } = useSelector((state) => state.auth);
  const { mutate: logout, isPending } = useLogout();

  // Wait for the /auth/me bootstrap to finish before rendering
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

  return (
    <div className="min-h-screen bg-bg-app flex flex-col items-center justify-center gap-6">
      <div className="bg-surface-base rounded-2xl border border-border-light shadow-sm px-10 py-8 flex flex-col items-center gap-4 text-center">

        {/* Brand icon */}
        <div className="w-14 h-14 rounded-2xl bg-primary-600 flex items-center justify-center shadow-lg">
          <svg className="w-8 h-8 text-text-inverse" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M16 4H8a2 2 0 00-2 2v14l4-2 4 2V6a2 2 0 00-2-2z" />
          </svg>
        </div>

        <div>
          <h1 className="text-2xl font-bold text-text-heading tracking-tight">BookIt</h1>
          <p className="text-text-muted text-sm mt-1">Discover and book events near you</p>
        </div>

        {isAuthenticated ? (
          /* ── Logged-in state ── */
          <>
            <div className="flex flex-col items-center gap-1">
              <div className="w-12 h-12 rounded-full bg-primary-50 flex items-center justify-center text-xl font-bold text-primary-600">
                {user?.name?.charAt(0).toUpperCase() ?? "?"}
              </div>
              <p className="text-text-body font-semibold mt-1">{user?.name}</p>
              <span className="text-xs font-medium px-2.5 py-1 rounded-full bg-secondary-50 text-secondary-700">
                {user?.role}
              </span>
            </div>

            <button
              id="logout-btn"
              onClick={() => logout()}
              disabled={isPending}
              className="flex items-center gap-2 px-5 py-2 rounded-lg border border-border-base text-text-body text-sm font-medium hover:bg-surface-muted transition disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {isPending ? (
                <>
                  <svg className="animate-spin w-4 h-4" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z" />
                  </svg>
                  Logging out…
                </>
              ) : (
                <>
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a2 2 0 01-2 2H5a2 2 0 01-2-2V7a2 2 0 012-2h6a2 2 0 012 2v1" />
                  </svg>
                  Logout
                </>
              )}
            </button>
          </>
        ) : (
          /* ── Guest state ── */
          <Link
            id="go-to-login-btn"
            to="/login"
            className="flex items-center gap-2 px-6 py-2.5 bg-primary-600 hover:bg-primary-700 text-text-inverse text-sm font-semibold rounded-lg transition-colors shadow-sm"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M11 16l-4-4m0 0l4-4m-4 4h14" />
            </svg>
            Log in
          </Link>
        )}
      </div>

      <p className="text-text-muted text-xs">More features coming soon 🚀</p>
    </div>
  );
};

export default LandingPage;
