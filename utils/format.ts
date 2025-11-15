/**
 * Formats bytes into a human-readable size string (e.g., "1.23 MB")
 * @param bytes - The number of bytes to format
 * @returns Formatted string like "1.23 MB" or "N/A" if bytes is undefined/null/0
 */
export const formatSize = (bytes?: number): string => {
  if (!bytes) {
    return 'N/A';
  }
  const mb = bytes / (1024 * 1024);
  return `${mb.toFixed(2)} MB`;
};
