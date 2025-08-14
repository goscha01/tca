import React from 'react';
import Link from 'next/link';
import { Shield, Target, Users, Award, BookOpen, TrendingUp } from 'lucide-react';

export default function About() {
  const benefits = [
    {
      icon: Shield,
      title: "Professional credibility boost",
              description: "Gain instant trust with the official TSA Certified seal and membership status"
    },
    {
      icon: Award,
              title: "Official TSA seal for marketing",
      description: "Display your certification on your website, business cards, uniforms, and social media to show customers you're a verified, trusted provider"
    },
    {
      icon: Users,
      title: "Inclusion in our member directory",
              description: "Get discovered by potential customers searching for vetted and reliable service providers"
    },
    {
      icon: Award,
      title: "Access to awards and recognition programs",
      description: "Compete for industry recognition based on service quality and customer satisfaction"
    },
    {
      icon: BookOpen,
      title: "Exclusive resources and training",
      description: "Access member-only training materials, business tools, and professional development opportunities"
    }
  ];

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-primary to-primary-dark text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl md:text-6xl font-bold mb-6">
            About Trusted Services Association
          </h1>
          <p className="text-xl md:text-2xl max-w-3xl mx-auto opacity-90">
            Promoting trust, transparency, and quality in services since 2024.
          </p>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Intro */}
          <div className="text-center mb-16">
            <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-6">
              <Shield className="w-10 h-10 text-primary" />
            </div>
            <p className="text-lg text-gray-700 leading-relaxed max-w-3xl mx-auto">
              The Trusted Services Association (TSA) is a professional organization dedicated to raising the standards of trust, 
              transparency, and quality across the services industry. We help service providers—from cleaners to handymen, landscapers, and beyond—earn recognition, grow their 
              skills, and stand out from the competition.
            </p>
          </div>

          {/* Mission Statement */}
          <div className="card mb-16 text-center">
            <div className="w-16 h-16 bg-secondary/10 rounded-full flex items-center justify-center mx-auto mb-6">
              <Target className="w-8 h-8 text-secondary" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Our Mission</h2>
            <p className="text-lg text-gray-700 leading-relaxed max-w-2xl mx-auto">
              Our mission is to set and uphold the highest standards in services, ensuring both 
              clients and professionals benefit from exceptional service, integrity, and reliability.
            </p>
          </div>

          {/* Benefits Section */}
          <div className="mb-16">
            <h2 className="text-3xl font-bold text-gray-900 text-center mb-12">
              Benefits for Members
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {benefits.map((benefit, index) => (
                <div key={index} className="card hover:shadow-xl transition-shadow">
                  <div className="flex items-start space-x-4">
                    <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center flex-shrink-0">
                      <benefit.icon className="w-6 h-6 text-primary" />
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900 mb-2">
                        {benefit.title}
                      </h3>
                      <p className="text-gray-600">
                        {benefit.description}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Values Section */}
          <div className="card mb-16">
            <h2 className="text-2xl font-bold text-gray-900 text-center mb-8">Our Core Values</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="text-center">
                <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Shield className="w-8 h-8 text-primary" />
                </div>
                <h3 className="font-semibold text-gray-900 mb-2">Trust</h3>
                <p className="text-gray-600 text-sm">
                  Building customer confidence through verified credentials, proof of insurance, and a track record of quality service
                </p>
              </div>
              <div className="text-center">
                <div className="w-16 h-16 bg-secondary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <TrendingUp className="w-8 h-8 text-secondary" />
                </div>
                <h3 className="font-semibold text-gray-900 mb-2">Excellence</h3>
                <p className="text-gray-600 text-sm">
                  Maintaining the highest standards in service quality, professionalism, and customer care
                </p>
              </div>
              <div className="text-center">
                <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Users className="w-8 h-8 text-primary" />
                </div>
                <h3 className="font-semibold text-gray-900 mb-2">Community</h3>
                <p className="text-gray-600 text-sm">
                  Supporting and connecting service professionals across multiple industries to share knowledge and grow together
                </p>
              </div>
            </div>
          </div>

          {/* CTA Section */}
          <div className="text-center">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">
              Ready to Join Our Community?
            </h2>
            <p className="text-lg text-gray-600 mb-8">
              Become part of the Trusted Services Association and start building your professional reputation today.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/login?mode=signup" className="btn-primary">
                Join TSA Now
              </Link>
              <Link href="/contact" className="btn-outline">
                Contact Us
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
