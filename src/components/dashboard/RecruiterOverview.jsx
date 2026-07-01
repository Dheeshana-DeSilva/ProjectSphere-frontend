import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getAllProjects } from '../../services/projectService.js';

function readStoredIds(key) {
  try {
    return JSON.parse(localStorage.getItem(key) || '[]');
  } catch {
    return [];
  }
}

export default function RecruiterOverview() {
  const [savedCount, setSavedCount] = useState(0);
  const [followedCount, setFollowedCount] = useState(0);
  const [approvedCount, setApprovedCount] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setSavedCount(readStoredIds('saved_projects').length);
    setFollowedCount(readStoredIds('followed_students').length);

    let active = true;
    getAllProjects()
      .then((projects) => {
        if (!active) return;
        setApprovedCount((projects || []).filter((p) => p.status === 'Approved').length);
      })
      .catch(() => {
        if (active) setApprovedCount(0);
      })
      .finally(() => {
        if (active) setLoading(false);
      });

    return () => { active = false; };
  }, []);

  return (
    <>
      <div className="stat-grid">
        <article className="panel stat-card">
          <strong>{loading ? '—' : savedCount}</strong>
          <span>Saved projects</span>
        </article>
        <article className="panel stat-card">
          <strong>{loading ? '—' : followedCount}</strong>
          <span>Followed students</span>
        </article>
        <article className="panel stat-card">
          <strong>{loading ? '—' : approvedCount}</strong>
          <span>Approved projects</span>
        </article>
      </div>

      <div className="panel dashboard-content-panel">
        <div className="content-panel-header">
          <p className="eyebrow">Discovery</p>
          <h2>Quick actions</h2>
        </div>
        <div className="quick-actions-grid">
          <Link className="quick-action-card" to="/projects">
            <strong>Explore projects</strong>
            <span>Browse approved student submissions</span>
          </Link>
          <Link className="quick-action-card" to="/recruiter/saved">
            <strong>Saved projects</strong>
            <span>Review your shortlisted work</span>
          </Link>
          <Link className="quick-action-card" to="/recruiter/followed">
            <strong>Followed students</strong>
            <span>Track talent you are interested in</span>
          </Link>
        </div>
      </div>
    </>
  );
}
