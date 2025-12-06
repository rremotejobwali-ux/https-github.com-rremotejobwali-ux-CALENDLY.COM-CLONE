import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Calendar, User, Settings, LogOut } from 'lucide-react';

export const Navbar: React.FC = () => {
  const location = useLocation();
  const isDashboard = location.pathname.includes('dashboard');

  return (
    <nav className="bg-white border-b border-gray-200 sticky top-0 z-50">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link to="/" className="flex items-center gap-2">
              <div className="bg-blue-600 p-2 rounded-lg">
                <Calendar className="h-6 w-6 text-white" />
              </div>
              <span className="text-xl font-bold text-gray-900 tracking-tight">Gemini Scheduler</span>
            </Link>
          </div>
          
          <div className="flex items-center gap-4">
            {isDashboard ? (
               <>
                <Link to="/booking" className="text-sm font-medium text-gray-500 hover:text-blue-600 transition-colors">
                  View Public Page
                </Link>
                <div className="h-6 w-px bg-gray-200"></div>
                <div className="flex items-center gap-2">
                  <span className="text-sm font-medium text-gray-700">Hi, Sarah</span>
                  <img src="https://picsum.photos/200" alt="Profile" className="h-8 w-8 rounded-full border border-gray-200" />
                </div>
               </>
            ) : (
              <div className="flex items-center gap-3">
                 <Link to="/dashboard" className="text-sm font-medium text-gray-600 hover:text-gray-900">
                  Login
                </Link>
                <Link to="/booking">
                  <span className="inline-flex items-center justify-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 shadow-sm transition-all">
                    Book a Meeting
                  </span>
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};