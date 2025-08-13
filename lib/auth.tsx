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
    // Skip if supabase is not available (build time)
    if (!supabase) {
      setLoading(false)
      return
    }

    // Get initial session
    const getSession = async () => {
      if (!supabase) return
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
    if (!supabase) return
    
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
    if (!supabase) return { error: { message: 'Supabase not configured' } }
    
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
          .update({ company_name: 'Your Company' })
          .eq('id', data.user.id)
        
        if (updateError) {
          console.error('Error updating company name:', updateError)
        }
      }
    }
    
    return { error }
  }

  const signUp = async (email: string, password: string, companyName: string) => {
    if (!supabase) return { error: { message: 'Supabase not configured' } }
    
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          company_name: companyName
        }
      }
    })
    
    return { error }
  }

  const signOut = async () => {
    if (!supabase) return
    await supabase.auth.signOut()
  }

  const resetPassword = async (email: string) => {
    if (!supabase) return { error: { message: 'Supabase not configured' } }
    
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
