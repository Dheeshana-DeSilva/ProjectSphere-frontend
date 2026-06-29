import { Navigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth.js';

function RoleRedirect() {
  const { dashboardPaths, user } = useAuth();
  const destination = dashboardPaths[user?.role] || '/dashboard/student';

  return <Navigate to={destination} replace />;
}

export default RoleRedirect;
