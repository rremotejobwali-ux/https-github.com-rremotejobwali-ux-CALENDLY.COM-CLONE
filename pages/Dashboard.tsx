import React, { useEffect, useState } from 'react';
import { getMeetings, getProfile, updateMeetingStatus } from '../services/db';
import { analyzeSchedule } from '../services/gemini';
import { Meeting, UserProfile, MeetingStatus } from '../types';
import { format, parseISO } from 'date-fns';
import { Calendar as CalendarIcon, Clock, XCircle, CheckCircle, BrainCircuit, RefreshCw } from 'lucide-react';
import { Button } from '../components/ui/Button';

export const Dashboard: React.FC = () => {
  const [meetings, setMeetings] = useState<Meeting[]>([]);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [activeTab, setActiveTab] = useState<'upcoming' | 'past'>('upcoming');
  const [aiAnalysis, setAiAnalysis] = useState<string>('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  useEffect(() => {
    refreshData();
  }, []);

  const refreshData = () => {
    const allMeetings = getMeetings().sort((a, b) => 
      new Date(a.startTime).getTime() - new Date(b.startTime).getTime()
    );
    setMeetings(allMeetings);
    setProfile(getProfile());
  };

  const handleCancel = (id: string) => {
    if (confirm('Are you sure you want to cancel this meeting?')) {
      updateMeetingStatus(id, MeetingStatus.CANCELLED);
      refreshData();
    }
  };

  const handleAnalyze = async () => {
    setIsAnalyzing(true);
    const analysis = await analyzeSchedule(meetings.filter(m => m.status === MeetingStatus.SCHEDULED));
    setAiAnalysis(analysis);
    setIsAnalyzing(false);
  };

  const upcomingMeetings = meetings.filter(m => {
    const isFuture = new Date(m.startTime) > new Date();
    return isFuture && m.status !== MeetingStatus.CANCELLED;
  });

  const pastMeetings = meetings.filter(m => {
    const isPast = new Date(m.startTime) <= new Date();
    return isPast || m.status === MeetingStatus.CANCELLED;
  });

  const displayedMeetings = activeTab === 'upcoming' ? upcomingMeetings : pastMeetings;

  return (
    <div className="min-h-screen bg-gray-50 pb-12">
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="md:flex md:items-center md:justify-between">
            <div className="flex-1 min-w-0">
              <h2 className="text-2xl font-bold leading-7 text-gray-900 sm:text-3xl sm:truncate">
                Dashboard
              </h2>
              <p className="mt-1 text-sm text-gray-500">
                Manage your schedule and availability.
              </p>
            </div>
            <div className="mt-4 flex md:mt-0 md:ml-4">
              <Button onClick={handleAnalyze} variant="secondary" disabled={isAnalyzing}>
                {isAnalyzing ? (
                  <>Analyzing...</>
                ) : (
                  <>
                    <BrainCircuit className="w-4 h-4 mr-2 text-purple-600" />
                    AI Insights
                  </>
                )}
              </Button>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* AI Insight Card */}
        {aiAnalysis && (
          <div className="mb-8 bg-gradient-to-r from-purple-50 to-blue-50 border border-purple-100 rounded-xl p-6 shadow-sm animate-fade-in">
            <div className="flex items-start gap-4">
              <div className="p-2 bg-white rounded-lg shadow-sm">
                <BrainCircuit className="w-6 h-6 text-purple-600" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-1">Gemini Insights</h3>
                <p className="text-gray-700 leading-relaxed whitespace-pre-wrap">{aiAnalysis}</p>
              </div>
            </div>
          </div>
        )}

        {/* Stats */}
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-3 mb-8">
          <div className="bg-white overflow-hidden shadow rounded-lg border border-gray-200 p-5">
            <dt className="text-sm font-medium text-gray-500 truncate">Upcoming Meetings</dt>
            <dd className="mt-1 text-3xl font-semibold text-gray-900">{upcomingMeetings.length}</dd>
          </div>
          <div className="bg-white overflow-hidden shadow rounded-lg border border-gray-200 p-5">
            <dt className="text-sm font-medium text-gray-500 truncate">Total Bookings</dt>
            <dd className="mt-1 text-3xl font-semibold text-gray-900">{meetings.length}</dd>
          </div>
          <div className="bg-white overflow-hidden shadow rounded-lg border border-gray-200 p-5">
            <dt className="text-sm font-medium text-gray-500 truncate">Availability</dt>
            <dd className="mt-1 text-lg font-semibold text-green-600">Mon-Fri, 9am-5pm</dd>
          </div>
        </div>

        {/* Tabs */}
        <div className="border-b border-gray-200 mb-6">
          <nav className="-mb-px flex space-x-8">
            <button
              onClick={() => setActiveTab('upcoming')}
              className={`${
                activeTab === 'upcoming'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm transition-colors`}
            >
              Upcoming
            </button>
            <button
              onClick={() => setActiveTab('past')}
              className={`${
                activeTab === 'past'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm transition-colors`}
            >
              Past & Cancelled
            </button>
          </nav>
        </div>

        {/* Meeting List */}
        <div className="bg-white shadow overflow-hidden sm:rounded-md border border-gray-200">
          <ul className="divide-y divide-gray-200">
            {displayedMeetings.length === 0 ? (
              <li className="px-6 py-12 text-center text-gray-500">
                No meetings found in this category.
              </li>
            ) : (
              displayedMeetings.map((meeting) => (
                <li key={meeting.id} className="hover:bg-gray-50 transition-colors">
                  <div className="px-4 py-4 sm:px-6">
                    <div className="flex items-center justify-between">
                      <div className="flex flex-col">
                        <p className="text-sm font-medium text-blue-600 truncate">{meeting.title}</p>
                        <p className="text-sm text-gray-500 truncate">{meeting.guestName} ({meeting.guestEmail})</p>
                      </div>
                      <div className="ml-2 flex-shrink-0 flex">
                        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full 
                          ${meeting.status === MeetingStatus.SCHEDULED ? 'bg-green-100 text-green-800' : 
                            meeting.status === MeetingStatus.CANCELLED ? 'bg-red-100 text-red-800' : 'bg-gray-100 text-gray-800'}`}>
                          {meeting.status}
                        </span>
                      </div>
                    </div>
                    <div className="mt-2 sm:flex sm:justify-between">
                      <div className="sm:flex">
                        <p className="flex items-center text-sm text-gray-500">
                          <CalendarIcon className="flex-shrink-0 mr-1.5 h-4 w-4 text-gray-400" />
                          {format(parseISO(meeting.startTime), 'EEEE, MMMM d, yyyy')}
                        </p>
                        <p className="mt-2 flex items-center text-sm text-gray-500 sm:mt-0 sm:ml-6">
                          <Clock className="flex-shrink-0 mr-1.5 h-4 w-4 text-gray-400" />
                          {format(parseISO(meeting.startTime), 'h:mm a')} ({meeting.durationMinutes} min)
                        </p>
                      </div>
                      {meeting.status === MeetingStatus.SCHEDULED && activeTab === 'upcoming' && (
                         <div className="mt-2 flex items-center text-sm sm:mt-0">
                           <button 
                            onClick={() => handleCancel(meeting.id)}
                            className="text-red-600 hover:text-red-900 font-medium flex items-center gap-1 transition-colors"
                           >
                             <XCircle className="w-4 h-4" /> Cancel
                           </button>
                         </div>
                      )}
                    </div>
                  </div>
                </li>
              ))
            )}
          </ul>
        </div>
      </main>
    </div>
  );
};