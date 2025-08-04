
import React, { createContext, useContext, useEffect, useState } from 'react';
import { User, Session } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface AuthContextType {
  user: User | null;
  session: Session | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<{ error: Error | null }>;
  signUp: (
    email: string,
    firstName: string,
    lastName: string,
    preferredName: string,
    phone: string,
    state: string
  ) => Promise<{ error: Error | null }>;
  signOut: () => Promise<void>;
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
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    console.log('[AUTH_CONTEXT] Setting up auth state listener...');
    
    // Set up auth state listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        console.log('[AUTH_STATE_CHANGE] Event:', event);
        console.log('[AUTH_STATE_CHANGE] Session:', session);
        console.log('[AUTH_STATE_CHANGE] User:', session?.user);
        
        if (event === 'SIGNED_IN') {
          console.log('[AUTH_STATE_CHANGE] User signed in successfully');
          console.log('[AUTH_STATE_CHANGE] Provider:', session?.user?.app_metadata?.provider);
          console.log('[AUTH_STATE_CHANGE] Providers:', session?.user?.app_metadata?.providers);
        } else if (event === 'SIGNED_OUT') {
          console.log('[AUTH_STATE_CHANGE] User signed out');
        } else if (event === 'TOKEN_REFRESHED') {
          console.log('[AUTH_STATE_CHANGE] Token refreshed');
        } else if (event === 'USER_UPDATED') {
          console.log('[AUTH_STATE_CHANGE] User updated');
        }
        
        setSession(session);
        setUser(session?.user ?? null);
        setLoading(false);
      }
    );

    // Check for existing session
    console.log('[AUTH_CONTEXT] Checking for existing session...');
    supabase.auth.getSession().then(({ data: { session }, error }) => {
      console.log('[AUTH_CONTEXT] Initial session check result:');
      console.log('[AUTH_CONTEXT] Session:', session);
      console.log('[AUTH_CONTEXT] Error:', error);
      
      if (error) {
        console.error('[AUTH_CONTEXT] Error getting initial session:', error);
      }
      
      setSession(session);
      setUser(session?.user ?? null);
      setLoading(false);
    });

    return () => {
      console.log('[AUTH_CONTEXT] Cleaning up auth subscription');
      subscription.unsubscribe();
    };
  }, []);

  const signIn = async (email: string, password: string) => {
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      toast({
        variant: "destructive",
        title: "Authentication Error",
        description: error.message,
      });
    }

    return { error };
  };

  const MAX_RETRIES = 2;
  const RETRY_DELAY = 1000;

  const signUp = async (
    email: string,
    firstName: string,
    lastName: string,
    preferredName: string,
    phone: string,
    state: string
  ) => {
    const tempPassword = Math.random().toString(36).slice(-8) + Math.random().toString(36).slice(-8);
    const effectivePreferredName = preferredName.trim() || firstName;

    const metadata = {
      role: 'client',
      first_name: firstName,
      last_name: lastName,
      preferred_name: effectivePreferredName,
      phone,
      state
    };

    let attempt = 0;
    let success = false;
    let lastError: Error | null = null;

    while (!success && attempt < MAX_RETRIES) {
      try {
        if (attempt > 0) await new Promise(resolve => setTimeout(resolve, RETRY_DELAY));

        const { data: authData, error: authError } = await supabase.auth.signUp({
          email,
          password: tempPassword,
          options: {
            data: metadata
          }
        });

        if (authError) throw authError;
        if (!authData.user) throw new Error("No user returned");

        success = true;
        toast({
          title: "Registration Successful",
          description: "Please complete your profile.",
        });
      } catch (error) {
        lastError = error instanceof Error ? error : new Error(String(error));
        attempt++;
      }
    }

    if (!success) {
      toast({
        variant: "destructive",
        title: "Registration Error",
        description: lastError?.message || "Failed to create account",
      });
      return { error: lastError };
    }

    return { error: null };
  };

  const signOut = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) {
      toast({
        variant: "destructive",
        title: "Sign Out Error",
        description: error.message,
      });
    }
  };

  const value = {
    user,
    session,
    loading,
    signIn,
    signUp,
    signOut,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
