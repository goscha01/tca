import React from 'react';
import Link from 'next/link';
import { Shield, Mail, Phone, MapPin } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="col-span-1 md:col-span-2">
            <div className="flex items-center space-x-2 mb-4">
              <Shield className="h-8 w-8 text-primary" />
              <div className="flex items-center space-x-2">
                                 <span className="text-2xl font-bold leading-none">THSA</span>
                <div className="flex flex-col text-xs text-gray-400 leading-tight justify-center">
                  <span>Trusted Home</span>
                  <span>Services</span>
                </div>
              </div>
            </div>
            <p className="text-gray-300 mb-4 max-w-md">
              The Trusted Home Services Association promotes trust, transparency, and quality in the home services industry. 
              Join our community of trusted professionals.
            </p>
                         <div className="flex space-x-4">
               <Link href="/login?mode=signup" className="btn-primary">
                 Join Now
               </Link>
             </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/about" className="text-gray-300 hover:text-white transition-colors">
                  About Us
                </Link>
              </li>
              <li>
                <Link href="/membership" className="text-gray-300 hover:text-white transition-colors">
                  Membership
                </Link>
              </li>
              <li>

              </li>
              <li>
                <Link href="/businesses" className="text-gray-300 hover:text-white transition-colors">
                  Business Directory
                </Link>
              </li>
              <li>
                <Link href="/training" className="text-gray-300 hover:text-white transition-colors">
                  Training
                </Link>
              </li>
              <li>
                <Link href="/awards" className="text-gray-300 hover:text-white transition-colors">
                  Awards
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Contact</h3>
            <div className="space-y-3">
              <div className="flex items-center space-x-2">
                <Mail className="h-4 w-4 text-primary" />
                                 <a href="mailto:info@trustedhomeservices.org" className="text-gray-300 hover:text-white transition-colors">
                   info@trustedhomeservices.org
                 </a>
              </div>
              <div className="flex items-center space-x-2">
                <Phone className="h-4 w-4 text-primary" />
                <span className="text-gray-300">(555) 123-4567</span>
              </div>
              <div className="flex items-center space-x-2">
                <MapPin className="h-4 w-4 text-primary" />
                                 <span className="text-gray-300">123 Professional Ave, Suite 100<br />Service City, SC 12345</span>
              </div>
            </div>
          </div>
        </div>

        <div className="border-t border-gray-800 mt-8 pt-8 text-center">
                     <p className="text-gray-400">
             © {new Date().getFullYear()} Trusted Home Services Association. All rights reserved.
           </p>
        </div>
      </div>
    </footer>
  );
}
