import React, { useState, useEffect } from 'react';
import { useAuth } from '../lib/auth';
import { useRouter } from 'next/router';
import { supabase } from '../lib/supabase';
import { Shield, Upload, Link as LinkIcon, Download, BookOpen, Calendar, CheckCircle } from 'lucide-react';

export default function Dashboard() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const [logoFile, setLogoFile] = useState<File | null>(null);
  const [businessLink, setBusinessLink] = useState('');
  const [uploading, setUploading] = useState(false);
  const [message, setMessage] = useState('');

  // Redirect if not authenticated
  useEffect(() => {
    if (!loading && !user) {
      router.push('/login');
    }
  }, [user, loading, router]);

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
      const fileExt = logoFile.name.split('.').pop();
      const fileName = `${user.id}-logo.${fileExt}`;
      const filePath = `logos/${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from('tca-assets')
        .upload(filePath, logoFile);

      if (uploadError) throw uploadError;

      const { data: { publicUrl } } = supabase.storage
        .from('tca-assets')
        .getPublicUrl(filePath);

      // Update user profile with logo URL
      const { error: updateError } = await supabase
        .from('users')
        .update({ logo_url: publicUrl })
        .eq('id', user.id);

      if (updateError) throw updateError;

      setMessage('Logo uploaded successfully!');
      setLogoFile(null);
    } catch (error) {
      setMessage('Error uploading logo. Please try again.');
      console.error('Upload error:', error);
    } finally {
      setUploading(false);
    }
  };

  const updateBusinessLink = async () => {
    if (!businessLink.trim() || !user) return;

    try {
      const { error } = await supabase
        .from('users')
        .update({ business_link: businessLink })
        .eq('id', user.id);

      if (error) throw error;

      setMessage('Business link updated successfully!');
      setBusinessLink('');
    } catch (error) {
      setMessage('Error updating business link. Please try again.');
      console.error('Update error:', error);
    }
  };

  const getMembershipStatus = () => {
    if (!user.membership_expires) return 'No membership';
    
    const expiryDate = new Date(user.membership_expires);
    const now = new Date();
    
    if (expiryDate < now) {
      return 'Expired';
    } else if (expiryDate.getTime() - now.getTime() < 30 * 24 * 60 * 60 * 1000) {
      return 'Expiring Soon';
    } else {
      return 'Active';
    }
  };

  const getMembershipStatusColor = (status: string) => {
    switch (status) {
      case 'Active': return 'text-green-600 bg-green-100';
      case 'Expiring Soon': return 'text-yellow-600 bg-yellow-100';
      case 'Expired': return 'text-red-600 bg-red-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

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
            
            {user.logo_url ? (
              <div className="mb-4">
                <img 
                  src={user.logo_url} 
                  alt="Company Logo" 
                  className="h-20 w-auto rounded-lg border border-gray-200"
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

          {/* Business Link */}
          <div className="card">
            <div className="flex items-center space-x-3 mb-4">
              <LinkIcon className="h-6 w-6 text-primary" />
              <h2 className="text-xl font-semibold text-gray-900">Business Link</h2>
            </div>
            
            <div className="space-y-4">
              {user.business_link ? (
                <div className="mb-4">
                  <a 
                    href={user.business_link} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-primary hover:text-primary-dark break-all"
                  >
                    {user.business_link}
                  </a>
                </div>
              ) : (
                <p className="text-gray-600 mb-4">No business link added yet.</p>
              )}

              <input
                type="url"
                placeholder="https://your-business-website.com"
                value={businessLink}
                onChange={(e) => setBusinessLink(e.target.value)}
                className="input-field"
              />
              <button
                onClick={updateBusinessLink}
                disabled={!businessLink.trim()}
                className="btn-primary w-full disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Update Business Link
              </button>
            </div>
          </div>

          {/* TCA Seal Download */}
          <div className="card">
            <div className="flex items-center space-x-3 mb-4">
              <Shield className="h-6 w-6 text-primary" />
              <h2 className="text-xl font-semibold text-gray-900">TCA Seal</h2>
            </div>
            
            <p className="text-gray-600 mb-4">
              Download and display the official TCA seal on your website to show your membership.
            </p>

            <div className="space-y-3">
              <button className="btn-outline w-full flex items-center justify-center space-x-2">
                <Download className="h-5 w-5" />
                <span>Download PNG</span>
              </button>
              <button className="btn-outline w-full flex items-center justify-center space-x-2">
                <Download className="h-5 w-5" />
                <span>Download HTML Code</span>
              </button>
            </div>
          </div>

          {/* Membership Status */}
          <div className="card">
            <div className="flex items-center space-x-3 mb-4">
              <CheckCircle className="h-6 w-6 text-primary" />
              <h2 className="text-xl font-semibold text-gray-900">Membership Status</h2>
            </div>
            
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-gray-600">Tier:</span>
                <span className="font-medium">{user.membership_tier || 'Basic'}</span>
              </div>
              
              <div className="flex items-center justify-between">
                <span className="text-gray-600">Status:</span>
                <span className={`px-2 py-1 rounded-full text-sm font-medium ${getMembershipStatusColor(getMembershipStatus())}`}>
                  {getMembershipStatus()}
                </span>
              </div>
              
              {user.membership_expires && (
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">Expires:</span>
                  <span className="font-medium">
                    {new Date(user.membership_expires).toLocaleDateString()}
                  </span>
                </div>
              )}
            </div>
          </div>

          {/* Training Library Access */}
          <div className="card lg:col-span-2">
            <div className="flex items-center space-x-3 mb-4">
              <BookOpen className="h-6 w-6 text-primary" />
              <h2 className="text-xl font-semibold text-gray-900">Training Library</h2>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="text-center p-4 bg-gray-50 rounded-lg">
                <div className="text-2xl font-bold text-primary">12</div>
                <div className="text-sm text-gray-600">Available Courses</div>
              </div>
              <div className="text-center p-4 bg-gray-50 rounded-lg">
                <div className="text-2xl font-bold text-secondary">8</div>
                <div className="text-sm text-gray-600">Completed</div>
              </div>
              <div className="text-center p-4 bg-gray-50 rounded-lg">
                <div className="text-2xl font-bold text-gray-600">4</div>
                <div className="text-sm text-gray-600">In Progress</div>
              </div>
            </div>

            <div className="mt-6">
              <a href="/training" className="btn-primary">
                Access Training Library
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
