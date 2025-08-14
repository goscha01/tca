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

  const getMembershipStatus = (expiryDate: string | null) => {
    if (!expiryDate) return 'No membership';
    
    const expiry = new Date(expiryDate);
    const now = new Date();
    
    if (expiry < now) {
      return 'Expired';
    } else if (expiry.getTime() - now.getTime() < 30 * 24 * 60 * 60 * 1000) {
      return 'Expiring Soon';
    } else {
      return 'Active';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Active': return 'text-green-600 bg-green-100';
      case 'Expiring Soon': return 'text-yellow-600 bg-yellow-100';
      case 'Expired': return 'text-red-600 bg-red-100';
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
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white rounded-lg shadow p-6 mb-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label htmlFor="search" className="block text-sm font-medium text-gray-700 mb-2">
                Search Businesses
              </label>
              <div className="relative">
                <Building className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                <input
                  type="text"
                  id="search"
                  placeholder="Company name or email..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:ring-primary focus:border-primary"
                />
              </div>
            </div>
            
            <div>
              <label htmlFor="tier" className="block text-sm font-medium text-gray-700 mb-2">
                Membership Tier
              </label>
              <select
                id="tier"
                value={filterTier}
                onChange={(e) => setFilterTier(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-primary focus:border-primary"
              >
                <option value="all">All Tiers</option>
                <option value="yearly">Yearly</option>
                <option value="free">Free</option>
              </select>
            </div>

            <div className="flex items-end">
              <div className="flex items-center space-x-2 text-sm text-gray-600">
                <Users className="h-4 w-4" />
                <span>{filteredBusinesses.length} businesses found</span>
              </div>
            </div>
          </div>
        </div>

        {/* Business Listings */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredBusinesses.map((business) => (
            <div key={business.id} className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow">
              {/* Business Header */}
              <div className="p-6 border-b border-gray-200">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center space-x-3">
                    {business.logo_url ? (
                      <img 
                        src={business.logo_url} 
                        alt={`${business.company_name} logo`}
                        className="h-12 w-12 rounded-lg object-cover"
                      />
                    ) : (
                      <div className="h-12 w-12 bg-primary/10 rounded-lg flex items-center justify-center">
                        <Building className="h-6 w-6 text-primary" />
                      </div>
                    )}
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900">
                        {business.company_name}
                      </h3>
                      <p className="text-sm text-gray-500">
                        Member since {new Date(business.created_at).getFullYear()}
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex flex-col items-end">
                    <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(getMembershipStatus(business.membership_expires || null))}`}>
                      {getMembershipStatus(business.membership_expires || null)}
                    </span>
                    {business.membership_tier && (
                      <span className="text-xs text-gray-500 mt-1">
                        {business.membership_tier.charAt(0).toUpperCase() + business.membership_tier.slice(1)}
                      </span>
                    )}
                  </div>
                </div>

                {/* Contact Info */}
                <div className="space-y-2">
                  <div className="flex items-center space-x-2 text-sm text-gray-600">
                    <Mail className="h-4 w-4" />
                    <span>{business.email}</span>
                  </div>
                  
                  {business.business_link && (
                    <div className="flex items-center space-x-2 text-sm text-gray-600">
                      <Globe className="h-4 w-4" />
                      <a 
                        href={business.business_link} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="text-primary hover:text-primary-dark underline"
                      >
                        Visit Website
                      </a>
                    </div>
                  )}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="p-4 bg-gray-50">
                <div className="flex space-x-2">
                  <button className="flex-1 bg-primary text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-primary-dark transition-colors">
                    Contact
                  </button>
                  {business.business_link && (
                    <a 
                      href={business.business_link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex-1 bg-white border border-gray-300 text-gray-700 px-4 py-2 rounded-md text-sm font-medium hover:bg-gray-50 transition-colors text-center"
                    >
                      Website
                    </a>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Empty State */}
        {filteredBusinesses.length === 0 && (
          <div className="text-center py-12">
            <Building className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No businesses found</h3>
            <p className="text-gray-500">
              {searchTerm || filterTier !== 'all' 
                ? 'Try adjusting your search criteria or filters.'
                : 'No businesses are currently listed in the directory.'
              }
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
