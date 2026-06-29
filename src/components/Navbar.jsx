import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth.js';

const roleNavigation = {
  student: [
    { label: 'Dashboard', to: '/dashboard/student' },
    { label: 'My projects', to: '/student/projects' },
    { label: 'Create project', to: '/student/projects/create' },
  ],
  lecturer: [
    { label: 'Dashboard', to: '/dashboard/lecturer' },
    { label: 'Approvals', to: '/lecturer/approvals' },
  ],
  admin: [
    { label: 'Dashboard', to: '/dashboard/lecturer' },
    { label: 'Approvals', to: '/lecturer/approvals' },
  ],
  recruiter: [
    { label: 'Dashboard', to: '/dashboard/recruiter' },
    { label: 'Projects', to: '/projects' },
    { label: 'Saved', to: '/recruiter/saved' },
  ],
};

function Navbar() {
  const { isAuthenticated, logout, roleLabels, user } = useAuth();
  const navigate = useNavigate();
  const links = isAuthenticated ? roleNavigation[user.role] || [] : [];

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <header className="site-header">
      <nav className="container navbar" aria-label="Main navigation">
        <NavLink className="brand" to="/">
          <span className="brand-mark">PS</span>
          ProjectSphere
        </NavLink>

        <div className="nav-links">
          <NavLink className="nav-link" to="/">Home</NavLink>
          <NavLink className="nav-link" to="/projects">Projects</NavLink>

          {links.map((link) => (
            <NavLink className="nav-link" key={link.to} to={link.to}>
              {link.label}
            </NavLink>
          ))}

          {isAuthenticated ? (
            <div className="nav-account">
              <span className="role-chip">{roleLabels[user.role] || user.role}</span>
              <button className="button button-secondary nav-button" type="button" onClick={handleLogout}>
                Logout
              </button>
            </div>
          ) : (
            <>
              <NavLink className="nav-link" to="/login">Sign in</NavLink>
              <NavLink className="button button-primary nav-button" to="/register">Register</NavLink>
            </>
          )}
        </div>
      </nav>
    </header>
  );
}

export default Navbar;
