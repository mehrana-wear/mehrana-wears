/**
 * Helper to get Google Account Profile Picture
 * Uses official Google avatar services / unavatar Google endpoint with Google Material fallback
 */
export function getGoogleAvatarUrl(email: string = 'farukarim@gmail.com', name: string = 'Faruk Karim'): string {
  const cleanEmail = email.trim().toLowerCase();
  const cleanName = name.trim() || 'User';

  // Primary: Google profile lookup via unavatar with Google Material initial fallback
  const fallbackUrl = `https://ui-avatars.com/api/?name=${encodeURIComponent(cleanName)}&background=1a73e8&color=ffffff&bold=true&size=256&font-size=0.45`;
  
  if (cleanEmail.includes('gmail.com') || cleanEmail.includes('google')) {
    return `https://unavatar.io/google/${encodeURIComponent(cleanEmail)}?fallback=${encodeURIComponent(fallbackUrl)}`;
  }

  return `https://ui-avatars.com/api/?name=${encodeURIComponent(cleanName)}&background=354024&color=fdfbf7&bold=true&size=256`;
}
