export function extractDomain(url: string) {
  try {
    const domain = new URL(url).hostname;
    return domain;
  } catch (error) {
    if (error instanceof Error) console.error('Invalid URL:', error.message);
    return null;
  }
}
