import { Link, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { useLogout } from "../hooks/useAuth";

const Navbar = () => {
  const { user, isAuthenticated } = useSelector((state) => state.auth);
  const { mutate: logout, isPending } = useLogout();
  const navigate = useNavigate();

  const isOrganizer = user?.role === "ORGANIZER";

  return (
    <header className="sticky top-0 z-50 w-full bg-surface-base/90 backdrop-blur-sm border-b border-border-light shadow-sm">
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">

        {/* Brand */}
        <Link
          to="/"
          id="nav-brand"
          className="flex items-center gap-2.5 shrink-0"
        >
          <div className="w-8 h-8 rounded-lg bg-primary-600 flex items-center justify-center shadow-sm">
            <svg
              className="w-5 h-5 text-text-inverse"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M16 4H8a2 2 0 00-2 2v14l4-2 4 2V6a2 2 0 00-2-2z"
              />
            </svg>
          </div>
          <span className="text-text-heading font-bold text-lg tracking-tight">
            BookIt
          </span>
        </Link>

        {/* Nav Links */}
        <div className="hidden sm:flex items-center justify-end gap-1 w-full">
          <Link
            to="/events"
            id="nav-events"
            className="px-3 py-2 rounded-lg text-sm font-medium text-text-body hover:bg-surface-muted hover:text-text-heading transition-colors"
          >
            Browse Events
          </Link>
          {isOrganizer && (
            <Link
              to="/organizer"
              id="nav-organizer"
              className="px-3 py-2 rounded-lg text-sm font-medium text-text-body hover:bg-surface-muted hover:text-text-heading transition-colors"
            >
              My Events
            </Link>
          )}
        </div>

        {/* Right side */}
        <div className="flex items-center gap-2 shrink-0">
          {isAuthenticated ? (
            <>
              {/* Avatar + name */}
              <div className="hidden sm:flex items-center gap-2.5 px-3 py-1.5 rounded-lg bg-surface-muted">
                <div className="w-7 h-7 rounded-full bg-primary-600 flex items-center justify-center text-xs font-bold text-text-inverse">
                  {user?.name?.charAt(0).toUpperCase() ?? "?"}
                </div>
                <span className="text-sm font-medium text-text-body">
                  {user?.name}
                </span>
              </div>

              {/* Logout */}
              <button
                id="nav-logout"
                onClick={() => logout()}
                disabled={isPending}
                className="flex items-center gap-1.5 px-3 py-2 rounded-lg border border-border-base text-text-body text-sm font-medium hover:bg-surface-muted disabled:opacity-60 disabled:cursor-not-allowed transition-colors"
              >
                <svg
                  className="w-4 h-4"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a2 2 0 01-2 2H5a2 2 0 01-2-2V7a2 2 0 012-2h6a2 2 0 012 2v1"
                  />
                </svg>
                <span className="hidden sm:inline">Logout</span>
              </button>
            </>
          ) : (
            <>
              <button
                id="nav-login"
                onClick={() => navigate("/login")}
                className="px-4 py-2 rounded-lg border border-border-base text-text-body text-sm font-medium hover:bg-surface-muted transition-colors"
              >
                Log in
              </button>
              <button
                id="nav-register"
                onClick={() => navigate("/register")}
                className="px-4 py-2 rounded-lg bg-primary-600 hover:bg-primary-700 text-text-inverse text-sm font-semibold transition-colors shadow-sm"
              >
                Sign up
              </button>
            </>
          )}
        </div>
      </nav>
    </header>
  );
};

export default Navbar;
