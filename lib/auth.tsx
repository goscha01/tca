import React, { createContext, useContext, useEffect, useState } from 'react'
import { User, supabase } from './supabase'

interface AuthContextType {
  user: User | null
  loading: boolean
  signIn: (email: string, password: string) => Promise<{ error: any }>
  signUp: (email: string, password: string, companyName: string) => Promise<{ error: any }>
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
      console.log('Fetching user profile for ID:', userId);
      
      // First check if we have a valid session
      const { data: { session } } = await supabase.auth.getSession();
      console.log('Current session:', session);
      
      if (!session) {
        console.log('No active session found');
        return;
      }
      
      const { data, error } = await supabase
        .from('users')
        .select('*')
        .eq('id', userId)
        .single()

      if (error) {
        console.error('Error fetching user profile:', error);
        console.error('Error details:', {
          message: error.message,
          details: error.details,
          hint: error.hint,
          code: error.code
        });
      } else if (data) {
        console.log('User profile fetched successfully:', data);
        setUser(data)
      }
    } catch (err) {
      console.error('Exception in fetchUserProfile:', err);
    }
  }

  const signIn = async (email: string, password: string) => {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    })
    
    if (!error && data.user) {
      // Check if the user profile has "New Company" and update it
      const { data: profileData, error: profileError } = await supabase
        .from('users')
        .select('company_name')
        .eq('id', data.user.id)
        .single()
      
      if (!profileError && profileData && profileData.company_name === 'New Company') {
        // Update the company name to something more appropriate
        // You can customize this or prompt the user to enter their company name
        const { error: updateError } = await supabase
          .from('users')
          .update({ company_name: 'Your Company' }) // Replace with actual company name
          .eq('id', data.user.id)
        
        if (updateError) {
          console.warn('Could not update company name:', updateError)
        }
      }
    }
    
    return { error }
  }

  const signUp = async (email: string, password: string, companyName: string) => {
    // Attempt signup directly - Supabase will tell us if account exists
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          company_name: companyName
        }
      }
    })

    if (error) {
      // Handle specific error cases
      if (error.message.includes('already registered') || 
          error.message.includes('already exists') ||
          error.message.includes('User already registered')) {
        return { 
          error: { 
            message: 'An account with this email already exists. Please sign in instead.' 
          } 
        }
      }
      
      if (error.message.includes('unconfirmed')) {
        return { 
          error: { 
            message: 'This email is already registered but not confirmed. Please check your email for verification or try logging in.' 
          } 
        }
      }
      
      return { error }
    }

    if (data.user) {
      // The trigger should have already created the profile with the correct company name
      // But let's verify and update if needed
      const { error: profileError } = await supabase
        .from('users')
        .update({ company_name: companyName })
        .eq('id', data.user.id)

      if (profileError) {
        console.warn('Could not update company name:', profileError)
        // Don't fail the signup if this fails
      }
    }

    return { error: null }
  }

  const signOut = async () => {
    await supabase.auth.signOut()
  }

  const resetPassword = async (email: string) => {
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/reset-password`,
    })
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

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}
