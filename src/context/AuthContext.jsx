import { useMemo, useState } from 'react';
import AuthContext from './auth-context.js';
const STORAGE_KEY = 'projectsphere_auth';

const dashboardPaths = {
  student: '/dashboard/student',
  lecturer: '/dashboard/lecturer',
  recruiter: '/dashboard/recruiter',
  admin: '/dashboard/lecturer',
};

const roleLabels = {
  student: 'Student',
  lecturer: 'Lecturer',
  recruiter: 'Recruiter',
  admin: 'Admin',
};

const getStoredAuth = () => {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    return saved ? JSON.parse(saved) : null;
  } catch {
    return null;
  }
};

const saveAuth = (payload) => {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(payload));
};

const clearAuth = () => {
  localStorage.removeItem(STORAGE_KEY);
};

const createSessionToken = (email) => `session-token-${email}-${Date.now()}`;

export function AuthProvider({ children }) {
  const [auth, setAuth] = useState(getStoredAuth);

  const login = async ({ email, password, role }) => {
    if (!email || !password) {
      throw new Error('Please enter both email and password.');
    }

    const selectedRole = role || 'student';
    const payload = {
      token: createSessionToken(email),
      user: {
        id: crypto.randomUUID(),
        name: email.split('@')[0] || 'ProjectSphere User',
        email,
        role: selectedRole,
      },
    };

    setAuth(payload);
    saveAuth(payload);
    return payload;
  };

  const register = async (formData) => {
    if (!formData.fullName || !formData.email || !formData.password || !formData.role) {
      throw new Error('Please complete the required registration details.');
    }

    if (formData.password.length < 8) {
      throw new Error('Password must be at least 8 characters.');
    }

    const payload = {
      token: createSessionToken(formData.email),
      user: {
        id: crypto.randomUUID(),
        name: formData.fullName,
        email: formData.email,
        role: formData.role,
        profile: formData,
      },
    };

    setAuth(payload);
    saveAuth(payload);
    return payload;
  };

  const loginWithGoogle = async (role = 'student') => {
    const googleAuthUrl = import.meta.env.VITE_GOOGLE_AUTH_URL;

    if (googleAuthUrl) {
      window.location.href = `${googleAuthUrl}?role=${role}`;
      return null;
    }

    const payload = {
      token: createSessionToken('google.user@projectsphere.dev'),
      user: {
        id: crypto.randomUUID(),
        name: 'Google User',
        email: 'google.user@projectsphere.dev',
        role,
      },
    };

    setAuth(payload);
    saveAuth(payload);
    return payload;
  };

  const logout = () => {
    clearAuth();
    setAuth(null);
  };

  const value = useMemo(() => ({
    user: auth?.user || null,
    token: auth?.token || null,
    isAuthenticated: Boolean(auth?.token),
    roleLabels,
    dashboardPaths,
    login,
    register,
    loginWithGoogle,
    logout,
  }), [auth]);

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}
