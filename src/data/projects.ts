export type Project = {
  title: string
  description: string
  tag: string
  url?: string
}

// Placeholder set — swap in real projects as they're ready. Each card just
// needs title/description/tag/url, so adding one is a one-line push here.
export const PROJECTS: Project[] = [
  {
    title: 'Salesforce Real Field Tracker',
    description:
      'An installable Salesforce package (LWC) that shows everything touching a field before you change it — automations, actions, and downstream async jobs.',
    tag: 'Salesforce',
  },
  {
    title: 'BatpodLabs',
    description:
      'This site — React, Three.js, and an AI-assisted build pipeline, built in the open.',
    tag: 'Web / 3D',
    url: 'https://batpodlabs.vercel.app',
  },
  {
    title: 'The Batpod',
    description:
      'Ride logs, routes, and motovlog content for the bike this whole brand is named after.',
    tag: 'Motovlog',
  },
]
