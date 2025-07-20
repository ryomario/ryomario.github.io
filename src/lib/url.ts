export function removeTrailingSlash(url: string): string {
  if(!url || !url.trim()) return '';
  if(url.trim().endsWith('/')) {
    return `${url.trim().split('/').slice(0, -1).filter(Boolean).join('/')}`;
  }
  return url;
}

export function isValidURL(
  urlString: string,
  options?: {
    requireProtocol?: boolean;
    requireValidTLD?: boolean;
  }
): boolean {
  try {
    const url = new URL(urlString);

    if (options?.requireProtocol && url.protocol) return false;

    if (options?.requireValidTLD) {
      // Simple TLD check - for more robust validation, use a library
      const tld = url.hostname.split('.').pop();
      if (!tld || tld.length < 2) return false;
    }

    return true;
  } catch (error) {
    return false;
  }
}