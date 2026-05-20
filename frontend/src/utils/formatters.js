/**
 * Formats a date string to a human-readable representation.
 * @param {string|Date} date - The date to format.
 * @returns {string} The formatted date string.
 */
export const formatDate = (date) => {
  if (!date) return '';
  const d = new Date(date);
  return d.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });
};

/**
 * Truncates a string to a specified length and appends an ellipsis.
 * @param {string} str - The string to truncate.
 * @param {number} num - The maximum length.
 * @returns {string} The truncated string.
 */
export const truncateText = (str, num = 100) => {
  if (!str) return '';
  if (str.length <= num) return str;
  return str.slice(0, num) + '...';
};
