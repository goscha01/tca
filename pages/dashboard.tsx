import React, { useState, useEffect } from 'react';
import { useAuth } from '../lib/auth';
import { useRouter } from 'next/router';
import { supabase } from '../lib/supabase';
import { 
  Shield, 
  Upload, 
  Download, 
  BookOpen, 
  Building,
  Phone,
  Mail,
  MapPin,
  Globe,
  Facebook,
  Instagram,
  Twitter,
  Linkedin,
  Save,
  Edit,
  X,
  Trash2
} from 'lucide-react';
import Link from 'next/link';

interface BusinessProfile {
  id?: string;
  name: string;
  description: string;
  logo_url: string;
  website: string;
  phone: string;
  email: string;
  address: string;
  city: string;
  state: string;
  zip_code: string;
  operating_hours: {
    monday: { open: string; close: string; closed: boolean };
    tuesday: { open: string; close: string; closed: boolean };
    wednesday: { open: string; close: string; closed: boolean };
    thursday: { open: string; close: string; closed: boolean };
    friday: { open: string; close: string; closed: boolean };
    saturday: { open: string; close: string; closed: boolean };
    sunday: { open: string; close: string; closed: boolean };
  };
  social_media: {
    facebook: string;
    instagram: string;
    twitter: string;
    linkedin: string;
    thumbtack: string;
    yelp: string;
  };
  services: string[];
  projects: string[];
  insurance_bond: string;
  reviews: Array<{
    customer_name: string;
    rating: number;
    comment: string;
    date: string;
  }>;
  created_at: string;
  updated_at: string;
  google_place_id?: string; // Added for Google Place ID
}

export default function Dashboard() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const [logoFile, setLogoFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [message, setMessage] = useState('');
  const [profile, setProfile] = useState<BusinessProfile | null>(null);
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [projectPhotos, setProjectPhotos] = useState<File[]>([]);
  const [insuranceFile, setInsuranceFile] = useState<File | null>(null);
  const [newReview, setNewReview] = useState({
    customer_name: '',
    rating: 5,
    comment: ''
  });

  // Redirect if not authenticated
  useEffect(() => {
    if (!loading && !user) {
      router.push('/login');
    }
  }, [user, loading, router]);

  // Fetch business profile
  useEffect(() => {
    if (user && supabase) {
      fetchBusinessProfile();
    }
  }, [user]);

  // Cleanup local URLs when component unmounts
  useEffect(() => {
    return () => {
      if (profile?.logo_url && profile.logo_url.startsWith('blob:')) {
        URL.revokeObjectURL(profile.logo_url);
      }
    };
  }, [profile?.logo_url]);

  const fetchBusinessProfile = async () => {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from('businesses')
        .select('*')
        .eq('user_id', user.id)
        .single();

      if (error) {
        console.log('Error fetching business profile:', error);
        
        // If table doesn't exist, show setup message
        if (error.code === '42P01') {
          console.log('Businesses table does not exist yet');
          setMessage('Business profile system is being set up. Please run the SQL script in Supabase to create the businesses table.');
          return;
        }
        
        // If table exists but no profile found, create a local profile
        if (error.code === 'PGRST116') {
          console.log('Business profile not found, creating local default profile');
          createLocalDefaultProfile();
          return;
        }
        
        // For other errors, still create a local profile
        console.log('Creating local default profile due to error');
        createLocalDefaultProfile();
        return;
      }

      if (data) {
        console.log('Business profile found:', data);
        setProfile(data);
        setIsEditing(false);
      } else {
        console.log('No business profile data, creating local default');
        createLocalDefaultProfile();
      }
    } catch (error) {
      console.error('Unexpected error in fetchBusinessProfile:', error);
      createLocalDefaultProfile();
    }
  };

  const createLocalDefaultProfile = () => {
    // Clear any existing blob URLs
    if (profile?.logo_url && profile.logo_url.startsWith('blob:')) {
      URL.revokeObjectURL(profile.logo_url);
    }
    
    const defaultProfile: Omit<BusinessProfile, 'id'> = {
      name: user?.company_name || 'Your Company',
      description: '',
      logo_url: '',
      website: user?.business_link || '',
      phone: user?.phone || '',
      email: user?.email || '',
      address: '',
      city: '',
      state: '',
      zip_code: '',
      operating_hours: {
        monday: { open: '09:00', close: '17:00', closed: false },
        tuesday: { open: '09:00', close: '17:00', closed: false },
        wednesday: { open: '09:00', close: '17:00', closed: false },
        thursday: { open: '09:00', close: '17:00', closed: false },
        friday: { open: '09:00', close: '17:00', closed: false },
        saturday: { open: '09:00', close: '17:00', closed: false },
        sunday: { open: '09:00', close: '17:00', closed: false },
      },
      social_media: {
        facebook: '',
        instagram: '',
        twitter: '',
        linkedin: '',
        thumbtack: '',
        yelp: '',
      },
      services: [],
      projects: [],
      insurance_bond: '',
      reviews: [],
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      google_place_id: '', // Add default for google_place_id
    };
    
    setProfile({
      ...defaultProfile,
      id: 'temp-' + Date.now()
    });
    setIsEditing(true);
  };

  const handleLogoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setLogoFile(file);
      setMessage('');
    }
  };

    const uploadLogo = async () => {
    if (!logoFile || !user) return;

    setUploading(true);
    try {
      // Convert image to base64 for persistent storage
      const reader = new FileReader();
      reader.onload = (e) => {
        const base64String = e.target?.result as string;
        if (profile && base64String) {
          setProfile({ ...profile, logo_url: base64String });
          setMessage('Logo uploaded successfully! Click "Save Profile" to save it permanently.');
        }
      };
      reader.readAsDataURL(logoFile);
      setLogoFile(null);
    } catch (error) {
      setMessage('Error uploading logo. Please try again.');
      console.error('Logo upload error:', error);
    } finally {
      setUploading(false);
    }
  };

  const handleInputChange = (field: string, value: any) => {
    setProfile(prev => prev ? { ...prev, [field]: value } : null);
  };

  const getLogoUrl = (logoUrl: string | null) => {
    if (!logoUrl) return null;
    // If it's already a base64 string, return as is
    if (logoUrl.startsWith('data:image/')) return logoUrl;
    // If it's a blob URL, return null (they're temporary)
    if (logoUrl.startsWith('blob:')) return null;
    // Otherwise return the URL as is
    return logoUrl;
  };

  const handleSocialMediaChange = (platform: string, value: string) => {
    setProfile(prev => prev ? {
      ...prev,
      social_media: {
        ...prev.social_media,
        [platform]: value
      }
    } : null);
  };

  const handleOperatingHoursChange = (day: string, field: string, value: any) => {
    setProfile(prev => prev ? {
      ...prev,
      operating_hours: {
        ...prev.operating_hours,
        [day]: {
          ...prev.operating_hours[day as keyof typeof prev.operating_hours],
          [field]: value
        }
      }
    } : null);
  };

  const addItem = (field: 'services' | 'projects' | 'reviews', value: string) => {
    if (!value.trim()) return;
    
    setProfile(prev => prev ? {
      ...prev,
      [field]: [...prev[field], value.trim()]
    } : null);
    
  };

  const removeItem = (field: 'projects' | 'reviews', index: number) => {
    setProfile(prev => prev ? {
      ...prev,
      [field]: prev[field].filter((_, i) => i !== index)
    } : null);
  };

  const handleProjectPhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (projectPhotos.length + files.length > 4) {
      alert('You can only upload up to 4 project photos');
      return;
    }
    setProjectPhotos(prev => [...prev, ...files]);
  };

  const removeProjectPhoto = (index: number) => {
    setProjectPhotos(prev => prev.filter((_, i) => i !== index));
  };

  const handleInsuranceUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setInsuranceFile(file);
    }
  };

  const handleReviewChange = (field: string, value: string | number) => {
    setNewReview(prev => ({ ...prev, [field]: value }));
  };

  const addReview = () => {
    if (!newReview.customer_name.trim() || !newReview.comment.trim()) return;
    
    const review = {
      ...newReview,
      date: new Date().toISOString()
    };
    
    setProfile(prev => prev ? {
      ...prev,
      reviews: [...prev.reviews, review]
    } : null);
    
    setNewReview({ customer_name: '', rating: 5, comment: '' });
  };

  const saveProfile = async () => {
    if (!profile || !user) return;

    setSaving(true);
    try {
      const profileData: any = {
        ...profile,
        user_id: user.id,
        updated_at: new Date().toISOString()
      };

      if (profileData.id && profileData.id.startsWith('temp-')) {
        delete profileData.id;
      }

      console.log('Attempting to save profile data:', profileData);

      const { data: savedProfile, error } = await supabase
        .from('businesses')
        .upsert(profileData, { onConflict: 'user_id' })
        .select()
        .single();

      if (error) {
        console.error('Database error during save:', error);
        
        if (error.code === '42P01') {
          setMessage('Business profile system is not set up yet. Please run the SQL script in Supabase to create the businesses table.');
        } else {
          throw error;
        }
        return;
      }

      if (savedProfile) {
        console.log('Profile saved successfully:', savedProfile);
        setProfile(savedProfile);
      }

      setMessage('Profile saved successfully!');
      setIsEditing(false);
    } catch (error) {
      setMessage('Error saving profile. Please try again.');
      console.error('Save error:', error);
    } finally {
      setSaving(false);
    }
  };

  const deleteProfile = async () => {
    if (!profile || !user) return;

    setDeleting(true);
    try {
      // Only delete if it's a real profile (not a temporary one)
      if (profile.id && !profile.id.startsWith('temp-')) {
        const { error } = await supabase
          .from('businesses')
          .delete()
          .eq('user_id', user.id);

        if (error) {
          console.error('Database error during delete:', error);
          throw error;
        }
      }

      // Clear the profile and create a new default one
      setProfile(null);
      createLocalDefaultProfile();
      setMessage('Profile deleted successfully! A new default profile has been created.');
      setShowDeleteConfirm(false);
    } catch (error) {
      setMessage('Error deleting profile. Please try again.');
      console.error('Delete error:', error);
    } finally {
      setDeleting(false);
    }
  };

  const getMembershipStatus = () => {
    if (!user?.membership_tier || user.membership_tier === 'free') return 'Free Member';
    
    if (!user?.membership_expires) return 'Yearly Member';
    
    const expiryDate = new Date(user.membership_expires);
    const now = new Date();
    
    if (expiryDate < now) {
      return 'Yearly Expired';
    } else {
      return 'Yearly Active';
    }
  };

  const getMembershipStatusColor = (status: string) => {
    switch (status) {
      case 'Yearly Active': return 'text-green-600 bg-green-100';
      case 'Yearly Expired': return 'text-red-600 bg-red-100';
      case 'Free Member': return 'text-blue-600 bg-blue-100';
      case 'Yearly Member': return 'text-purple-600 bg-purple-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  if (!profile && !message?.includes('being set up')) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p>Loading business profile...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">
            Welcome back, {user.company_name || 'Member'}!
          </h1>
          <p className="mt-2 text-gray-600">
            Manage your TCA membership, upload assets, and access exclusive resources.
          </p>
        </div>

        {message && (
          <div className="mb-6 p-4 bg-green-50 border border-green-200 text-green-700 rounded-md">
            {message}
          </div>
        )}
        
        {/* Business Profile Section */}
        {profile ? (
          <div className="mt-8">
            <div className="card">
               <div className="flex items-center justify-between mb-6">
                 <h2 className="text-2xl font-semibold text-gray-900">Business Profile</h2>
               </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                  {/* Left Column - Logo + Contact Info, Services */}
                  <div className="space-y-6">
                    {/* Logo and Contact Info Row */}
                    <div className="flex items-start space-x-6">
                      {/* Logo Upload */}
                      <div className="flex-shrink-0">
                        <h3 className="text-lg font-semibold text-gray-900 mb-4">Company Logo</h3>
                        
                        <div className="space-y-3">
                          {profile?.logo_url && getLogoUrl(profile.logo_url) ? (
                            <img 
                              src={getLogoUrl(profile.logo_url) || ''} 
                              alt="Company Logo" 
                              className="h-20 w-auto rounded-lg border border-gray-200"
                              onError={(e) => {
                                // Hide broken images
                                const target = e.target as HTMLImageElement;
                                target.style.display = 'none';
                              }}
                            />
                          ) : (
                            <div className="h-20 w-20 bg-gray-100 rounded-lg border border-gray-200 flex items-center justify-center">
                              <span className="text-gray-400 text-xs">No Logo</span>
                            </div>
                          )}
                          
                          <input
                            type="file"
                            accept="image/*"
                            onChange={handleLogoUpload}
                            className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-primary file:text-white hover:file:bg-primary-dark"
                          />
                          {logoFile && (
                            <button
                              onClick={uploadLogo}
                              disabled={uploading}
                              className="btn-primary w-full"
                            >
                              {uploading ? 'Uploading...' : 'Upload Logo'}
                            </button>
                          )}
                        </div>
                      </div>
                      
                      {/* Contact Information */}
                      <div className="flex-1">
                        <h3 className="text-lg font-semibold text-gray-900 mb-4">Contact Information</h3>
                        <div className="space-y-3">
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                              Phone Number
                            </label>
                            <div className="relative">
                              <Phone className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                              <input
                                type="tel"
                                autoComplete="tel"
                                value={profile.phone}
                                onChange={(e) => handleInputChange('phone', e.target.value)}
                                className="input-field pl-10"
                                placeholder="(555) 123-4567"
                                disabled={!isEditing}
                              />
                            </div>
                          </div>

                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                              Email
                            </label>
                            <div className="relative">
                              <Mail className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                              <input
                                type="email"
                                autoComplete="email"
                                value={profile.email}
                                onChange={(e) => handleInputChange('email', e.target.value)}
                                className="input-field pl-10"
                                placeholder="contact@company.com"
                                disabled={!isEditing}
                              />
                            </div>
                          </div>

                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                              Address
                            </label>
                            <div className="relative">
                              <MapPin className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                              <input
                                type="text"
                                value={profile.address}
                                onChange={(e) => handleInputChange('address', e.target.value)}
                                className="input-field pl-10"
                                placeholder="123 Business St"
                                disabled={!isEditing}
                              />
                            </div>
                          </div>

                          <div className="grid grid-cols-3 gap-3">
                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-1">
                                City
                              </label>
                              <input
                                type="text"
                                value={profile.city}
                                onChange={(e) => handleInputChange('city', e.target.value)}
                                className="input-field"
                                placeholder="City"
                                disabled={!isEditing}
                              />
                            </div>

                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-1">
                                State
                              </label>
                              <input
                                type="text"
                                value={profile.state}
                                onChange={(e) => handleInputChange('state', e.target.value)}
                                className="input-field"
                                placeholder="State"
                                disabled={!isEditing}
                              />
                            </div>

                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-1">
                                ZIP Code
                              </label>
                              <input
                                type="text"
                                value={profile.zip_code}
                                onChange={(e) => handleInputChange('zip_code', e.target.value)}
                                className="input-field"
                                placeholder="12345"
                                disabled={!isEditing}
                              />
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Services */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Services Offered
                      </label>
                      <div className="mb-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 max-h-60 overflow-y-auto p-3 border border-gray-200 rounded-lg">
                          <label className="flex items-center space-x-2 cursor-pointer">
                            <input
                              type="checkbox"
                              checked={profile.services?.includes('Cleaning') || false}
                              onChange={(e) => {
                                if (e.target.checked) {
                                  setProfile(prev => prev ? { ...prev, services: [...(prev.services || []), 'Cleaning'] } : null);
                                } else {
                                  setProfile(prev => prev ? { ...prev, services: (prev.services || []).filter(s => s !== 'Cleaning') } : null);
                                }
                              }}
                              className="rounded border-gray-300 text-primary focus:ring-primary"
                              disabled={!isEditing}
                            />
                            <span className="text-sm text-gray-700">Cleaning</span>
                          </label>
                          
                          <label className="flex items-center space-x-2 cursor-pointer">
                            <input
                              type="checkbox"
                              checked={profile.services?.includes('Commercial/office cleaning')}
                              onChange={(e) => {
                                if (e.target.checked) {
                                  setProfile(prev => prev ? { ...prev, services: [...(prev.services || []), 'Commercial/office cleaning'] } : null);
                                } else {
                                  setProfile(prev => prev ? { ...prev, services: (prev.services || []).filter(s => s !== 'Commercial/office cleaning') } : null);
                                }
                              }}
                              className="rounded border-gray-300 text-primary focus:ring-primary"
                              disabled={!isEditing}
                            />
                            <span className="text-sm text-gray-700">Commercial/office cleaning</span>
                          </label>
                          
                          <label className="flex items-center space-x-2 cursor-pointer">
                            <input
                              type="checkbox"
                              checked={profile.services?.includes('Carpet & upholstery cleaning')}
                              onChange={(e) => {
                                if (e.target.checked) {
                                  setProfile(prev => prev ? { ...prev, services: [...(prev.services || []), 'Carpet & upholstery cleaning'] } : null);
                                } else {
                                  setProfile(prev => prev ? { ...prev, services: (prev.services || []).filter(s => s !== 'Carpet & upholstery cleaning') } : null);
                                }
                              }}
                              className="rounded border-gray-300 text-primary focus:ring-primary"
                              disabled={!isEditing}
                            />
                            <span className="text-sm text-gray-700">Carpet & upholstery cleaning</span>
                          </label>
                          
                          <label className="flex items-center space-x-2 cursor-pointer">
                            <input
                              type="checkbox"
                              checked={profile.services?.includes('Window washing')}
                              onChange={(e) => {
                                if (e.target.checked) {
                                  setProfile(prev => prev ? { ...prev, services: [...(prev.services || []), 'Window washing'] } : null);
                                } else {
                                  setProfile(prev => prev ? { ...prev, services: (prev.services || []).filter(s => s !== 'Window washing') } : null);
                                }
                              }}
                              className="rounded border-gray-300 text-primary focus:ring-primary"
                              disabled={!isEditing}
                            />
                            <span className="text-sm text-gray-700">Window washing</span>
                          </label>
                          
                          <label className="flex items-center space-x-2 cursor-pointer">
                            <input
                              type="checkbox"
                              checked={profile.services?.includes('Pressure washing')}
                              onChange={(e) => {
                                if (e.target.checked) {
                                  setProfile(prev => prev ? { ...prev, services: [...(prev.services || []), 'Pressure washing'] } : null);
                                } else {
                                  setProfile(prev => prev ? { ...prev, services: (prev.services || []).filter(s => s !== 'Pressure washing') } : null);
                                }
                              }}
                              className="rounded border-gray-300 text-primary focus:ring-primary"
                              disabled={!isEditing}
                            />
                            <span className="text-sm text-gray-700">Pressure washing</span>
                          </label>
                          
                          <label className="flex items-center space-x-2 cursor-pointer">
                            <input
                              type="checkbox"
                              checked={profile.services?.includes('Handyman services')}
                              onChange={(e) => {
                                if (e.target.checked) {
                                  setProfile(prev => prev ? { ...prev, services: [...(prev.services || []), 'Handyman services'] } : null);
                                } else {
                                  setProfile(prev => prev ? { ...prev, services: (prev.services || []).filter(s => s !== 'Handyman services') } : null);
                                }
                              }}
                              className="rounded border-gray-300 text-primary focus:ring-primary"
                              disabled={!isEditing}
                            />
                            <span className="text-sm text-gray-700">Handyman services</span>
                          </label>
                          
                          <label className="flex items-center space-x-2 cursor-pointer">
                            <input
                              type="checkbox"
                              checked={profile.services?.includes('Plumbing')}
                              onChange={(e) => {
                                if (e.target.checked) {
                                  setProfile(prev => prev ? { ...prev, services: [...(prev.services || []), 'Plumbing'] } : null);
                                } else {
                                  setProfile(prev => prev ? { ...prev, services: (prev.services || []).filter(s => s !== 'Plumbing') } : null);
                                }
                              }}
                              className="rounded border-gray-300 text-primary focus:ring-primary"
                              disabled={!isEditing}
                            />
                            <span className="text-sm text-gray-700">Plumbing</span>
                          </label>
                          
                          <label className="flex items-center space-x-2 cursor-pointer">
                            <input
                              type="checkbox"
                              checked={profile.services?.includes('Electrical services')}
                              onChange={(e) => {
                                if (e.target.checked) {
                                  setProfile(prev => prev ? { ...prev, services: [...(prev.services || []), 'Electrical services'] } : null);
                                } else {
                                  setProfile(prev => prev ? { ...prev, services: (prev.services || []).filter(s => s !== 'Electrical services') } : null);
                                }
                              }}
                              className="rounded border-gray-300 text-primary focus:ring-primary"
                              disabled={!isEditing}
                            />
                            <span className="text-sm text-gray-700">Electrical services</span>
                          </label>
                          
                          <label className="flex items-center space-x-2 cursor-pointer">
                            <input
                              type="checkbox"
                              checked={profile.services?.includes('HVAC installation & maintenance')}
                              onChange={(e) => {
                                if (e.target.checked) {
                                  setProfile(prev => prev ? { ...prev, services: [...(prev.services || []), 'HVAC installation & maintenance'] } : null);
                                } else {
                                  setProfile(prev => prev ? { ...prev, services: (prev.services || []).filter(s => s !== 'HVAC installation & maintenance') } : null);
                                }
                              }}
                              className="rounded border-gray-300 text-primary focus:ring-primary"
                              disabled={!isEditing}
                            />
                            <span className="text-sm text-gray-700">HVAC installation & maintenance</span>
                          </label>
                          
                          <label className="flex items-center space-x-2 cursor-pointer">
                            <input
                              type="checkbox"
                              checked={profile.services?.includes('Appliance repair')}
                              onChange={(e) => {
                                if (e.target.checked) {
                                  setProfile(prev => prev ? { ...prev, services: [...(prev.services || []), 'Appliance repair'] } : null);
                                } else {
                                  setProfile(prev => prev ? { ...prev, services: (prev.services || []).filter(s => s !== 'Appliance repair') } : null);
                                }
                              }}
                              className="rounded border-gray-300 text-primary focus:ring-primary"
                              disabled={!isEditing}
                            />
                            <span className="text-sm text-gray-700">Appliance repair</span>
                          </label>
                          
                          <label className="flex items-center space-x-2 cursor-pointer">
                            <input
                              type="checkbox"
                              checked={profile.services?.includes('Landscaping & lawn care')}
                              onChange={(e) => {
                                if (e.target.checked) {
                                  setProfile(prev => prev ? { ...prev, services: [...(prev.services || []), 'Landscaping & lawn care'] } : null);
                                } else {
                                  setProfile(prev => prev ? { ...prev, services: (prev.services || []).filter(s => s !== 'Landscaping & lawn care') } : null);
                                }
                              }}
                              className="rounded border-gray-300 text-primary focus:ring-primary"
                              disabled={!isEditing}
                            />
                            <span className="text-sm text-gray-700">Landscaping & lawn care</span>
                          </label>
                          
                          <label className="flex items-center space-x-2 cursor-pointer">
                            <input
                              type="checkbox"
                              checked={profile.services?.includes('Tree trimming & removal')}
                              onChange={(e) => {
                                if (e.target.checked) {
                                  setProfile(prev => prev ? { ...prev, services: [...(prev.services || []), 'Tree trimming & removal'] } : null);
                                } else {
                                  setProfile(prev => prev ? { ...prev, services: (prev.services || []).filter(s => s !== 'Tree trimming & removal') } : null);
                                }
                              }}
                              className="rounded border-gray-300 text-primary focus:ring-primary"
                              disabled={!isEditing}
                            />
                            <span className="text-sm text-gray-700">Tree trimming & removal</span>
                          </label>
                          
                          <label className="flex items-center space-x-2 cursor-pointer">
                            <input
                              type="checkbox"
                              checked={profile.services?.includes('Snow removal')}
                              onChange={(e) => {
                                if (e.target.checked) {
                                  setProfile(prev => prev ? { ...prev, services: [...(prev.services || []), 'Snow removal'] } : null);
                                } else {
                                  setProfile(prev => prev ? { ...prev, services: (prev.services || []).filter(s => s !== 'Snow removal') } : null);
                                }
                              }}
                              className="rounded border-gray-300 text-primary focus:ring-primary"
                              disabled={!isEditing}
                            />
                            <span className="text-sm text-gray-700">Snow removal</span>
                          </label>
                          
                          <label className="flex items-center space-x-2 cursor-pointer">
                            <input
                              type="checkbox"
                              checked={profile.services?.includes('Pool cleaning & maintenance')}
                              onChange={(e) => {
                                if (e.target.checked) {
                                  setProfile(prev => prev ? { ...prev, services: [...(prev.services || []), 'Pool cleaning & maintenance'] } : null);
                                } else {
                                  setProfile(prev => prev ? { ...prev, services: (prev.services || []).filter(s => s !== 'Pool cleaning & maintenance') } : null);
                                }
                              }}
                              className="rounded border-gray-300 text-primary focus:ring-primary"
                              disabled={!isEditing}
                            />
                            <span className="text-sm text-gray-700">Pool cleaning & maintenance</span>
                          </label>
                          
                          <label className="flex items-center space-x-2 cursor-pointer">
                            <input
                              type="checkbox"
                              checked={profile.services?.includes('Pest control')}
                              onChange={(e) => {
                                if (e.target.checked) {
                                  setProfile(prev => prev ? { ...prev, services: [...(prev.services || []), 'Pest control'] } : null);
                                } else {
                                  setProfile(prev => prev ? { ...prev, services: (prev.services || []).filter(s => s !== 'Pest control') } : null);
                                }
                              }}
                              className="rounded border-gray-300 text-primary focus:ring-primary"
                              disabled={!isEditing}
                            />
                            <span className="text-sm text-gray-700">Pest control</span>
                          </label>
                          
                          <label className="flex items-center space-x-2 cursor-pointer">
                            <input
                              type="checkbox"
                              checked={profile.services?.includes('Deep sanitation & disinfection services')}
                              onChange={(e) => {
                                if (e.target.checked) {
                                  setProfile(prev => prev ? { ...prev, services: [...(prev.services || []), 'Deep sanitation & disinfection services'] } : null);
                                } else {
                                  setProfile(prev => prev ? { ...prev, services: (prev.services || []).filter(s => s !== 'Deep sanitation & disinfection services') } : null);
                                }
                              }}
                              className="rounded border-gray-300 text-primary focus:ring-primary"
                              disabled={!isEditing}
                            />
                            <span className="text-sm text-gray-700">Deep sanitation & disinfection services</span>
                          </label>
                          
                          <label className="flex items-center space-x-2 cursor-pointer">
                            <input
                              type="checkbox"
                              checked={profile.services?.includes('Mold remediation')}
                              onChange={(e) => {
                                if (e.target.checked) {
                                  setProfile(prev => prev ? { ...prev, services: [...(prev.services || []), 'Mold remediation'] } : null);
                                } else {
                                  setProfile(prev => prev ? { ...prev, services: (prev.services || []).filter(s => s !== 'Mold remediation') } : null);
                                }
                              }}
                              className="rounded border-gray-300 text-primary focus:ring-primary"
                              disabled={!isEditing}
                            />
                            <span className="text-sm text-gray-700">Mold remediation</span>
                          </label>
                          
                          <label className="flex items-center space-x-2 cursor-pointer">
                            <input
                              type="checkbox"
                              checked={profile.services?.includes('Water damage restoration')}
                              onChange={(e) => {
                                if (e.target.checked) {
                                  setProfile(prev => prev ? { ...prev, services: [...(prev.services || []), 'Water damage restoration'] } : null);
                                } else {
                                  setProfile(prev => prev ? { ...prev, services: (prev.services || []).filter(s => s !== 'Water damage restoration') } : null);
                                }
                              }}
                              className="rounded border-gray-300 text-primary focus:ring-primary"
                              disabled={!isEditing}
                            />
                            <span className="text-sm text-gray-700">Water damage restoration</span>
                          </label>
                          
                          <label className="flex items-center space-x-2 cursor-pointer">
                            <input
                              type="checkbox"
                              checked={profile.services?.includes('Moving assistance (packing/unpacking)')}
                              onChange={(e) => {
                                if (e.target.checked) {
                                  setProfile(prev => prev ? { ...prev, services: [...(prev.services || []), 'Moving assistance (packing/unpacking)'] } : null);
                                } else {
                                  setProfile(prev => prev ? { ...prev, services: (prev.services || []).filter(s => s !== 'Moving assistance (packing/unpacking)') } : null);
                                }
                              }}
                              className="rounded border-gray-300 text-primary focus:ring-primary"
                              disabled={!isEditing}
                            />
                            <span className="text-sm text-gray-700">Moving assistance (packing/unpacking)</span>
                          </label>
                        </div>
                        <p className="text-sm text-gray-500 mt-2">
                          Click the checkboxes to select the services you offer
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Right Column - Basic Info, Social Media, Projects, Insurance, Working Hours */}
                  <div className="space-y-6">
                    {/* Basic Information */}
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900 mb-4">Basic Information</h3>
                      <div className="space-y-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Company Name
                          </label>
                          <input
                            type="text"
                            autoComplete="organization"
                            value={profile?.name ?? ''}
                            onChange={(e) => handleInputChange('name', e.target.value)}
                            className="input-field"
                            placeholder="Enter company name"
                            disabled={!isEditing}
                          />
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Description
                          </label>
                          <textarea
                            value={profile?.description ?? ''}
                            onChange={(e) => handleInputChange('description', e.target.value)}
                            rows={4}
                            className="input-field"
                            placeholder="Describe your business and services"
                            disabled={!isEditing}
                          />
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Website
                          </label>
                          <div className="relative">
                            <Globe className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                            <input
                              type="url"
                              autoComplete="url"
                              value={profile?.website ?? ''}
                              onChange={(e) => handleInputChange('website', e.target.value)}
                              className="input-field pl-10"
                              placeholder="https://your-website.com"
                              disabled={!isEditing}
                            />
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Social Media Profiles */}
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900 mb-4">Social Media Profiles</h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Facebook
                          </label>
                          <div className="relative">
                            <Facebook className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                            <input
                              type="url"
                              value={profile.social_media?.facebook || ''}
                              onChange={(e) => handleSocialMediaChange('facebook', e.target.value)}
                              className="input-field pl-10"
                              placeholder="https://facebook.com/yourpage"
                              disabled={!isEditing}
                            />
                          </div>
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Instagram
                          </label>
                          <div className="relative">
                            <Instagram className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                            <input
                              type="url"
                              value={profile.social_media?.instagram || ''}
                              onChange={(e) => handleSocialMediaChange('instagram', e.target.value)}
                              className="input-field pl-10"
                              placeholder="https://instagram.com/yourpage"
                              disabled={!isEditing}
                            />
                          </div>
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Twitter
                          </label>
                          <div className="relative">
                            <Twitter className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                            <input
                              type="url"
                              value={profile.social_media?.twitter || ''}
                              onChange={(e) => handleSocialMediaChange('twitter', e.target.value)}
                              className="input-field pl-10"
                              placeholder="https://twitter.com/yourpage"
                              disabled={!isEditing}
                            />
                          </div>
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            LinkedIn
                          </label>
                          <div className="relative">
                            <Linkedin className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                            <input
                              type="url"
                              value={profile.social_media?.linkedin || ''}
                              onChange={(e) => handleSocialMediaChange('linkedin', e.target.value)}
                              className="input-field pl-10"
                              placeholder="https://linkedin.com/company/yourcompany"
                              disabled={!isEditing}
                            />
                          </div>
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Thumbtack
                          </label>
                          <div className="relative">
                            <Globe className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                            <input
                              type="url"
                              value={profile.social_media?.thumbtack || ''}
                              onChange={(e) => handleSocialMediaChange('thumbtack', e.target.value)}
                              className="input-field pl-10"
                              placeholder="https://thumbtack.com/profile/yourbusiness"
                              disabled={!isEditing}
                            />
                          </div>
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Yelp
                          </label>
                          <div className="relative">
                            <Globe className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                            <input
                              type="url"
                              value={profile.social_media?.yelp || ''}
                              onChange={(e) => handleSocialMediaChange('yelp', e.target.value)}
                              className="input-field pl-10"
                              placeholder="https://yelp.com/biz/yourbusiness"
                              disabled={!isEditing}
                            />
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Projects Portfolio */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Project Portfolio (Max 4 Photos)
                      </label>
                      <div className="mb-4">
                        <input
                          type="file"
                          accept="image/*"
                          multiple
                          onChange={handleProjectPhotoUpload}
                          className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-primary file:text-white hover:file:bg-primary-dark"
                          disabled={!isEditing || projectPhotos.length >= 4}
                        />
                        <p className="text-sm text-gray-500 mt-1">
                          Upload photos of your completed projects (max 4)
                        </p>
                      </div>
                      
                      {/* Display Project Photos */}
                      {projectPhotos.length > 0 && (
                        <div className="grid grid-cols-2 gap-4 mb-4">
                          {projectPhotos.map((photo, index) => (
                            <div key={index} className="relative">
                              <img
                                src={URL.createObjectURL(photo)}
                                alt={`Project ${index + 1}`}
                                className="w-full h-32 object-cover rounded-lg border border-gray-200"
                              />
                              {isEditing && (
                                <button
                                  onClick={() => removeProjectPhoto(index)}
                                  className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm hover:bg-red-600"
                                >
                                  ×
                                </button>
                              )}
                            </div>
                          ))}
                        </div>
                      )}
                    </div>

                    {/* Insurance & Bond */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Insurance or Bond Certificate
                      </label>
                      <div className="mb-4">
                        <input
                          type="file"
                          accept=".pdf,.jpg,.jpeg,.png"
                          onChange={handleInsuranceUpload}
                          className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-primary file:text-white hover:file:bg-primary-dark"
                          disabled={!isEditing}
                        />
                        <p className="text-sm text-gray-500 mt-1">
                          Upload your insurance certificate or bond documentation
                        </p>
                      </div>
                      
                      {insuranceFile && (
                        <div className="flex items-center space-x-2 p-3 bg-green-50 border border-green-200 rounded-lg">
                          <span className="text-green-600">✓</span>
                          <span className="text-sm text-green-800">{insuranceFile.name}</span>
                        </div>
                      )}
                    </div>

                    {/* Google Review Button */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Customer Reviews
                      </label>
                      <p className="text-sm text-gray-500 mb-3">
                        Encourage your customers to leave reviews on Google
                      </p>
                      <button
                        onClick={() => {
                          const googleReviewUrl = `https://search.google.com/local/writereview?placeid=${profile?.google_place_id || ''}`;
                          if (profile?.google_place_id) {
                            window.open(googleReviewUrl, '_blank');
                          } else {
                            alert('Please add your Google Place ID to enable direct review links');
                          }
                        }}
                        className="btn-primary w-full flex items-center justify-center space-x-2"
                        disabled={!isEditing}
                      >
                        <Globe className="h-5 w-5" />
                        <span>Get Google Reviews</span>
                      </button>
                      <p className="text-xs text-gray-500 mt-2">
                        Share this link with your customers to collect reviews
                      </p>
                    </div>

                    {/* Working Hours */}
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900 mb-4">Working Hours</h3>
                      <div className="space-y-3">
                        {Object.entries(profile.operating_hours).map(([day, hours]) => (
                          <div key={day} className="flex items-center space-x-3">
                            <div className="w-20 text-sm font-medium text-gray-700 capitalize">
                              {day}
                            </div>
                            <div className="flex items-center space-x-2">
                              <input
                                type="time"
                                value={hours.open}
                                onChange={(e) => handleOperatingHoursChange(day, 'open', e.target.value)}
                                className="input-field text-sm w-24"
                                disabled={!isEditing || hours.closed}
                              />
                              <span className="text-gray-500">to</span>
                              <input
                                type="time"
                                value={hours.close}
                                onChange={(e) => handleOperatingHoursChange(day, 'close', e.target.value)}
                                className="input-field text-sm w-24"
                                disabled={!isEditing || hours.closed}
                              />
                            </div>
                            <label className="flex items-center space-x-2">
                              <input
                                type="checkbox"
                                checked={hours.closed}
                                onChange={(e) => handleOperatingHoursChange(day, 'closed', e.target.checked)}
                                className="rounded border-gray-300 text-primary focus:ring-primary"
                                disabled={!isEditing}
                              />
                              <span className="text-sm text-gray-600">Closed</span>
                            </label>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>

               {/* Action Buttons - Moved to Bottom */}
               <div className="flex items-center justify-end space-x-3 mt-8 pt-6 border-t border-gray-200">
                 {isEditing ? (
                   <>
                     <button
                       onClick={() => setIsEditing(false)}
                       className="btn-secondary flex items-center space-x-2"
                     >
                       <X className="h-5 w-5" />
                       <span>Cancel</span>
                     </button>
                     <button
                       onClick={saveProfile}
                       disabled={saving}
                       className="btn-primary flex items-center space-x-2"
                     >
                       {saving ? (
                         <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                       ) : (
                         <Save className="h-5 w-5" />
                       )}
                       <span>{saving ? 'Saving...' : 'Save Profile'}</span>
                     </button>
                   </>
                 ) : (
                   <div className="flex space-x-3">
                     <button
                       onClick={() => setIsEditing(true)}
                       className="btn-primary flex items-center space-x-2"
                     >
                       <Edit className="h-5 w-5" />
                       <span>Edit Profile</span>
                     </button>
                     <button
                       onClick={() => setShowDeleteConfirm(true)}
                       className="btn-danger flex items-center space-x-2"
                     >
                       <Trash2 className="h-5 w-5" />
                       <span>Delete Profile</span>
                     </button>
                   </div>
                 )}
               </div>
             </div>
           </div>
        ) : (
          <div className="mt-8">
            <div className="card">
              <div className="text-center py-8">
                <Building className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">Business Profile System</h3>
                <p className="text-gray-600 mb-4">
                  The business profile system is currently being set up. Please check back later to manage your business details.
                </p>
                <div className="text-sm text-gray-500">
                  This will include company information, contact details, operating hours, and more.
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Membership Status */}
        <div className="mt-8">
          <div className="card">
            <div className="flex items-center space-x-3 mb-4">
              <Shield className="h-6 w-6 text-primary" />
              <h2 className="text-xl font-semibold text-gray-900">Membership Status</h2>
            </div>
            
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <span className={`px-3 py-1 rounded-full text-sm font-medium ${getMembershipStatusColor(getMembershipStatus())}`}>
                  {getMembershipStatus()}
                </span>
                <span className="text-gray-600">
                  {user.membership_tier === 'free' ? 'Basic membership with listing ability' : 'Yearly membership with enhanced benefits'}
                </span>
              </div>
              
              {user.membership_tier === 'free' && (
                <Link href="/membership#membership-plans" className="btn-primary">
                  Upgrade to Yearly Membership
                </Link>
              )}
            </div>
          </div>
        </div>

        {/* TCA Seal */}
        <div className="mt-8">
          <div className="card">
            <div className="flex items-center space-x-3 mb-4">
              <Shield className="h-6 w-6 text-primary" />
              <h2 className="text-xl font-semibold text-gray-900">TCA Seal</h2>
            </div>
            <p className="text-gray-600 text-sm mb-4">
              Download your official TCA seal to display on your website and marketing materials.
            </p>
            <div className="space-y-3">
              <a 
                href="/TRUSTED CLEANERS Logo.png" 
                download="TCA-Seal.png"
                className="btn-outline w-full flex items-center justify-center space-x-2"
              >
                <Download className="h-5 w-5" />
                <span>Download PNG</span>
              </a>
              <button 
                onClick={() => {
                  const htmlCode = `<a href="https://trustedcleaners.org" target="_blank" rel="noopener noreferrer">
  <img src="https://trustedcleaners.org/TRUSTED%20CLEANERS%20Logo.png" 
       alt="Trusted Cleaners Association Member" 
       style="max-width: 200px; height: auto;">
</a>`;
                  navigator.clipboard.writeText(htmlCode);
                  alert('HTML code copied to clipboard!');
                }}
                className="btn-outline w-full flex items-center justify-center space-x-2"
              >
                <Download className="h-5 w-5" />
                <span>Copy HTML Code</span>
              </button>
            </div>
          </div>
        </div>

        {/* Training Access */}
        <div className="mt-8">
          <div className="card">
            <div className="flex items-center space-x-3 mb-4">
              <BookOpen className="h-6 w-6 text-primary" />
              <h2 className="text-xl font-semibold text-gray-900">Training Access</h2>
            </div>
            <p className="text-gray-600 text-sm mb-4">
              Access exclusive training materials and courses designed for TCA members.
            </p>
            <Link href="/training" className="btn-primary">
              Access Training Library
            </Link>
          </div>
        </div>

        {/* Delete Profile Confirmation Modal */}
        {showDeleteConfirm && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
              <div className="flex items-center space-x-3 mb-4">
                <Trash2 className="h-6 w-6 text-red-600" />
                <h3 className="text-lg font-semibold text-gray-900">Delete Business Profile</h3>
              </div>
              
              <p className="text-gray-600 mb-6">
                Are you sure you want to delete your business profile? This action cannot be undone. 
                A new default profile will be created for you.
              </p>
              
              <div className="flex space-x-3">
                <button
                  onClick={() => setShowDeleteConfirm(false)}
                  className="btn-secondary flex-1"
                  disabled={deleting}
                >
                  Cancel
                </button>
                <button
                  onClick={deleteProfile}
                  disabled={deleting}
                  className="btn-danger flex-1 flex items-center justify-center space-x-2"
                >
                  {deleting ? (
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                  ) : (
                    <Trash2 className="h-5 w-5" />
                  )}
                  <span>{deleting ? 'Deleting...' : 'Delete Profile'}</span>
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
