import { useState } from 'react';
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
    { label: 'Saved', to: '/recruiter/saved' },
  ],
};

function HamburgerIcon({ open }) {
  return (
    <svg width="22" height="22" viewBox="0 0 22 22" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
      {open ? (
        <>
          <line x1="4" y1="4" x2="18" y2="18" />
          <line x1="18" y1="4" x2="4" y2="18" />
        </>
      ) : (
        <>
          <line x1="3" y1="6"  x2="19" y2="6"  />
          <line x1="3" y1="11" x2="19" y2="11" />
          <line x1="3" y1="16" x2="19" y2="16" />
        </>
      )}
    </svg>
  );
}

function Navbar() {
  const { isAuthenticated, logout, roleLabels, user } = useAuth();
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);

  const roleLinks = isAuthenticated ? roleNavigation[user.role] || [] : [];

  const handleLogout = () => {
    logout();
    navigate('/login');
    setMenuOpen(false);
  };

  const close = () => setMenuOpen(false);

  return (
    <header className="site-header">
      <nav className="container navbar" aria-label="Main navigation">
        {/* Brand */}
        <NavLink className="brand" to="/" onClick={close}>
          <span className="brand-mark">PS</span>
          ProjectSphere
        </NavLink>

        {/* Desktop nav */}
        <div className="nav-links nav-desktop">
          <NavLink className="nav-link" to="/">Home</NavLink>
          <NavLink className="nav-link" to="/projects">Projects</NavLink>

          {roleLinks.map((link) => (
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

        {/* Hamburger toggle (mobile only) */}
        <button
          className="nav-hamburger"
          aria-label={menuOpen ? 'Close menu' : 'Open menu'}
          aria-expanded={menuOpen}
          onClick={() => setMenuOpen(v => !v)}
        >
          <HamburgerIcon open={menuOpen} />
        </button>
      </nav>

      {/* Mobile dropdown */}
      {menuOpen && (
        <div className="nav-mobile">
          <NavLink className="nav-link nav-mobile-link" to="/" onClick={close}>Home</NavLink>
          <NavLink className="nav-link nav-mobile-link" to="/projects" onClick={close}>Projects</NavLink>

          {roleLinks.map((link) => (
            <NavLink className="nav-link nav-mobile-link" key={link.to} to={link.to} onClick={close}>
              {link.label}
            </NavLink>
          ))}

          {isAuthenticated ? (
            <div className="nav-mobile-account">
              <span className="role-chip">{roleLabels[user.role] || user.role}</span>
              <button className="button button-secondary nav-button" type="button" onClick={handleLogout}>
                Logout
              </button>
            </div>
          ) : (
            <div className="nav-mobile-account">
              <NavLink className="nav-link nav-mobile-link" to="/login" onClick={close}>Sign in</NavLink>
              <NavLink className="button button-primary nav-button" to="/register" onClick={close}>Register</NavLink>
            </div>
          )}
        </div>
      )}
    </header>
  );
}

export default Navbar;
