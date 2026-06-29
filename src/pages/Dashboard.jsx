import { useState, useEffect } from 'react';
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
    nav: [
      { label: 'Dashboard', to: '/dashboard/student' },
      { label: 'My projects', to: '/student/projects' },
      { label: 'Create project', to: '/student/projects/create' },
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
    nav: [
      { label: 'Dashboard', to: '/dashboard/lecturer' },
      { label: 'Approvals', to: '/lecturer/approvals' },
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
    nav: [
      { label: 'Dashboard', to: '/dashboard/recruiter' },
      { label: 'Saved projects', to: '/recruiter/saved' },
      { label: 'Followed students', to: '/recruiter/followed' },
    ],
    actions: [
      { label: 'Explore projects', to: '/projects', variant: 'button-primary' },
    ],
    tasks: ['Shortlist web app projects', 'Follow top data science students', 'Review new approved submissions'],
  },
};

function Dashboard({ role }) {
  const { roleLabels, user } = useAuth();
  const content = dashboardContent[role] || dashboardContent.student;

  const [tasks, setTasks] = useState(() => 
    content.tasks.map((t, i) => ({ id: Date.now() + i, text: t, done: false }))
  );
  const [newTask, setNewTask] = useState('');

  // Reset tasks if role changes
  useEffect(() => {
    setTasks(content.tasks.map((t, i) => ({ id: Date.now() + i, text: t, done: false })));
  }, [role, content.tasks]);

  const toggleTask = (id) => {
    // Mark as done immediately for UI feedback
    setTasks(prev => prev.map(t => t.id === id ? { ...t, done: true } : t));
    
    // Remove it after a short delay
    setTimeout(() => {
      setTasks(prev => prev.filter(t => t.id !== id));
    }, 300);
  };

  const addTask = (e) => {
    e.preventDefault();
    if (!newTask.trim()) return;
    setTasks(prev => [...prev, { id: Date.now(), text: newTask.trim(), done: false }]);
    setNewTask('');
  };

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
            {content.nav.map((link) => (
              <Link key={link.to} to={link.to}>{link.label}</Link>
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
              {tasks.length === 0 ? (
                <p className="text-slate-400 text-sm italic">All tasks completed!</p>
              ) : (
                tasks.map((task) => (
                  <label className={`task-item transition-all duration-300 ${task.done ? 'opacity-50 scale-95' : 'opacity-100 scale-100'}`} key={task.id}>
                    <input
                      type="checkbox"
                      checked={task.done}
                      onChange={() => toggleTask(task.id)}
                    />
                    <span className={task.done ? 'line-through text-slate-400' : ''}>{task.text}</span>
                  </label>
                ))
              )}
              <form onSubmit={addTask} className="mt-4 flex gap-2">
                <input
                  type="text"
                  value={newTask}
                  onChange={e => setNewTask(e.target.value)}
                  placeholder="Add a new task..."
                  className="flex-grow text-sm px-3 py-2 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-400"
                />
                <button type="submit" disabled={!newTask.trim()} className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-2 rounded-xl text-sm font-semibold disabled:opacity-50">
                  Add
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default Dashboard;
