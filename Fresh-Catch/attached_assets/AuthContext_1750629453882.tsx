import React, { createContext, useContext, useEffect, useState } from 'react';
import { makeRedirectUri, useAuthRequest } from 'expo-auth-session';
import * as WebBrowser from 'expo-web-browser';

WebBrowser.maybeCompleteAuthSession();

const discovery = {
  authorizationEndpoint: 'https://accounts.google.com/o/oauth2/v2/auth',
  tokenEndpoint: 'https://www.googleapis.com/oauth2/v4/token',
  revocationEndpoint: 'https://oauth2.googleapis.com/revoke',
};

interface User {
  id: string;
  name: string;
  email: string;
  photo?: string;
}

interface AuthContextType {
  user: User | null;
  setUser: (user: User | null) => void;
  isLoading: boolean;
  signOut: () => void;
  signIn: () => void;
  isSigninInProgress: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isSigninInProgress, setIsSigninInProgress] = useState(false);

  const [request, response, promptAsync] = useAuthRequest(
    {
      clientId: '1034603210241-de313rscvknssatbe2fnkh3pnjumcma4.apps.googleusercontent.com',
      scopes: ['openid', 'profile', 'email'],
      redirectUri: 'https://auth.expo.io/@anonymous/expo-on-replit--',
    },
    discovery
  );

  useEffect(() => {
    if (response?.type === 'success') {
      const { authentication } = response;
      fetchUserInfo(authentication?.accessToken);
    }
  }, [response]);

  const fetchUserInfo = async (token: string | undefined) => {
    if (!token) return;

    try {
      setIsLoading(true);
      const response = await fetch('https://www.googleapis.com/oauth2/v2/userinfo', {
        headers: { Authorization: `Bearer ${token}` },
      });
      const userInfo = await response.json();

      setUser({
        id: userInfo.id,
        name: userInfo.name || '',
        email: userInfo.email,
        photo: userInfo.picture || undefined,
      });
    } catch (error) {
      console.error('Error fetching user info:', error);
    } finally {
      setIsLoading(false);
      setIsSigninInProgress(false);
    }
  };

  const signIn = async () => {
    setIsSigninInProgress(true);
    await promptAsync();
  };

  const signOut = () => {
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ 
      user, 
      setUser, 
      isLoading, 
      signOut, 
      signIn, 
      isSigninInProgress 
    }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}