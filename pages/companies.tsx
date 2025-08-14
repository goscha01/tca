import React, { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { Building, MapPin, Phone, Mail, Globe, Search, Filter, Users, Star } from 'lucide-react';
import Link from 'next/link';

interface Company {
  id: string;
  name: string;
  description: string;
  industry: string;
  created_at: string;
  updated_at: string;
  business_count?: number;
}

export default function Companies() {
  const [companies, setCompanies] = useState<Company[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterIndustry, setFilterIndustry] = useState<string>('all');

  useEffect(() => {
    fetchCompanies();
  }, []);

  const fetchCompanies = async () => {
    if (!supabase) return;
    
    try {
      // Fetch companies with business count
      const { data, error } = await supabase
        .from('companies')
        .select(`
          *,
          business_count:businesses(count)
        `)
        .order('name');

      if (error) throw error;
      
      // Process the data to extract business count
      const processedCompanies = data?.map(company => ({
        ...company,
        business_count: company.business_count?.[0]?.count || 0
      })) || [];
      
      setCompanies(processedCompanies);
    } catch (error) {
      console.error('Error fetching companies:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredCompanies = companies.filter(company => {
    const matchesSearch = company.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         company.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesIndustry = filterIndustry === 'all' || company.industry === filterIndustry;
    return matchesSearch && matchesIndustry;
  });

  const industries = ['all', ...Array.from(new Set(companies.map(c => c.industry)))];

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
              <Building className="h-16 w-16 text-primary" />
            </div>
            <h1 className="text-4xl font-bold text-gray-900 mb-4">
              TCA Companies Directory
            </h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Discover all companies registered with the Trusted Cleaners Association. 
              Find cleaning professionals and services in your area.
            </p>
          </div>
        </div>
      </div>

      {/* Search and Filter Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Search */}
            <div className="relative">
              <Search className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search companies..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary focus:border-transparent"
              />
            </div>

            {/* Industry Filter */}
            <div className="relative">
              <Filter className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
              <select
                value={filterIndustry}
                onChange={(e) => setFilterIndustry(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary focus:border-transparent"
              >
                {industries.map(industry => (
                  <option key={industry} value={industry}>
                    {industry === 'all' ? 'All Industries' : industry}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Companies Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredCompanies.map((company) => (
            <div key={company.id} className="bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow duration-200">
              <div className="p-6">
                {/* Company Header */}
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">
                      {company.name}
                    </h3>
                    <div className="flex items-center space-x-2 text-sm text-gray-600">
                      <Building className="h-4 w-4" />
                      <span>{company.industry}</span>
                    </div>
                  </div>
                  <div className="flex items-center space-x-1 text-sm text-gray-500">
                    <Users className="h-4 w-4" />
                    <span>{company.business_count}</span>
                  </div>
                </div>

                {/* Company Description */}
                <p className="text-gray-600 text-sm mb-4 line-clamp-3">
                  {company.description || 'No description available.'}
                </p>

                {/* Company Stats */}
                <div className="flex items-center justify-between text-sm text-gray-500 mb-4">
                  <span>Member since {new Date(company.created_at).getFullYear()}</span>
                  {company.business_count > 0 && (
                    <span className="flex items-center space-x-1">
                      <Star className="h-4 w-4 text-yellow-400 fill-current" />
                      <span>Active</span>
                    </span>
                  )}
                </div>

                {/* Action Buttons */}
                <div className="flex space-x-2">
                  <Link
                    href={`/businesses?company=${encodeURIComponent(company.name)}`}
                    className="flex-1 bg-primary text-white text-center py-2 px-4 rounded-md hover:bg-primary-dark transition-colors duration-200"
                  >
                    View Businesses
                  </Link>
                  <button className="bg-gray-100 text-gray-700 py-2 px-4 rounded-md hover:bg-gray-200 transition-colors duration-200">
                    Contact
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Empty State */}
        {filteredCompanies.length === 0 && (
          <div className="text-center py-12">
            <Building className="h-16 w-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No companies found</h3>
            <p className="text-gray-600">
              {searchTerm || filterIndustry !== 'all' 
                ? 'Try adjusting your search or filter criteria.'
                : 'No companies are currently registered in the system.'
              }
            </p>
          </div>
        )}

        {/* Stats Section */}
        <div className="mt-12 bg-white rounded-lg shadow-sm p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Directory Statistics</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center">
              <div className="text-3xl font-bold text-primary">{companies.length}</div>
              <div className="text-sm text-gray-600">Total Companies</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-secondary">
                {companies.reduce((sum, c) => sum + (c.business_count || 0), 0)}
              </div>
              <div className="text-sm text-gray-600">Total Businesses</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-gray-600">
                {Array.from(new Set(companies.map(c => c.industry))).length}
              </div>
              <div className="text-sm text-gray-600">Industries</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

