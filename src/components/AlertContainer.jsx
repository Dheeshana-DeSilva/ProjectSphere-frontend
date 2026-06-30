import { useAlert } from '../hooks/useAlert.js';

/* ── Icons per type ── */
const icons = {
  success: (
    <svg viewBox="0 0 20 20" fill="none" aria-hidden="true">
      <circle cx="10" cy="10" r="9" stroke="currentColor" strokeWidth="1.5" />
      <path d="M6 10.5l2.5 2.5 5-5" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  ),
  error: (
    <svg viewBox="0 0 20 20" fill="none" aria-hidden="true">
      <circle cx="10" cy="10" r="9" stroke="currentColor" strokeWidth="1.5" />
      <path d="M7 7l6 6M13 7l-6 6" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" />
    </svg>
  ),
  warning: (
    <svg viewBox="0 0 20 20" fill="none" aria-hidden="true">
      <path d="M9.13 3.4L2.22 15.4A1 1 0 003.09 17h13.82a1 1 0 00.87-1.6L10.87 3.4a1 1 0 00-1.74 0z" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" />
      <path d="M10 8v4M10 14.5v.5" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" />
    </svg>
  ),
  info: (
    <svg viewBox="0 0 20 20" fill="none" aria-hidden="true">
      <circle cx="10" cy="10" r="9" stroke="currentColor" strokeWidth="1.5" />
      <path d="M10 9v5M10 6.5v.5" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" />
    </svg>
  ),
};

function Toast({ alert, onDismiss }) {
  const { id, message, type, title, exiting } = alert;

  return (
    <div
      className={`toast toast-${type}${exiting ? ' toast-exit' : ''}`}
      role="alert"
      aria-live="assertive"
      aria-atomic="true"
    >
      <span className="toast-icon">{icons[type]}</span>

      <div className="toast-body">
        {title && <strong className="toast-title">{title}</strong>}
        <span className="toast-message">{message}</span>
      </div>

      <button
        className="toast-close"
        onClick={() => onDismiss(id)}
        aria-label="Dismiss notification"
      >
        <svg viewBox="0 0 16 16" fill="none" aria-hidden="true">
          <path d="M4 4l8 8M12 4l-8 8" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
        </svg>
      </button>

      {/* Progress bar — animates via CSS animation tied to toast lifetime */}
      <div className="toast-progress" />
    </div>
  );
}

export default function AlertContainer() {
  const { alerts, dismissAlert } = useAlert();

  if (alerts.length === 0) return null;

  return (
    <div className="toast-container" aria-label="Notifications">
      {alerts.map((alert) => (
        <Toast key={alert.id} alert={alert} onDismiss={dismissAlert} />
      ))}
    </div>
  );
}
