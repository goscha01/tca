import React, { createContext, useContext, useEffect, useState } from 'react'
import { User, supabase } from './supabase'

interface AuthContextType {
  user: User | null
  loading: boolean
  signIn: (email: string, password: string) => Promise<{ error: any }>
  signUp: (email: string, password: string, companyName: string, companyUrl?: string) => Promise<{ error: any }>
  signOut: () => Promise<void>
  resetPassword: (email: string) => Promise<{ error: any }>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {

    // Get initial session
    const getSession = async () => {
      const { data: { session } } = await supabase.auth.getSession()
      if (session?.user) {
        await fetchUserProfile(session.user.id)
      }
      setLoading(false)
    }

    getSession()

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        if (session?.user) {
          await fetchUserProfile(session.user.id)
        } else {
          setUser(null)
        }
        setLoading(false)
      }
    )

    return () => subscription.unsubscribe()
  }, [])

  const fetchUserProfile = async (userId: string) => {
    
    try {
      const { data, error } = await supabase
        .from('users')
        .select('*')
        .eq('id', userId)
        .single();

      if (error) {
        console.error('Error fetching user profile:', error);
        console.error('Error details:', {
          message: error.message,
          details: error.details,
          hint: error.hint,
          code: error.code
        });
        
        // If user profile doesn't exist, create one
        if (error.code === 'PGRST116') {
          console.log('User profile not found, creating one...');
          const { data: userData } = await supabase.auth.getUser();
          
          if (userData?.user) {
            // Derive company name from email
            let companyName = 'Professional Services';
            if (userData.user.email && userData.user.email.includes('@')) {
              const emailParts = userData.user.email.split('@');
              if (emailParts.length === 2) {
                companyName = emailParts[0].charAt(0).toUpperCase() + 
                             emailParts[0].slice(1).toLowerCase() + ' ' +
                             emailParts[1].charAt(0).toUpperCase() + 
                             emailParts[1].slice(1).toLowerCase();
              }
            }
            
            const { data: newProfile, error: createError } = await supabase
              .from('users')
              .insert({
                id: userData.user.id,
                email: userData.user.email,
                company_name: companyName,
                membership_tier: 'free',
                created_at: new Date().toISOString(),
                updated_at: new Date().toISOString()
              })
              .select()
              .single();
            
            if (createError) {
              console.error('Error creating user profile:', createError);
            } else {
              console.log('User profile created successfully:', newProfile);
              setUser(newProfile);
              return;
            }
          }
        }
      } else if (data) {
        console.log('User profile fetched successfully:', data);
        
        // Ensure company name is not "New Company" or "Your Company"
        if (data.company_name && 
            ['New Company', 'Your Company', 'new company', 'your company'].includes(data.company_name)) {
          
          let newCompanyName = 'Professional Services';
          if (data.email && data.email.includes('@')) {
            const emailParts = data.email.split('@');
            if (emailParts.length === 2) {
              newCompanyName = emailParts[0].charAt(0).toUpperCase() + 
                              emailParts[0].slice(1).toLowerCase() + ' ' +
                              emailParts[1].charAt(0).toUpperCase() + 
                              emailParts[1].slice(1).toLowerCase();
            }
          }
          
          // Update the company name
          const { error: updateError } = await supabase
            .from('users')
            .update({ 
              company_name: newCompanyName,
              updated_at: new Date().toISOString()
            })
            .eq('id', userId);
          
          if (updateError) {
            console.error('Error updating company name:', updateError);
          } else {
            data.company_name = newCompanyName;
            console.log('Company name updated to:', newCompanyName);
          }
        }
        
        setUser(data);
      }
    } catch (error) {
      console.error('Unexpected error in fetchUserProfile:', error);
    }
  };

  const signIn = async (email: string, password: string) => {
    
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password
      });

      if (error) {
        return { error: error.message };
      }

      if (data.user) {
        // Fetch the user profile immediately after sign-in
        await fetchUserProfile(data.user.id);
      }

      return { data, error: null };
    } catch (error) {
      return { error: 'An unexpected error occurred' };
    }
  };

  const signUp = async (email: string, password: string, companyName: string, companyUrl?: string) => {

    try {
      console.log('Signing up with company name:', companyName, 'companyUrl:', companyUrl);

      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            company_name: companyName,
            business_link: companyUrl || null
          }
        }
      });

      if (error) {
        console.error('Supabase signup error:', error);
        return { error: error.message };
      }

              if (data.user) {
          console.log('User created successfully. Profile will be created automatically by database trigger.');
          
          // The database trigger will create the user profile automatically
          // We just need to wait a moment for it to complete
          await new Promise(resolve => setTimeout(resolve, 1000));
          
          console.log('User profile should now be available.');
        }

      return { data, error: null };
    } catch (error) {
      console.error('Unexpected error in signUp:', error);
      return { error: 'An unexpected error occurred' };
    }
  };

  const signOut = async () => {
    await supabase.auth.signOut()
  }

  const resetPassword = async (email: string) => {
    
    const { error } = await supabase.auth.resetPasswordForEmail(email)
    return { error }
  }

  const value = {
    user,
    loading,
    signIn,
    signUp,
    signOut,
    resetPassword,
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}
