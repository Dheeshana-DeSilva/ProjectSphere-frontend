import { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { getPendingProjects, approveProject, rejectProject } from '../../services/projectService.js';
import { Check, X, ExternalLink, Loader2, Sparkles, Folder, RefreshCw } from 'lucide-react';
import { useAlert } from '../../hooks/useAlert.js';

function getProjectId(project) {
  return project.id || project._id;
}

function getErrorMessage(err, fallback) {
  if (typeof err === 'string') return err;
  return err?.response?.data?.error || err?.message || fallback;
}

export default function Approvals() {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [processingId, setProcessingId] = useState(null);
  const { showAlert, showConfirm } = useAlert();

  const fetchProjects = useCallback(async () => {
    setLoading(true);
    try {
      const data = await getPendingProjects();
      setProjects(data || []);
    } catch (err) {
      console.error('Failed to load pending projects:', err);
      showAlert({
        type: 'error',
        title: 'Error',
        message: getErrorMessage(err, 'Failed to fetch pending projects.'),
      });
    } finally {
      setLoading(false);
    }
  }, [showAlert]);

  useEffect(() => {
    fetchProjects();
  }, [fetchProjects]);

  const handleApprove = async (project) => {
    const id = getProjectId(project);
    const confirmed = await showConfirm({
      title: 'Approve project?',
      message: `Approve "${project.title}" and make it visible to recruiters?`,
      confirmLabel: 'Approve',
    });
    if (!confirmed) return;

    setProcessingId(id);
    try {
      const res = await approveProject(id);
      if (res.success) {
        showAlert({ type: 'success', title: 'Approved', message: 'Project approved successfully.' });
        setProjects((prev) => prev.filter((p) => getProjectId(p) !== id));
      } else {
        showAlert({ type: 'error', title: 'Error', message: res.error || 'Failed to approve project.' });
      }
    } catch (err) {
      showAlert({ type: 'error', title: 'Error', message: getErrorMessage(err, 'Approval request failed.') });
    } finally {
      setProcessingId(null);
    }
  };

  const handleReject = async (project) => {
    const id = getProjectId(project);
    const confirmed = await showConfirm({
      title: 'Reject project?',
      message: `Reject "${project.title}"? The student can revise and resubmit later.`,
      confirmLabel: 'Reject',
      variant: 'danger',
    });
    if (!confirmed) return;

    setProcessingId(id);
    try {
      const res = await rejectProject(id);
      if (res.success) {
        showAlert({ type: 'warning', title: 'Rejected', message: 'Project rejected successfully.' });
        setProjects((prev) => prev.filter((p) => getProjectId(p) !== id));
      } else {
        showAlert({ type: 'error', title: 'Error', message: res.error || 'Failed to reject project.' });
      }
    } catch (err) {
      showAlert({ type: 'error', title: 'Error', message: getErrorMessage(err, 'Rejection request failed.') });
    } finally {
      setProcessingId(null);
    }
  };

  if (loading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center bg-slate-50">
        <div className="text-center">
          <Loader2 className="w-12 h-12 mx-auto text-blue-500 animate-spin mb-4" />
          <p className="text-slate-500 text-sm">Loading submissions...</p>
        </div>
      </div>
    );
  }

  return (
    <section className="page-section bg-slate-50 min-h-screen py-10">
      <div className="container max-w-5xl">
        <div className="flex flex-wrap items-center justify-between gap-4 mb-8">
          <div>
            <span className="badge blue mb-2 inline-block">Lecturer Workspace</span>
            <h1 className="section-title text-3xl font-extrabold text-slate-800 flex items-center gap-2">
              <Folder className="w-8 h-8 text-blue-600" /> Pending Approvals
            </h1>
            <p className="text-slate-500 text-sm mt-1">
              Review, approve, or reject student project submissions before they go public.
            </p>
          </div>
          <div className="flex items-center gap-3">
            <span className="bg-slate-200 text-slate-700 font-bold px-3 py-1 rounded-full text-sm">
              {projects.length} pending
            </span>
            <button
              type="button"
              className="button button-secondary flex items-center gap-2"
              onClick={fetchProjects}
              disabled={loading}
            >
              <RefreshCw className="w-4 h-4" /> Refresh
            </button>
          </div>
        </div>

        {projects.length === 0 ? (
          <div className="panel bg-white border border-slate-100 rounded-2xl p-12 text-center shadow-sm">
            <Sparkles className="w-16 h-16 mx-auto text-yellow-400 mb-4 animate-pulse" />
            <h2 className="text-xl font-bold text-slate-700 mb-2">All Caught Up!</h2>
            <p className="text-slate-400 text-sm max-w-md mx-auto mb-6">
              There are no project submissions currently waiting for your review. Check back later!
            </p>
            <Link className="button button-secondary" to="/dashboard/lecturer">Back to dashboard</Link>
          </div>
        ) : (
          <div className="space-y-6">
            {projects.map((project) => {
              const id = getProjectId(project);
              const ownerName = project.owner?.name || project.student?.name || 'Student';
              const ownerEmail = project.owner?.email || project.student?.email || '';
              const thumbnail = project.thumbnailUrl || project.thumbnail;
              const isProcessing = processingId === id;

              return (
                <article key={id} className="panel bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-shadow">
                  <div className="lecturer-approval-card">
                    {thumbnail ? (
                      <div className="lecturer-approval-thumb">
                        <img src={thumbnail} alt="" />
                      </div>
                    ) : (
                      <div className="lecturer-approval-thumb lecturer-approval-thumb-fallback">
                        {project.title?.charAt(0)?.toUpperCase() || 'P'}
                      </div>
                    )}

                    <div className="lecturer-approval-body">
                      <div className="flex flex-wrap items-start justify-between gap-4 mb-4">
                        <div>
                          <span className="bg-blue-50 text-blue-700 text-xs font-semibold px-3 py-1 rounded-full mb-2 inline-block">
                            {project.category || 'General'}
                          </span>
                          <h2 className="text-xl font-bold text-slate-800">{project.title}</h2>
                          <p className="text-slate-500 text-xs mt-1">
                            Submitted by: <strong className="text-slate-700">{ownerName}</strong>
                            {ownerEmail ? ` (${ownerEmail})` : ''}
                          </p>
                        </div>

                        <div className="flex flex-wrap gap-2">
                          <button
                            type="button"
                            onClick={() => handleApprove(project)}
                            disabled={processingId !== null}
                            className="flex items-center gap-1 bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 text-white text-sm font-semibold px-4 py-2 rounded-xl transition-colors shadow-sm"
                          >
                            {isProcessing ? <Loader2 className="w-4 h-4 animate-spin" /> : <Check className="w-4 h-4" />}
                            Approve
                          </button>
                          <button
                            type="button"
                            onClick={() => handleReject(project)}
                            disabled={processingId !== null}
                            className="flex items-center gap-1 bg-rose-600 hover:bg-rose-700 disabled:opacity-50 text-white text-sm font-semibold px-4 py-2 rounded-xl transition-colors shadow-sm"
                          >
                            {isProcessing ? <Loader2 className="w-4 h-4 animate-spin" /> : <X className="w-4 h-4" />}
                            Reject
                          </button>
                        </div>
                      </div>

                      <p className="text-slate-600 text-sm leading-relaxed mb-4 whitespace-pre-line line-clamp-4">
                        {project.description}
                      </p>

                      {project.technologies?.length > 0 && (
                        <div className="flex flex-wrap gap-1.5 mb-4">
                          {project.technologies.map((tech) => (
                            <span key={tech} className="bg-slate-100 text-slate-600 text-xs px-2.5 py-1 rounded-lg">
                              {tech}
                            </span>
                          ))}
                        </div>
                      )}

                      <div className="flex flex-wrap items-center justify-between gap-3 border-t border-slate-100 pt-4 text-xs text-slate-400">
                        <span className="italic">
                          Submitted on {project.createdAt ? new Date(project.createdAt).toLocaleDateString() : 'N/A'}
                        </span>
                        <div className="flex gap-4">
                          <Link
                            to={`/projects/${id}`}
                            className="flex items-center gap-1 text-slate-500 hover:text-blue-600 transition-colors font-medium"
                          >
                            <ExternalLink className="w-3.5 h-3.5" /> View details
                          </Link>
                          {project.githubUrl && (
                            <a
                              href={project.githubUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="flex items-center gap-1 text-slate-500 hover:text-blue-600 transition-colors font-medium"
                            >
                              <ExternalLink className="w-3.5 h-3.5" /> GitHub
                            </a>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </article>
              );
            })}
          </div>
        )}
      </div>
    </section>
  );
}
