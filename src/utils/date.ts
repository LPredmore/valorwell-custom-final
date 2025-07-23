/**
 * Date utility functions for ValorWell
 * Handles timezone conversions and formatting according to SRS requirements
 */

import { format, parseISO } from 'date-fns';
import { toZonedTime, fromZonedTime, formatInTimeZone } from 'date-fns-tz';

/**
 * Get the browser's timezone using Intl API
 */
export const getBrowserTimezone = (): string => {
  return Intl.DateTimeFormat().resolvedOptions().timeZone;
};

/**
 * Convert UTC date string to browser timezone
 * @param utcDateString - ISO string in UTC
 * @returns Date object in browser timezone
 */
export const utcToBrowserTime = (utcDateString: string): Date => {
  const browserTimezone = getBrowserTimezone();
  return toZonedTime(parseISO(utcDateString), browserTimezone);
};

/**
 * Convert local date to UTC for storage in Supabase
 * @param localDate - Date object in local timezone
 * @param timezone - IANA timezone identifier (optional, defaults to browser timezone)
 * @returns Date object in UTC
 */
export const localToUtc = (localDate: Date, timezone?: string): Date => {
  const tz = timezone || getBrowserTimezone();
  return fromZonedTime(localDate, tz);
};

/**
 * Format date in specific timezone
 * @param date - Date object or ISO string
 * @param formatStr - date-fns format string
 * @param timezone - IANA timezone identifier (optional, defaults to browser timezone)
 * @returns Formatted date string
 */
export const formatInTimezone = (
  date: Date | string,
  formatStr: string = 'PPp',
  timezone?: string
): string => {
  const tz = timezone || getBrowserTimezone();
  const dateObj = typeof date === 'string' ? parseISO(date) : date;
  return formatInTimeZone(dateObj, tz, formatStr);
};

/**
 * Get timezone abbreviation (e.g., EST, PST)
 * @param timezone - IANA timezone identifier (optional, defaults to browser timezone)
 * @returns Timezone abbreviation
 */
export const getTimezoneAbbreviation = (timezone?: string): string => {
  const tz = timezone || getBrowserTimezone();
  const now = new Date();
  
  try {
    const formatter = new Intl.DateTimeFormat('en-US', {
      timeZone: tz,
      timeZoneName: 'short'
    });
    
    const parts = formatter.formatToParts(now);
    const timeZonePart = parts.find(part => part.type === 'timeZoneName');
    return timeZonePart?.value || tz;
  } catch {
    return tz;
  }
};

/**
 * Get timezone offset string (e.g., "-05:00", "+08:00")
 * @param timezone - IANA timezone identifier (optional, defaults to browser timezone)
 * @returns Timezone offset string
 */
export const getTimezoneOffset = (timezone?: string): string => {
  const tz = timezone || getBrowserTimezone();
  const now = new Date();
  
  try {
    const formatter = new Intl.DateTimeFormat('en-CA', {
      timeZone: tz,
      timeZoneName: 'longOffset'
    });
    
    const parts = formatter.formatToParts(now);
    const offsetPart = parts.find(part => part.type === 'timeZoneName');
    return offsetPart?.value || '+00:00';
  } catch {
    const offset = now.getTimezoneOffset();
    const hours = Math.floor(Math.abs(offset) / 60);
    const minutes = Math.abs(offset) % 60;
    const sign = offset <= 0 ? '+' : '-';
    return `${sign}${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`;
  }
};

/**
 * Common date format patterns for the application
 */
export const DATE_FORMATS = {
  APPOINTMENT_TIME: 'h:mm a', // 9:00 AM
  APPOINTMENT_DATE: 'MMM d, yyyy', // Jul 23, 2025
  APPOINTMENT_DATETIME: 'MMM d, yyyy h:mm a', // Jul 23, 2025 9:00 AM
  ISO_DATE: 'yyyy-MM-dd', // 2025-07-23
  ISO_DATETIME: "yyyy-MM-dd'T'HH:mm:ss", // 2025-07-23T09:00:00
} as const;

/**
 * Validate if a string is a valid IANA timezone
 * @param timezone - Timezone string to validate
 * @returns boolean indicating if timezone is valid
 */
export const isValidTimezone = (timezone: string): boolean => {
  try {
    Intl.DateTimeFormat(undefined, { timeZone: timezone });
    return true;
  } catch {
    return false;
  }
};

/**
 * Get popular timezone options for dropdowns
 */
export const COMMON_TIMEZONES = [
  { value: 'America/New_York', label: 'Eastern Time (ET)' },
  { value: 'America/Chicago', label: 'Central Time (CT)' },
  { value: 'America/Denver', label: 'Mountain Time (MT)' },
  { value: 'America/Los_Angeles', label: 'Pacific Time (PT)' },
  { value: 'America/Anchorage', label: 'Alaska Time (AT)' },
  { value: 'Pacific/Honolulu', label: 'Hawaii Time (HT)' },
  { value: 'UTC', label: 'UTC' },
] as const;