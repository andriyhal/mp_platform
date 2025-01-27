import React, { createContext, useContext, useState, useEffect } from 'react';
import { useRouter } from 'next/navigation'

// Add interface for the context type
interface AuthContextType {
  user: any | string | null;
  token: string | null;
  loading: boolean;
  login: (credentials: any) => Promise<void>;
  logout: () => void;
  
}

// Create context with the type and initial value
const AuthContext = createContext<AuthContextType>({
  user: null,
  token: null,
  loading: true,
  login: async () => {},
  logout: () => {},
  
});

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<any | string | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
 

  const router = useRouter()

  // Load token and user from localStorage when the app initializes
  useEffect(() => {
    const loadUserFromStorage = () => {
      const storedToken = localStorage.getItem('token');
      const storedUser = localStorage.getItem('user');
     

      if (storedToken && storedUser) {
        setToken(storedToken);
        try {
          setUser(JSON.parse(storedUser));
        } catch (error) {
          console.error('Error parsing stored user:', error);
        }
      } else {
        setToken('missing');
        setUser('missing');
      }
      setLoading(false);
    };

    loadUserFromStorage();
  }, []);

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
      localStorage.setItem('token', token );
      localStorage.setItem('user', JSON.stringify(user ));

      // Update state
      setToken(token);
      setUser(user);

      router.push('/dashboard');

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
    if (!token) return;

    try {
      // Optionally validate or refresh token by calling an API
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_ROOT}/auth/refresh`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ token }),
      });
      const data = await response.json();
      const { newToken } = data;

      localStorage.setItem('token', newToken);
      setToken(newToken);
    } catch (error) {
      console.error('Token validation failed:', error);
      
      logout();
      throw error; // Re-throw error to be handled in the UI
    }
  };

  useEffect(() => {
    // Optionally, validate the token on app load
    validateToken();
  }, [token]);

  return (
    <AuthContext.Provider value={{ user, token, loading, login, logout  }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
