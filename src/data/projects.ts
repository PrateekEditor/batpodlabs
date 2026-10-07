/** Projects shown on the home page, and the content of their setup pages. */

export type Tone = 'live' | 'service' | 'soon'

export type Project = {
  slug: string
  /** where the card goes */
  to: string
  name: string
  tagline: string
  blurb: string
  status: { label: string; tone: Tone }
  tags: string[]
  cta: string
  icon: 'xray' | 'pipeline' | 'cube'
}

export type Step = { title: string; body: string; code?: string }

export type ProjectPageData = {
  eyebrow: string
  overview: string
  highlights: { title: string; body: string }[]
  stepsTitle: string
  stepsIntro?: string
  steps: Step[]
  /** an honest list of what it can't do yet */
  limitsTitle?: string
  limits?: string[]
  repo?: string
  ctaText: string
}

export const PROJECTS: Project[] = [
  {
    slug: 'orgxray',
    to: '/projects/orgxray',
    name: 'OrgXRay',
    tagline: 'See inside your Salesforce org before you hit Save.',
    blurb:
      'Pick an object and the fields you care about, describe a change, and see which automations fire, in what order, and which of them write your field.',
    status: { label: 'Phase 1 · built', tone: 'live' },
    tags: ['Apex', 'LWC', 'Read-only', 'Runs inside your org'],
    cta: 'Set it up yourself',
    icon: 'xray',
  },
  {
    slug: 'pipeline',
    to: '/pipeline',
    name: 'Auto-debugger pipeline',
    tagline: 'Tickets in, fixes out.',
    blurb:
      'Claude connected to your org and your tracker. It picks up tickets, finds the cause, drafts the fix and keeps the ticket updated, with a person approving every change.',
    status: { label: 'Done for your org', tone: 'service' },
    tags: ['Claude', 'Flows & Apex', 'Ticket tracker', 'Human approval'],
    cta: 'See how it works',
    icon: 'pipeline',
  },
  {
    slug: '3d-printing',
    to: '/projects/3d-printing',
    name: '3D printing',
    tagline: 'Creative designs, printed in colour.',
    blurb: 'A small workshop for multi-colour 3D prints of original designs, to be sold online. The next thing I’m building.',
    status: { label: 'Coming soon', tone: 'soon' },
    tags: ['Original designs', 'Multi-colour', 'Online shop'],
    cta: 'Follow along',
    icon: 'cube',
  },
]

export const PROJECT_PAGES: Record<string, ProjectPageData> = {
  orgxray: {
    eyebrow: 'Project · OrgXRay',
    overview:
      'You change one field on one object, and something somewhere overwrites it. Was it a before-save flow? A trigger three classes deep? In a mature org, finding out means opening Setup in six tabs and reading code by hand. OrgXRay answers it on one screen: it lays out the Salesforce order of execution for your change, with every automation in its place, and tells you which ones write your fields.',
    highlights: [
      { title: 'Runs entirely in your org', body: 'No callouts, no Named Credential, no external service. Nothing leaves your tenant.' },
      { title: 'Zero configuration', body: 'Deploy, assign one permission set, open the app. No Trusted Sites or Tooling API setup.' },
      { title: 'Finds field writers', body: 'Static analysis of your Apex shows which class or trigger assigns which field.' },
      { title: 'Read-only by design', body: 'Phase 1 never inserts, updates or deletes a record of the object you’re checking.' },
      { title: 'Honest about its gaps', body: 'Anything it can’t see is listed on screen, never silently skipped.' },
      { title: 'Maps the whole org', body: 'Objects, fields, relationships, triggers, record-triggered flows and duplicate rules, in an index you can rebuild any time.' },
    ],
    stepsTitle: 'Set it up yourself',
    stepsIntro: 'You need the Salesforce CLI and a sandbox, scratch org or Developer Edition org. Don’t deploy it to production in Phase 1.',
    steps: [
      { title: 'Get the code', body: 'Clone the repository.', code: 'git clone https://github.com/PrateekEditor/OrgXray.git\ncd OrgXray' },
      { title: 'Log in to your org', body: 'Use a sandbox, scratch org or Developer Edition org.', code: 'sf org login web --alias orgxray' },
      { title: 'Deploy', body: 'Push the app, classes and components to the org.', code: 'sf project deploy start --source-dir force-app --target-org orgxray' },
      {
        title: 'Assign the permission set',
        body: 'It grants access to OrgXRay’s own objects, controller and app, and nothing wider. Without Author Apex access, field-write detection from Apex is unavailable, and the app tells you so.',
        code: 'sf org assign permset --name FieldFlow_Developer --target-org orgxray',
      },
      { title: 'Open it and build the org map', body: 'Open the org, then App Launcher → OrgXRay → Build org map. It builds in chained batch jobs, and you can navigate away while it runs.', code: 'sf org open --target-org orgxray' },
      { title: 'Build a change, run the preview', body: 'Choose Insert, Update or Delete, pick an object, tick the fields to track and fill the grid. Run the preview to see the order of execution, sorted into what writes your fields, what fires without writing them, and what can’t be determined yet.' },
    ],
    limitsTitle: 'What Phase 1 can’t see',
    limits: [
      'Validation rules and workflow rules (not available to standard SOQL).',
      'Which fields a Flow assigns. It confirms a flow fires and when, not what it sets.',
      'The Apex call graph. A writer reached through several layers is reported as undecided.',
      'Managed package automations (only the default namespace is scanned).',
      'Assignment, auto-response and escalation rules.',
    ],
    repo: 'https://github.com/PrateekEditor/OrgXray',
    ctaText: 'Want it on your org, or want to know what Phase 2 brings? Get in touch.',
  },
  '3d-printing': {
    eyebrow: 'Project · 3D printing',
    overview:
      'The next thing I’m building: a small workshop that prints creative designs in multiple colours and sells them online. It’s at the planning stage, so there’s nothing to set up yet.',
    highlights: [
      { title: 'Original designs', body: 'Creative pieces designed in-house, not catalogue prints.' },
      { title: 'Multi-colour printing', body: 'Prints in several colours at once, so designs come out finished rather than needing paint.' },
      { title: 'Sold online', body: 'A small online shop, once the workshop is up and running.' },
    ],
    stepsTitle: 'Where it stands',
    stepsIntro: 'Honest status, updated as it moves.',
    steps: [
      { title: 'Choosing the printer', body: 'Looking at multi-colour printers and what the workshop needs.' },
      { title: 'Designing the first range', body: 'Sketching the first set of original designs to print.' },
      { title: 'Opening the shop', body: 'Putting the first prints online. This page will turn into the shop link.' },
    ],
    ctaText: 'Got something you’d want printed, or want to hear when the shop opens? Get in touch.',
  },
}

/** The setup steps for the auto-debugger, shown on /pipeline. */
export const PIPELINE_SETUP: Step[] = [
  { title: 'Tell me about your org and tracker', body: 'Which Salesforce orgs you have, and where your tickets live.' },
  { title: 'Connect read-only first', body: 'PP starts in a sandbox, reading metadata and tickets. Nothing changes yet.' },
  { title: 'Agree the approval rules', body: 'We decide what runs on its own (reads, analysis) and what always waits for a person (deploys).' },
  { title: 'Run it on real tickets', body: 'Tickets are worked end to end in the sandbox, with every step written back to the ticket.' },
  { title: 'Monitor from your tracker', body: 'Once you trust it, you watch the tracker. I keep it tuned and maintained.' },
]
