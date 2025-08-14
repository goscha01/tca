import React from 'react';
import Link from 'next/link';
import { Shield, Award, BookOpen, Users, Check, Star } from 'lucide-react';

export default function Membership() {
  const membershipTiers = [
    {
      name: "Free Membership – Free forever",
      price: "Free",
      period: "forever",
      description: "Perfect for individual providers starting their professional journey",
      features: [
        "Listing in the THSA member directory",
        "Basic member resources",
        "Community forum access",
        "Email support"
      ],
      popular: false,
      cta: "Join Free"
    },
    {
      name: "Most Popular – Yearly Membership – $9/year",
      price: "$9",
      period: "per year",
      description: "Full THSA membership with all premium benefits and badge",
      features: [
        "Official THSA seal for your website",
        "Premium badge & recognition",
        "Full training materials access",
        "Priority customer support",
        "Award nomination eligibility",
        "Exclusive member discounts",
        "Monthly webinars",
        "Professional development resources"
      ],
      popular: true,
      cta: "Join Yearly"
    },
    {
      name: "Award Nomination – $19 one-time",
      price: "$19",
      period: "one-time",
      description: "Nominate your business for recognition based on verified reviews",
      features: [
        "Business nomination for awards",
        "Review score evaluation",
        "Public announcement of winners",
        "Award certificate if selected"
      ],
      popular: false,
      cta: "Nominate Now"
    },
    {
      name: "Training Subscription – $49/month",
      price: "$49",
      period: "per month",
      description: "Full access to training materials & professional certifications",
      features: [
        "Complete training library",
        "Video courses & downloadable PDFs",
        "Professional certifications",
        "Priority support",
        "Monthly webinars"
      ],
      popular: false,
      cta: "Subscribe Now"
    }
  ];

  const benefits = [
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
            Become a THSA Member
          </h1>
          <div className="text-center mb-4">
            <span className="text-lg opacity-80">Trusted House Services Association</span>
          </div>
          <p className="text-xl md:text-2xl mb-8 max-w-3xl mx-auto opacity-90">
            Join our network of trusted home service professionals and unlock exclusive benefits. Membership is quick, affordable, and designed to help you grow your business.
          </p>
          <div className="flex items-center justify-center space-x-2 text-lg">
            <Star className="w-6 h-6 text-yellow-300 fill-current" />
            <span>Join hundreds of satisfied professionals across multiple home service industries</span>
          </div>
        </div>
      </section>

      {/* Industry Coverage Section */}
      <section className="py-16 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <p className="text-lg text-gray-700 mb-8">
            From cleaners and handymen to landscapers and repair specialists, THSA gives you the tools and recognition to stand out in a competitive market.
          </p>
        </div>
      </section>

      {/* Benefits Section */}
       <section className="py-20 bg-gray-50">
         <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
           <div className="text-center mb-16">
                         <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Why Choose THSA Membership?
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Gain the tools and recognition you need to differentiate your business and attract more clients.
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

       {/* Certification Criteria Section */}
       <section className="py-20 bg-white">
         <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
           <div className="text-center mb-16">
             <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
               THSA Membership Certification Criteria
             </h2>
             <p className="text-xl text-gray-600 max-w-3xl mx-auto">
               To be certified and display the Trusted Home Services Association Badge, a business must meet all of the following criteria:
             </p>
           </div>

           <div className="space-y-8">
             {/* Criteria 1: Verified Public Reputation */}
             <div className="card">
               <div className="flex items-start space-x-4">
                 <div className="flex-shrink-0 w-8 h-8 bg-primary text-white rounded-full flex items-center justify-center font-bold text-sm">
                   1
                 </div>
                 <div className="flex-1">
                   <h3 className="text-lg font-semibold text-gray-900 mb-3">Verified Public Reputation</h3>
                   <ul className="space-y-2 text-gray-700">
                     <li className="flex items-start space-x-2">
                       <span className="text-primary">•</span>
                       <span>Must have a Google Business Profile with at least 1 public customer review.</span>
                     </li>
                     <li className="flex items-start space-x-2">
                       <span className="text-primary">•</span>
                       <span>Review rating must be no less than 3.0 stars at time of application.</span>
                     </li>
                   </ul>
                 </div>
               </div>
             </div>

             {/* Criteria 2: Insurance Coverage */}
             <div className="card">
               <div className="flex items-start space-x-4">
                 <div className="flex-shrink-0 w-8 h-8 bg-primary text-white rounded-full flex items-center justify-center font-bold text-sm">
                   2
                 </div>
                 <div className="flex-1">
                   <h3 className="text-lg font-semibold text-gray-900 mb-3">Insurance Coverage</h3>
                   <ul className="space-y-2 text-gray-700">
                     <li className="flex items-start space-x-2">
                       <span className="text-primary">•</span>
                       <span>Must carry active general liability insurance (minimum coverage amount recommended: $500,000).</span>
                     </li>
                     <li className="flex items-start space-x-2">
                       <span className="text-primary">•</span>
                       <span>Must provide proof of insurance upon application and at each annual renewal.</span>
                     </li>
                   </ul>
                 </div>
               </div>
             </div>

             {/* Criteria 3: Professional Business Presence */}
             <div className="card">
               <div className="flex items-start space-x-4">
                 <div className="flex-shrink-0 w-8 h-8 bg-primary text-white rounded-full flex items-center justify-center font-bold text-sm">
                   3
                 </div>
                 <div className="flex-1">
                   <h3 className="text-lg font-semibold text-gray-900 mb-3">Professional Business Presence</h3>
                   <ul className="space-y-2 text-gray-700">
                     <li className="flex items-start space-x-2">
                       <span className="text-primary">•</span>
                       <span>Must operate a public website with contact details, services offered, and customer communication channels.</span>
                     </li>
                     <li className="flex items-start space-x-2">
                       <span className="text-primary">•</span>
                       <span>Website must display a privacy policy and terms of service or basic customer guidelines.</span>
                     </li>
                   </ul>
                 </div>
               </div>
             </div>

             {/* Criteria 4: Legal Business Registration */}
             <div className="card">
               <div className="flex items-start space-x-4">
                 <div className="flex-shrink-0 w-8 h-8 bg-primary text-white rounded-full flex items-center justify-center font-bold text-sm">
                   4
                 </div>
                 <div className="flex-1">
                   <h3 className="text-lg font-semibold text-gray-900 mb-3">Legal Business Registration</h3>
                   <ul className="space-y-2 text-gray-700">
                     <li className="flex items-start space-x-2">
                       <span className="text-primary">•</span>
                       <span>Must have a registered LLC, corporation, or similar entity.</span>
                     </li>
                     <li className="flex items-start space-x-2">
                       <span className="text-primary">•</span>
                       <span>Owner's name and physical business address must be on file with THSA for verification purposes (does not have to be published to the public).</span>
                     </li>
                   </ul>
                 </div>
               </div>
             </div>

             {/* Criteria 5: Quality Commitment Agreement */}
             <div className="card">
               <div className="flex items-start space-x-4">
                 <div className="flex-shrink-0 w-8 h-8 bg-primary text-white rounded-full flex items-center justify-center font-bold text-sm">
                   5
                 </div>
                 <div className="flex-1">
                   <h3 className="text-lg font-semibold text-gray-900 mb-3">Quality Commitment Agreement</h3>
                   <p className="text-gray-700 mb-3">Must sign the THSA Quality Commitment Agreement, which includes:</p>
                   <ul className="space-y-2 text-gray-700 ml-4">
                     <li className="flex items-start space-x-2">
                       <span className="text-primary">•</span>
                       <span>Providing a redo job at no additional charge if the client is not satisfied (within reasonable limits).</span>
                     </li>
                     <li className="flex items-start space-x-2">
                       <span className="text-primary">•</span>
                       <span>Responding to customer complaints within 48 hours.</span>
                     </li>
                   </ul>
                 </div>
               </div>
             </div>

             {/* Criteria 6: Certified Owner */}
             <div className="card">
               <div className="flex items-start space-x-4">
                 <div className="flex-shrink-0 w-8 h-8 bg-primary text-white rounded-full flex items-center justify-center font-bold text-sm">
                   6
                 </div>
                 <div className="flex-1">
                   <h3 className="text-lg font-semibold text-gray-900 mb-3">Certified Owner</h3>
                   <ul className="space-y-2 text-gray-700">
                     <li className="flex items-start space-x-2">
                       <span className="text-primary">•</span>
                       <span>The business owner must hold at least one relevant industry certification (for example: cleaning, electrical, plumbing, landscaping, etc.).</span>
                     </li>
                     <li className="flex items-start space-x-2">
                       <span className="text-primary">•</span>
                       <span>Certification must be from a recognized training body or professional association.</span>
                     </li>
                   </ul>
                 </div>
               </div>
             </div>

             {/* Annual Renewal & Monitoring */}
             <div className="card bg-primary/5 border-primary/20">
               <div className="flex items-start space-x-4">
                 <div className="flex-shrink-0 w-8 h-8 bg-primary text-white rounded-full flex items-center justify-center">
                   <Shield className="w-4 h-4" />
                 </div>
                 <div className="flex-1">
                   <h3 className="text-lg font-semibold text-gray-900 mb-3">Annual Renewal & Monitoring</h3>
                   <ul className="space-y-2 text-gray-700">
                     <li className="flex items-start space-x-2">
                       <span className="text-primary">•</span>
                       <span>Certification is valid for 12 months.</span>
                     </li>
                     <li className="flex items-start space-x-2">
                       <span className="text-primary">•</span>
                       <span>Annual renewal requires updated documents and verification of continued compliance.</span>
                     </li>
                     <li className="flex items-start space-x-2">
                       <span className="text-primary">•</span>
                       <span>THSA reserves the right to revoke certification if criteria are no longer met or if verified customer complaints remain unresolved.</span>
                     </li>
                   </ul>
                 </div>
               </div>
             </div>

             {/* Badge Wording */}
             <div className="card bg-secondary/5 border-secondary/20">
               <div className="flex items-start space-x-4">
                 <div className="flex-shrink-0 w-8 h-8 bg-secondary text-white rounded-full flex items-center justify-center">
                   <Award className="w-4 h-4" />
                 </div>
                 <div className="flex-1">
                   <h3 className="text-lg font-semibold text-gray-900 mb-3">Badge Wording</h3>
                   <p className="text-gray-700 mb-3">The seal could read:</p>
                   <div className="bg-white p-4 rounded-lg border border-secondary/30">
                     <p className="text-center text-lg font-semibold text-secondary">
                       "THSA Certified – Insured, Verified, Quality Guaranteed"
                     </p>
                   </div>
                   <p className="text-gray-700 mt-3 text-sm">
                     And include the year of verification, so it looks fresh and legitimate on websites.
                   </p>
                 </div>
               </div>
             </div>
           </div>
         </div>
       </section>

      {/* Pricing Section */}
      <section id="membership-plans" className="py-20">
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

                <div className="mt-auto">
                  <button className={`btn-primary w-full ${
                    tier.popular
                      ? 'bg-secondary hover:bg-secondary-dark text-white'
                      : 'bg-primary hover:bg-primary-dark text-white'
                  }`}>
                    {tier.name.includes("Free Membership") ? (
                      <Link href="/login?mode=signup" className="block w-full h-full flex items-center justify-center">
                        {tier.cta}
                      </Link>
                    ) : (
                      <Link href="/login" className="block w-full h-full flex items-center justify-center">
                        {tier.cta}
                      </Link>
                    )}
                  </button>
                </div>
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
                How long does it take to get my THSA seal?
              </h3>
              <p className="text-gray-600">
                You'll receive your seal immediately after payment confirmation. It will be available for download in your member dashboard.
              </p>
            </div>

            <div className="card">
              <h3 className="text-lg font-semibold text-gray-900 mb-3">
                Can I cancel my training subscription?
              </h3>
              <p className="text-gray-600">
                Yes. Cancel anytime—access continues until the end of your billing cycle.
              </p>
            </div>

            <div className="card">
              <h3 className="text-lg font-semibold text-gray-900 mb-3">
                What happens if I don't renew my membership?
              </h3>
              <p className="text-gray-600">
                You'll lose access to benefits and the right to display the THSA seal. You can rejoin anytime.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-secondary text-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">
            Ready to Join THSA?
          </h2>
          <p className="text-xl mb-8 opacity-90">
            Start building your professional reputation and growing your home services business today.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="#membership-plans" className="btn-primary bg-white text-secondary hover:bg-white hover:text-secondary">
              Join THSA Now
            </Link>
            <Link href="/contact" className="btn-outline border-white text-white hover:bg-white hover:text-secondary">
              Contact Us
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
