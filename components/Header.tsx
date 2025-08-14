import React, { useState } from 'react';
import Link from 'next/link';
import { useAuth } from '../lib/auth';
import { Menu, X, Shield, User, LogOut } from 'lucide-react';

export default function Header() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { user, signOut } = useAuth();

  const handleSignOut = async () => {
    await signOut();
  };

  return (
    <header className="bg-white shadow-sm border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="flex items-center">
            <Link href="/" className="flex items-center space-x-2">
              <Shield className="h-8 w-8 text-primary" />
              <div className="flex items-center space-x-2">
                                 <span className="text-2xl font-bold text-gray-900 leading-none">THSA</span>
                                    <div className="flex flex-col text-xs text-gray-600 leading-tight justify-center">
                      <span>Trusted Home</span>
                      <span>Services</span>
                    </div>
              </div>
            </Link>
          </div>

                     {/* Desktop Navigation */}
           <nav className="hidden md:flex space-x-8">
             <Link href="/" className="text-gray-700 hover:text-primary px-3 py-2 text-sm font-medium">
               Home
             </Link>
             <Link href="/about" className="text-gray-700 hover:text-primary px-3 py-2 text-sm font-medium">
               About
             </Link>
             <Link href="/membership" className="text-gray-700 hover:text-primary px-3 py-2 text-sm font-medium">
               Membership
             </Link>
             <Link href="/businesses" className="text-gray-700 hover:text-primary px-3 py-2 text-sm font-medium">
               Businesses
             </Link>
             <Link href="/training" className="text-gray-700 hover:text-primary px-3 py-2 text-sm font-medium">
               Training
             </Link>
             <Link href="/awards" className="text-gray-700 hover:text-primary px-3 py-2 text-sm font-medium">
               Awards
             </Link>
           </nav>

                     {/* Desktop Auth Buttons */}
           <div className="hidden md:flex items-center space-x-4">
             {user ? (
               <div className="flex items-center space-x-4">

                 <Link 
                   href="/dashboard" 
                   className="text-gray-700 hover:text-primary transition-colors font-medium"
                 >
                   {user.company_name || 'Dashboard'}
                 </Link>
                 <button
                   onClick={signOut}
                   className="text-gray-700 hover:text-primary transition-colors"
                 >
                   Sign Out
                 </button>
               </div>
             ) : (
               <>
                 <Link href="/login" className="text-gray-700 hover:text-primary px-3 py-2 text-sm font-medium">
                   Sign In
                 </Link>
                                                      <Link href="/login?mode=signup" className="btn-primary">
                     Join THSA
                   </Link>
               </>
             )}
           </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="text-gray-700 hover:text-primary p-2"
            >
              {isMobileMenuOpen ? (
                <X className="h-6 w-6" />
              ) : (
                <Menu className="h-6 w-6" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Navigation */}
      {isMobileMenuOpen && (
        <div className="md:hidden">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3 bg-white border-t border-gray-200">
            <Link
              href="/"
              className="text-gray-700 hover:text-primary block px-3 py-2 text-base font-medium"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              Home
            </Link>
            <Link
              href="/about"
              className="text-gray-700 hover:text-primary block px-3 py-2 text-base font-medium"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              About
            </Link>
                         <Link
               href="/membership"
               className="text-gray-700 hover:text-primary block px-3 py-2 text-base font-medium"
               onClick={() => setIsMobileMenuOpen(false)}
             >
               Membership
             </Link>
             <Link
               href="/businesses"
               className="text-gray-700 hover:text-primary block px-3 py-2 text-base font-medium"
               onClick={() => setIsMobileMenuOpen(false)}
             >
               Businesses
             </Link>
             <Link
               href="/training"
               className="text-gray-700 hover:text-primary block px-3 py-2 text-base font-medium"
               onClick={() => setIsMobileMenuOpen(false)}
             >
               Training
             </Link>
             <Link
               href="/awards"
               className="text-gray-700 hover:text-primary block px-3 py-2 text-base font-medium"
               onClick={() => setIsMobileMenuOpen(false)}
             >
               Awards
             </Link>
            
                         {/* Mobile Auth */}
             {user ? (
               <div className="pt-4 border-t border-gray-200">

                 <Link
                   href="/dashboard"
                   className="text-gray-700 hover:text-primary block px-3 py-2 text-base font-medium"
                   onClick={() => setIsMobileMenuOpen(false)}
                 >
                   {user.company_name || 'Dashboard'}
                 </Link>
                 <button
                   onClick={() => {
                     handleSignOut();
                     setIsMobileMenuOpen(false);
                   }}
                   className="text-gray-700 hover:text-red-600 block w-full text-left px-3 py-2 text-base font-medium"
                 >
                   Sign Out
                 </button>
               </div>
             ) : (
              <div className="pt-4 border-t border-gray-200 space-y-2">
                <Link
                  href="/login"
                  className="text-gray-700 hover:text-primary block px-3 py-2 text-base font-medium"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  Sign In
                </Link>
                                                   <Link
                    href="/login?mode=signup"
                    className="btn-primary block text-center"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    Join THSA
                  </Link>
              </div>
            )}
          </div>
        </div>
      )}
    </header>
  );
}
