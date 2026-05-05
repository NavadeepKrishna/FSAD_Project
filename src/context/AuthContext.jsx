import { createContext, useContext, useState } from 'react';

const AuthContext = createContext(null);

const ADMIN_CREDENTIALS = { email: 'admin@technova.com', password: 'admin123' };

const SEED_USERS = [
  { id: 'USR-001', name: 'Arjun Mehta',  email: 'arjun@svce.ac.in',  password: 'arjun123', dept: 'CSE' },
  { id: 'USR-002', name: 'Priya Sharma', email: 'priya@svce.ac.in',  password: 'priya123', dept: 'ECE' },
];

export function AuthProvider({ children }) {
  const [currentUser, setCurrentUser] = useState(null);
  const [users, setUsers] = useState(SEED_USERS);

  // Single unified login — handles both admin and regular users
  function login(email, password) {
    // Check admin first
    if (email === ADMIN_CREDENTIALS.email && password === ADMIN_CREDENTIALS.password) {
      const adminUser = { role: 'admin', name: 'Admin', email };
      setCurrentUser(adminUser);
      return { success: true, role: 'admin' };
    }
    // Check registered users
    const found = users.find(u => u.email === email && u.password === password);
    if (found) {
      setCurrentUser({ ...found, role: 'user' });
      return { success: true, role: 'user' };
    }
    return { success: false, error: 'Invalid email or password.' };
  }

  function registerUser({ name, email, password, dept }) {
    if (email === ADMIN_CREDENTIALS.email) {
      return { success: false, error: 'An account with this email already exists.' };
    }
    if (users.find(u => u.email === email)) {
      return { success: false, error: 'An account with this email already exists.' };
    }
    const newUser = {
      id: 'USR-' + String(users.length + 1).padStart(3, '0'),
      name, email, password, dept,
    };
    setUsers(prev => [...prev, newUser]);
    setCurrentUser({ ...newUser, role: 'user' });
    return { success: true };
  }

  function logout() {
    setCurrentUser(null);
  }

  return (
    <AuthContext.Provider value={{ currentUser, users, login, registerUser, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}