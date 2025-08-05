
import React, { createContext, useContext, useEffect, useState } from 'react';
import { makeRedirectUri, useAuthRequest } from 'expo-auth-session';
import * as WebBrowser from 'expo-web-browser';
import * as AppleAuthentication from 'expo-apple-authentication';
import { Platform } from 'react-native';
import { supabase } from '@/lib/supabase';
import { Session, User as SupabaseUser } from '@supabase/supabase-js';

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
  session: Session | null;
  loading: boolean;
  signOut: () => Promise<void>;
  signInWithGoogle: () => void;
  signInWithApple: () => Promise<void>;
  isSigninInProgress: boolean;
  signUp: (email: string, password: string) => Promise<{ error: any }>;
  signIn: (email: string, password: string) => Promise<{ error: any }>;
  getUserProfile: () => Promise<any>;
  getUserCatches: () => Promise<any[]>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  const [isSigninInProgress, setIsSigninInProgress] = useState(false);

  const [request, response, promptAsync] = useAuthRequest(
    {
      clientId: '1034603210241-de313rscvknssatbe2fnkh3pnjumcma4.apps.googleusercontent.com',
      scopes: ['openid', 'profile', 'email'],
      redirectUri: makeRedirectUri({
        scheme: 'expo-on-replit',
        useProxy: true,
      }),
    },
    discovery
  );

  useEffect(() => {
    // Get initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      if (session?.user) {
        setUserFromSupabase(session.user);
      }
      setLoading(false);
    });

    // Listen for auth changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      if (session?.user) {
        setUserFromSupabase(session.user);
      } else {
        setUser(null);
      }
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  useEffect(() => {
    if (response?.type === 'success') {
      const { authentication } = response;
      handleGoogleSignIn(authentication?.accessToken);
    }
  }, [response]);

  const setUserFromSupabase = (supabaseUser: SupabaseUser) => {
    setUser({
      id: supabaseUser.id,
      name: supabaseUser.user_metadata?.full_name || supabaseUser.user_metadata?.name || '',
      email: supabaseUser.email || '',
      photo: supabaseUser.user_metadata?.avatar_url || supabaseUser.user_metadata?.picture,
    });
  };

  const handleGoogleSignIn = async (token: string | undefined) => {
    if (!token) return;

    try {
      setLoading(true);
      
      // Get user info from Google
      const response = await fetch('https://www.googleapis.com/oauth2/v2/userinfo', {
        headers: { Authorization: `Bearer ${token}` },
      });
      const userInfo = await response.json();

      if (!userInfo.id) {
        console.error('No user ID received from Google');
        return;
      }

      // Generate a UUID for Supabase compatibility
      const generateUUID = () => {
        return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
          const r = Math.random() * 16 | 0;
          const v = c === 'x' ? r : (r & 0x3 | 0x8);
          return v.toString(16);
        });
      };

      const userId = generateUUID();

      // Create or update user in our database using the generated UUID
      const { data, error } = await supabase
        .from('users')
        .upsert({
          id: userId,
          email: userInfo.email,
          name: userInfo.name,
          avatar_url: userInfo.picture,
          provider: 'google',
          google_id: userInfo.id, // Store the Google ID separately
          updated_at: new Date().toISOString(),
        })
        .select()
        .single();

      if (error) {
        console.error('Error saving user to database:', error);
        return;
      }

      // Set user state
      setUser({
        id: userId,
        name: userInfo.name,
        email: userInfo.email,
        photo: userInfo.picture,
      });

      // Create a session object
      const userSession = {
        access_token: token,
        user: {
          id: userId,
          email: userInfo.email,
          user_metadata: {
            name: userInfo.name,
            picture: userInfo.picture,
          }
        }
      };
      setSession(userSession as any);

    } catch (error) {
      console.error('Error with Google sign-in:', error);
    } finally {
      setLoading(false);
      setIsSigninInProgress(false);
    }
  };

  const ensureUserInDatabase = async (supabaseUser: any, providerUserInfo: any, provider: string) => {
    try {
      // Check if user exists in our users table
      const { data: existingUser, error: fetchError } = await supabase
        .from('users')
        .select('*')
        .eq('id', supabaseUser.id)
        .single();

      if (fetchError && fetchError.code !== 'PGRST116') {
        console.error('Error fetching user:', fetchError);
        return;
      }

      // If user doesn't exist, create them
      if (!existingUser) {
        const { data, error } = await supabase
          .from('users')
          .insert({
            id: supabaseUser.id,
            email: supabaseUser.email,
            name: providerUserInfo?.name || supabaseUser.user_metadata?.full_name || supabaseUser.user_metadata?.name || '',
            avatar_url: providerUserInfo?.picture || supabaseUser.user_metadata?.avatar_url || supabaseUser.user_metadata?.picture || '',
            provider: provider,
          })
          .select()
          .single();

        if (error) {
          console.error('Error creating user in database:', error);
        }
      }
    } catch (error) {
      console.error('Error ensuring user in database:', error);
    }
  };

  const signInWithGoogle = async () => {
    setIsSigninInProgress(true);
    await promptAsync();
  };

  const signInWithApple = async () => {
    if (Platform.OS !== 'ios') {
      console.log('Apple Sign-In is only available on iOS');
      return;
    }

    try {
      setIsSigninInProgress(true);
      const credential = await AppleAuthentication.signInAsync({
        requestedScopes: [
          AppleAuthentication.AppleAuthenticationScope.FULL_NAME,
          AppleAuthentication.AppleAuthenticationScope.EMAIL,
        ],
      });

      if (credential.identityToken) {
        const { data, error } = await supabase.auth.signInWithIdToken({
          provider: 'apple',
          token: credential.identityToken,
        });

        if (error) {
          console.error('Apple sign-in error:', error);
          return;
        }

        // If sign in successful, ensure user data is in our users table
        if (data.user) {
          await ensureUserInDatabase(data.user, {
            name: credential.fullName ? `${credential.fullName.givenName} ${credential.fullName.familyName}` : '',
            email: credential.email,
          }, 'apple');
        }
      }
    } catch (error) {
      console.error('Apple sign-in error:', error);
    } finally {
      setIsSigninInProgress(false);
    }
  };

  const signUp = async (email: string, password: string) => {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
    });
    
    if (data.user && !error) {
      // Create user profile in our users table
      await supabase
        .from('users')
        .insert({
          id: data.user.id,
          email: data.user.email,
          name: '',
          provider: 'email',
        });
    }
    
    return { error };
  };

  const signIn = async (email: string, password: string) => {
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    return { error };
  };

  const getUserProfile = async () => {
    if (!user) return null;
    
    const { data, error } = await supabase
      .from('users')
      .select('*')
      .eq('id', user.id)
      .single();
      
    if (error) {
      console.error('Error fetching user profile:', error);
      return null;
    }
    
    return data;
  };

  const getUserCatches = async () => {
    if (!user) return [];
    
    const { data, error } = await supabase
      .from('catches')
      .select('*')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false });
      
    if (error) {
      console.error('Error fetching user catches:', error);
      return [];
    }
    
    return data || [];
  };

  const signOut = async () => {
    await supabase.auth.signOut();
    setUser(null);
    setSession(null);
  };

  return (
    <AuthContext.Provider value={{ 
      user, 
      session,
      loading, 
      signOut, 
      signInWithGoogle, 
      signInWithApple,
      isSigninInProgress,
      signUp,
      signIn,
      getUserProfile,
      getUserCatches
    }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
