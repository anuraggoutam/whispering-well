
import React, { createContext, useState, useContext, useEffect, ReactNode } from 'react';
import { useToast } from '@/components/ui/use-toast';
import { currentUser } from '@/data/mockData';

interface AuthContextType {
  user: any | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (username: string, email: string, password: string) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<any | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const { toast } = useToast();

  useEffect(() => {
    // Check if user is stored in localStorage (simulating persistence)
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
    setIsLoading(false);
  }, []);

  const login = async (email: string, password: string) => {
    try {
      setIsLoading(true);
      // Simulate API call delay
      await new Promise((resolve) => setTimeout(resolve, 1000));
      
      // Simulate successful login with mock data
      // In a real app, this would be an API call to the backend
      if (email === 'jane@example.com' && password === 'password123') {
        setUser(currentUser);
        localStorage.setItem('user', JSON.stringify(currentUser));
        toast({
          title: 'Login successful',
          description: 'Welcome back!',
        });
      } else {
        throw new Error('Invalid credentials');
      }
    } catch (error) {
      toast({
        title: 'Login failed',
        description: error instanceof Error ? error.message : 'Please check your credentials',
        variant: 'destructive',
      });
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (username: string, email: string, password: string) => {
    try {
      setIsLoading(true);
      // Simulate API call delay
      await new Promise((resolve) => setTimeout(resolve, 1000));
      
      // Simulate successful registration
      // In a real app, this would be an API call to the backend
      const newUser = {
        ...currentUser,
        username,
        email,
      };
      
      setUser(newUser);
      localStorage.setItem('user', JSON.stringify(newUser));
      toast({
        title: 'Registration successful',
        description: 'Your account has been created',
      });
    } catch (error) {
      toast({
        title: 'Registration failed',
        description: error instanceof Error ? error.message : 'Please try again',
        variant: 'destructive',
      });
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('user');
    toast({
      title: 'Logged out',
      description: 'You have been logged out successfully',
    });
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        isLoading,
        login,
        register,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
