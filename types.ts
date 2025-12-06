export enum MeetingStatus {
  SCHEDULED = 'SCHEDULED',
  CANCELLED = 'CANCELLED',
  COMPLETED = 'COMPLETED'
}

export interface Meeting {
  id: string;
  title: string;
  description: string;
  startTime: string; // ISO string
  durationMinutes: number;
  guestName: string;
  guestEmail: string;
  status: MeetingStatus;
}

export interface Availability {
  daysOfWeek: number[]; // 0-6 (Sun-Sat)
  startHour: number; // 0-23
  endHour: number; // 0-23
}

export interface UserProfile {
  name: string;
  bio: string;
  avatarUrl: string;
}
