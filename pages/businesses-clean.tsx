import React, { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { Shield, MapPin, Phone, Mail, Globe, Building, Star, Users } from 'lucide-react';

interface Business {
  id: string;
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
  services: string[];
  specialties: string[];
  certifications: string[];
  created_at: string;
  updated_at: string;
}

export default function Businesses() {
  const [businesses, setBusinesses] = useState<Business[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchBusinesses();
  }, []);

  const fetchBusinesses = async () => {
    if (!supabase) return;
    
    try {
      const { data, error } = await supabase
        .from('businesses')
        .select('*')
        .order('name');

      if (error) {
        console.error('Error fetching businesses:', error);
        // If businesses table doesn't exist yet, show empty state
        setBusinesses([]);
        return;
      }
      
      setBusinesses(data || []);
    } catch (error) {
      console.error('Error fetching businesses:', error);
      setBusinesses([]);
    } finally {
      setLoading(false);
    }
  };

  const filteredBusinesses = businesses.filter(business => {
    const matchesSearch = business.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         business.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         business.city.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         business.state.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesSearch;
  });

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <div className="bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="text-center">
            <div className="flex justify-center mb-6">
              <Shield className="h-16 w-16 text-primary" />
            </div>
            <h1 className="text-4xl font-bold text-gray-900 mb-4">
              TCA Business Directory
            </h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Discover trusted cleaning professionals in your area. All businesses listed here are verified TCA members committed to quality and transparency.
            </p>
          </div>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search by company name, email, city, or state..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                />
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Results Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-6">
          <h2 className="text-2xl font-semibold text-gray-900">
            {filteredBusinesses.length === 0 ? 'No businesses found' : `${filteredBusinesses.length} businesses found`}
          </h2>
        </div>

        {businesses.length === 0 ? (
          <div className="text-center py-12">
            <Building className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No businesses available yet</h3>
            <p className="text-gray-600">
              The business directory is being set up. Check back soon to find trusted cleaning professionals in your area.
            </p>
          </div>
        ) : filteredBusinesses.length === 0 ? (
          <div className="text-center py-12">
            <Building className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No businesses match your search</h3>
            <p className="text-gray-600">
              Try adjusting your search terms or browse all available businesses.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredBusinesses.map((business) => (
              <div key={business.id} className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow duration-200">
                <div className="p-6">
                  {/* Business Header */}
                  <div className="flex items-start space-x-4 mb-4">
                    {business.logo_url ? (
                      <img
                        src={business.logo_url}
                        alt={`${business.name} logo`}
                        className="w-16 h-16 rounded-lg object-cover border border-gray-200"
                      />
                    ) : (
                      <div className="w-16 h-16 bg-gray-100 rounded-lg flex items-center justify-center">
                        <Building className="h-8 w-8 text-gray-400" />
                      </div>
                    )}
                    <div className="flex-1 min-w-0">
                      <h3 className="text-lg font-semibold text-gray-900 truncate">
                        {business.name}
                      </h3>
                      {business.city && business.state && (
                        <p className="text-sm text-gray-600 flex items-center">
                          <MapPin className="h-4 w-4 mr-1" />
                          {business.city}, {business.state}
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Description */}
                  {business.description && (
                    <p className="text-gray-600 text-sm mb-4 line-clamp-3">
                      {business.description}
                    </p>
                  )}

                  {/* Services */}
                  {business.services && business.services.length > 0 && (
                    <div className="mb-4">
                      <h4 className="text-sm font-medium text-gray-900 mb-2">Services</h4>
                      <div className="flex flex-wrap gap-2">
                        {business.services.slice(0, 3).map((service, index) => (
                          <span
                            key={index}
                            className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-primary/10 text-primary"
                          >
                            {service}
                          </span>
                        ))}
                        {business.services.length > 3 && (
                          <span className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-gray-100 text-gray-600">
                            +{business.services.length - 3} more
                          </span>
                        )}
                      </div>
                    </div>
                  )}

                  {/* Contact Information */}
                  <div className="space-y-2 mb-4">
                    {business.phone && (
                      <div className="flex items-center text-sm text-gray-600">
                        <Phone className="h-4 w-4 mr-2 text-gray-400" />
                        <span>{business.phone}</span>
                      </div>
                    )}
                    {business.email && (
                      <div className="flex items-center text-sm text-gray-600">
                        <Mail className="h-4 w-4 mr-2 text-gray-400" />
                        <span>{business.email}</span>
                      </div>
                    )}
                    {business.website && (
                      <div className="flex items-center text-sm text-gray-600">
                        <Globe className="h-4 w-4 mr-2 text-gray-400" />
                        <a
                          href={business.website}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-primary hover:text-primary-dark truncate"
                        >
                          {business.website.replace(/^https?:\/\//, '')}
                        </a>
                      </div>
                    )}
                  </div>

                  {/* Address */}
                  {business.address && (
                    <div className="flex items-start text-sm text-gray-600 mb-4">
                      <MapPin className="h-4 w-4 mr-2 text-gray-400 mt-0.5" />
                      <div>
                        <p>{business.address}</p>
                        {(business.city || business.state || business.zip_code) && (
                          <p>
                            {[business.city, business.state, business.zip_code].filter(Boolean).join(', ')}
                          </p>
                        )}
                      </div>
                    </div>
                  )}

                  {/* Specialties & Certifications */}
                  {(business.specialties?.length > 0 || business.certifications?.length > 0) && (
                    <div className="pt-4 border-t border-gray-200">
                      {business.specialties?.length > 0 && (
                        <div className="mb-2">
                          <h4 className="text-xs font-medium text-gray-900 mb-1">Specialties</h4>
                          <div className="flex flex-wrap gap-1">
                            {business.specialties.slice(0, 2).map((specialty, index) => (
                              <span
                                key={index}
                                className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-secondary/10 text-secondary"
                              >
                                {specialty}
                              </span>
                            ))}
                          </div>
                        </div>
                      )}
                      {business.certifications?.length > 0 && (
                        <div>
                          <h4 className="text-xs font-medium text-gray-900 mb-1">Certifications</h4>
                          <div className="flex flex-wrap gap-1">
                            {business.certifications.slice(0, 2).map((certification, index) => (
                              <span
                                key={index}
                                className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-green-100 text-green-800"
                              >
                                {certification}
                              </span>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

