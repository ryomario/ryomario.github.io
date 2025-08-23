import { Locale } from "@/i18n/routing"

export function date2string(date?: Date | number | string, showTime = true) {
  if (!date) date = Date.now()
  if (!(date instanceof Date)) date = new Date(date)

  const year = date.getFullYear()
  const month = date.getMonth() + 1
  const date_of_month = date.getDate()

  const hour = date.getHours()
  const minute = date.getMinutes()
  const second = date.getSeconds()

  return `${[year, month, date_of_month].map(n => String(n).padStart(2, '0')).join('-')
    } ${showTime ? [hour, minute, second].map(n => String(n).padStart(2, '0')).join(':') : ''
    }`.trim()
}

export function date2localeString(date?: Date | number | string, showTime = false, locale: Locale = 'en') {
  if (!date) date = Date.now()
  if (!(date instanceof Date)) date = new Date(date)

  const dateLocale = locale == 'en' ? 'en-US' : 'id-ID'

  return date.toLocaleDateString(dateLocale, {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    ...(showTime && {
      hour: 'numeric',
      minute: 'numeric',
    })
  })
}

export function getMonthName(monthIndex: number, shortName = false, locale: Locale = 'en'): string {
  monthIndex = Number(monthIndex);
  if (Number.isNaN(monthIndex)) return '';

  const date = new Date();
  date.setMonth(monthIndex);

  const dateLocale = locale == 'en' ? 'en-US' : 'id-ID'

  return date.toLocaleString(dateLocale, { month: shortName ? 'short' : 'long' });
}

export function getAllMonthsName(shortName = false, locale: Locale = 'en') {
  return Array.from({ length: 12 }, (_, i) => getMonthName(i, shortName, locale));
}

export interface MonthYearElapsed {
  years: number;
  months: number;
  totalMonths: number;
}

/**
 * Calculates time elapsed between two month-year dates (January = 0)
 * @param startMonth 0-11 (January = 0)
 * @param startYear Full year (e.g., 2023)
 * @param endMonth 0-11 (January = 0)
 * @param endYear Full year (e.g., 2025)
 * @returns Object with years, months, and total months elapsed
 */
export function monthYearElapsed(
  startMonth: number,
  startYear: number,
  endMonth?: number | null,
  endYear?: number | null
): MonthYearElapsed {
  if (typeof endMonth !== 'number') endMonth = new Date().getMonth();
  if (typeof endYear !== 'number') endYear = new Date().getFullYear();
  // Validate inputs
  if (startMonth < 0 || startMonth > 11 || endMonth < 0 || endMonth > 11) {
    throw new Error('Months must be between 0 and 11');
  }

  if (startYear > endYear || (startYear === endYear && startMonth > endMonth)) {
    throw new Error('Start date must be before end date');
  }

  // Calculate total months difference
  const totalMonths = (endYear - startYear) * 12 + (endMonth - startMonth) + 1; // round up

  // Convert to years and remaining months
  const years = Math.floor(totalMonths / 12);
  const months = totalMonths % 12;

  return {
    years,
    months,
    totalMonths
  };
}

export function monthYearElapsedHuman(
  startMonth: number,
  startYear: number,
  endMonth?: number | null,
  endYear?: number | null
): string {
  const elapsed = monthYearElapsed(startMonth, startYear, endMonth, endYear);

  const parts = [];
  if (elapsed.years > 0) {
    parts.push(`${elapsed.years} year${elapsed.years !== 1 ? 's' : ''}`);
  }
  if (elapsed.months > 0) {
    parts.push(`${elapsed.months} month${elapsed.months !== 1 ? 's' : ''}`);
  }

  return parts.join(' and ') || '0 months';
}

export function isDatePassed(date: Date | string | number, atDate?: Date | string | number): boolean {
  const targetDate = new Date(date);
  const currentDate = new Date(atDate ?? Date.now());

  return targetDate < currentDate;
}