export function removeTrailingSlash(url: string): string {
  if(!url || !url.trim()) return '';
  if(url.trim().endsWith('/')) {
    return `${url.trim().split('/').slice(0, -1).filter(Boolean).join('/')}`;
  }
  return url;
}