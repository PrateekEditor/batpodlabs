export const CONTACT_LINKS: { label: string; url: string }[] = [
  { label: 'LinkedIn', url: 'https://www.linkedin.com/in/prateekpatel-sfdc' },
  { label: 'GitHub', url: 'https://github.com/PrateekEditor' },
  // TODO(Prateek): drop in your real Trailhead profile URL — placeholder for now.
  { label: 'Trailhead', url: 'https://www.salesforce.com/trailblazer/' },
]

export type SocialKey = 'youtube' | 'instagram' | 'x' | 'reddit' | 'facebook' | 'email'

// Stakyn Labs — the tech channel's socials.
export const STAKYN_EMAIL = 'stakynlabs@gmail.com'
export const STAKYN_LINKS: { key: SocialKey; label: string; url: string }[] = [
  { key: 'youtube', label: 'YouTube', url: 'https://www.youtube.com/channel/UCb2ifEZkYKstOgIKU0pYsXA' },
  { key: 'instagram', label: 'Instagram', url: 'https://www.instagram.com/stakynlabs/' },
  { key: 'x', label: 'X', url: 'https://x.com/stakynlabs' },
  { key: 'reddit', label: 'Reddit', url: 'https://www.reddit.com/user/NightShiftLabsIn/' },
  { key: 'facebook', label: 'Facebook', url: 'https://www.facebook.com/profile.php?id=61595410024901' },
  { key: 'email', label: 'Email', url: `mailto:${STAKYN_EMAIL}` },
]
