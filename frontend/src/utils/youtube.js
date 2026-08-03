/**
 * Extracts the YouTube Video ID from various YouTube URL formats.
 * Supports:
 * - https://youtu.be/VIDEO_ID
 * - https://www.youtube.com/watch?v=VIDEO_ID
 * - https://youtube.com/watch?v=VIDEO_ID
 * - https://www.youtube.com/embed/VIDEO_ID
 *
 * @param {string} url The original YouTube URL
 * @returns {string|null} The 11-character video ID, or null if invalid
 */
export const getYoutubeVideoId = (url) => {
  if (!url) return null;
  const regExp = /^.*(youtu\.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
  const match = url.match(regExp);
  return (match && match[2].length === 11) ? match[2] : null;
};

/**
 * Converts any standard YouTube URL into a proper embed URL.
 *
 * @param {string} url The original YouTube URL
 * @returns {string|null} The embed URL, or null if invalid
 */
export const getYoutubeEmbedUrl = (url) => {
  const videoId = getYoutubeVideoId(url);
  if (!videoId) return null;
  return `https://www.youtube.com/embed/${videoId}`;
};
