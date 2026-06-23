import { useState } from "react";
import { Link } from "react-router-dom";
import { useRegister } from "../hooks/useAuth";

const ROLES = ["USER", "ORGANIZER"];

const RegisterPage = () => {
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    role: "USER",
  });

  const { mutate: register, isPending, error } = useRegister();

  const handleChange = (e) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    register(form);
  };

  const errorMessage =
    error?.response?.data?.message || error?.message || null;
  const fieldErrors = error?.response?.data?.errors || [];

  return (
    <div className="min-h-screen bg-bg-app flex items-center justify-center p-4">
      <div className="w-full max-w-md">

        {/* Brand */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-primary-600 mb-4 shadow-lg">
            <svg className="w-8 h-8 text-text-inverse" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M16 4H8a2 2 0 00-2 2v14l4-2 4 2V6a2 2 0 00-2-2z" />
            </svg>
          </div>
          <h1 className="text-3xl font-bold text-text-heading tracking-tight">BookIt</h1>
          <p className="text-text-muted mt-1 text-sm">Create your account to get started</p>
        </div>

        {/* Card */}
        <div className="bg-surface-base rounded-2xl shadow-sm border border-border-light p-8">
          <form onSubmit={handleSubmit} noValidate className="space-y-5">

            {/* Global error banner */}
            {errorMessage && (
              <div className="bg-danger-50 border border-danger-600/20 rounded-lg px-4 py-3">
                <p className="text-danger-600 text-sm font-medium">{errorMessage}</p>
                {fieldErrors.length > 0 && (
                  <ul className="mt-1 list-disc list-inside space-y-0.5">
                    {fieldErrors.map((err, i) => (
                      <li key={i} className="text-danger-600 text-xs">{err}</li>
                    ))}
                  </ul>
                )}
              </div>
            )}

            {/* Full Name */}
            <div className="space-y-1.5">
              <label htmlFor="register-name" className="block text-sm font-medium text-text-body">
                Full name
              </label>
              <input
                id="register-name"
                name="name"
                type="text"
                autoComplete="name"
                required
                value={form.name}
                onChange={handleChange}
                placeholder="Jane Doe"
                className="w-full px-4 py-2.5 rounded-lg border border-border-base bg-surface-muted text-text-body placeholder:text-text-muted text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition"
              />
            </div>

            {/* Email */}
            <div className="space-y-1.5">
              <label htmlFor="register-email" className="block text-sm font-medium text-text-body">
                Email address
              </label>
              <input
                id="register-email"
                name="email"
                type="email"
                autoComplete="email"
                required
                value={form.email}
                onChange={handleChange}
                placeholder="you@example.com"
                className="w-full px-4 py-2.5 rounded-lg border border-border-base bg-surface-muted text-text-body placeholder:text-text-muted text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition"
              />
            </div>

            {/* Password */}
            <div className="space-y-1.5">
              <label htmlFor="register-password" className="block text-sm font-medium text-text-body">
                Password
                <span className="ml-1 text-text-muted font-normal">(min 6 characters)</span>
              </label>
              <input
                id="register-password"
                name="password"
                type="password"
                autoComplete="new-password"
                required
                value={form.password}
                onChange={handleChange}
                placeholder="••••••••"
                className="w-full px-4 py-2.5 rounded-lg border border-border-base bg-surface-muted text-text-body placeholder:text-text-muted text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition"
              />
            </div>

            {/* Role */}
            <div className="space-y-1.5">
              <label htmlFor="register-role" className="block text-sm font-medium text-text-body">
                I am a…
              </label>
              <div className="grid grid-cols-2 gap-3">
                {ROLES.map((role) => (
                  <label
                    key={role}
                    htmlFor={`role-${role}`}
                    className={`flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg border text-sm font-medium cursor-pointer transition-all
                      ${form.role === role
                        ? "border-primary-600 bg-primary-50 text-primary-600"
                        : "border-border-base bg-surface-muted text-text-muted hover:border-primary-500"
                      }`}
                  >
                    <input
                      id={`role-${role}`}
                      type="radio"
                      name="role"
                      value={role}
                      checked={form.role === role}
                      onChange={handleChange}
                      className="sr-only"
                    />
                    {role === "USER" ? "Attendee" : "Organizer"}
                  </label>
                ))}
              </div>
            </div>

            {/* Submit */}
            <button
              id="register-submit"
              type="submit"
              disabled={isPending}
              className="w-full flex items-center justify-center gap-2 px-4 py-2.5 bg-primary-600 hover:bg-primary-700 disabled:opacity-60 disabled:cursor-not-allowed text-text-inverse font-semibold text-sm rounded-lg transition-colors duration-150 shadow-sm"
            >
              {isPending ? (
                <>
                  <svg className="animate-spin w-4 h-4" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z" />
                  </svg>
                  Creating account…
                </>
              ) : (
                "Create account"
              )}
            </button>
          </form>
        </div>

        {/* Footer link */}
        <p className="text-center text-sm text-text-muted mt-6">
          Already have an account?{" "}
          <Link
            to="/login"
            className="text-primary-600 font-medium hover:text-primary-700 transition-colors"
          >
            Sign in
          </Link>
        </p>
      </div>
    </div>
  );
};

export default RegisterPage;
