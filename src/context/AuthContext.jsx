import { createContext, useContext, useEffect, useMemo, useState, useCallback } from 'react';
import api from '../api/axios';

const AuthContext = createContext(null);

const readStoredUser = () => {
  try {
    const cached = localStorage.getItem('muldhon_user');
    if (!cached || cached === 'undefined' || cached === 'null') return null;
    return JSON.parse(cached);
  } catch {
    localStorage.removeItem('muldhon_user');
    return null;
  }
};

const DEMO_USER = {
  _id: 'demo-admin',
  fullName: 'Arghya Biswas',
  email: 'admin@muldhon.com',
  role: 'admin',
  avatar: 'https://i.pravatar.cc/150?u=admin',
  demo: true,
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(readStoredUser);
  const [loading, setLoading] = useState(true);

  const persist = useCallback((token, nextUser) => {
    if (!nextUser || typeof nextUser !== 'object') return false;
    if (token) localStorage.setItem('muldhon_token', token);
    localStorage.setItem('muldhon_user', JSON.stringify(nextUser));
    setUser(nextUser);
    return true;
  }, []);

  useEffect(() => {
    const boot = async () => {
      const token = localStorage.getItem('muldhon_token');
      if (!token) return setLoading(false);
      try {
        const { data } = await api.get('/auth/me');
        persist(null, data.user);
      } catch {
        /* keep cached user — server may simply be offline */
      } finally {
        setLoading(false);
      }
    };
    boot();
  }, [persist]);

  const login = useCallback(
    async (email, password) => {
      try {
        const { data } = await api.post('/auth/login', { email, password });
        if (persist(data.token, data.user)) return { ok: true };
        // Server reachable but sent no user (e.g. static host) — fall back to demo.
        persist('demo-token', { ...DEMO_USER, email });
        return { ok: true, demo: true };
      } catch (error) {
        // Offline demo mode: any email + 4+ char password signs in locally.
        if (!error.response && password?.length >= 4) {
          persist('demo-token', { ...DEMO_USER, email });
          return { ok: true, demo: true };
        }
        return { ok: false, message: error.response?.data?.message || 'Login failed' };
      }
    },
    [persist]
  );

  const register = useCallback(
    async (payload) => {
      try {
        const { data } = await api.post('/auth/register', payload);
        if (persist(data.token, data.user)) return { ok: true };
        persist('demo-token', { ...DEMO_USER, ...payload });
        return { ok: true, demo: true };
      } catch (error) {
        if (!error.response) {
          persist('demo-token', { ...DEMO_USER, ...payload, role: payload.role });
          return { ok: true, demo: true };
        }
        return { ok: false, message: error.response?.data?.message || 'Registration failed' };
      }
    },
    [persist]
  );

  const logout = useCallback(async () => {
    try {
      await api.post('/auth/logout');
    } catch {
      /* ignore */
    }
    localStorage.removeItem('muldhon_token');
    localStorage.removeItem('muldhon_user');
    setUser(null);
  }, []);

  const updateProfile = useCallback(
    async (payload) => {
      try {
        const { data } = await api.put('/auth/me', payload);
        persist(null, data.user);
        return { ok: true };
      } catch (error) {
        if (!error.response) {
          persist(null, { ...user, ...payload });
          return { ok: true, demo: true };
        }
        return { ok: false, message: error.response?.data?.message || 'Update failed' };
      }
    },
    [persist, user]
  );

  const value = useMemo(
    () => ({ user, loading, login, register, logout, updateProfile, setUser }),
    [user, loading, login, register, logout, updateProfile]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used inside <AuthProvider>');
  return ctx;
};

export default AuthContext;
