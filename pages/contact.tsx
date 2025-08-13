import React, { useState } from 'react';
import { Mail, Phone, MapPin, Clock, Send, Shield } from 'lucide-react';

export default function Contact() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // TODO: Implement contact form submission
    console.log('Contact form submitted:', formData);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const contactInfo = [
    {
      icon: Mail,
      title: "Email Us",
      details: "info@trustedcleaners.org",
      description: "Send us an email anytime"
    },
    {
      icon: Phone,
      title: "Call Us",
      details: "(555) 123-4567",
      description: "Mon-Fri from 8am to 6pm"
    },
    {
      icon: MapPin,
      title: "Visit Us",
      details: "123 Cleaning Ave, Suite 100<br />Professional City, PC 12345",
      description: "Main office location"
    },
    {
      icon: Clock,
      title: "Business Hours",
      details: "Monday - Friday<br />8:00 AM - 6:00 PM EST",
      description: "We're here to help"
    }
  ];

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-primary to-primary-dark text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl md:text-6xl font-bold mb-6">
            Get in Touch
          </h1>
          <p className="text-xl md:text-2xl mb-8 max-w-3xl mx-auto opacity-90">
            Have questions? We'd love to hear from you. Fill out the form below or contact us directly.
          </p>
          <div className="flex items-center justify-center space-x-2 text-lg">
            <Shield className="w-6 h-6 text-blue-200" />
            <span>We're here to help you succeed</span>
          </div>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
          {/* Contact Form */}
          <div>
            <div className="mb-8">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">
                Send us a Message
              </h2>
              <p className="text-lg text-gray-600">
                Fill out the form below and we'll get back to you within 24 hours.
              </p>
            </div>

            <div className="card">
              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
                    Full Name *
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    className="input-field"
                    placeholder="Enter your full name"
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
                    value={formData.email}
                    onChange={handleChange}
                    className="input-field"
                    placeholder="Enter your email address"
                    required
                  />
                </div>

                <div>
                  <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-2">
                    Message *
                  </label>
                  <textarea
                    id="message"
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    rows={6}
                    className="input-field"
                    placeholder="Tell us how we can help you..."
                    required
                  />
                </div>

                <button type="submit" className="btn-primary w-full">
                  <Send className="w-4 h-4 mr-2" />
                  Send Message
                </button>
              </form>

              <div className="mt-6 text-center">
                <p className="text-sm text-gray-500">
                  By submitting this form, you agree to our{' '}
                  <a href="/privacy" className="text-primary hover:text-primary-dark">
                    Privacy Policy
                  </a>
                </p>
              </div>
            </div>
          </div>

          {/* Contact Information */}
          <div>
            <div className="mb-8">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">
                Contact Information
              </h2>
              <p className="text-lg text-gray-600">
                Reach out to us through any of these channels. We're here to support your success.
              </p>
            </div>

            <div className="space-y-6">
              {contactInfo.map((info, index) => (
                <div key={index} className="card hover:shadow-lg transition-shadow">
                  <div className="flex items-start space-x-4">
                    <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center flex-shrink-0">
                      <info.icon className="w-6 h-6 text-primary" />
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900 mb-1">
                        {info.title}
                      </h3>
                      <div 
                        className="text-gray-700 mb-1"
                        dangerouslySetInnerHTML={{ __html: info.details }}
                      />
                      <p className="text-sm text-gray-500">
                        {info.description}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Additional Info */}
            <div className="mt-8 p-6 bg-gray-50 rounded-lg">
              <h3 className="text-lg font-semibold text-gray-900 mb-3">
                Need Immediate Assistance?
              </h3>
              <p className="text-gray-600 mb-4">
                For urgent matters or technical support, please call us directly at{' '}
                <a href="tel:+15551234567" className="text-primary hover:text-primary-dark font-medium">
                  (555) 123-4567
                </a>
              </p>
              <p className="text-sm text-gray-500">
                Our support team is available Monday through Friday, 8:00 AM to 6:00 PM EST.
              </p>
            </div>
          </div>
        </div>

        {/* FAQ Section */}
        <div className="mt-20">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Frequently Asked Questions
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Find quick answers to common questions about TCA membership and services.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="card">
              <h3 className="text-lg font-semibold text-gray-900 mb-3">
                How do I become a TCA member?
              </h3>
              <p className="text-gray-600">
                Becoming a TCA member is easy! Simply visit our membership page, choose your plan, 
                and complete the registration process. You'll receive immediate access to member benefits.
              </p>
            </div>

            <div className="card">
              <h3 className="text-lg font-semibold text-gray-900 mb-3">
                What training materials are available?
              </h3>
              <p className="text-gray-600">
                Our training library includes video courses, PDF guides, interactive workshops, and 
                professional certifications covering all aspects of cleaning and business management.
              </p>
            </div>

            <div className="card">
              <h3 className="text-lg font-semibold text-gray-900 mb-3">
                How are award winners selected?
              </h3>
              <p className="text-gray-600">
                Award winners are selected based on customer reviews, ratings, business performance, 
                and community feedback. We use a comprehensive evaluation process to ensure fairness.
              </p>
            </div>

            <div className="card">
              <h3 className="text-lg font-semibold text-gray-900 mb-3">
                Can I cancel my membership?
              </h3>
              <p className="text-gray-600">
                Yes, you can cancel your membership at any time. You'll continue to have access to 
                benefits until the end of your current billing period.
              </p>
            </div>
          </div>
        </div>

        {/* Office Location */}
        <div className="mt-20">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Visit Our Office
            </h2>
            <p className="text-lg text-gray-600">
              Stop by our main office to meet our team and learn more about TCA.
            </p>
          </div>

          <div className="card text-center">
            <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-6">
              <MapPin className="w-8 h-8 text-primary" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              123 Cleaning Avenue, Suite 100
            </h3>
            <p className="text-gray-600 mb-4">
              Professional City, PC 12345
            </p>
            <p className="text-sm text-gray-500">
              Located in the heart of the business district, with easy access to public transportation.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
