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
      <div className="auth-shell">
        <div className="auth-aside panel">
          <p className="eyebrow">Secure access</p>
          <h1 className="section-title">Sign in to your workspace</h1>
          <p className="page-copy">
            Continue to the right workspace for your account, whether you manage projects, review submissions, or discover student work.
          </p>
          <div className="auth-highlights">
            <span>Student workspace</span>
            <span>Lecturer review area</span>
            <span>Recruiter project discovery</span>
          </div>
        </div>

        <div className="panel auth-card">
          <div className="auth-card-header">
            <p className="eyebrow">Welcome back</p>
            <h2 className="section-title">Sign in</h2>
            <p className="page-copy">Enter your account details to continue.</p>
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

            <div className="form-field">
              <label htmlFor="login-role">Account type</label>
              <select id="login-role" name="role" value={form.role} onChange={updateField}>
                <option value="student">Student</option>
                <option value="lecturer">Lecturer</option>
                <option value="recruiter">Recruiter</option>
                <option value="admin">Admin</option>
              </select>
              <span className="field-hint">Choose the workspace you want to open.</span>
            </div>

            <button className="button button-primary button-full" type="submit" disabled={isSubmitting}>
              {isSubmitting ? 'Signing in...' : 'Sign in'}
            </button>

            <div className="divider">or</div>

            <button className="button button-google" type="button" onClick={handleGoogleLogin}>
              Continue with Google
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
