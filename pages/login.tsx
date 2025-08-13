import React, { useState } from 'react';
import { useAuth } from '../lib/auth';
import { useRouter } from 'next/router';
import { Eye, EyeOff, Mail, Lock, Building } from 'lucide-react';

export default function Login() {
  const [isSignUp, setIsSignUp] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [companyName, setCompanyName] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');

  const { signIn, signUp } = useAuth();
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setMessage('');

    try {
      if (isSignUp) {
        const { error } = await signUp(email, password, companyName);
        if (error) {
          setError(error.message);
        } else {
          setMessage('Account created successfully! Please check your email to verify your account.');
        }
      } else {
        const { error } = await signIn(email, password);
        if (error) {
          setError(error.message);
        } else {
          router.push('/dashboard');
        }
      }
    } catch (err) {
      setError('An unexpected error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <div className="text-center">
          <h2 className="text-3xl font-bold text-gray-900">
            {isSignUp ? 'Join TCA' : 'Welcome Back'}
          </h2>
          <p className="mt-2 text-sm text-gray-600">
            {isSignUp 
              ? 'Create your account to access exclusive TCA benefits'
              : 'Sign in to your TCA account'
            }
          </p>
          {isSignUp && (
            <p className="mt-1 text-xs text-gray-500">
              Already have an account? <button 
                type="button" 
                onClick={() => {
                  setIsSignUp(false);
                  setError('');
                  setMessage('');
                }}
                className="text-primary hover:text-primary-dark underline"
              >
                Sign in here
              </button>
            </p>
          )}
          {!isSignUp && (
            <p className="mt-1 text-xs text-gray-500">
              Not sure if you have an account? Try signing in first, or <button 
                type="button" 
                onClick={() => {
                  setIsSignUp(true);
                  setError('');
                  setMessage('');
                }}
                className="text-primary hover:text-primary-dark underline"
              >
                create a new one
              </button>
            </p>
          )}
        </div>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
          <form className="space-y-6" onSubmit={handleSubmit}>
            {isSignUp && (
              <div>
                <label htmlFor="companyName" className="block text-sm font-medium text-gray-700">
                  Company Name
                </label>
                <div className="mt-1 relative">
                  <Building className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                  <input
                    id="companyName"
                    name="companyName"
                    type="text"
                    required={isSignUp}
                    value={companyName}
                    onChange={(e) => setCompanyName(e.target.value)}
                    className="input-field pl-10"
                    placeholder="Enter your company name"
                  />
                </div>
              </div>
            )}

            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                Email Address
              </label>
              <div className="mt-1 relative">
                <Mail className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="input-field pl-10"
                  placeholder="Enter your email"
                />
              </div>
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                Password
              </label>
              <div className="mt-1 relative">
                <Lock className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                <input
                  id="password"
                  name="password"
                  type={showPassword ? 'text' : 'password'}
                  autoComplete={isSignUp ? 'new-password' : 'current-password'}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="input-field pr-10"
                  placeholder="Enter your password"
                />
                <button
                  type="button"
                  className="absolute inset-y-0 right-0 pr-3 flex items-center"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? (
                    <EyeOff className="h-5 w-5 text-gray-400" />
                  ) : (
                    <Eye className="h-5 w-5 text-gray-400" />
                  )}
                </button>
              </div>
            </div>

            {!isSignUp && (
              <div className="flex items-center justify-between">
                <div className="text-sm">
                  <a href="#" className="font-medium text-primary hover:text-primary-dark">
                    Forgot your password?
                  </a>
                </div>
              </div>
            )}

            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md">
                <div className="flex flex-col space-y-2">
                  <p>{error}</p>
                  {error.includes('already exists') && isSignUp && (
                    <div className="flex flex-col space-y-2">
                      <p className="text-sm text-red-600">
                        It looks like you already have an account with us.
                      </p>
                      <button
                        type="button"
                        onClick={() => {
                          setIsSignUp(false);
                          setError('');
                          setMessage('');
                          // Keep the email for convenience
                        }}
                        className="text-sm text-primary hover:text-primary-dark font-medium underline"
                      >
                        Sign in to your existing account
                      </button>
                    </div>
                  )}
                  {error.includes('Invalid login credentials') && !isSignUp && (
                    <div className="flex flex-col space-y-2">
                      <p className="text-sm text-red-600">
                        The email or password you entered is incorrect.
                      </p>
                      <button
                        type="button"
                        onClick={() => {
                          setIsSignUp(true);
                          setError('');
                          setMessage('');
                        }}
                        className="text-sm text-primary hover:text-primary-dark font-medium underline"
                      >
                        Create a new account instead
                      </button>
                    </div>
                  )}
                </div>
              </div>
            )}

            {message && (
              <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-md">
                <div className="flex flex-col space-y-2">
                  <p>{message}</p>
                  {message.includes('Account created successfully') && (
                    <div className="text-sm">
                      <p className="text-green-600">
                        After verifying your email, you can sign in with your credentials.
                      </p>
                      <button
                        type="button"
                        onClick={() => {
                          setIsSignUp(false);
                          setMessage('');
                          setEmail('');
                          setPassword('');
                          setCompanyName('');
                        }}
                        className="text-primary hover:text-primary-dark font-medium underline mt-1"
                      >
                        Switch to sign in
                      </button>
                    </div>
                  )}
                </div>
              </div>
            )}

            <div>
              <button
                type="submit"
                disabled={loading}
                className="btn-primary w-full flex justify-center"
              >
                {loading ? (
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                ) : (
                  isSignUp ? 'Create Account' : 'Sign In'
                )}
              </button>
            </div>
          </form>

          <div className="mt-6">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-300" />
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-white text-gray-500">
                  {isSignUp ? 'Already have an account?' : "Don't have an account?"}
                </span>
              </div>
            </div>

            <div className="mt-6 text-center">
              <button
                type="button"
                onClick={() => {
                  setIsSignUp(!isSignUp);
                  setError('');
                  setMessage('');
                }}
                className="text-primary hover:text-primary-dark font-medium"
              >
                {isSignUp ? 'Sign in instead' : 'Join TCA Now'}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
