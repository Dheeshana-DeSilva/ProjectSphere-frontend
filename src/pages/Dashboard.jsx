import { Link } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth.js';
import { getMyProjects } from '../services/projectService.js';
import { useState, useEffect } from 'react';
import DashboardSidebarProfile from '../components/dashboard/DashboardSidebarProfile.jsx';
import StudentRecentProjects from '../components/dashboard/StudentRecentProjects.jsx';
import LecturerOverview from '../components/dashboard/LecturerOverview.jsx';
import RecruiterOverview from '../components/dashboard/RecruiterOverview.jsx';
import { formatAuthProviders, formatMemberSince, getRoleAccess } from '../utils/roleAccess.js';

const dashboardContent = {
  student: {
    eyebrow: 'Student dashboard',
    title: 'Manage your project journey',
    copy: 'Create project submissions, track approval status, and prepare your public profile for recruiter discovery.',
    nav: [
      { label: 'Dashboard', to: '/dashboard/student' },
      { label: 'My projects', to: '/student/projects' },
      { label: 'Create project', to: '/student/projects/create' },
    ],
    actions: [
      { label: 'Create project', to: '/student/projects/create', variant: 'button-primary' },
      { label: 'My projects', to: '/student/projects', variant: 'button-secondary' },
    ],
  },
  lecturer: {
    eyebrow: 'Lecturer dashboard',
    title: 'Review submissions with clarity',
    copy: 'Approve high-quality work, reject incomplete submissions, and help students improve before projects become public.',
    nav: [
      { label: 'Dashboard', to: '/dashboard/lecturer' },
      { label: 'Approvals', to: '/lecturer/approvals' },
      { label: 'Browse projects', to: '/projects' },
    ],
    actions: [
      { label: 'Open approvals', to: '/lecturer/approvals', variant: 'button-primary' },
      { label: 'Browse projects', to: '/projects', variant: 'button-secondary' },
    ],
  },
  recruiter: {
    eyebrow: 'Recruiter dashboard',
    title: 'Discover approved student talent',
    copy: 'Browse public projects, save interesting work, and follow students whose skills match your hiring needs.',
    nav: [
      { label: 'Dashboard', to: '/dashboard/recruiter' },
      { label: 'Saved projects', to: '/recruiter/saved' },
      { label: 'Followed students', to: '/recruiter/followed' },
    ],
    actions: [
      { label: 'Explore projects', to: '/projects', variant: 'button-primary' },
    ],
  },
};

function StudentStats() {
  const { token, user } = useAuth();
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;
    getMyProjects(token, user)
      .then(projects => {
        if (!active) return;
        setStats({
          total: projects.length,
          pending: projects.filter(p => (p.status || 'Pending') === 'Pending').length,
          approved: projects.filter(p => p.status === 'Approved').length,
        });
      })
      .catch(() => {
        if (active) setStats({ total: 0, pending: 0, approved: 0 });
      })
      .finally(() => { if (active) setLoading(false); });
    return () => { active = false; };
  }, [token, user]);

  if (loading) {
    return (
      <div className="stat-grid">
        {[1, 2, 3].map(i => (
          <article className="panel stat-card" key={i}>
            <strong className="animate-pulse text-slate-300">—</strong>
            <span className="text-slate-400 text-xs">Loading…</span>
          </article>
        ))}
      </div>
    );
  }

  return (
    <div className="stat-grid">
      <article className="panel stat-card">
        <strong>{stats.total}</strong>
        <span>My projects</span>
      </article>
      <article className="panel stat-card">
        <strong>{stats.pending}</strong>
        <span>Pending review</span>
      </article>
      <article className="panel stat-card">
        <strong>{stats.approved}</strong>
        <span>Approved</span>
      </article>
    </div>
  );
}

function DashboardAccessSummary() {
  const { user, roleLabels } = useAuth();
  const access = getRoleAccess(user.role);

  return (
    <div className="panel dashboard-content-panel">
      <div className="content-panel-header">
        <p className="eyebrow">Platform access</p>
        <h2>Your permissions</h2>
      </div>

      <div className="access-summary-grid">
        <section className="access-summary-card access-summary-readonly" aria-labelledby="readonly-access-heading">
          <div className="access-summary-card-header">
            <span className="access-type-badge access-type-readonly">Read-only</span>
            <h3 id="readonly-access-heading">Account credentials</h3>
            <p className="access-summary-desc">These details are fixed and cannot be edited here.</p>
          </div>
          <dl className="credentials-list credentials-list-panel">
            {access.readOnly.map((item) => (
              <div className="credentials-row" key={item.value}>
                <dt>{item.label}</dt>
                <dd>
                  {item.value === 'email' && user.email}
                  {item.value === 'role' && (roleLabels[user.role] || user.role)}
                  {item.value === 'authProviders' && formatAuthProviders(user.authProviders)}
                  {item.value === 'createdAt' && formatMemberSince(user.createdAt)}
                </dd>
              </div>
            ))}
          </dl>
        </section>

        <section className="access-summary-card access-summary-write" aria-labelledby="write-access-heading">
          <div className="access-summary-card-header">
            <span className="access-type-badge access-type-write">Write access</span>
            <h3 id="write-access-heading">What you can do</h3>
            <p className="access-summary-desc">Actions available with your current role.</p>
          </div>
          <ul className="access-list access-list-panel">
            {access.writeAccess.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </section>
      </div>
    </div>
  );
}

function Dashboard({ role }) {
  const content = dashboardContent[role] || dashboardContent.student;

  return (
    <section className="dashboard-page">
      <div className="container dashboard-shell">
        <aside className="panel dashboard-sidebar">
          <DashboardSidebarProfile navLinks={content.nav} />
        </aside>

        <div className="dashboard-main">
          <div className="dashboard-hero panel">
            <p className="eyebrow">{content.eyebrow}</p>
            <h1 className="section-title">{content.title}</h1>
            <p className="page-copy">{content.copy}</p>
            <div className="actions">
              {content.actions.map((action) => (
                <Link className={`button ${action.variant}`} key={action.to} to={action.to}>
                  {action.label}
                </Link>
              ))}
            </div>
          </div>

          {role === 'student' && (
            <>
              <StudentStats />
              <div className="dashboard-content-grid">
                <StudentRecentProjects />
                <DashboardAccessSummary />
              </div>
            </>
          )}

          {role === 'lecturer' && (
            <>
              <LecturerOverview />
              <DashboardAccessSummary />
            </>
          )}

          {role === 'recruiter' && (
            <>
              <RecruiterOverview />
              <DashboardAccessSummary />
            </>
          )}
        </div>
      </div>
    </section>
  );
}

export default Dashboard;
