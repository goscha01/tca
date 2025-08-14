import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { supabase } from '../../lib/supabase';
import { 
  Building, 
  Phone, 
  Mail, 
  MapPin, 
  Globe, 
  Facebook, 
  Instagram, 
  Twitter, 
  Linkedin,
  Clock,
  Star,
  Shield
} from 'lucide-react';
import Link from 'next/link';

interface CompanyProfile {
  id: string;
  user_id: string;
  name: string;
  description: string;
  logo_url: string | null;
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

export default function CompanyProfile() {
  const router = useRouter();
  const { id } = router.query;
  const [company, setCompany] = useState<CompanyProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (id) {
      fetchCompanyProfile();
    }
  }, [id]);

  const fetchCompanyProfile = async () => {
    if (!id || !supabase) return;

    try {
      const { data, error } = await supabase
        .from('businesses')
        .select('*')
        .eq('id', id)
        .single();

      if (error) {
        console.error('Error fetching company profile:', error);
        setError('Company profile not found');
        return;
      }

      setCompany(data);
    } catch (error) {
      console.error('Unexpected error:', error);
      setError('Failed to load company profile');
    } finally {
      setLoading(false);
    }
  };

  const getLogoUrl = (logoUrl: string | null) => {
    if (!logoUrl) return null;
    if (logoUrl.startsWith('data:image/')) return logoUrl;
    if (logoUrl.startsWith('blob:')) return null;
    return logoUrl;
  };

  const formatTime = (time: string) => {
    if (!time) return '';
    return time;
  };

  const getDayStatus = (day: { open: string; close: string; closed: boolean }) => {
    if (day.closed) return 'Closed';
    return `${day.open} - ${day.close}`;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (error || !company) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <Building className="h-16 w-16 text-gray-400 mx-auto mb-4" />
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Company Not Found</h1>
          <p className="text-gray-600 mb-4">{error || 'The company profile you are looking for does not exist.'}</p>
          <Link href="/businesses" className="btn-primary">
            Browse All Companies
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <Link href="/" className="text-primary hover:text-primary-dark font-semibold">
              ← Back to THSA
            </Link>
            <div className="flex items-center space-x-2">
              <Shield className="h-6 w-6 text-primary" />
              <span className="text-sm text-gray-600">THSA Verified Member</span>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Company Header */}
        <div className="bg-white rounded-xl shadow-lg p-8 mb-8">
          <div className="flex flex-col md:flex-row items-start md:items-center space-y-4 md:space-y-0 md:space-x-6">
            {/* Logo */}
            <div className="flex-shrink-0">
              {getLogoUrl(company.logo_url) ? (
                <img 
                  src={getLogoUrl(company.logo_url) || ''} 
                  alt={`${company.name} Logo`}
                  className="h-24 w-24 rounded-lg object-cover border border-gray-200"
                  onError={(e) => {
                    const target = e.target as HTMLImageElement;
                    target.style.display = 'none';
                  }}
                />
              ) : (
                <div className="h-24 w-24 rounded-lg bg-gray-100 border border-gray-200 flex items-center justify-center">
                  <Building className="h-12 w-12 text-gray-400" />
                </div>
              )}
            </div>

            {/* Company Info */}
            <div className="flex-1">
              <h1 className="text-3xl font-bold text-gray-900 mb-2">{company.name}</h1>
              {company.description && (
                <p className="text-gray-600 text-lg mb-4">{company.description}</p>
              )}
              
              {/* Contact Buttons */}
              <div className="flex flex-wrap gap-3">
                {company.phone && (
                  <a 
                    href={`tel:${company.phone}`}
                    className="inline-flex items-center space-x-2 bg-primary text-white px-4 py-2 rounded-lg hover:bg-primary-dark transition-colors"
                  >
                    <Phone className="h-4 w-4" />
                    <span>Call Now</span>
                  </a>
                )}
                {company.email && (
                  <a 
                    href={`mailto:${company.email}`}
                    className="inline-flex items-center space-x-2 bg-secondary text-white px-4 py-2 rounded-lg hover:bg-secondary-dark transition-colors"
                  >
                    <Mail className="h-4 w-4" />
                    <span>Email</span>
                  </a>
                )}
                {company.website && (
                  <a 
                    href={company.website}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center space-x-2 bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors"
                  >
                    <Globe className="h-4 w-4" />
                    <span>Visit Website</span>
                  </a>
                )}
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Services */}
            {company.services && company.services.length > 0 && (
              <div className="bg-white rounded-xl shadow-lg p-6">
                <h2 className="text-xl font-semibold text-gray-900 mb-4">Services Offered</h2>
                <div className="flex flex-wrap gap-2">
                  {company.services.map((service, index) => (
                    <span
                      key={index}
                      className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-primary/10 text-primary"
                    >
                      {service}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Specialties */}
            {company.specialties && company.specialties.length > 0 && (
              <div className="bg-white rounded-xl shadow-lg p-6">
                <h2 className="text-xl font-semibold text-gray-900 mb-4">Specialties</h2>
                <div className="flex flex-wrap gap-2">
                  {company.specialties.map((specialty, index) => (
                    <span
                      key={index}
                      className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-secondary/10 text-secondary"
                    >
                      {specialty}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Certifications */}
            {company.certifications && company.certifications.length > 0 && (
              <div className="bg-white rounded-xl shadow-lg p-6">
                <h2 className="text-xl font-semibold text-gray-900 mb-4">Certifications</h2>
                <div className="flex flex-wrap gap-2">
                  {company.certifications.map((certification, index) => (
                    <span
                      key={index}
                      className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-green-100 text-green-800"
                    >
                      {certification}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Contact Information */}
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Contact Information</h3>
              <div className="space-y-3">
                {company.phone && (
                  <div className="flex items-center space-x-3">
                    <Phone className="h-5 w-5 text-gray-400" />
                    <span className="text-gray-700">{company.phone}</span>
                  </div>
                )}
                {company.email && (
                  <div className="flex items-center space-x-3">
                    <Mail className="h-5 w-5 text-gray-400" />
                    <span className="text-gray-700">{company.email}</span>
                  </div>
                )}
                {company.address && (
                  <div className="flex items-start space-x-3">
                    <MapPin className="h-5 w-5 text-gray-400 mt-0.5" />
                    <div className="text-gray-700">
                      <div>{company.address}</div>
                      {company.city && company.state && (
                        <div>{company.city}, {company.state} {company.zip_code}</div>
                      )}
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Operating Hours */}
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Operating Hours</h3>
              <div className="space-y-2">
                {Object.entries(company.operating_hours).map(([day, hours]) => (
                  <div key={day} className="flex justify-between items-center">
                    <span className="text-gray-700 capitalize">{day}</span>
                    <span className="text-gray-600 font-medium">
                      {getDayStatus(hours)}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Social Media */}
            {(company.social_media.facebook || company.social_media.instagram || 
              company.social_media.twitter || company.social_media.linkedin) && (
              <div className="bg-white rounded-xl shadow-lg p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Follow Us</h3>
                <div className="flex space-x-3">
                  {company.social_media.facebook && (
                    <a 
                      href={company.social_media.facebook}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600 hover:text-blue-700"
                    >
                      <Facebook className="h-6 w-6" />
                    </a>
                  )}
                  {company.social_media.instagram && (
                    <a 
                      href={company.social_media.instagram}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-pink-600 hover:text-pink-700"
                    >
                      <Instagram className="h-6 w-6" />
                    </a>
                  )}
                  {company.social_media.twitter && (
                    <a 
                      href={company.social_media.twitter}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-400 hover:text-blue-500"
                    >
                      <Twitter className="h-6 w-6" />
                    </a>
                  )}
                  {company.social_media.linkedin && (
                    <a 
                      href={company.social_media.linkedin}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-700 hover:text-blue-800"
                    >
                      <Linkedin className="h-6 w-6" />
                    </a>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Call to Action */}
        <div className="bg-primary rounded-xl shadow-lg p-8 text-center mt-8">
          <h2 className="text-2xl font-bold text-white mb-4">Ready to Work with {company.name}?</h2>
          <p className="text-primary-100 mb-6">
            Contact them today for a quote or to schedule your service.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            {company.phone && (
              <a 
                href={`tel:${company.phone}`}
                className="inline-flex items-center space-x-2 bg-white text-primary px-6 py-3 rounded-lg hover:bg-gray-50 transition-colors font-semibold"
              >
                <Phone className="h-5 w-5" />
                <span>Call Now</span>
              </a>
            )}
            {company.email && (
              <a 
                href={`mailto:${company.email}`}
                className="inline-flex items-center space-x-2 bg-secondary text-white px-6 py-3 rounded-lg hover:bg-secondary-dark transition-colors font-semibold"
              >
                <Mail className="h-5 w-5" />
                <span>Send Email</span>
              </a>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
