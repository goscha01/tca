import React from 'react';
import Link from 'next/link';
import { Shield, Award, BookOpen, Users, Check, Star } from 'lucide-react';

export default function Membership() {
  const membershipTiers = [
    {
      name: "Listed",
      price: "Free",
      period: "forever",
      description: "For new or small businesses starting out in home services",
      benefits: [
        "Business listing in THSA member directory",
        "Email support"
      ],
      requirements: ["Name", "Address", "Phone number"],
      popular: false,
      cta: "Join Free",
      color: "bg-gray-100",
      textColor: "text-gray-800"
    },
    {
      name: "Member",
      price: "$9",
      period: "per year",
      description: "For insured or bonded professionals who want credibility",
      benefits: [
        "All Free Listing benefits",
        "THSA Badge (Insured, Verified)"
      ],
      requirements: [
        "Meet all Free requirements",
        "Must provide proof of insurance or bond"
      ],
      popular: true,
      cta: "Join Yearly",
      color: "bg-primary",
      textColor: "text-white"
    },
    {
      name: "Verified",
      price: "$19",
      period: "per year",
      description: "For trusted businesses with a proven public reputation",
      benefits: [
        "All Member benefits",
        "THSA Verified Badge",
        "Eligibility for THSA Awards based on customer satisfaction"
      ],
      requirements: [
        "Meet all Member requirements",
        "Have a Google Business Profile with positive reviews"
      ],
      popular: false,
      cta: "Join Verified",
      color: "bg-secondary",
      textColor: "text-white"
    },
    {
      name: "Certified",
      price: "$49",
      period: "per month",
      description: "For elite professionals with verified skills & certifications",
      benefits: [
        "All Verified benefits",
        "training materials & professional certifications",
        "Boosted listing position in THSA directory"
      ],
      requirements: [
        "All Verified requirements",
        "Complete THSA-approved training"
      ],
      popular: false,
      cta: "Start Training",
      color: "bg-gradient-to-r from-purple-600 to-purple-800",
      textColor: "text-white"
    }
  ];

  const generalBenefits = [
    {
      icon: Shield,
      title: "Official THSA Seal for Your Website",
      description: "Display the trusted seal to build instant customer confidence"
    },
    {
      icon: Award,
      title: "Awards Based on Customer Satisfaction",
      description: "Get recognized for delivering exceptional service quality"
    },
    {
      icon: BookOpen,
      title: "Access Exclusive Professional Training",
      description: "Learn from industry experts and improve your skills"
    },
    {
      icon: Users,
      title: "Boost Local SEO Rankings",
      description: "Increase your online visibility and attract more customers in your area"
    }
  ];

  return (
    <div className="min-h-screen">
      
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-primary to-primary-dark text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl md:text-6xl font-bold mb-6">
            THSA Membership Tiers
          </h1>
          <p className="text-xl md:text-2xl mb-8 max-w-4xl mx-auto">
            Choose the perfect membership level for your business. From free listing to certified professional status, 
            we have options for every stage of your growth journey.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <div className="flex items-center space-x-2 bg-white/20 px-4 py-2 rounded-full">
              <Shield className="h-5 w-5" />
              <span>Trusted by thousands</span>
            </div>
            <div className="flex items-center space-x-2 bg-white/20 px-4 py-2 rounded-full">
              <Award className="h-5 w-5" />
              <span>Industry recognition</span>
            </div>
            <div className="flex items-center space-x-2 bg-white/20 px-4 py-2 rounded-full">
              <BookOpen className="h-5 w-5" />
              <span>Professional development</span>
            </div>
          </div>
        </div>
      </section>

      {/* Membership Tiers */}
      <section id="membership-tiers" className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Choose Your Membership Level
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Start with our free listing and upgrade as your business grows. Each tier builds upon the previous one, 
              giving you more benefits and recognition in the industry.
            </p>
          </div>

          <div id="membership-cards" className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-4 gap-8 scroll-mt-20">
            {membershipTiers.map((tier, index) => (
              <div key={index} className={`relative rounded-2xl shadow-xl overflow-hidden ${tier.color} ${tier.textColor}`}>
                {tier.popular && (
                  <div className="absolute top-4 left-1/2 transform -translate-x-1/2 z-10">
                    <div className="bg-yellow-400 text-yellow-900 px-4 py-2 rounded-full text-sm font-semibold shadow-lg">
                      Most Popular
                    </div>
                  </div>
                )}
                
                <div className="pt-16 px-8 pb-8">
                  <div className="text-center mb-6">
                    <h3 className="text-xl font-bold mb-2">{tier.name}</h3>
                    <div className="mb-4">
                      <span className="text-3xl font-bold">{tier.price}</span>
                      <span className="text-lg opacity-80">/{tier.period}</span>
                    </div>
                    <p className="text-sm opacity-80">{tier.description}</p>
                  </div>

                  <div className="mb-6">
                    <h4 className="font-semibold mb-3 flex items-center">
                      <Check className="h-4 w-4 mr-2" />
                      Benefits
                    </h4>
                    <ul className="space-y-2 text-sm">
                      {tier.benefits.map((benefit, idx) => (
                        <li key={idx} className="flex items-start">
                          <Check className="h-3 w-3 mr-2 mt-0.5 flex-shrink-0" />
                          <span>{benefit}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="mb-6">
                    <h4 className="font-semibold mb-3 flex items-center">
                      <Shield className="h-4 w-4 mr-2" />
                      Requirements
                    </h4>
                    <ul className="space-y-2 text-sm">
                      {tier.requirements.map((requirement, idx) => (
                        <li key={idx} className="flex items-start">
                          <Shield className="h-3 w-3 mr-2 mt-0.5 flex-shrink-0" />
                          <span>{requirement}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <Link 
                    href="/login?mode=signup" 
                    className={`w-full py-3 px-6 rounded-lg font-semibold transition-colors inline-block text-center ${
                      tier.popular 
                        ? 'bg-white text-primary hover:bg-gray-100' 
                        : 'bg-white/20 hover:bg-white/30'
                    }`}
                  >
                    {tier.cta}
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* General Benefits */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Why Choose THSA Membership?
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Join thousands of home service professionals who trust THSA for industry recognition, 
              professional development, and business growth.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {generalBenefits.map((benefit, index) => (
              <div key={index} className="text-center">
                <div className="inline-flex items-center justify-center w-16 h-16 bg-primary/10 text-primary rounded-full mb-4">
                  <benefit.icon className="h-8 w-8" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-3">{benefit.title}</h3>
                <p className="text-gray-600">{benefit.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-primary to-secondary text-white">
        <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">
            Ready to Elevate Your Business?
          </h2>
          <p className="text-xl mb-8 opacity-90">
            Start with our free listing today and discover how THSA membership can transform your business. 
            Join thousands of professionals who trust THSA for industry recognition and growth.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link 
              href="#membership-tiers" 
              className="bg-white text-primary px-8 py-4 rounded-lg font-semibold hover:bg-gray-100 transition-colors"
            >
              Get Started Free
            </Link>
            <Link 
              href="/contact" 
              className="border-2 border-white text-white px-8 py-4 rounded-lg font-semibold hover:bg-white hover:text-primary transition-colors"
            >
              Contact Us
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
