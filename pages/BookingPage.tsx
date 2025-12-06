import React, { useState, useEffect } from 'react';
import { format, addDays, startOfToday, isSameDay, addMinutes, setHours, setMinutes, isBefore, isEqual } from 'date-fns';
import { getAvailability, getProfile, addMeeting, checkSlotAvailability } from '../services/db';
import { UserProfile, Availability } from '../types';
import { ChevronLeft, ChevronRight, Clock, Calendar as CalendarIcon, CheckCircle } from 'lucide-react';
import { Button } from '../components/ui/Button';
import { SmartAgendaGenerator } from '../components/SmartAgendaGenerator';

export const BookingPage: React.FC = () => {
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [availability, setAvailability] = useState<Availability | null>(null);
  const [selectedDate, setSelectedDate] = useState<Date>(startOfToday());
  const [selectedSlot, setSelectedSlot] = useState<Date | null>(null);
  const [step, setStep] = useState<'date' | 'details' | 'success'>('date');
  
  // Form State
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [notes, setNotes] = useState('');
  const [duration, setDuration] = useState(30);

  useEffect(() => {
    setProfile(getProfile());
    setAvailability(getAvailability());
  }, []);

  // Generate next 14 days
  const calendarDays = Array.from({ length: 14 }, (_, i) => addDays(startOfToday(), i));

  // Generate slots for selected date
  const generateSlots = () => {
    if (!availability) return [];
    
    const slots: Date[] = [];
    let current = setMinutes(setHours(selectedDate, availability.startHour), 0);
    const end = setMinutes(setHours(selectedDate, availability.endHour), 0);

    while (isBefore(current, end)) {
        // Only add if it's not in the past (if today)
        if (isBefore(new Date(), current) && checkSlotAvailability(current, duration)) {
            slots.push(current);
        }
        current = addMinutes(current, 30);
    }
    return slots;
  };

  const availableSlots = generateSlots();

  const handleBooking = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedSlot) return;

    addMeeting({
      title: 'Meeting with ' + name,
      description: notes,
      startTime: selectedSlot.toISOString(),
      durationMinutes: duration,
      guestName: name,
      guestEmail: email,
    });

    setStep('success');
  };

  if (!profile) return <div>Loading...</div>;

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl w-full bg-white rounded-2xl shadow-xl overflow-hidden flex flex-col md:flex-row min-h-[600px]">
        
        {/* Sidebar Info */}
        <div className="w-full md:w-1/3 bg-gray-50 p-8 border-r border-gray-200 flex flex-col">
          <div className="mb-6">
             <img src={profile.avatarUrl} alt={profile.name} className="w-16 h-16 rounded-full border-2 border-white shadow-sm mb-4" />
             <p className="text-sm font-medium text-gray-500 uppercase tracking-wider">Host</p>
             <h2 className="text-2xl font-bold text-gray-900">{profile.name}</h2>
          </div>
          
          <div className="space-y-4 mb-8">
             <div className="flex items-start text-gray-600">
               <Clock className="w-5 h-5 mr-3 mt-0.5" />
               <span>{duration} min</span>
             </div>
             <div className="flex items-start text-gray-600">
               <CalendarIcon className="w-5 h-5 mr-3 mt-0.5" />
               {selectedSlot ? (
                 <span className="font-medium text-gray-900">
                   {format(selectedSlot, 'h:mm a')} - {format(addMinutes(selectedSlot, duration), 'h:mm a')}<br/>
                   {format(selectedSlot, 'EEEE, MMMM d, yyyy')}
                 </span>
               ) : (
                 <span>Select a date & time</span>
               )}
             </div>
          </div>

          <div className="mt-auto">
             <p className="text-sm text-gray-500 leading-relaxed">{profile.bio}</p>
          </div>
        </div>

        {/* Main Content Area */}
        <div className="w-full md:w-2/3 p-8 relative">
            {step === 'success' ? (
                <div className="h-full flex flex-col items-center justify-center text-center animate-fade-in">
                    <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-6">
                        <CheckCircle className="w-8 h-8 text-green-600" />
                    </div>
                    <h3 className="text-2xl font-bold text-gray-900 mb-2">Booking Confirmed!</h3>
                    <p className="text-gray-600 max-w-sm mb-8">
                        You are scheduled with {profile.name} for {format(selectedSlot!, 'MMMM d, h:mm a')}.
                        A confirmation email has been sent to {email}.
                    </p>
                    <Button onClick={() => window.location.reload()} variant="secondary">
                        Book Another Meeting
                    </Button>
                </div>
            ) : step === 'details' ? (
                <div className="animate-fade-in">
                    <button 
                      onClick={() => setStep('date')}
                      className="mb-6 flex items-center text-sm text-blue-600 hover:text-blue-800 transition-colors"
                    >
                        <ChevronLeft className="w-4 h-4 mr-1" /> Back to calendar
                    </button>
                    <h3 className="text-xl font-bold text-gray-900 mb-6">Enter Details</h3>
                    <form onSubmit={handleBooking} className="space-y-6">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Your Name</label>
                            <input 
                              required
                              type="text" 
                              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
                              value={name}
                              onChange={e => setName(e.target.value)}
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
                            <input 
                              required
                              type="email" 
                              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
                              value={email}
                              onChange={e => setEmail(e.target.value)}
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Additional Notes / Agenda
                            </label>
                            <textarea 
                              rows={4}
                              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
                              value={notes}
                              onChange={e => setNotes(e.target.value)}
                              placeholder="What would you like to discuss?"
                            />
                             <SmartAgendaGenerator 
                                topic={notes || "Project Planning"} // Provide a default or use the input
                                duration={duration}
                                onAgendaGenerated={(agenda) => setNotes(prev => prev + (prev ? '\n\n' : '') + agenda)}
                             />
                             <p className="text-xs text-gray-500 mt-2">
                                Tip: Type a topic above and use the AI button to auto-generate a structured agenda.
                             </p>
                        </div>
                        <div className="pt-4">
                            <Button type="submit" className="w-full h-12 text-lg">
                                Schedule Meeting
                            </Button>
                        </div>
                    </form>
                </div>
            ) : (
                <div className="animate-fade-in h-full flex flex-col">
                    <h3 className="text-xl font-bold text-gray-900 mb-6">Select a Date & Time</h3>
                    <div className="flex flex-col md:flex-row gap-8 flex-1">
                        {/* Calendar Strip (Simplified for vertical list on mobile, grid on desktop) */}
                        <div className="flex-1 overflow-y-auto max-h-[400px] pr-2">
                            <div className="grid grid-cols-1 gap-2">
                                {calendarDays.map((day) => {
                                    const isSelected = isSameDay(day, selectedDate);
                                    const isToday = isSameDay(day, new Date());
                                    const dayName = format(day, 'EEEE');
                                    const dateNum = format(day, 'd');
                                    const month = format(day, 'MMM');
                                    
                                    // Skip weekends for this demo based on default availability
                                    const isWeekend = day.getDay() === 0 || day.getDay() === 6;
                                    if(isWeekend) return null;

                                    return (
                                        <button
                                            key={day.toISOString()}
                                            onClick={() => { setSelectedDate(day); setSelectedSlot(null); }}
                                            className={`w-full flex items-center p-3 rounded-lg border transition-all ${
                                                isSelected 
                                                ? 'bg-blue-50 border-blue-500 ring-1 ring-blue-500' 
                                                : 'bg-white border-gray-200 hover:border-blue-300'
                                            }`}
                                        >
                                            <div className={`w-10 text-center text-sm font-bold uppercase ${isSelected ? 'text-blue-600' : 'text-gray-500'}`}>
                                                {format(day, 'EEE')}
                                            </div>
                                            <div className={`text-lg font-semibold ml-4 ${isSelected ? 'text-gray-900' : 'text-gray-700'}`}>
                                                {format(day, 'MMMM d')}
                                            </div>
                                            {isToday && <span className="ml-auto text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded">Today</span>}
                                        </button>
                                    );
                                })}
                            </div>
                        </div>

                        {/* Slots */}
                        <div className="w-full md:w-48 flex-shrink-0">
                            <h4 className="text-sm font-medium text-gray-500 mb-4 sticky top-0 bg-white py-2">
                                {format(selectedDate, 'EEEE, MMM d')}
                            </h4>
                            <div className="space-y-2 overflow-y-auto max-h-[400px] pr-2">
                                {availableSlots.length === 0 ? (
                                    <div className="text-center py-8 text-gray-500 text-sm">
                                        No slots available
                                    </div>
                                ) : (
                                    availableSlots.map(slot => (
                                        <button
                                            key={slot.toISOString()}
                                            onClick={() => {
                                                setSelectedSlot(slot);
                                                setStep('details');
                                            }}
                                            className="w-full py-3 px-4 text-center border border-blue-200 text-blue-600 font-medium rounded-lg hover:bg-blue-600 hover:text-white transition-all hover:shadow-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                                        >
                                            {format(slot, 'h:mm a')}
                                        </button>
                                    ))
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
      </div>
    </div>
  );
};