import { createContext, useContext, useState, useEffect } from 'react';
import { v4 as uuidv4 } from 'uuid';

const AuthContext = createContext(null);

const RESET_KEY = 'synthdata_users_reset_v2';
if (!localStorage.getItem(RESET_KEY)) {
  localStorage.removeItem('synthdata_users');
  localStorage.removeItem('synthdata_session');
  localStorage.removeItem('synthdata_dashboard');
  localStorage.setItem(RESET_KEY, 'done');
}

function hashPassword(password) {
  let hash = 0;
  for (let i = 0; i < password.length; i++) {
    const char = password.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash; 
  }
  return hash.toString(36);
}

function getUsers() {
  const stored = localStorage.getItem('synthdata_users');
  if (!stored) return [];
  try {
    const parsed = JSON.parse(stored);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

function saveUsers(users) {
  localStorage.setItem('synthdata_users', JSON.stringify(users));
}

function getCurrentSession() {
  const stored = localStorage.getItem('synthdata_session');
  if (!stored) return null;
  try {
    return JSON.parse(stored);
  } catch {
    return null;
  }
}

function saveSession(session) {
  if (session) {
    localStorage.setItem('synthdata_session', JSON.stringify(session));
  } else {
    localStorage.removeItem('synthdata_session');
  }
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const session = getCurrentSession();
    if (session) {
      const users = getUsers();
      const found = users.find((u) => u.id === session.userId);
      if (found) {
        setUser({ id: found.id, name: found.name, email: found.email });
      } else {
        saveSession(null);
      }
    }
    setLoading(false);
  }, []);

  const signup = (name, email, password) => {
    const users = getUsers();
    const cleanEmail = email.toLowerCase().trim();
    const exists = users.find((u) => u.email.toLowerCase() === cleanEmail);
    if (exists) {
      return { success: false, message: 'An account with this email already exists.' };
    }

    const newUser = {
      id: uuidv4(),
      name: name.trim(),
      email: cleanEmail,
      passwordHash: hashPassword(password.trim()),
      createdAt: new Date().toISOString(),
    };

    users.push(newUser);
    saveUsers(users);
    setUser({ id: newUser.id, name: newUser.name, email: newUser.email });
    saveSession({ userId: newUser.id });
    return { success: true };
  };

  const login = (email, password) => {
    const users = getUsers();
    const cleanEmail = email.toLowerCase().trim();
    // Accept the password as typed, or with stray leading/trailing spaces removed
    const hashes = [hashPassword(password), hashPassword(password.trim())];
    const found = users.find(
      (u) => u.email.toLowerCase().trim() === cleanEmail && hashes.includes(u.passwordHash)
    );

    if (!found) {
      return { success: false, message: 'Invalid email or password.' };
    }

    setUser({ id: found.id, name: found.name, email: found.email });
    saveSession({ userId: found.id });
    return { success: true };
  };

  const logout = () => {
    setUser(null);
    saveSession(null);
  };

  const value = { user, loading, signup, login, logout };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}

export default AuthContext;
