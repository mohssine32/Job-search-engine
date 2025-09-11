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

  useEffect(() => {
    const token = localStorage.getItem('user_token');
    if (token) {
      try {
        const decodedUser: any = jwtDecode(token);
        setUser({ token, ...decodedUser });
      } catch (error) {
        console.error("Failed to decode token:", error);
        localStorage.removeItem('user_token');
      }
    }
  }, []);

  const login = (token: string) => {
    localStorage.setItem('user_token', token);
    const decodedUser: any = jwtDecode(token);
    setUser({ token, ...decodedUser });
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