export function formatDateTime(value: string): string {
  return new Intl.DateTimeFormat('es-CO', {
    dateStyle: 'medium',
    timeStyle: 'short',
    timeZone: 'America/Bogota',
  }).format(new Date(value));
}

export function formatFileSize(bytes: number): string {
  if (bytes === 0) {
    return '0 B';
  }

  const units = ['B', 'KB', 'MB', 'GB'];
  const exponent = Math.min(Math.floor(Math.log(bytes) / Math.log(1024)), units.length - 1);
  const value = bytes / 1024 ** exponent;

  return `${value.toFixed(value >= 10 || exponent === 0 ? 0 : 1)} ${units[exponent]}`;
}

export function truncateMiddle(value: string, maxLength = 42): string {
  if (value.length <= maxLength) {
    return value;
  }

  const sideLength = Math.floor((maxLength - 3) / 2);
  return `${value.slice(0, sideLength)}...${value.slice(-sideLength)}`;
}
