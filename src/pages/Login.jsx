import { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth.js';

const initialForm = {
  email: '',
  password: '',
  role: 'student',
};

function Login() {
  const [form, setForm] = useState(initialForm);
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { dashboardPaths, login, loginWithGoogle } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const redirectAfterAuth = (role) => {
    const fallback = dashboardPaths[role] || '/dashboard';
    navigate(location.state?.from?.pathname || fallback, { replace: true });
  };

  const updateField = (event) => {
    const { name, value } = event.target;
    setForm((current) => ({ ...current, [name]: value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError('');
    setIsSubmitting(true);

    try {
      const result = await login(form);
      redirectAfterAuth(result.user.role);
    } catch (err) {
      setError(err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleGoogleLogin = async () => {
    setError('');

    try {
      const result = await loginWithGoogle(form.role);

      if (result) {
        redirectAfterAuth(result.user.role);
      }
    } catch {
      setError('Google login could not be started.');
    }
  };

  return (
    <section className="auth-layout">
      <div className="auth-shell split">
        <div className="auth-visual">
          <div className="visual-inner">
            <span className="visual-tag">ProjectSphere workspace</span>
            <h1>Welcome back!</h1>
            <p className="visual-sub">Sign in to continue to your projects and reviews.</p>
          </div>
          <div className="visual-panel">
            <div className="visual-panel-item">
              <span>Secure login</span>
              <strong>Access your workspace instantly</strong>
            </div>
            <div className="visual-panel-item small">
              <span>Built for students and recruiters</span>
              <strong>Keep projects and feedback organized</strong>
            </div>
          </div>
        </div>

        <div className="panel auth-card split-card">
          <div className="auth-card-top">
            <div className="auth-brand">
              <div className="brand-mark">PS</div>
              <div className="brand">ProjectSphere</div>
            </div>
            <h2 className="section-title">Sign In</h2>
            <p className="page-copy">Use your account to access ProjectSphere.</p>
          </div>

          {error && <div className="alert alert-error">{error}</div>}

          <form className="form-stack" onSubmit={handleSubmit}>
            <div className="form-field">
              <label htmlFor="login-email">Email</label>
              <input
                id="login-email"
                name="email"
                type="email"
                autoComplete="email"
                placeholder="you@example.com"
                value={form.email}
                onChange={updateField}
                required
              />
            </div>

            <div className="form-field">
              <label htmlFor="login-password">Password</label>
              <input
                id="login-password"
                name="password"
                type="password"
                autoComplete="current-password"
                placeholder="Enter your password"
                value={form.password}
                onChange={updateField}
                required
              />
            </div>

            <div className="form-actions-row">
              <div>
                <label className="field-hint"><input type="checkbox" /> Remember me</label>
              </div>
              <div>
                <a href="#" className="field-hint">Forgot password?</a>
              </div>
            </div>

            <button className="button button-primary button-full" type="submit" disabled={isSubmitting}>
              {isSubmitting ? 'Signing in...' : 'Sign in'}
            </button>

            <div className="divider">or</div>

            <button className="button button-google" type="button" onClick={handleGoogleLogin}>
              <svg className="google-mark" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 533.5 544.3" width="18" height="18" aria-hidden="true">
                <path fill="#4285F4" d="M533.5 278.4c0-18.5-1.5-36.3-4.3-53.6H272v101.5h146.9c-6.3 34-25 62.8-53.4 82v68.1h86.3c50.6-46.6 79.7-115.2 79.7-198.0z"/>
                <path fill="#34A853" d="M272 544.3c72.3 0 133-23.9 177.3-64.8l-86.3-68.1c-24 16.1-54.8 25.6-91 25.6-69.9 0-129.2-47.1-150.4-110.5H35.1v69.4C79.9 479.9 168.7 544.3 272 544.3z"/>
                <path fill="#FBBC05" d="M121.6 325.4c-10.9-32.8-10.9-68 0-100.8V155.2H35.1c-39.3 78.6-39.3 169.9 0 248.5l86.5-78.3z"/>
                <path fill="#EA4335" d="M272 107.6c39.2 0 74.4 13.5 102.2 39.9l76.6-76.6C405 24.1 346.3 0 272 0 168.7 0 79.9 64.4 35.1 155.2l86.5 69.7C142.8 154.7 202.1 107.6 272 107.6z"/>
              </svg>
              <span>Continue with Google</span>
            </button>
          </form>

          <p className="auth-switch">
            New to ProjectSphere? <Link to="/register">Create an account</Link>
          </p>
        </div>
      </div>
    </section>
  );
}

export default Login;
