import React from 'react';
import Link from 'next/link';
import { Shield, Award, BookOpen, Users, Check, Star } from 'lucide-react';

export default function Membership() {
  const membershipTiers = [
    {
      name: "Basic Membership",
      price: "$10",
      period: "per year",
      description: "Perfect for individual cleaners starting their professional journey",
      features: [
        "Official TCA seal for your website",
        "Listing in the TCA member directory",
        "Access to member resources",
        "Email support"
      ],
      popular: false,
      cta: "Join Basic"
    },
    {
      name: "Renewal",
      price: "$5",
      period: "per year",
      description: "Continue your TCA membership and benefits",
      features: [
        "Continued listing & seal usage",
        "Access to member resources",
        "Email support",
        "Member directory listing"
      ],
      popular: false,
      cta: "Renew Now"
    },
    {
      name: "Award Nomination",
      price: "$20",
      period: "one-time",
      description: "Nominate your business for recognition based on reviews",
      features: [
        "Business nomination for awards",
        "Review score evaluation",
        "Winner announcement",
        "Award certificate if selected"
      ],
      popular: false,
      cta: "Nominate Now"
    },
    {
      name: "Training Subscription",
      price: "$30",
      period: "per month",
      description: "Access to all training materials & certifications",
      features: [
        "Full training library access",
        "Video courses & PDFs",
        "Professional certifications",
        "Priority support",
        "Monthly webinars"
      ],
      popular: true,
      cta: "Subscribe Now"
    }
  ];

  const benefits = [
    {
      icon: Shield,
      title: "Professional Credibility",
      description: "Display the trusted TCA seal to build customer confidence"
    },
    {
      icon: Award,
      title: "Industry Recognition",
      description: "Get nominated for awards and gain public recognition"
    },
    {
      icon: BookOpen,
      title: "Professional Development",
      description: "Access exclusive training materials and improve your skills"
    },
    {
      icon: Users,
      title: "Network & Community",
      description: "Connect with other cleaning professionals and share best practices"
    }
  ];

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-primary to-primary-dark text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl md:text-6xl font-bold mb-6">
            Become a TCA Member
          </h1>
          <p className="text-xl md:text-2xl mb-8 max-w-3xl mx-auto opacity-90">
            Join our community of trusted cleaners and unlock exclusive benefits. Membership is quick and affordable.
          </p>
          <div className="flex items-center justify-center space-x-2 text-lg">
            <Star className="w-6 h-6 text-yellow-300 fill-current" />
            <span>Join hundreds of satisfied cleaning professionals</span>
          </div>
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

      {/* Pricing Section */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Choose Your Membership Plan
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Select the plan that best fits your needs and start building your professional reputation today.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {membershipTiers.map((tier, index) => (
              <div key={index} className={`card relative ${tier.popular ? 'ring-2 ring-secondary' : ''}`}>
                {tier.popular && (
                  <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                    <span className="bg-secondary text-white px-4 py-1 rounded-full text-sm font-semibold">
                      Most Popular
                    </span>
                  </div>
                )}
                
                <div className="text-center mb-6">
                  <h3 className="text-xl font-bold text-gray-900 mb-2">{tier.name}</h3>
                  <div className="mb-2">
                    <span className="text-4xl font-bold text-primary">{tier.price}</span>
                    <span className="text-gray-600 ml-1">{tier.period}</span>
                  </div>
                  <p className="text-gray-600 text-sm">{tier.description}</p>
                </div>

                <ul className="space-y-3 mb-8">
                  {tier.features.map((feature, featureIndex) => (
                    <li key={featureIndex} className="flex items-center space-x-3">
                      <Check className="w-5 h-5 text-secondary flex-shrink-0" />
                      <span className="text-gray-700 text-sm">{feature}</span>
                    </li>
                  ))}
                </ul>

                <button className={`w-full py-3 px-6 rounded-lg font-semibold transition-colors duration-200 ${
                  tier.popular 
                    ? 'bg-secondary hover:bg-secondary-dark text-white' 
                    : 'bg-primary hover:bg-primary-dark text-white'
                }`}>
                  {tier.cta}
                </button>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Frequently Asked Questions
            </h2>
          </div>

          <div className="space-y-6">
            <div className="card">
              <h3 className="text-lg font-semibold text-gray-900 mb-3">
                How long does it take to get my TCA seal?
              </h3>
              <p className="text-gray-600">
                You'll receive your TCA seal immediately after payment confirmation. You can download it right from your dashboard.
              </p>
            </div>

            <div className="card">
              <h3 className="text-lg font-semibold text-gray-900 mb-3">
                Can I cancel my training subscription?
              </h3>
              <p className="text-gray-600">
                Yes, you can cancel your training subscription at any time. You'll continue to have access until the end of your billing period.
              </p>
            </div>

            <div className="card">
              <h3 className="text-lg font-semibold text-gray-900 mb-3">
                What happens if I don't renew my membership?
              </h3>
              <p className="text-gray-600">
                If you don't renew, you'll lose access to member benefits and the right to display the TCA seal. You can rejoin at any time.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-secondary text-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">
            Ready to Join TCA?
          </h2>
          <p className="text-xl mb-8 opacity-90">
            Start building your professional reputation and growing your cleaning business today.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/membership" className="btn-primary bg-white text-secondary hover:bg-gray-100">
              Join Now
            </Link>
            <Link href="/contact" className="btn-outline border-white text-white hover:bg-white hover:text-secondary">
              Have Questions?
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
