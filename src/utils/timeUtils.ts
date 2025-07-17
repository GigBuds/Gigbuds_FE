/**
 * Converts a unix timestamp to a formatted date string
 * @param timestamp - Unix timestamp in milliseconds
 * @returns Formatted string like "25/12/2023 - 2:30 PM"
 */
export function formatRelativeTime(timestamp: number): string {
  const date = new Date(timestamp);
  
  const day = date.getDate().toString().padStart(2, '0');
  const month = (date.getMonth() + 1).toString().padStart(2, '0'); // getMonth() is 0-indexed
  const year = date.getFullYear();
  
  const hours24 = date.getHours();
  const minutes = date.getMinutes().toString().padStart(2, '0');
  
  // Convert to 12-hour format
  const hours12 = hours24 === 0 ? 12 : hours24 > 12 ? hours24 - 12 : hours24;
  const ampm = hours24 >= 12 ? 'PM' : 'AM';
  
  return `${day}/${month}/${year} - ${hours12}:${minutes} ${ampm}`;
} 