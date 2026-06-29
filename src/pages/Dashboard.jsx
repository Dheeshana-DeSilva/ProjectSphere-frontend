import { Link } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth.js';

const dashboardContent = {
  student: {
    eyebrow: 'Student dashboard',
    title: 'Manage your project journey',
    copy: 'Create project submissions, track approval status, and prepare your public profile for recruiter discovery.',
    stats: [
      { label: 'My projects', value: '03' },
      { label: 'Pending review', value: '01' },
      { label: 'Profile views', value: '28' },
    ],
    actions: [
      { label: 'Create project', to: '/student/projects/create', variant: 'button-primary' },
      { label: 'My projects', to: '/student/projects', variant: 'button-secondary' },
    ],
    tasks: ['Complete project thumbnail', 'Add GitHub repository link', 'Review lecturer feedback'],
  },
  lecturer: {
    eyebrow: 'Lecturer dashboard',
    title: 'Review submissions with clarity',
    copy: 'Approve high-quality work, reject incomplete submissions, and help students improve before projects become public.',
    stats: [
      { label: 'Pending projects', value: '16' },
      { label: 'Approved this week', value: '08' },
      { label: 'Rejected drafts', value: '03' },
    ],
    actions: [
      { label: 'Open approvals', to: '/lecturer/approvals', variant: 'button-primary' },
      { label: 'Browse projects', to: '/projects', variant: 'button-secondary' },
    ],
    tasks: ['Review new AI submissions', 'Check rejected project resubmissions', 'Confirm project category tags'],
  },
  recruiter: {
    eyebrow: 'Recruiter dashboard',
    title: 'Discover approved student talent',
    copy: 'Browse public projects, save interesting work, and follow students whose skills match your hiring needs.',
    stats: [
      { label: 'Saved projects', value: '12' },
      { label: 'Followed students', value: '07' },
      { label: 'New projects', value: '21' },
    ],
    actions: [
      { label: 'Explore projects', to: '/projects', variant: 'button-primary' },
      { label: 'Saved projects', to: '/recruiter/saved', variant: 'button-secondary' },
    ],
    tasks: ['Shortlist web app projects', 'Follow top data science students', 'Review new approved submissions'],
  },
};

function Dashboard({ role }) {
  const { roleLabels, user } = useAuth();
  const content = dashboardContent[role] || dashboardContent.student;

  return (
    <section className="dashboard-page">
      <div className="container dashboard-shell">
        <aside className="panel dashboard-sidebar">
          <div>
            <span className="badge blue">{roleLabels[user.role] || user.role}</span>
            <h2>{user.name}</h2>
            <p>{user.email}</p>
          </div>
          <nav className="dashboard-menu" aria-label="Dashboard navigation">
            {content.actions.map((action) => (
              <Link key={action.to} to={action.to}>{action.label}</Link>
            ))}
          </nav>
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

          <div className="stat-grid">
            {content.stats.map((stat) => (
              <article className="panel stat-card" key={stat.label}>
                <strong>{stat.value}</strong>
                <span>{stat.label}</span>
              </article>
            ))}
          </div>

          <div className="panel task-panel">
            <div className="task-panel-header">
              <p className="eyebrow">Priority work</p>
              <h2>Next actions</h2>
            </div>
            <div className="task-list">
              {content.tasks.map((task) => (
                <label className="task-item" key={task}>
                  <input type="checkbox" />
                  <span>{task}</span>
                </label>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default Dashboard;
