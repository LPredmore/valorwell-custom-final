/**
 * Enterprise-grade timezone utilities
 * Handles consistent UTC conversion and timezone-aware scheduling
 */

import { format, parseISO } from 'date-fns';
import { toZonedTime, fromZonedTime } from 'date-fns-tz';

export const DEFAULT_TIMEZONE = 'America/New_York';

/**
 * Converts a local date/time to UTC for database storage
 */
export const localToUtc = (
  date: Date | string,
  timezone: string = DEFAULT_TIMEZONE
): Date => {
  const localDate = typeof date === 'string' ? parseISO(date) : date;
  return fromZonedTime(localDate, timezone);
};

/**
 * Converts UTC time from database to local timezone for display
 */
export const utcToLocal = (
  utcDate: Date | string,
  timezone: string = DEFAULT_TIMEZONE
): Date => {
  const utc = typeof utcDate === 'string' ? parseISO(utcDate) : utcDate;
  return toZonedTime(utc, timezone);
};

/**
 * Formats a UTC date for display in a specific timezone
 */
export const formatInTimezone = (
  utcDate: Date | string,
  formatString: string = 'PPp',
  timezone: string = DEFAULT_TIMEZONE
): string => {
  const localDate = utcToLocal(utcDate, timezone);
  return format(localDate, formatString);
};

/**
 * Gets the current browser timezone
 */
export const getBrowserTimezone = (): string => {
  return Intl.DateTimeFormat().resolvedOptions().timeZone;
};

/**
 * Checks if a date falls within business hours for a timezone
 */
export const isBusinessHours = (
  date: Date | string,
  timezone: string = DEFAULT_TIMEZONE,
  startHour: number = 8,
  endHour: number = 18
): boolean => {
  const localDate = utcToLocal(date, timezone);
  const hour = localDate.getHours();
  return hour >= startHour && hour < endHour;
};

/**
 * Creates a date object for a specific time in a timezone
 */
export const createDateInTimezone = (
  year: number,
  month: number,
  day: number,
  hour: number,
  minute: number,
  timezone: string = DEFAULT_TIMEZONE
): Date => {
  const localDate = new Date(year, month, day, hour, minute);
  return localToUtc(localDate, timezone);
};

/**
 * Validates that an appointment time is appropriate for the timezone
 */
export const validateAppointmentTime = (
  startTime: Date | string,
  endTime: Date | string,
  timezone: string = DEFAULT_TIMEZONE
): { isValid: boolean; errors: string[] } => {
  const errors: string[] = [];
  
  const start = utcToLocal(startTime, timezone);
  const end = utcToLocal(endTime, timezone);
  
  // Check if it's during reasonable hours (6 AM to 10 PM)
  if (start.getHours() < 6 || start.getHours() > 22) {
    errors.push('Appointment is scheduled outside normal business hours');
  }
  
  // Check if it's not on a weekend (optional, configurable)
  const dayOfWeek = start.getDay();
  if (dayOfWeek === 0 || dayOfWeek === 6) {
    // Note: This could be configurable per practice
    // errors.push('Appointment is scheduled on a weekend');
  }
  
  // Check minimum duration (15 minutes)
  const durationMinutes = (end.getTime() - start.getTime()) / (1000 * 60);
  if (durationMinutes < 15) {
    errors.push('Appointment duration must be at least 15 minutes');
  }
  
  // Check maximum duration (8 hours)
  if (durationMinutes > 480) {
    errors.push('Appointment duration cannot exceed 8 hours');
  }
  
  return {
    isValid: errors.length === 0,
    errors
  };
};