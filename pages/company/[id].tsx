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
  Shield,
  Image as ImageIcon,
  FileText
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
  google_place_id?: string;
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
    if (!id) return;

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
              ← Back to TSA
            </Link>
            <div className="flex items-center space-x-2">
              <Shield className="h-6 w-6 text-primary" />
              <span className="text-sm text-gray-600">TSA Verified Member</span>
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

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Left Column - Logo + Contact Info, Services */}
          <div className="space-y-6">
            {/* Logo and Contact Info Row */}
            <div className="bg-white rounded-xl shadow-lg p-6">
              <div className="flex items-start space-x-6">
                {/* Logo Display */}
                <div className="flex-shrink-0">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Company Logo</h3>
                  {getLogoUrl(company.logo_url) ? (
                    <img 
                      src={getLogoUrl(company.logo_url) || ''} 
                      alt={`${company.name} Logo`}
                      className="h-20 w-auto rounded-lg border border-gray-200"
                      onError={(e) => {
                        const target = e.target as HTMLImageElement;
                        target.style.display = 'none';
                      }}
                    />
                  ) : (
                    <div className="h-20 w-20 bg-gray-100 rounded-lg border border-gray-200 flex items-center justify-center">
                      <Building className="h-10 w-10 text-gray-400" />
                    </div>
                  )}
                </div>
                
                {/* Contact Information */}
                <div className="flex-1">
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
              </div>
            </div>

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

            {/* Project Portfolio */}
            {company.projects && company.projects.length > 0 && (
              <div className="bg-white rounded-xl shadow-lg p-6">
                <h2 className="text-xl font-semibold text-gray-900 mb-4">Project Portfolio</h2>
                <div className="grid grid-cols-2 gap-4">
                  {company.projects.map((project, index) => (
                    <div key={index} className="relative">
                      <div className="w-full h-32 bg-gray-100 rounded-lg border border-gray-200 flex items-center justify-center">
                        <ImageIcon className="h-8 w-8 text-gray-400" />
                      </div>
                      <div className="mt-2 text-sm text-gray-600 text-center">Project {index + 1}</div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Insurance & Bond */}
            {company.insurance_bond && (
              <div className="bg-white rounded-xl shadow-lg p-6">
                <h2 className="text-xl font-semibold text-gray-900 mb-4">Insurance & Bond Certificate</h2>
                <div className="flex items-center space-x-3 p-3 bg-green-50 border border-green-200 rounded-lg">
                  <FileText className="h-6 w-6 text-green-600" />
                  <span className="text-green-800">Certificate Available</span>
                </div>
              </div>
            )}
          </div>

          {/* Right Column - Basic Info, Social Media, Working Hours */}
          <div className="space-y-6">
            {/* Basic Information */}
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Basic Information</h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Company Name</label>
                  <p className="text-gray-900">{company.name}</p>
                </div>
                {company.description && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                    <p className="text-gray-900">{company.description}</p>
                  </div>
                )}
                {company.website && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Website</label>
                    <a 
                      href={company.website}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-primary hover:text-primary-dark"
                    >
                      {company.website}
                    </a>
                  </div>
                )}
              </div>
            </div>

            {/* Social Media Profiles */}
            {(company.social_media.facebook || company.social_media.instagram || 
              company.social_media.twitter || company.social_media.linkedin ||
              company.social_media.thumbtack || company.social_media.yelp) && (
              <div className="bg-white rounded-xl shadow-lg p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Social Media Profiles</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {company.social_media.facebook && (
                    <a 
                      href={company.social_media.facebook}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center space-x-2 text-blue-600 hover:text-blue-700"
                    >
                      <Facebook className="h-5 w-5" />
                      <span className="text-sm">Facebook</span>
                    </a>
                  )}
                  {company.social_media.instagram && (
                    <a 
                      href={company.social_media.instagram}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center space-x-2 text-pink-600 hover:text-pink-700"
                    >
                      <Instagram className="h-5 w-5" />
                      <span className="text-sm">Instagram</span>
                    </a>
                  )}
                  {company.social_media.twitter && (
                    <a 
                      href={company.social_media.twitter}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center space-x-2 text-blue-400 hover:text-blue-500"
                    >
                      <Twitter className="h-5 w-5" />
                      <span className="text-sm">Twitter</span>
                    </a>
                  )}
                  {company.social_media.linkedin && (
                    <a 
                      href={company.social_media.linkedin}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center space-x-2 text-blue-700 hover:text-blue-800"
                    >
                      <Linkedin className="h-5 w-5" />
                      <span className="text-sm">LinkedIn</span>
                    </a>
                  )}
                  {company.social_media.thumbtack && (
                    <a 
                      href={company.social_media.thumbtack}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center space-x-2 text-green-600 hover:text-green-700"
                    >
                      <Globe className="h-5 w-5" />
                      <span className="text-sm">Thumbtack</span>
                    </a>
                  )}
                  {company.social_media.yelp && (
                    <a 
                      href={company.social_media.yelp}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center space-x-2 text-red-600 hover:text-red-700"
                    >
                      <Globe className="h-5 w-5" />
                      <span className="text-sm">Yelp</span>
                    </a>
                  )}
                </div>
              </div>
            )}

            {/* Working Hours */}
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Working Hours</h3>
              <div className="space-y-3">
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

            {/* Customer Reviews */}
            {company.reviews && company.reviews.length > 0 && (
              <div className="bg-white rounded-xl shadow-lg p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Customer Reviews</h3>
                <div className="space-y-4">
                  {company.reviews.map((review, index) => (
                    <div key={index} className="border-l-4 border-primary pl-4">
                      <div className="flex items-center space-x-2 mb-2">
                        <div className="flex items-center space-x-1">
                          {[...Array(5)].map((_, i) => (
                            <Star 
                              key={i} 
                              className={`h-4 w-4 ${i < review.rating ? 'text-yellow-400 fill-current' : 'text-gray-300'}`} 
                            />
                          ))}
                        </div>
                        <span className="text-sm text-gray-600">{review.rating}/5</span>
                      </div>
                      <p className="text-gray-700 text-sm mb-1">{review.comment}</p>
                      <div className="flex items-center justify-between text-xs text-gray-500">
                        <span>- {review.customer_name}</span>
                        <span>{new Date(review.date).toLocaleDateString()}</span>
                      </div>
                    </div>
                  ))}
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
