import { createContext, useContext, useState, useEffect } from 'react';
import { v4 as uuidv4 } from 'uuid';

const AuthContext = createContext(null);

const SESSION_DAYS = 7;
const MAX_ATTEMPTS = 5;
const LOCK_MS = 60 * 1000; // 1 minute

// One-time full cleanup: removes all saved accounts, sessions and dashboard files
const RESET_KEY = 'synthdata_full_reset_v3';
try {
  if (!localStorage.getItem(RESET_KEY)) {
    const keysToRemove = [];
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (
        key === 'synthdata_users' ||
        key === 'synthdata_session' ||
        key === 'synthdata_dashboard' ||
        key === 'synthdata_attempts' ||
        (key && key.startsWith('synthdata_files_'))
      ) {
        keysToRemove.push(key);
      }
    }
    keysToRemove.forEach((k) => localStorage.removeItem(k));
    localStorage.setItem(RESET_KEY, 'done');
  }
} catch {
  // ignore storage errors
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

function newSession(userId) {
  return {
    userId,
    expiresAt: Date.now() + SESSION_DAYS * 24 * 60 * 60 * 1000,
  };
}

function getAttempts() {
  const stored = localStorage.getItem('synthdata_attempts');
  if (!stored) return {};
  try {
    const parsed = JSON.parse(stored);
    return parsed && typeof parsed === 'object' ? parsed : {};
  } catch {
    return {};
  }
}

function saveAttempts(attempts) {
  localStorage.setItem('synthdata_attempts', JSON.stringify(attempts));
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const session = getCurrentSession();
    if (session) {
      // Session must have a valid, unexpired date
      const valid = session.expiresAt && session.expiresAt > Date.now();
      if (valid) {
        const users = getUsers();
        const found = users.find((u) => u.id === session.userId);
        if (found) {
          setUser({ id: found.id, name: found.name, email: found.email });
        } else {
          saveSession(null);
        }
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
    saveSession(newSession(newUser.id));
    return { success: true };
  };

  const login = (email, password) => {
    const cleanEmail = email.toLowerCase().trim();
    const attempts = getAttempts();
    const record = attempts[cleanEmail];

    // Locked after too many wrong attempts
    if (record && record.lockUntil && record.lockUntil > Date.now()) {
      const secs = Math.ceil((record.lockUntil - Date.now()) / 1000);
      return {
        success: false,
        message: `Too many failed attempts. Please try again in ${secs} second${secs > 1 ? 's' : ''}.`,
      };
    }

    const users = getUsers();
    // Accept the password as typed, or with stray leading/trailing spaces removed
    const hashes = [hashPassword(password), hashPassword(password.trim())];
    const found = users.find(
      (u) => u.email.toLowerCase().trim() === cleanEmail && hashes.includes(u.passwordHash)
    );

    if (!found) {
      const base = record && !record.lockUntil ? record.count : 0;
      const count = base + 1;
      if (count >= MAX_ATTEMPTS) {
        attempts[cleanEmail] = { count, lockUntil: Date.now() + LOCK_MS };
        saveAttempts(attempts);
        return {
          success: false,
          message: 'Too many failed attempts. Please try again in 1 minute.',
        };
      }
      attempts[cleanEmail] = { count };
      saveAttempts(attempts);
      const left = MAX_ATTEMPTS - count;
      return {
        success: false,
        message: `Invalid email or password. ${left} attempt${left > 1 ? 's' : ''} left.`,
      };
    }

    // Successful login clears the failed-attempt counter
    if (attempts[cleanEmail]) {
      delete attempts[cleanEmail];
      saveAttempts(attempts);
    }

    setUser({ id: found.id, name: found.name, email: found.email });
    saveSession(newSession(found.id));
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
