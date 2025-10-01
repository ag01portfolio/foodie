import React, { createContext, useContext, useState, useMemo, ReactNode, useEffect } from 'react';

interface User {
  name: string;
  email: string;
  picture: string;
}



interface AuthContextType {
  user: User | null;
  login: (username: string) => void;
  logout: () => void;
  loading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    try {
      const storedUser = localStorage.getItem('foodie-user');
      if (storedUser) {
        setUser(JSON.parse(storedUser));
      }
    } catch (error) {
      console.error("Failed to parse user from localStorage", error);
      localStorage.removeItem('foodie-user');
    } finally {
        setLoading(false);
    }
  }, []);

  const login = (username: string) => {
    // This is a simulated login.
    const mockUser: User = {
      name: username,
      email: `${username.toLowerCase().replace(' ', '.')}@example.com`,
      picture: `https://i.pravatar.cc/150?u=${username}` // Use username for consistent avatar
    };
    localStorage.setItem('foodie-user', JSON.stringify(mockUser));
    setUser(mockUser);
  };

  const logout = () => {
    localStorage.removeItem('foodie-user');
    setUser(null);
  };

  const value = useMemo(() => ({
    user,
    login,
    logout,
    loading
  }), [user, loading]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
