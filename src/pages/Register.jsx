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
      <div className="auth-shell auth-shell-wide">
        <div className="auth-aside panel">
          <p className="eyebrow">Join ProjectSphere</p>
          <h1 className="section-title">Create a clear professional profile</h1>
          <p className="page-copy">
            Add the details that help your account open the right workspace and present your profile clearly.
          </p>
          <div className="register-checklist">
            <span>Full name and email</span>
            <span>Secure password</span>
            <span>Account type</span>
            <span>Profile details</span>
          </div>
        </div>

        <div className="panel auth-card register-card">
          <div className="auth-card-header">
            <p className="eyebrow">Create account</p>
            <h2 className="section-title">Register</h2>
            <p className="page-copy">Choose the account type that matches how you will use ProjectSphere.</p>
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

            {form.role === 'student' && (
              <div className="form-panel">
                <span className="badge blue">Student profile</span>
                <div className="form-row">
                  <div className="form-field">
                    <label htmlFor="student-id">Student id</label>
                    <input
                      id="student-id"
                      name="studentId"
                      type="text"
                      placeholder="IT2026001"
                      value={form.studentId}
                      onChange={updateField}
                    />
                  </div>
                  <div className="form-field">
                    <label htmlFor="student-department">Department</label>
                    <select
                      id="student-department"
                      name="department"
                      value={form.department}
                      onChange={updateDepartment}
                    >
                      <option value="">Select department</option>
                      {departmentOptions.map((department) => (
                        <option key={department} value={department}>{department}</option>
                      ))}
                    </select>
                  </div>
                  {form.department === 'Other' && (
                    <div className="form-field">
                      <label htmlFor="student-custom-department">Other department</label>
                      <input
                        id="student-custom-department"
                        name="customDepartment"
                        type="text"
                        placeholder="Type your department"
                        value={form.customDepartment}
                        onChange={updateField}
                      />
                    </div>
                  )}
                  <div className="form-field">
                    <label htmlFor="academic-year">Academic year</label>
                    <select id="academic-year" name="academicYear" value={form.academicYear} onChange={updateField}>
                      <option value="">Select year</option>
                      <option value="1">Year 1</option>
                      <option value="2">Year 2</option>
                      <option value="3">Year 3</option>
                      <option value="4">Year 4</option>
                    </select>
                  </div>
                </div>
              </div>
            )}

            {form.role === 'lecturer' && (
              <div className="form-panel">
                <span className="badge">Lecturer profile</span>
                <div className="form-row">
                  <div className="form-field">
                    <label htmlFor="staff-id">Staff id</label>
                    <input
                      id="staff-id"
                      name="staffId"
                      type="text"
                      placeholder="LEC1024"
                      value={form.staffId}
                      onChange={updateField}
                    />
                  </div>
                  <div className="form-field">
                    <label htmlFor="lecturer-department">Department</label>
                    <select
                      id="lecturer-department"
                      name="department"
                      value={form.department}
                      onChange={updateDepartment}
                    >
                      <option value="">Select department</option>
                      {departmentOptions.map((department) => (
                        <option key={department} value={department}>{department}</option>
                      ))}
                    </select>
                  </div>
                  {form.department === 'Other' && (
                    <div className="form-field">
                      <label htmlFor="lecturer-custom-department">Other department</label>
                      <input
                        id="lecturer-custom-department"
                        name="customDepartment"
                        type="text"
                        placeholder="Type your department"
                        value={form.customDepartment}
                        onChange={updateField}
                      />
                    </div>
                  )}
                </div>
              </div>
            )}

            {form.role === 'recruiter' && (
              <div className="form-panel">
                <span className="badge gold">Recruiter profile</span>
                <div className="form-row">
                  <div className="form-field">
                    <label htmlFor="company">Company</label>
                    <input
                      id="company"
                      name="company"
                      type="text"
                      placeholder="Company name"
                      value={form.company}
                      onChange={updateField}
                    />
                  </div>
                  <div className="form-field">
                    <label htmlFor="job-title">Job title</label>
                    <input
                      id="job-title"
                      name="jobTitle"
                      type="text"
                      placeholder="Talent Acquisition Lead"
                      value={form.jobTitle}
                      onChange={updateField}
                    />
                  </div>
                </div>
              </div>
            )}

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
