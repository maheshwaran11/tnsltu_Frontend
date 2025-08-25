import { createContext, useContext, useState, useEffect } from 'react';
import { getProfileAPI } from './api';

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [token, setToken] = useState(() => localStorage.getItem('token') || null);
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(false);

  // 🔑 Make fetchProfile reusable
  const fetchProfile = async () => {
    if (!token) {
      setProfile(null);
      return;
    }
    setLoading(true);
    try {
      const response = await getProfileAPI(token);
      if (response.status === 200) {
        setProfile(response.data);
      } else {
        logout(); // Clean up
      }
    } catch (error) {
      logout(); // Clean up
    } finally {
      setLoading(false);
    }
  };

  // Run fetchProfile when token changes
  useEffect(() => {
    fetchProfile();
  }, [token]);

  const login = (newToken) => {
    setToken(newToken);
    localStorage.setItem('token', newToken);
  };

  const logout = () => {
    setToken(null);
    setProfile(null);
    localStorage.removeItem('token');
  };

  return (
    <AuthContext.Provider
      value={{
        token,
        profile,
        setProfile,
        login,
        logout,
        fetchProfile,   // ✅ now available in components
        loading,
        isLoggedIn: !!token,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
