import { createContext, useCallback, useRef, useState } from 'react';
import ConfirmDialog from '../components/ConfirmDialog.jsx';

export const AlertContext = createContext(null);

export function AlertProvider({ children }) {
  const [alerts, setAlerts] = useState([]);
  const [confirmState, setConfirmState] = useState(null);
  const timersRef = useRef({});
  const confirmResolverRef = useRef(null);

  const dismissAlert = useCallback((id) => {
    setAlerts((prev) =>
      prev.map((a) => (a.id === id ? { ...a, exiting: true } : a))
    );
    setTimeout(() => {
      setAlerts((prev) => prev.filter((a) => a.id !== id));
    }, 320);
    clearTimeout(timersRef.current[id]);
    delete timersRef.current[id];
  }, []);

  const showAlert = useCallback(
    ({ message, type = 'info', title, duration = 4000 }) => {
      const id = crypto.randomUUID();
      setAlerts((prev) => [...prev, { id, message, type, title, exiting: false }]);

      if (duration > 0) {
        timersRef.current[id] = setTimeout(() => dismissAlert(id), duration);
      }

      return id;
    },
    [dismissAlert]
  );

  const showConfirm = useCallback(
    ({
      title = 'Confirm action',
      message = 'Are you sure you want to continue?',
      confirmLabel = 'Confirm',
      cancelLabel = 'Cancel',
      variant = 'primary',
    }) => new Promise((resolve) => {
      confirmResolverRef.current = resolve;
      setConfirmState({ title, message, confirmLabel, cancelLabel, variant });
    }),
    []
  );

  const closeConfirm = useCallback((result) => {
    setConfirmState(null);
    confirmResolverRef.current?.(result);
    confirmResolverRef.current = null;
  }, []);

  return (
    <AlertContext.Provider value={{ alerts, showAlert, dismissAlert, showConfirm }}>
      {children}
      <ConfirmDialog
        state={confirmState}
        onConfirm={() => closeConfirm(true)}
        onCancel={() => closeConfirm(false)}
      />
    </AlertContext.Provider>
  );
}
