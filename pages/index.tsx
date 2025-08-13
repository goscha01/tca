import React from 'react';
import Link from 'next/link';
import { Shield, Award, BookOpen, TrendingUp, Star, Users } from 'lucide-react';

export default function Home() {
  const benefits = [
    {
      icon: Shield,
      title: "Get our official TCA seal for your website",
      description: "Display the trusted TCA seal to build customer confidence"
    },
    {
      icon: Award,
      title: "Win awards based on customer satisfaction",
      description: "Get recognized for your exceptional service quality"
    },
    {
      icon: BookOpen,
      title: "Access exclusive professional training",
      description: "Learn from industry experts and improve your skills"
    },
    {
      icon: TrendingUp,
      title: "Boost your local SEO rankings",
      description: "Improve your online visibility and attract more customers"
    }
  ];

  const featuredMembers = [
    {
      name: "Sparkle Clean Pro",
      location: "New York, NY",
      rating: 4.9,
      specialty: "Residential & Commercial"
    },
    {
      name: "Elite Cleaning Services",
      location: "Los Angeles, CA",
      rating: 4.8,
      specialty: "Deep Cleaning & Restoration"
    },
    {
      name: "Fresh Start Cleaners",
      location: "Chicago, IL",
      rating: 4.9,
      specialty: "Eco-Friendly Cleaning"
    }
  ];

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-primary to-primary-dark text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl md:text-6xl font-bold mb-6">
            Join the Trusted Cleaners Association
          </h1>
          <h2 className="text-xl md:text-2xl font-light mb-8">
            Stand Out. Get Recognized. Grow Your Cleaning Business.
          </h2>
          <p className="text-lg md:text-xl mb-10 max-w-3xl mx-auto opacity-90">
            Whether you're an independent cleaner or run a full team, TCA membership gives you the credibility and resources to succeed.
          </p>
          <Link href="/membership" className="btn-secondary text-lg px-8 py-4">
            Join Now
          </Link>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Why Choose TCA Membership?
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Get the tools and recognition you need to stand out in the competitive cleaning industry.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {benefits.map((benefit, index) => (
              <div key={index} className="card text-center hover:shadow-xl transition-shadow">
                <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <benefit.icon className="w-8 h-8 text-primary" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  {benefit.title}
                </h3>
                <p className="text-gray-600">
                  {benefit.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Members Section */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Featured TCA Members
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Meet some of our outstanding members who are setting the standard for excellence.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {featuredMembers.map((member, index) => (
              <div key={index} className="card hover:shadow-xl transition-shadow">
                <div className="flex items-center space-x-3 mb-4">
                  <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center">
                    <Users className="w-6 h-6 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900">{member.name}</h3>
                    <p className="text-sm text-gray-600">{member.location}</p>
                  </div>
                </div>
                <div className="flex items-center space-x-2 mb-3">
                  <Star className="w-5 h-5 text-yellow-400 fill-current" />
                  <span className="font-semibold text-gray-900">{member.rating}</span>
                  <span className="text-gray-600">/ 5.0</span>
                </div>
                <p className="text-gray-600 text-sm">{member.specialty}</p>
              </div>
            ))}
          </div>

          <div className="text-center mt-12">
            <Link href="/membership" className="btn-outline">
              Become a Member
            </Link>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-secondary text-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">
            Ready to Join the Elite?
          </h2>
          <p className="text-xl mb-8 opacity-90">
            Start your journey with TCA today and join hundreds of trusted cleaning professionals.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/membership" className="btn-primary bg-white text-secondary hover:bg-gray-100">
              Join Now
            </Link>
            <Link href="/about" className="btn-outline border-white text-white hover:bg-white hover:text-secondary">
              Learn More
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
