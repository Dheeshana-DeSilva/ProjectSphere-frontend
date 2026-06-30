import { useContext } from 'react';
import { AlertContext } from '../context/AlertContext.jsx';

export function useAlert() {
  const ctx = useContext(AlertContext);
  if (!ctx) throw new Error('useAlert must be used inside <AlertProvider>');
  return ctx;
}
