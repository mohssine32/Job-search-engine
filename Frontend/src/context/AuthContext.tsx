import React, { createContext, useState, useContext, useEffect, ReactNode } from 'react';
import { jwtDecode } from 'jwt-decode';

// Définir le type pour les données de l'utilisateur décodées du token
interface User {
  token: string;
  email: string;
  sub: string; // C'est l'ID de l'utilisateur
  role: 'CANDIDATE' | 'RECRUITER' | 'ADMIN';
}

// Définir le type pour la valeur du contexte
interface AuthContextType {
  user: User | null;
  login: (token: string) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | null>(null);

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);

  const syncUserFromToken = (token: string | null) => {
    if (!token) {
      setUser(null);
      return;
    }

    try {
      const decodedUser: any = jwtDecode(token);
      setUser({ token, ...decodedUser });
    } catch (error) {
      console.error("Failed to decode token:", error);
      localStorage.removeItem('user_token');
      setUser(null);
    }
  };

  useEffect(() => {
    syncUserFromToken(localStorage.getItem('user_token'));

    const handleStorage = (event: StorageEvent) => {
      if (event.key === 'user_token') {
        syncUserFromToken(event.newValue);
      }
    };

    window.addEventListener('storage', handleStorage);
    return () => window.removeEventListener('storage', handleStorage);
  }, []);

  const login = (token: string) => {
    localStorage.setItem('user_token', token);
    syncUserFromToken(token);
  };

  const logout = () => {
    localStorage.removeItem('user_token');
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

// Hook personnalisé pour utiliser le contexte
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === null) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};