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
  };
  services: string[];
  specialties: string[];
  certifications: string[];
  created_at: string;
  updated_at: string;
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
  const [newSpecialty, setNewSpecialty] = useState('');
  const [newCertification, setNewCertification] = useState('');
  const [isEditing, setIsEditing] = useState(false);

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
      },
      services: [],
      specialties: [],
      certifications: [],
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
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

  const addItem = (field: 'services' | 'specialties' | 'certifications', value: string) => {
    if (!value.trim()) return;
    
    setProfile(prev => prev ? {
      ...prev,
      [field]: [...prev[field], value.trim()]
    } : null);
    
    if (field === 'specialties') setNewSpecialty('');
    if (field === 'certifications') setNewCertification('');
  };

  const removeItem = (field: 'specialties' | 'certifications', index: number) => {
    setProfile(prev => prev ? {
      ...prev,
      [field]: prev[field].filter((_, i) => i !== index)
    } : null);
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
        


        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Company Logo Upload */}
          <div className="card">
            <div className="flex items-center space-x-3 mb-4">
              <Upload className="h-6 w-6 text-primary" />
              <h2 className="text-xl font-semibold text-gray-900">Company Logo</h2>
            </div>
            
            {profile?.logo_url && getLogoUrl(profile.logo_url) ? (
              <div className="mb-4">
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
              </div>
            ) : (
              <p className="text-gray-600 mb-4">No logo uploaded yet.</p>
            )}

            <div className="space-y-4">
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
        </div>

        {/* Business Profile Section */}
        {profile ? (
          <div className="mt-8">
            <div className="card">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-semibold text-gray-900">Business Profile</h2>
                <div className="flex space-x-3">
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

              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Left Column - Basic Info */}
                <div className="lg:col-span-1 space-y-6">
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
                </div>

                {/* Right Column - Contact & Details */}
                <div className="lg:col-span-2 space-y-6">
                  {/* Contact Information */}
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Contact Information</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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

                      <div className="md:col-span-2">
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

                  {/* Services & Specialties */}
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Services & Specialties</h3>
                    <div className="space-y-4">
                      {/* Services */}
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Services Offered
                        </label>
                        <div className="mb-4">
                          <select
                            multiple
                            value={profile.services}
                            onChange={(e) => {
                              const selectedOptions = Array.from(e.target.selectedOptions, option => option.value);
                              setProfile(prev => prev ? { ...prev, services: selectedOptions } : null);
                            }}
                            className="input-field min-h-[120px]"
                            disabled={!isEditing}
                          >
                            <optgroup label="Cleaning & Maintenance">
                              <option value="Residential cleaning">Residential cleaning</option>
                              <option value="Commercial/office cleaning">Commercial/office cleaning</option>
                              <option value="Carpet & upholstery cleaning">Carpet & upholstery cleaning</option>
                              <option value="Window washing">Window washing</option>
                              <option value="Pressure washing">Pressure washing</option>
                            </optgroup>
                            <optgroup label="Home Improvement & Repairs">
                              <option value="Handyman services">Handyman services</option>
                              <option value="Plumbing">Plumbing</option>
                              <option value="Electrical services">Electrical services</option>
                              <option value="HVAC installation & maintenance">HVAC installation & maintenance</option>
                              <option value="Appliance repair">Appliance repair</option>
                            </optgroup>
                            <optgroup label="Outdoor & Property Services">
                              <option value="Landscaping & lawn care">Landscaping & lawn care</option>
                              <option value="Tree trimming & removal">Tree trimming & removal</option>
                              <option value="Snow removal">Snow removal</option>
                              <option value="Pool cleaning & maintenance">Pool cleaning & maintenance</option>
                              <option value="Pest control">Pest control</option>
                            </optgroup>
                            <optgroup label="Specialized Home Care">
                              <option value="Deep sanitation & disinfection services">Deep sanitation & disinfection services</option>
                              <option value="Mold remediation">Mold remediation</option>
                              <option value="Water damage restoration">Water damage restoration</option>
                              <option value="Moving assistance (packing/unpacking)">Moving assistance (packing/unpacking)</option>
                            </optgroup>
                          </select>
                          <p className="text-sm text-gray-500 mt-1">
                            Hold Ctrl (or Cmd on Mac) to select multiple services
                          </p>
                        </div>

                      </div>

                      {/* Specialties */}
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Specialties
                        </label>
                        <div className="flex space-x-2 mb-2">
                          <input
                            type="text"
                            value={newSpecialty}
                            onChange={(e) => setNewSpecialty(e.target.value)}
                            className="input-field flex-1"
                            placeholder="Add a specialty"
                            onKeyPress={(e) => e.key === 'Enter' && addItem('specialties', newSpecialty)}
                            disabled={!isEditing}
                          />
                          <button
                            onClick={() => addItem('specialties', newSpecialty)}
                            className="btn-primary px-4"
                            disabled={!isEditing}
                          >
                            Add
                          </button>
                        </div>
                        <div className="flex flex-wrap gap-2">
                          {profile.specialties.map((specialty, index) => (
                            <span
                              key={index}
                              className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-secondary/10 text-secondary"
                            >
                              {specialty}
                              <button
                                onClick={() => removeItem('specialties', index)}
                                className="ml-2 text-secondary hover:text-secondary-dark"
                                disabled={!isEditing}
                              >
                                ×
                              </button>
                            </span>
                          ))}
                        </div>
                      </div>

                      {/* Certifications */}
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Certifications
                        </label>
                        <div className="flex space-x-2 mb-2">
                          <input
                            type="text"
                            value={newCertification}
                            onChange={(e) => setNewCertification(e.target.value)}
                            className="input-field flex-1"
                            placeholder="Add a certification"
                            onKeyPress={(e) => e.key === 'Enter' && addItem('certifications', newCertification)}
                            disabled={!isEditing}
                          />
                          <button
                            onClick={() => addItem('certifications', newCertification)}
                            className="btn-primary px-4"
                            disabled={!isEditing}
                          >
                            Add
                          </button>
                        </div>
                        <div className="flex flex-wrap gap-2">
                          {profile.certifications.map((certification, index) => (
                            <span
                              key={index}
                              className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-green-100 text-green-800"
                            >
                              {certification}
                              <button
                                onClick={() => removeItem('certifications', index)}
                                className="ml-2 text-green-600 hover:text-green-800"
                                disabled={!isEditing}
                              >
                                ×
                              </button>
                            </span>
                          ))}
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
                    </div>
                  </div>
                </div>
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
