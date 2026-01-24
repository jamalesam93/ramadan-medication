export function generateId(): string {
  return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
}

export function formatTime12h(time: string, isArabic: boolean = false): string {
  const [hours, minutes] = time.split(':').map(Number);
  const period = hours >= 12 
    ? (isArabic ? 'مساءً' : 'PM') 
    : (isArabic ? 'صباحاً' : 'AM');
  const displayHours = hours % 12 || 12;
  return `${displayHours}:${minutes.toString().padStart(2, '0')} ${period}`;
}

export function getCurrentDate(): string {
  return new Date().toISOString().split('T')[0];
}

export function getCurrentTime(): string {
  const now = new Date();
  return `${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}`;
}

export function parseTimeToDate(time: string, date?: string): Date {
  const [hours, minutes] = time.split(':').map(Number);
  const targetDate = date ? new Date(date) : new Date();
  targetDate.setHours(hours, minutes, 0, 0);
  return targetDate;
}

export function addMinutesToTime(time: string, minutes: number): string {
  const date = parseTimeToDate(time);
  date.setMinutes(date.getMinutes() + minutes);
  return `${date.getHours().toString().padStart(2, '0')}:${date.getMinutes().toString().padStart(2, '0')}`;
}

export function subtractMinutesFromTime(time: string, minutes: number): string {
  return addMinutesToTime(time, -minutes);
}

export function timeToMinutes(time: string): number {
  const [hours, minutes] = time.split(':').map(Number);
  return hours * 60 + minutes;
}

export function minutesToTime(totalMinutes: number): string {
  const normalizedMinutes = ((totalMinutes % 1440) + 1440) % 1440;
  const hours = Math.floor(normalizedMinutes / 60);
  const minutes = normalizedMinutes % 60;
  return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`;
}

export function getTimeRemaining(targetTime: string): {
  hours: number;
  minutes: number;
  seconds: number;
  totalSeconds: number;
  isOverdue: boolean;
} {
  const now = new Date();
  const target = parseTimeToDate(targetTime);
  
  if (target.getTime() < now.getTime()) {
    target.setDate(target.getDate() + 1);
  }
  
  const diff = target.getTime() - now.getTime();
  const isOverdue = diff < 0;
  const absDiff = Math.abs(diff);
  
  const totalSeconds = Math.floor(absDiff / 1000);
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;
  
  return { hours, minutes, seconds, totalSeconds, isOverdue };
}

export function formatTime(date: Date, isArabic: boolean = false): string {
  const hours = date.getHours();
  const minutes = date.getMinutes();
  const period = hours >= 12 
    ? (isArabic ? 'مساءً' : 'PM') 
    : (isArabic ? 'صباحاً' : 'AM');
  const displayHours = hours % 12 || 12;
  return `${displayHours}:${minutes.toString().padStart(2, '0')} ${period}`;
}

export function formatCountdown(hours: number, minutes: number, seconds: number): string {
  if (hours > 0) {
    return `${hours}h ${minutes}m`;
  } else if (minutes > 0) {
    return `${minutes}m ${seconds}s`;
  }
  return `${seconds}s`;
}

export function formatDate(date: Date | string): string {
  const d = typeof date === 'string' ? new Date(date) : date;
  return d.toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
}

export function formatDateShort(date: Date | string): string {
  const d = typeof date === 'string' ? new Date(date) : date;
  return d.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
  });
}

export function isToday(date: Date | string): boolean {
  const d = typeof date === 'string' ? new Date(date) : date;
  const today = new Date();
  return d.toDateString() === today.toDateString();
}
