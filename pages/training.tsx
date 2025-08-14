import React, { useState, useEffect } from 'react';
import { useAuth } from '../lib/auth';
import { supabase } from '../lib/supabase';
import { BookOpen, Play, Download, Lock, Clock, CheckCircle } from 'lucide-react';
import Link from 'next/link';

interface TrainingCourse {
  id: string;
  title: string;
  description: string;
  category: string;
  video_url?: string;
  pdf_url?: string;
  duration: number;
  is_member_only: boolean;
}

interface UserProgress {
  course_id: string;
  progress_percentage: number;
  completed_at?: string;
}

export default function Training() {
  const { user } = useAuth();
  const [courses, setCourses] = useState<TrainingCourse[]>([]);
  const [userProgress, setUserProgress] = useState<UserProgress[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  useEffect(() => {
    fetchCourses();
    if (user) {
      fetchUserProgress();
    }
  }, [user]);

  const fetchCourses = async () => {
    
    try {
      let query = supabase
        .from('training_courses')
        .select('*')
        .order('category')
        .order('title');

      if (!user) {
        query = query.eq('is_member_only', false);
      }

      const { data, error } = await query;
      if (error) throw error;
      setCourses(data || []);
    } catch (error) {
      console.error('Error fetching courses:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchUserProgress = async () => {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from('user_course_progress')
        .select('*')
        .eq('user_id', user.id);

      if (error) throw error;
      setUserProgress(data || []);
    } catch (error) {
      console.error('Error fetching user progress:', error);
    }
  };

  const getProgressForCourse = (courseId: string) => {
    return userProgress.find(p => p.course_id === courseId)?.progress_percentage || 0;
  };

  const isCourseCompleted = (courseId: string) => {
    const progress = userProgress.find(p => p.course_id === courseId);
    return progress?.completed_at != null;
  };

  const filteredCourses = selectedCategory === 'all' 
    ? courses 
    : courses.filter(course => course.category === selectedCategory);

  const categories = ['all', ...Array.from(new Set(courses.map(c => c.category)))];

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="text-center">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">
              TCA Training Library
            </h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Access professional development courses designed specifically for cleaning industry professionals. 
              Learn from experts and advance your career with our comprehensive training programs.
            </p>
          </div>
        </div>
      </div>

      {/* Category Filter */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex flex-wrap gap-2">
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => setSelectedCategory(category)}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                  selectedCategory === category
                    ? 'bg-primary text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {category === 'all' ? 'All Categories' : category}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {!user ? (
          /* Public View */
          <div className="text-center py-12">
            <BookOpen className="mx-auto h-16 w-16 text-gray-400 mb-4" />
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              Join THSA to Access Full Training Library
            </h2>
            <p className="text-gray-600 mb-8 max-w-2xl mx-auto">
              Our training library includes courses on advanced cleaning techniques, 
              business management, customer service, and more. Become a TCA member 
              to unlock all courses and track your progress.
            </p>
            <div className="space-x-4">
              <Link href="/login?mode=signup" className="btn-primary">
                Join THSA Now
              </Link>
              <a href="/login" className="btn-outline">
                Sign In
              </a>
            </div>
          </div>
        ) : (
          /* Member View */
          <div className="space-y-8">
            {/* Progress Overview */}
            <div className="bg-white rounded-lg shadow p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Your Progress</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="text-center p-4 bg-gray-50 rounded-lg">
                  <div className="text-2xl font-bold text-primary">
                    {courses.filter(c => !c.is_member_only || user).length}
                  </div>
                  <div className="text-sm text-gray-600">Available Courses</div>
                </div>
                <div className="text-center p-4 bg-gray-50 rounded-lg">
                  <div className="text-2xl font-bold text-secondary">
                    {userProgress.filter(p => p.completed_at).length}
                  </div>
                  <div className="text-sm text-gray-600">Completed</div>
                </div>
                <div className="text-center p-4 bg-gray-50 rounded-lg">
                  <div className="text-2xl font-bold text-gray-600">
                    {userProgress.filter(p => p.progress_percentage > 0 && !p.completed_at).length}
                  </div>
                  <div className="text-sm text-gray-600">In Progress</div>
                </div>
              </div>
            </div>

            {/* My Courses */}
            <div className="bg-white rounded-lg shadow">
              <div className="px-6 py-4 border-b border-gray-200">
                <h2 className="text-xl font-semibold text-gray-900">My Courses</h2>
              </div>
              <div className="divide-y divide-gray-200">
                {filteredCourses.map((course) => {
                  const progress = getProgressForCourse(course.id);
                  const completed = isCourseCompleted(course.id);
                  
                  return (
                    <div key={course.id} className="p-6">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center space-x-3 mb-2">
                            <h3 className="text-lg font-medium text-gray-900">
                              {course.title}
                            </h3>
                            {course.is_member_only && (
                              <Lock className="h-4 w-4 text-primary" />
                            )}
                            {completed && (
                              <CheckCircle className="h-4 w-4 text-green-500" />
                            )}
                          </div>
                          <p className="text-gray-600 mb-3">{course.description}</p>
                          <div className="flex items-center space-x-4 text-sm text-gray-500">
                            <span className="flex items-center">
                              <Clock className="h-4 w-4 mr-1" />
                              {course.duration} min
                            </span>
                            <span className="px-2 py-1 bg-gray-100 rounded-full">
                              {course.category}
                            </span>
                          </div>
                        </div>
                        <div className="ml-6 flex-shrink-0">
                          <div className="flex items-center space-x-2">
                            {course.video_url && (
                              <button className="btn-primary text-sm">
                                <Play className="h-4 w-4 mr-1" />
                                {completed ? 'Replay' : 'Watch'}
                              </button>
                            )}
                            {course.pdf_url && (
                              <button className="btn-outline text-sm">
                                <Download className="h-4 w-4 mr-1" />
                                Download
                              </button>
                            )}
                          </div>
                        </div>
                      </div>
                      
                      {/* Progress Bar */}
                      <div className="mt-4">
                        <div className="flex items-center justify-between text-sm text-gray-600 mb-1">
                          <span>Progress</span>
                          <span>{progress}%</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div 
                            className="bg-primary h-2 rounded-full transition-all duration-300"
                            style={{ width: `${progress}%` }}
                          ></div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        )}

        {/* Quick Actions */}
        <div className="mt-8 text-center">
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4">
              Need Help Getting Started?
            </h3>
            <p className="text-gray-600 mb-6">
              Our training team is here to help you succeed. Contact us for personalized guidance.
            </p>
            <div className="space-x-4">
              <a href="/contact" className="btn-primary">
                Contact Support
              </a>
              <a href="/membership" className="btn-outline">
                Upgrade Membership
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
