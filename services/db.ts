import { Meeting, Availability, UserProfile, MeetingStatus } from '../types';
import { addMinutes, parseISO, isWithinInterval, startOfDay, endOfDay } from 'date-fns';

const STORAGE_KEYS = {
  MEETINGS: 'gs_meetings',
  AVAILABILITY: 'gs_availability',
  PROFILE: 'gs_profile'
};

const DEFAULT_AVAILABILITY: Availability = {
  daysOfWeek: [1, 2, 3, 4, 5], // Mon-Fri
  startHour: 9,
  endHour: 17
};

const DEFAULT_PROFILE: UserProfile = {
  name: "Sarah Conners",
  bio: "Product Designer & Consultant. Let's chat about your next big idea.",
  avatarUrl: "https://picsum.photos/200"
};

// Initialize simulated DB
const initDB = () => {
  if (!localStorage.getItem(STORAGE_KEYS.AVAILABILITY)) {
    localStorage.setItem(STORAGE_KEYS.AVAILABILITY, JSON.stringify(DEFAULT_AVAILABILITY));
  }
  if (!localStorage.getItem(STORAGE_KEYS.PROFILE)) {
    localStorage.setItem(STORAGE_KEYS.PROFILE, JSON.stringify(DEFAULT_PROFILE));
  }
  if (!localStorage.getItem(STORAGE_KEYS.MEETINGS)) {
    localStorage.setItem(STORAGE_KEYS.MEETINGS, JSON.stringify([]));
  }
};

initDB();

export const getMeetings = (): Meeting[] => {
  const data = localStorage.getItem(STORAGE_KEYS.MEETINGS);
  return data ? JSON.parse(data) : [];
};

export const addMeeting = (meeting: Omit<Meeting, 'id' | 'status'>): Meeting => {
  const meetings = getMeetings();
  const newMeeting: Meeting = {
    ...meeting,
    id: crypto.randomUUID(),
    status: MeetingStatus.SCHEDULED
  };
  meetings.push(newMeeting);
  localStorage.setItem(STORAGE_KEYS.MEETINGS, JSON.stringify(meetings));
  return newMeeting;
};

export const updateMeetingStatus = (id: string, status: MeetingStatus): void => {
  const meetings = getMeetings();
  const updated = meetings.map(m => m.id === id ? { ...m, status } : m);
  localStorage.setItem(STORAGE_KEYS.MEETINGS, JSON.stringify(updated));
};

export const getAvailability = (): Availability => {
  const data = localStorage.getItem(STORAGE_KEYS.AVAILABILITY);
  return data ? JSON.parse(data) : DEFAULT_AVAILABILITY;
};

export const saveAvailability = (avail: Availability): void => {
  localStorage.setItem(STORAGE_KEYS.AVAILABILITY, JSON.stringify(avail));
};

export const getProfile = (): UserProfile => {
  const data = localStorage.getItem(STORAGE_KEYS.PROFILE);
  return data ? JSON.parse(data) : DEFAULT_PROFILE;
};

export const checkSlotAvailability = (start: Date, durationMinutes: number): boolean => {
  const meetings = getMeetings().filter(m => m.status === MeetingStatus.SCHEDULED);
  const requestedEnd = addMinutes(start, durationMinutes);

  for (const meeting of meetings) {
    const mStart = parseISO(meeting.startTime);
    const mEnd = addMinutes(mStart, meeting.durationMinutes);

    // Simple overlap check
    if (
      (start < mEnd && requestedEnd > mStart) // Overlap logic
    ) {
      return false;
    }
  }
  return true;
};
