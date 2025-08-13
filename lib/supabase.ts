import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Database types
export interface User {
  id: string
  email: string
  company_name?: string
  membership_tier?: string
  membership_expires?: string
  logo_url?: string
  business_link?: string
  created_at: string
  updated_at: string
}

export interface Membership {
  id: string
  user_id: string
  tier: string
  status: 'active' | 'expired' | 'pending'
  expires_at: string
  created_at: string
}

export interface TrainingCourse {
  id: string
  title: string
  description: string
  category: string
  video_url?: string
  pdf_url?: string
  duration: number
  is_member_only: boolean
  created_at: string
}

export interface Award {
  id: string
  user_id: string
  category: string
  business_name: string
  contact_name: string
  contact_email: string
  google_business_url?: string
  special_achievements?: string
  status: 'pending' | 'approved' | 'rejected'
  review_score?: number
  created_at: string
}
