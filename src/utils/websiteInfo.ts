interface WebsiteInfo {
  name: string;
  logo: string;
  domain: string;
}

const websiteData: Record<string, WebsiteInfo> = {
  'youtube.com': {
    name: 'YouTube',
    logo: 'https://www.google.com/s2/favicons?domain=youtube.com&sz=64',
    domain: 'youtube.com'
  },
  'facebook.com': {
    name: 'Facebook',
    logo: 'https://www.google.com/s2/favicons?domain=facebook.com&sz=64',
    domain: 'facebook.com'
  },
  'twitter.com': {
    name: 'Twitter',
    logo: 'https://www.google.com/s2/favicons?domain=twitter.com&sz=64',
    domain: 'twitter.com'
  },
  'instagram.com': {
    name: 'Instagram',
    logo: 'https://www.google.com/s2/favicons?domain=instagram.com&sz=64',
    domain: 'instagram.com'
  },
  'linkedin.com': {
    name: 'LinkedIn',
    logo: 'https://www.google.com/s2/favicons?domain=linkedin.com&sz=64',
    domain: 'linkedin.com'
  },
  'github.com': {
    name: 'GitHub',
    logo: 'https://www.google.com/s2/favicons?domain=github.com&sz=64',
    domain: 'github.com'
  },
  'google.com': {
    name: 'Google',
    logo: 'https://www.google.com/s2/favicons?domain=google.com&sz=64',
    domain: 'google.com'
  },
  'ulm.edu': {
    name: 'ULM',
    logo: 'https://www.google.com/s2/favicons?domain=ulm.edu&sz=64',
    domain: 'ulm.edu'
  },
  'portal.ulm.edu': {
    name: 'ULM Portal',
    logo: 'https://www.google.com/s2/favicons?domain=ulm.edu&sz=64',
    domain: 'portal.ulm.edu'
  },
  'catalog.ulm.edu': {
    name: 'ULM Catalog',
    logo: 'https://www.google.com/s2/favicons?domain=ulm.edu&sz=64',
    domain: 'catalog.ulm.edu'
  }
};

export function getWebsiteInfo(url: string): WebsiteInfo | null {
  try {
    // Remove protocol and www if present
    const domain = url.replace(/^(https?:\/\/)?(www\.)?/, '').split('/')[0].toLowerCase();
    
    // Find matching website info
    for (const [key, value] of Object.entries(websiteData)) {
      if (domain.includes(key)) {
        return value;
      }
    }
    return null;
  } catch {
    return null;
  }
}

export function formatMessageText(text: string): string {
  // Regular expression to find URLs
  const urlRegex = /(https?:\/\/[^\s]+)/g;
  
  return text.replace(urlRegex, (url) => {
    const websiteInfo = getWebsiteInfo(url);
    return websiteInfo ? websiteInfo.name : url;
  });
}

export { websiteData };
export type { WebsiteInfo }; 