import { createContext, useCallback, useRef, useState } from 'react';

export const AlertContext = createContext(null);

export function AlertProvider({ children }) {
  const [alerts, setAlerts] = useState([]);
  const timersRef = useRef({});

  const dismissAlert = useCallback((id) => {
    // mark as exiting so the CSS exit animation plays
    setAlerts((prev) =>
      prev.map((a) => (a.id === id ? { ...a, exiting: true } : a))
    );
    // remove from DOM after animation completes (300 ms)
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

  return (
    <AlertContext.Provider value={{ alerts, showAlert, dismissAlert }}>
      {children}
    </AlertContext.Provider>
  );
}
