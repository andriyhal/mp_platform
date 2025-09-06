/**
 * Utility functions for date formatting
 */

/**
 * Formats a date string to US format (MM/DD/YYYY, h:mm AM/PM)
 * @param dateString - ISO date string or any valid date string
 * @returns Formatted date string in US format
 */
export function formatToUSDateTime(dateString: string): string {
  try {
    const date = new Date(dateString);
    
    // Check if date is valid
    if (isNaN(date.getTime())) {
      return dateString; // Return original if invalid
    }
    
    // Format to US locale with date and time
    return date.toLocaleString('en-US', {
      month: '2-digit',
      day: '2-digit', 
      year: 'numeric',
      hour: 'numeric',
      minute: '2-digit',
      hour12: true
    });
  } catch (error) {
    console.error('Error formatting date:', error);
    return dateString; // Return original on error
  }
}

/**
 * Formats a date string to US date format only (MM/DD/YYYY)
 * @param dateString - ISO date string or any valid date string
 * @returns Formatted date string in US format
 */
export function formatToUSDate(dateString: string): string {
  try {
    const date = new Date(dateString);
    
    // Check if date is valid
    if (isNaN(date.getTime())) {
      return dateString; // Return original if invalid
    }
    
    // Format to US locale with date only
    return date.toLocaleDateString('en-US', {
      month: '2-digit',
      day: '2-digit',
      year: 'numeric'
    });
  } catch (error) {
    console.error('Error formatting date:', error);
    return dateString; // Return original on error
  }
}
