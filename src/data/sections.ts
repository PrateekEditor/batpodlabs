export type Step = {
  title: string
  body: string
}

export type SectionDef = {
  id: 'coder' | 'biker' | 'ecommerce' | 'about'
  label: string
  accent: string
  steps: Step[]
}

export const SECTIONS: SectionDef[] = [
  {
    id: 'coder',
    label: 'Coder',
    accent: '#55ac9f',
    steps: [
      {
        title: 'Salesforce, mostly',
        body: 'Placeholder copy — Salesforce development is the day job: LWCs, Apex, and the odd late-night deployment.',
      },
      {
        title: 'Real Field Tracker',
        body: 'Placeholder copy — an installable package that shows everything touching a field before you break it. First real project to feature here.',
      },
      {
        title: 'This very site',
        body: 'Placeholder copy — BatpodLabs itself: React, Three.js, and an AI pipeline building most of it. Meta, but honest.',
      },
    ],
  },
  {
    id: 'biker',
    label: 'Biker',
    accent: '#d67f74',
    steps: [
      {
        title: 'Meet the Batpod',
        body: 'Placeholder copy — the bike this whole brand is named after. Photos and specs land here.',
      },
      {
        title: 'Routes and rides',
        body: 'Placeholder copy — ride logs, favorite routes, and the odd breakdown story.',
      },
      {
        title: 'The motovlog',
        body: 'Placeholder copy — video content once the social side of the Batpod project gets going.',
      },
    ],
  },
  {
    id: 'ecommerce',
    label: 'E-Commerce',
    accent: '#d6c23d',
    steps: [
      {
        title: 'Coming later',
        body: 'Placeholder copy — merch, gear, or whatever comes out of the builder side of things. Nothing for sale yet.',
      },
      {
        title: 'Built with checkout in mind',
        body: 'Placeholder copy — SEO, payment-form security, and schema markup are already parked as tickets for when this goes live.',
      },
      {
        title: "You'll know when it's real",
        body: "Placeholder copy — this section stays quiet until there's an actual product behind it.",
      },
    ],
  },
  {
    id: 'about',
    label: 'About Me',
    accent: '#9186d9',
    steps: [
      {
        title: "Hi, I'm Prateek",
        body: 'Placeholder copy — coder, biker, AI enthusiast. Real bio lands once Fix Things settles the language across profiles.',
      },
      {
        title: 'What BatpodLabs is',
        body: 'Placeholder copy — a portfolio, a motovlog, and eventually a small shop, all under one name.',
      },
      {
        title: 'Get in touch',
        body: 'Placeholder copy — contact details and links go here.',
      },
    ],
  },
]
