import React, { createContext, useContext, useEffect, useState } from 'react';
import toast from 'react-hot-toast';

export interface User {
  id: string;
  email: string;
  role: string;
  full_name?: string;
  phone?: string;
  id_number?: string;
  user_type?: string;
}

interface AuthContextType {
  user: User | null;
  loading: boolean;
  isConfigured: boolean;
  signUp: (email: string, password: string, userData: Partial<User>) => Promise<void>;
  signIn: (email: string, password: string) => Promise<void>;
  signInWithIdNumber: (idNumber: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
  resetPassword: (email: string) => Promise<void>;
  updateProfile: (userData: Partial<User>) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(false);
  
  // Load user from localStorage with error handling
  useEffect(() => {
    const loadUser = async () => {
      setLoading(true);
      try {
        // Check if we have a user in localStorage
        const savedUser = localStorage.getItem('auth-user');
        if (savedUser) {
          try {
            const parsedUser = JSON.parse(savedUser);
            setUser(parsedUser);
          } catch (parseError) {
            console.error('Error parsing saved user:', parseError);
            localStorage.removeItem('auth-user');
            setUser(null);
          }
        } else {
          setUser(null);
        }
      } catch (error) {
        console.error('Error loading user:', error);
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    loadUser();
  }, []);

  // Map role to user_type for backward compatibility
  const getUserTypeFromRole = (role: string): string => {
    switch (role) {
      case 'admin': 
      case 'authority': 
      case 'authorities': 
        return 'authorities';
      case 'resident': return 'residents';
      case 'developer': return 'developers';
      case 'professional': return 'professionals';
      default: return role;
    }
  };

  const signUp = async (email: string, password: string, userData: Partial<User>) => {
    setLoading(true);
    try {
      // Create a mock user for development
      const mockUser = {
        id: Date.now().toString(),
        email,
        role: userData.role || 'resident',
        full_name: userData.full_name,
        phone: userData.phone,
        id_number: userData.id_number,
        user_type: getUserTypeFromRole(userData.role || 'resident')
      };
      
      // Save to localStorage
      localStorage.setItem('auth-user', JSON.stringify(mockUser));
      
      // Set the user in state
      setUser(mockUser);
      
      toast.success('נרשמת בהצלחה! (מצב דמו)');
    } catch (error: any) {
      console.error('Signup error:', error);
      toast.error('שגיאה בהרשמה (מצב דמו)');
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const signIn = async (email: string, password: string) => {
    setLoading(true);
    try {
      // For demo purposes, create a user based on the email
      // Admin login is simplified - any email with "admin" works
      const isAdminEmail = email.includes('admin') || email === 'oravraham217@gmail.com';
      
      const mockUser = {
        id: isAdminEmail ? '1' : '2',
        email,
        role: isAdminEmail ? 'admin' : 'resident',
        user_type: isAdminEmail ? 'admin' : 'residents',
        full_name: isAdminEmail ? 'מנהל מערכת' : 'משתמש לדוגמה',
      };
      
      localStorage.setItem('auth-user', JSON.stringify(mockUser));
      setUser(mockUser);
      toast.success(`התחברת בהצלחה ${isAdminEmail ? 'כמנהל' : ''}! (מצב דמו)`);
    } catch (error: any) {
      console.error('Signin error:', error);
      toast.error('שגיאה בהתחברות (מצב דמו)');
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const signInWithIdNumber = async (idNumber: string, password: string) =>
  {
    setLoading(true);
    try
    {
      const response = await fetch(`${API_BASE_URL}/auth/login-id`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ idNumber, password }),
      });

      if (!response.ok) throw new Error('שגיאה בהתחברות עם תעודת זהות');

      const data = await response.json();
      const { accessToken, user } = data;

      localStorage.setItem('accessToken', accessToken);
      localStorage.setItem('auth-user', JSON.stringify(user));
      setUser(user);

      toast.success('התחברת בהצלחה עם תעודת זהות!');
    } catch (error: any)
    {
      console.error('ID login error:', error);
      toast.error('שגיאה בהתחברות עם תעודת זהות');
      throw error;
    } finally
    {
      setLoading(false);
    }
  };

  const signOut = async () => {
    try {
      setLoading(true);

      // Clear localStorage
      localStorage.removeItem('auth-user');

      setUser(null);
      toast.success('התנתקת בהצלחה (מצב דמו)');      
    } finally {
      setLoading(false);
    }
  };

  const resetPassword = async (email: string) => {
    try {
      toast.success('נשלח מייל לאיפוס סיסמה (מצב דמו)');
    } catch (error: any) {
      console.error('Reset password error:', error);
      toast.error('שגיאה בשליחת מייל לאיפוס סיסמה (מצב דמו)');
      throw error;
    }
  };

  const updateProfile = async (userData: Partial<User>) => {
    try {
      if (!user) throw new Error('No user logged in');
      
      // Update the mock user in localStorage
      const updatedUser = { ...user, ...userData };
      localStorage.setItem('auth-user', JSON.stringify(updatedUser));
      setUser(updatedUser);
      toast.success('הפרופיל עודכן בהצלחה (מצב דמו)');
    } catch (error: any) {
      console.error('Update profile error:', error);
      toast.error('שגיאה בעדכון הפרופיל (מצב דמו)');
      throw error;
    }
  };

  const value = {
    user,
    loading,
    isConfigured: true, // Set to true for demo mode
    signUp,
    signIn,
    signInWithIdNumber,
    signOut,
    resetPassword,
    updateProfile,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};