
import React, { createContext, useContext, useEffect, useState } from 'react';
import { User, Session } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface AuthContextType {
  user: User | null;
  session: Session | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<{ error: any }>;
  signUp: (email: string, password: string, role?: 'client' | 'clinician', firstName?: string, lastName?: string) => Promise<{ error: any }>;
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
    // Set up auth state listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        setSession(session);
        setUser(session?.user ?? null);
        setLoading(false);
      }
    );

    // Check for existing session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setUser(session?.user ?? null);
      setLoading(false);
    });

    return () => subscription.unsubscribe();
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

  const signUp = async (email: string, password: string, role: 'client' | 'clinician' = 'client', firstName?: string, lastName?: string) => {
    console.log('🔵 AUTH CONTEXT - signUp function called with parameters:');
    console.log('📧 Email:', email);
    console.log('🔒 Password length:', password?.length);
    console.log('👤 Role:', role);
    console.log('👤 First Name:', firstName);
    console.log('👤 Last Name:', lastName);
    
    const redirectUrl = `${window.location.origin}/`;
    console.log('🌐 Redirect URL:', redirectUrl);
    
    const signUpPayload = {
      email,
      password,
      options: {
        emailRedirectTo: redirectUrl,
        data: {
          role,
          first_name: firstName,
          last_name: lastName
        }
      }
    };
    
    console.log('📦 Full signUp payload being sent to Supabase:');
    console.log(JSON.stringify(signUpPayload, null, 2));
    
    console.log('🚀 Calling supabase.auth.signUp...');
    
    try {
      const result = await supabase.auth.signUp(signUpPayload);
      
      console.log('✅ Supabase signUp response received:');
      console.log('📊 Full result object:', JSON.stringify(result, null, 2));
      console.log('❌ Error object:', result.error);
      console.log('👤 User object:', result.data?.user);
      console.log('🔑 Session object:', result.data?.session);
      
      if (result.error) {
        console.error('❌ SIGNUP ERROR DETECTED:');
        console.error('Error message:', result.error.message);
        console.error('Error status:', result.error.status);
        console.error('Error details:', result.error);
        
        toast({
          variant: "destructive",
          title: "Registration Error",
          description: result.error.message,
        });
      } else {
        console.log('✅ SIGNUP SUCCESS - No error detected');
        toast({
          title: "Registration Successful",
          description: "Please check your email to confirm your account.",
        });
      }

      return { error: result.error };
    } catch (exception) {
      console.error('💥 EXCEPTION CAUGHT during signUp:');
      console.error('Exception type:', typeof exception);
      console.error('Exception message:', exception?.message);
      console.error('Full exception:', exception);
      
      toast({
        variant: "destructive",
        title: "Registration Error",
        description: "An unexpected error occurred during registration.",
      });
      
      return { error: exception };
    }
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
