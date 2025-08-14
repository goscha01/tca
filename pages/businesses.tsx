import React, { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { Shield, MapPin, Phone, Mail, Globe, Building, Star, Users } from 'lucide-react';
import Link from 'next/link';

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
              TSA Business Directory
            </h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Discover trusted service professionals in your area. All businesses listed here are verified TSA members committed to quality and transparency.
            </p>
          </div>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white rounded-lg shadow p-6 mb-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label htmlFor="search" className="block text-sm font-medium text-gray-700 mb-2">
                Search Businesses
              </label>
              <input
                type="text"
                id="search"
                placeholder="Search by name, email, city, or state..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
              />
            </div>
            <div className="flex items-end">
              <div className="text-sm text-gray-500">
                {filteredBusinesses.length} business{filteredBusinesses.length !== 1 ? 'es' : ''} found
              </div>
            </div>
          </div>
        </div>

        {/* Businesses Grid */}
        {filteredBusinesses.length === 0 ? (
          <div className="text-center py-12">
            <Building className="h-16 w-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No businesses found</h3>
            <p className="text-gray-500">
              {searchTerm ? 'Try adjusting your search terms.' : 'The business directory is being populated. Check back soon!'}
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredBusinesses.map((business) => (
              <Link 
                key={business.id} 
                href={`/company/${business.id}`}
                className="block bg-white rounded-lg shadow-md hover:shadow-lg transition-all duration-200 hover:scale-[1.02] cursor-pointer"
              >
                {/* Business Header */}
                <div className="p-6 border-b border-gray-200">
                  <div className="flex items-start space-x-4">
                    <div className="flex-shrink-0">
                      {business.logo_url ? (
                        <img
                          src={business.logo_url}
                          alt={`${business.name} logo`}
                          className="w-16 h-16 rounded-lg object-cover"
                        />
                      ) : (
                        <div className="w-16 h-16 bg-primary/10 rounded-lg flex items-center justify-center">
                          <Building className="w-8 h-8 text-primary" />
                        </div>
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="text-lg font-semibold text-gray-900 mb-1">
                        {business.name}
                      </h3>
                      {business.description && (
                        <p className="text-sm text-gray-600 line-clamp-2">
                          {business.description}
                        </p>
                      )}
                    </div>
                  </div>
                </div>

                {/* Business Details */}
                <div className="p-6 space-y-4">
                  {/* Contact Info */}
                  <div className="space-y-2">
                    {business.phone && (
                      <div className="flex items-center space-x-2 text-sm text-gray-600">
                        <Phone className="w-4 h-4 text-primary" />
                        <span>{business.phone}</span>
                      </div>
                    )}
                    {business.email && (
                      <div className="flex items-center space-x-2 text-sm text-gray-600">
                        <Mail className="w-4 h-4 text-primary" />
                        <span>{business.email}</span>
                      </div>
                    )}
                    {(business.address || business.city || business.state) && (
                      <div className="flex items-center space-x-2 text-sm text-gray-600">
                        <MapPin className="w-4 h-4 text-primary" />
                        <span>
                          {[business.address, business.city, business.state].filter(Boolean).join(', ')}
                        </span>
                      </div>
                    )}
                    {business.website && (
                      <div className="flex items-center space-x-2 text-sm text-gray-600">
                        <Globe className="w-4 h-4 text-primary" />
                        <a
                          href={business.website.startsWith('http') ? business.website : `https://${business.website}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-primary hover:underline"
                        >
                          {business.website.replace(/^https?:\/\//, '')}
                        </a>
                      </div>
                    )}
                  </div>

                  {/* Services */}
                  {business.services && business.services.length > 0 && (
                    <div>
                      <h4 className="text-sm font-medium text-gray-900 mb-2">Services</h4>
                      <div className="flex flex-wrap gap-1">
                        {business.services.slice(0, 3).map((service, index) => (
                          <span
                            key={index}
                            className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-primary/10 text-primary"
                          >
                            {service}
                          </span>
                        ))}
                        {business.services.length > 3 && (
                          <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-600">
                            +{business.services.length - 3} more
                          </span>
                        )}
                      </div>
                    </div>
                  )}

                  {/* Specialties */}
                  {business.specialties && business.specialties.length > 0 && (
                    <div>
                      <h4 className="text-sm font-medium text-gray-900 mb-2">Specialties</h4>
                      <div className="flex flex-wrap gap-1">
                        {business.specialties.slice(0, 2).map((specialty, index) => (
                          <span
                            key={index}
                            className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-secondary/10 text-secondary"
                          >
                            {specialty}
                          </span>
                        ))}
                        {business.specialties.length > 2 && (
                          <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-600">
                            +{business.specialties.length - 2} more
                          </span>
                        )}
                      </div>
                    </div>
                  )}

                  {/* Certifications */}
                  {business.certifications && business.certifications.length > 0 && (
                    <div>
                      <h4 className="text-sm font-medium text-gray-900 mb-2">Certifications</h4>
                      <div className="flex flex-wrap gap-1">
                        {business.certifications.slice(0, 2).map((cert, index) => (
                          <span
                            key={index}
                            className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-700"
                          >
                            {cert}
                          </span>
                        ))}
                        {business.certifications.length > 2 && (
                          <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-600">
                            +{business.certifications.length - 2} more
                          </span>
                        )}
                      </div>
                    </div>
                  )}

                  {/* Member Since */}
                  <div className="pt-2 border-t border-gray-200">
                    <div className="flex items-center justify-between text-xs text-gray-500">
                      <span>Member since {new Date(business.created_at).getFullYear()}</span>
                      <div className="flex items-center space-x-1">
                        <Shield className="w-3 h-3 text-primary" />
                        <span className="text-primary font-medium">TSA Verified</span>
                      </div>
                    </div>
                  </div>
                  
                  {/* View Profile Button */}
                  <div className="pt-3">
                    <div className="text-center">
                      <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-primary text-white">
                        Click to View Full Profile
                      </span>
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
