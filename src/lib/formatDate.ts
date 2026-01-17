/**
 * Formats an ISO date string into a readable format like "5 Jan 2021"
 * @param dateString - ISO date string (e.g., "1990-05-15T00:00:00.000Z")
 * @returns Formatted date string (e.g., "15 May 1990")
 */
export function formatDate(dateString: string): string {
  if (!dateString) return '';

  const date = new Date(dateString);

  // Check if date is valid
  if (isNaN(date.getTime())) return dateString;

  const day = date.getDate();
  const month = date.toLocaleString('en-US', { month: 'short' });
  const year = date.getFullYear();

  return `${day} ${month} ${year}`;
}

/**
 * Formats an ISO date string for display in forms (YYYY-MM-DD)
 * @param dateString - ISO date string
 * @returns Date string in YYYY-MM-DD format
 */
export function formatDateForInput(dateString: string): string {
  if (!dateString) return '';

  const date = new Date(dateString);

  if (isNaN(date.getTime())) return '';

  return date.toISOString().split('T')[0];
}

/**
 * Formats an ISO date string into DD/MM/YYYY format
 * @param dateString - ISO date string (e.g., "2025-11-18T00:00:00.000Z")
 * @returns Formatted date string (e.g., "18/11/2025")
 */
export function formatDateDDMMYYYY(dateString: string): string {
  if (!dateString) return '';

  const date = new Date(dateString);

  // Check if date is valid
  if (isNaN(date.getTime())) return dateString;

  const day = String(date.getDate()).padStart(2, '0');
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const year = date.getFullYear();

  return `${day}/${month}/${year}`;
}
