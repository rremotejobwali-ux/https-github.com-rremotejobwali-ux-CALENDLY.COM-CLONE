import React from 'react';
import { Link } from 'react-router-dom';
import { Calendar, Clock, Shield, Zap, Check } from 'lucide-react';

export const Home: React.FC = () => {
  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <div className="relative overflow-hidden bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="relative z-10 pb-8 bg-white sm:pb-16 md:pb-20 lg:max-w-2xl lg:w-full lg:pb-28 xl:pb-32">
            <svg
              className="hidden lg:block absolute right-0 inset-y-0 h-full w-48 text-white transform translate-x-1/2"
              fill="currentColor"
              viewBox="0 0 100 100"
              preserveAspectRatio="none"
              aria-hidden="true"
            >
              <polygon points="50,0 100,0 50,100 0,100" />
            </svg>

            <main className="mt-10 mx-auto max-w-7xl px-4 sm:mt-12 sm:px-6 md:mt-16 lg:mt-20 lg:px-8 xl:mt-28">
              <div className="sm:text-center lg:text-left">
                <h1 className="text-4xl tracking-tight font-extrabold text-gray-900 sm:text-5xl md:text-6xl">
                  <span className="block xl:inline">Scheduling made</span>{' '}
                  <span className="block text-blue-600 xl:inline">intelligent</span>
                </h1>
                <p className="mt-3 text-base text-gray-500 sm:mt-5 sm:text-lg sm:max-w-xl sm:mx-auto md:mt-5 md:text-xl lg:mx-0">
                  Gemini Scheduler is the smart appointment booking platform. Stop playing phone tag and let your clients book time with you seamlessly. Powered by Google Gemini for agenda assistance.
                </p>
                <div className="mt-5 sm:mt-8 sm:flex sm:justify-center lg:justify-start">
                  <div className="rounded-md shadow">
                    <Link
                      to="/booking"
                      className="w-full flex items-center justify-center px-8 py-3 border border-transparent text-base font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 md:py-4 md:text-lg md:px-10"
                    >
                      Book a Demo
                    </Link>
                  </div>
                  <div className="mt-3 sm:mt-0 sm:ml-3">
                    <Link
                      to="/dashboard"
                      className="w-full flex items-center justify-center px-8 py-3 border border-transparent text-base font-medium rounded-md text-blue-700 bg-blue-100 hover:bg-blue-200 md:py-4 md:text-lg md:px-10"
                    >
                      Host Dashboard
                    </Link>
                  </div>
                </div>
              </div>
            </main>
          </div>
        </div>
        <div className="lg:absolute lg:inset-y-0 lg:right-0 lg:w-1/2 bg-gray-50 flex items-center justify-center">
            <div className="grid grid-cols-2 gap-4 p-8 opacity-80 transform rotate-[-3deg]">
               <div className="w-48 h-32 bg-blue-500 rounded-xl shadow-lg"></div>
               <div className="w-48 h-32 bg-gray-200 rounded-xl shadow-lg mt-8"></div>
               <div className="w-48 h-32 bg-gray-200 rounded-xl shadow-lg -mt-8"></div>
               <div className="w-48 h-32 bg-blue-400 rounded-xl shadow-lg"></div>
            </div>
        </div>
      </div>

      {/* Feature Section */}
      <div className="py-24 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="lg:text-center">
            <h2 className="text-base text-blue-600 font-semibold tracking-wide uppercase">Features</h2>
            <p className="mt-2 text-3xl leading-8 font-extrabold tracking-tight text-gray-900 sm:text-4xl">
              A better way to meet
            </p>
            <p className="mt-4 max-w-2xl text-xl text-gray-500 lg:mx-auto">
              Everything you need to manage your calendar and appointments efficiently.
            </p>
          </div>

          <div className="mt-16">
            <dl className="space-y-10 md:space-y-0 md:grid md:grid-cols-2 md:gap-x-8 md:gap-y-10">
              <div className="relative">
                <dt>
                  <div className="absolute flex items-center justify-center h-12 w-12 rounded-md bg-blue-500 text-white">
                    <Clock className="h-6 w-6" aria-hidden="true" />
                  </div>
                  <p className="ml-16 text-lg leading-6 font-medium text-gray-900">Real-time Availability</p>
                </dt>
                <dd className="mt-2 ml-16 text-base text-gray-500">
                  Define your working hours and let the system handle the time zones. No more double bookings.
                </dd>
              </div>

              <div className="relative">
                <dt>
                  <div className="absolute flex items-center justify-center h-12 w-12 rounded-md bg-blue-500 text-white">
                    <Zap className="h-6 w-6" aria-hidden="true" />
                  </div>
                  <p className="ml-16 text-lg leading-6 font-medium text-gray-900">AI Powered Agendas</p>
                </dt>
                <dd className="mt-2 ml-16 text-base text-gray-500">
                  Use our Gemini integration to automatically generate structured meeting agendas based on your topic notes.
                </dd>
              </div>

              <div className="relative">
                <dt>
                  <div className="absolute flex items-center justify-center h-12 w-12 rounded-md bg-blue-500 text-white">
                    <Shield className="h-6 w-6" aria-hidden="true" />
                  </div>
                  <p className="ml-16 text-lg leading-6 font-medium text-gray-900">Secure & Private</p>
                </dt>
                <dd className="mt-2 ml-16 text-base text-gray-500">
                  Your data is stored locally in this demo version, ensuring your privacy while testing the platform.
                </dd>
              </div>

              <div className="relative">
                <dt>
                  <div className="absolute flex items-center justify-center h-12 w-12 rounded-md bg-blue-500 text-white">
                    <Check className="h-6 w-6" aria-hidden="true" />
                  </div>
                  <p className="ml-16 text-lg leading-6 font-medium text-gray-900">Easy Booking</p>
                </dt>
                <dd className="mt-2 ml-16 text-base text-gray-500">
                  Share your link and guests can book a slot in seconds. No account required for guests.
                </dd>
              </div>
            </dl>
          </div>
        </div>
      </div>
    </div>
  );
};