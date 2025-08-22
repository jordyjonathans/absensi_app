export function getDateTime(isoString: string): string {
  if (!isoString) return '';
  const date = new Date(isoString);

  const gmt7Time = new Date(date.getTime() + 7 * 60 * 60 * 1000);

  const year = gmt7Time.getFullYear();
  const month = String(gmt7Time.getMonth() + 1).padStart(2, '0'); // months are 0-indexed
  const day = String(gmt7Time.getDate()).padStart(2, '0');
  const hours = String(gmt7Time.getHours()).padStart(2, '0');
  const minutes = String(gmt7Time.getMinutes()).padStart(2, '0');

  return `${year}-${month}-${day} ${hours}:${minutes}`;
}
