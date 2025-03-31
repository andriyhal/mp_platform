import React, { createContext, useContext, useState, useEffect } from 'react';
import { useRouter } from 'next/navigation'

// Add interface for the context type
interface AuthContextType {
  user: any | string | null;
  token: string | null;
  loading: boolean;
  login: (credentials: any) => Promise<void>;
  logout: () => void;
  validateToken: () => Promise<void>;
}

// Create context with the type and initial value
const AuthContext = createContext<AuthContextType>({
  user: null,
  token: null,
  loading: true,
  login: async () => { },
  logout: () => { },
  validateToken: async () => { },
});

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<any | string | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);


  const router = useRouter()

  // Load token and user from localStorage when the app initializes
  useEffect(() => {
    const loadUserFromStorage = async () => {
      const storedToken = localStorage.getItem('token');
      const storedUser = localStorage.getItem('user');

      if (storedToken && storedUser) {
        try {
          await validateToken(); // Validate token first
          setToken(storedToken);
          setUser(JSON.parse(storedUser));
        } catch (error) {
          // If validation fails, clear credentials
          setToken('missing');
          setUser('missing');
        }
      } else {
        setToken('missing');
        setUser('missing');
      }
      setLoading(false);
    };

    loadUserFromStorage();
  }, []); // Remove token dependency to avoid loops

  // Login function to authenticate the user and get a token
  const login = async (credentials: { email: string; password: string }) => {

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_ROOT}/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(credentials),
      });

      if (response.status === 401) {
        //console.error('Login failed: Invalid credentials');

        throw new Error('Invalid email or password. Please try again.'); // Throw error if login fails

      }

      if (response.status === 403) {
        throw new Error('Too many login attempts. Please try again later'); // Throw error if login fails

      }

      const data = await response.json();


      const { token, user } = data;
      //console.log(data)
      // Store token and user in localStorage
      localStorage.setItem('token', token);
      localStorage.setItem('user', JSON.stringify(user));

      // Update state
      setToken(token);
      setUser(user);

      //router.push('/dashboard');
      router.push('/dash');

    } catch (err) {
      console.error('Login failed:', err);
      throw err; // Re-throw error to be handled in the UI
    }
  };

  // Logout function to clear user and token
  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setToken('');
    setUser('');

    router.push('/');
  };

  // Function to validate token and refresh if necessary
  const validateToken = async () => {
    const storedToken = localStorage.getItem('token');
    if (!storedToken) return;

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_ROOT}/auth/refresh`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ token: storedToken }),
      });
      const data = await response.json();
      const { newToken, user: refreshedUser } = data;

      // Update both token and user data
      localStorage.setItem('token', newToken);
      localStorage.setItem('user', JSON.stringify(refreshedUser));

      setToken(newToken);
      setUser(refreshedUser);
    } catch (error) {
      console.error('Token validation failed:', error);
      logout();
      throw error;
    }
  };

  return (
    <AuthContext.Provider value={{ user, token, loading, login, logout, validateToken }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
