import React, { useState } from 'react';
import Link from 'next/link';
import { Award, Star, Trophy, Users, Calendar, MapPin } from 'lucide-react';
import Image from 'next/image';

export default function Awards() {
  const [nominationForm, setNominationForm] = useState({
    businessName: '',
    contactName: '',
    email: '',
    phone: '',
    businessType: '',
    googleBusinessUrl: '',
    yearsInBusiness: '',
    specialAchievements: ''
  });

  const handleFormChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setNominationForm({
      ...nominationForm,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // TODO: Implement nomination submission and Stripe checkout
    console.log('Nomination submitted:', nominationForm);
  };

  const currentWinners = [
    {
      year: "2024",
      category: "Excellence in Services",
      winner: "Sparkle Services",
      location: "New York, NY",
      rating: 4.9,
      reviews: 247,
      specialty: "Premium service solutions"
    },
    {
      year: "2024",
      category: "Outstanding Commercial Services",
      winner: "Elite Commercial Services",
      location: "Los Angeles, CA",
      rating: 4.8,
      reviews: 189,
      specialty: "Large-scale commercial projects"
    },
    {
      year: "2024",
      category: "Customer Service Champion",
      winner: "Fresh Start Services",
      location: "Chicago, IL",
      rating: 4.9,
      reviews: 156,
      specialty: "Eco-friendly and client-focused services"
    },
    {
      year: "2023",
      category: "Innovation in Services",
      winner: "Green Home Solutions",
      location: "Austin, TX",
      rating: 4.7,
      reviews: 134,
      specialty: "Sustainable service technology and methods"
    }
  ];

  const awardCategories = [
    {
      name: "Excellence in Services",
      description: "Recognizing outstanding service providers",
      icon: "/award-residential.svg"
    },
    {
      name: "Outstanding Commercial Services",
      description: "Awarding excellence in commercial and industrial service projects",
      icon: "/award-commercial.svg"
    },
    {
      name: "Customer Service Champion",
      description: "Celebrating exceptional customer service and client satisfaction",
      icon: "/award-customer.svg"
    },
    {
      name: "Innovation in Services",
      description: "Honoring innovative approaches, techniques, or technologies",
      icon: "/award-innovation.svg"
    },
    {
      name: "Sustainability & Green Practices",
      description: "Recognizing eco-friendly and environmentally conscious practices",
      icon: "/award-green.svg"
    },
    {
      name: "Rising Star Award",
      description: "Celebrating new businesses with exceptional potential and early achievements",
      icon: "/award-rising.svg"
    }
  ];

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-primary to-primary-dark text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl md:text-6xl font-bold mb-6">
            TSA Excellence Awards
          </h1>
          <p className="text-xl md:text-2xl mb-8 max-w-3xl mx-auto opacity-90">
            Each year, the Trusted Services Association recognizes outstanding service professionals based on customer reviews, community feedback, and service quality.
          </p>
          <div className="flex items-center justify-center space-x-2 text-lg">
            <Trophy className="w-6 h-6 text-yellow-300" />
            <span>Celebrating Excellence Across the Services Industry</span>
          </div>
        </div>
      </section>

      {/* Award Categories */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Award Categories
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              We honor excellence across multiple categories to highlight the diverse talents of our members.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {awardCategories.map((category, index) => (
              <div key={index} className="card text-center hover:shadow-xl transition-shadow">
                <div className="flex justify-center mb-4">
                  <Image 
                    src={category.icon} 
                    alt={category.name} 
                    width={80} 
                    height={80} 
                    className="h-20 w-20"
                  />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  {category.name}
                </h3>
                <p className="text-gray-600 text-sm">
                  {category.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Nomination Section */}
      <section className="py-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Nominate Your Business
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Ready to be recognized? Submit your nomination for the TSA Excellence Awards.
            </p>
          </div>

          <div className="card">
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label htmlFor="businessName" className="block text-sm font-medium text-gray-700 mb-2">
                    Business Name *
                  </label>
                  <input
                    type="text"
                    id="businessName"
                    name="businessName"
                    value={nominationForm.businessName}
                    onChange={handleFormChange}
                    className="input-field"
                    required
                  />
                </div>

                <div>
                  <label htmlFor="contactName" className="block text-sm font-medium text-gray-700 mb-2">
                    Contact Person *
                  </label>
                  <input
                    type="text"
                    id="contactName"
                    name="contactName"
                    value={nominationForm.contactName}
                    onChange={handleFormChange}
                    className="input-field"
                    required
                  />
                </div>

                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                    Email Address *
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={nominationForm.email}
                    onChange={handleFormChange}
                    className="input-field"
                    required
                  />
                </div>

                <div>
                  <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-2">
                    Phone Number
                  </label>
                  <input
                    type="tel"
                    id="phone"
                    name="phone"
                    value={nominationForm.phone}
                    onChange={handleFormChange}
                    className="input-field"
                  />
                </div>

                <div>
                  <label htmlFor="businessType" className="block text-sm font-medium text-gray-700 mb-2">
                    Business Type *
                  </label>
                  <select
                    id="businessType"
                    name="businessType"
                    value={nominationForm.businessType}
                    onChange={handleFormChange}
                    className="input-field"
                    required
                  >
                    <option value="">Select business type</option>
                    <option value="cleaning">Cleaning</option>
                    <option value="plumbing">Plumbing</option>
                    <option value="electrical">Electrical</option>
                    <option value="landscaping">Landscaping</option>
                    <option value="handyman">Handyman</option>
                    <option value="other">Other</option>
                  </select>
                </div>

                <div>
                  <label htmlFor="yearsInBusiness" className="block text-sm font-medium text-gray-700 mb-2">
                    Years in Business *
                  </label>
                  <select
                    id="yearsInBusiness"
                    name="yearsInBusiness"
                    value={nominationForm.yearsInBusiness}
                    onChange={handleFormChange}
                    className="input-field"
                    required
                  >
                    <option value="">Select years</option>
                    <option value="1-2">1-2 years</option>
                    <option value="3-5">3-5 years</option>
                    <option value="6-10">6-10 years</option>
                    <option value="11-20">11-20 years</option>
                    <option value="20+">20+ years</option>
                  </select>
                </div>
              </div>

              <div>
                <label htmlFor="googleBusinessUrl" className="block text-sm font-medium text-gray-700 mb-2">
                  Google Business Profile URL *
                </label>
                <input
                  type="url"
                  id="googleBusinessUrl"
                  name="googleBusinessUrl"
                  value={nominationForm.googleBusinessUrl}
                  onChange={handleFormChange}
                  placeholder="https://g.page/your-business"
                  className="input-field"
                  required
                />
                <p className="text-sm text-gray-500 mt-1">
                  We'll use this to verify your customer reviews and ratings.
                </p>
              </div>

              <div>
                <label htmlFor="specialAchievements" className="block text-sm font-medium text-gray-700 mb-2">
                  Special Achievements or Highlights
                </label>
                <textarea
                  id="specialAchievements"
                  name="specialAchievements"
                  value={nominationForm.specialAchievements}
                  onChange={handleFormChange}
                  rows={4}
                  className="input-field"
                  placeholder="Tell us about any special achievements, certifications, or unique aspects of your business..."
                />
              </div>

              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <div className="flex items-start space-x-3">
                  <Award className="w-5 h-5 text-blue-600 mt-0.5" />
                  <div>
                    <h4 className="font-medium text-blue-900 mb-1">Nomination Fee: $19</h4>
                    <p className="text-sm text-blue-800">
                      The nomination fee covers the review process and evaluation of your business. 
                      Winners receive a prestigious TSA Excellence Award certificate and recognition.
                    </p>
                  </div>
                </div>
              </div>

              <button type="submit" className="btn-primary w-full">
                Submit Nomination & Pay $19
              </button>
            </form>
          </div>
        </div>
      </section>

      {/* Current Winners */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Current Winners
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Meet our outstanding recipients who exemplify excellence in services.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {currentWinners.map((winner, index) => {
              // Map winner category to award logo
              const getAwardLogo = (category: string) => {
                switch (category) {
                  case "Excellence in Services":
                    return "/award-residential.svg";
                  case "Outstanding Commercial Services":
                    return "/award-commercial.svg";
                  case "Customer Service Champion":
                    return "/award-customer.svg";
                  case "Innovation in Services":
                    return "/award-innovation.svg";
                  default:
                    return "/award-residential.svg"; // fallback
                }
              };

              return (
                <div key={index} className="card hover:shadow-xl transition-shadow">
                  <div className="flex items-start space-x-4">
                    <div className="w-16 h-16 bg-yellow-100 rounded-lg flex items-center justify-center flex-shrink-0">
                      <Image 
                        src={getAwardLogo(winner.category)} 
                        alt={`${winner.category} Award`} 
                        width={48} 
                        height={48} 
                        className="w-12 h-12"
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center space-x-2 mb-2">
                        <span className="text-sm font-medium text-yellow-600 bg-yellow-100 px-2 py-1 rounded">
                          {winner.year} Winner
                        </span>
                        <span className="text-sm text-gray-500">{winner.category}</span>
                      </div>
                      <h3 className="text-lg font-semibold text-gray-900 mb-2">{winner.winner}</h3>
                      <div className="flex items-center space-x-4 text-sm text-gray-500 mb-3">
                        <div className="flex items-center space-x-1">
                          <MapPin className="w-4 h-4" />
                          <span>{winner.location}</span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <Star className="w-4 h-4 text-yellow-400 fill-current" />
                          <span>{winner.rating}</span>
                          <span>({winner.reviews} reviews)</span>
                        </div>
                      </div>
                      <p className="text-gray-600 text-sm">{winner.specialty}</p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-secondary text-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">
            Ready to Be Recognized?
          </h2>
          <p className="text-xl mb-8 opacity-90">
            Submit your nomination today and join the ranks of TSA Excellence Award winners.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="#nomination" className="btn-primary bg-white text-secondary hover:bg-gray-100">
              Nominate Your Business
            </Link>
            <Link href="/login?mode=signup" className="btn-outline border-white text-white hover:bg-white hover:text-secondary">
              Join TSA First
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
