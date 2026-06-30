import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth.js';

const initialForm = {
  fullName: '',
  email: '',
  password: '',
  role: 'student',
  studentId: '',
  department: '',
  customDepartment: '',
  academicYear: '',
  staffId: '',
  company: '',
  jobTitle: '',
};

const departmentOptions = [
  'Computer Science',
  'Software Engineering',
  'Information Technology',
  'Data Science',
  'Cyber Security',
  'Business Information Systems',
  'Other',
];

function Register() {
  const [form, setForm] = useState(initialForm);
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { dashboardPaths, register } = useAuth();
  const navigate = useNavigate();

  const updateField = (event) => {
    const { name, value } = event.target;
    setForm((current) => ({ ...current, [name]: value }));
  };

  const updateDepartment = (event) => {
    const { value } = event.target;
    setForm((current) => ({
      ...current,
      department: value,
      customDepartment: value === 'Other' ? current.customDepartment : '',
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError('');
    setIsSubmitting(true);

    try {
      const result = await register({
        ...form,
        department: form.department === 'Other' ? form.customDepartment : form.department,
      });
      navigate(dashboardPaths[result.user.role] || '/dashboard', { replace: true });
    } catch (err) {
      setError(err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section className="auth-layout">
      <div className="auth-shell split">
        <div className="auth-visual">
          <div className="visual-inner">
            <span className="visual-tag">New space</span>
            <h1>Create an account</h1>
            <p className="visual-sub">Join ProjectSphere to manage and showcase projects.</p>
          </div>
          <div className="visual-panel">
            <div className="visual-panel-item">
              <span>Welcome aboard</span>
              <strong>Start building your profile</strong>
            </div>
            <div className="visual-panel-item small">
              <span>ProjectSphere is your hub</span>
              <strong>Showcase work with confidence</strong>
            </div>
          </div>
        </div>

        <div className="panel auth-card split-card">
          <div className="auth-card-top">
            <div className="auth-brand">
              <div className="brand-mark">PS</div>
              <div className="brand">ProjectSphere</div>
            </div>
            <h2 className="section-title">Register</h2>
            <p className="page-copy">Create your account and set up a profile.</p>
          </div>

          {error && <div className="alert alert-error">{error}</div>}

          <form className="form-stack" onSubmit={handleSubmit}>
            <div className="form-row">
              <div className="form-field">
                <label htmlFor="register-name">Full name</label>
                <input
                  id="register-name"
                  name="fullName"
                  type="text"
                  autoComplete="name"
                  placeholder="Enter your full name"
                  value={form.fullName}
                  onChange={updateField}
                  required
                />
              </div>

              <div className="form-field">
                <label htmlFor="register-email">Email</label>
                <input
                  id="register-email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  placeholder="you@example.com"
                  value={form.email}
                  onChange={updateField}
                  required
                />
              </div>
            </div>

            <div className="form-row">
              <div className="form-field">
                <label htmlFor="register-password">Password</label>
                <input
                  id="register-password"
                  name="password"
                  type="password"
                  autoComplete="new-password"
                  placeholder="Minimum 8 characters"
                  value={form.password}
                  onChange={updateField}
                  required
                />
              </div>

              <div className="form-field">
                <label htmlFor="register-role">Account type</label>
                <select id="register-role" name="role" value={form.role} onChange={updateField}>
                  <option value="student">Student</option>
                  <option value="lecturer">Lecturer</option>
                  <option value="recruiter">Recruiter</option>
                </select>
              </div>
            </div>

            <button className="button button-primary button-full" type="submit" disabled={isSubmitting}>
              {isSubmitting ? 'Creating account...' : 'Create account'}
            </button>
          </form>

          <p className="auth-switch">
            Already registered? <Link to="/login">Sign in instead</Link>
          </p>
        </div>
      </div>
    </section>
  );
}

export default Register;
