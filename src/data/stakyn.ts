/**
 * Stakyn Labs posts shown on /stakyn. Generated from the Stakyn Labs Video
 * Board (posted videos only). Each post gets its own page at /stakyn/<slug>
 * with the repo link and setup steps. To add one, copy an entry.
 */
export type StakynCategory = 'security' | 'terminal' | 'webdev' | 'ai'

export const STAKYN_CATEGORIES: { id: StakynCategory; label: string; blurb: string }[] = [
  { id: 'ai', label: 'AI & Claude Code', blurb: 'Skills, plugins and local AI apps.' },
  { id: 'terminal', label: 'Terminal & CLI', blurb: 'Small tools that fix daily dev pain.' },
  { id: 'webdev', label: 'Web dev', blurb: 'Ship, share and demo your work.' },
  { id: 'security', label: 'Security', blurb: 'Leaks, patches and what to do today.' },
]

export const STAKYN_SERIES: { name: string; blurb: string }[] = [
  { name: 'Steal This Repo', blurb: '30 days, 30 free open-source repos that save you hours.' },
  { name: 'Ask Stakyn', blurb: 'A real dev problem, fixed with one free tool.' },
  { name: 'Patch Notes', blurb: 'Weekly: what broke in tech and what to do about it.' },
  { name: 'Layer Lab', blurb: '3D printing tips, fails and fixes from the Bambu A1.' },
]

export type StakynPost = {
  slug: string
  series: string
  episode: string
  category: StakynCategory
  name: string
  title: string
  tagline: string
  hook: string
  facts: string[]
  repo: string
  links: { label: string; url: string }[]
  steps: string[]
  tips: string[]
  keywords: string[]
  postedOn: string
  /** the word people comment to get the DM */
  keyword: string
  live: { platform: string; url: string }[]
}

export const STAKYN_INTRO = {
  "hook": "I spent three hours on a bug. She fixed it in ten seconds.",
  "live": [
    {
      "platform": "Facebook",
      "url": "https://www.facebook.com/reel/4654959008066054/"
    },
    {
      "platform": "Instagram",
      "url": "https://www.instagram.com/reel/DfPlYwoATQi/"
    },
    {
      "platform": "Threads",
      "url": "https://www.threads.com/@stakynlabs"
    },
    {
      "platform": "X",
      "url": "https://x.com/stakynlabs/status/2117273459592253854"
    },
    {
      "platform": "YouTube",
      "url": "https://www.youtube.com/shorts/yJPmYuvcGv4"
    }
  ]
}

export const STAKYN_POSTS: StakynPost[] = [
  {
    "slug": "gitleaks",
    "series": "Ask Stakyn",
    "episode": "Day 1/30",
    "category": "security",
    "name": "Gitleaks",
    "title": "leaked API key → Gitleaks",
    "tagline": "block leaked keys",
    "hook": "Bro, I just pushed my API key to GitHub!",
    "facts": [
      "Free",
      "MIT",
      "29.6k ⭐",
      "runs before every commit"
    ],
    "repo": "https://github.com/gitleaks/gitleaks",
    "links": [
      {
        "label": "Open on GitHub",
        "url": "https://github.com/gitleaks/gitleaks"
      },
      {
        "label": "Setup steps",
        "url": "https://github.com/gitleaks/gitleaks#pre-commit"
      },
      {
        "label": "Try Betterleaks",
        "url": "https://github.com/betterleaks/betterleaks"
      }
    ],
    "steps": [
      "Rotate the leaked key first",
      "pip install pre-commit",
      "Add the gitleaks hook → pre-commit install"
    ],
    "tips": [
      "Secrets now get blocked before they leave your laptop 🔒"
    ],
    "keywords": [
      "api key leaked",
      "github secrets",
      "gitleaks",
      "pre-commit hook",
      "git security"
    ],
    "postedOn": "2026-11-02",
    "keyword": "LEAK",
    "live": [
      {
        "platform": "YouTube",
        "url": "https://www.youtube.com/shorts/hFpn4ETL-u0"
      },
      {
        "platform": "Instagram",
        "url": "https://www.instagram.com/reel/DfP36WNATfg/"
      },
      {
        "platform": "Facebook",
        "url": "https://www.facebook.com/reel/1466699408898653/"
      },
      {
        "platform": "X",
        "url": "https://x.com/stakynlabs/status/2117648509193297949"
      },
      {
        "platform": "Threads",
        "url": "https://www.threads.com/@stakynlabs/post/DfP3_O6kyKI"
      }
    ]
  },
  {
    "slug": "php2shell",
    "series": "Patch Notes",
    "episode": "Week 45 (update)",
    "category": "security",
    "name": "PHP2Shell",
    "title": "two critical PHP bugs, patch today",
    "tagline": "two critical PHP bugs, patch today",
    "hook": "Bro, fifty thousand PHP hack attempts. Your site still unpatched?",
    "facts": [
      "CVSS 9.2 each",
      "unauthenticated remote code execution",
      "actively exploited"
    ],
    "repo": "https://www.php.net/downloads.php",
    "links": [
      {
        "label": "Download fixed PHP",
        "url": "https://www.php.net/downloads.php"
      }
    ],
    "steps": [
      "Check your version with php -v",
      "Update to 8.5.12, 8.4.27, 8.3.36 or 8.2.35 (or newer)",
      "Restart PHP-FPM / your web server, then check php -v again"
    ],
    "tips": [
      "PHP 5.4 to 7.3 are end of life with no fix: upgrade to a supported version."
    ],
    "keywords": [
      "php2shell",
      "php vulnerability",
      "update php",
      "wordpress security",
      "remote code execution"
    ],
    "postedOn": "2026-11-03",
    "keyword": "",
    "live": [
      {
        "platform": "YouTube",
        "url": "https://www.youtube.com/shorts/FZI_fiwFoEU"
      },
      {
        "platform": "Instagram",
        "url": "https://www.instagram.com/reel/DfRIBxoAsb9/"
      },
      {
        "platform": "Facebook",
        "url": "https://www.facebook.com/reel/2346382056111001/"
      },
      {
        "platform": "X",
        "url": "https://x.com/stakynlabs/status/2117651298623652262"
      },
      {
        "platform": "Threads",
        "url": "https://www.threads.com/@stakynlabs/post/DfSZTNzgWOO"
      }
    ]
  },
  {
    "slug": "npkill",
    "series": "Ask Stakyn",
    "episode": "Day 2/30",
    "category": "terminal",
    "name": "npkill",
    "title": "node_modules ate my disk → npkill",
    "tagline": "delete old node_modules",
    "hook": "Bro, don't delete your photos. Delete node_modules.",
    "facts": [
      "Free",
      "MIT",
      "9.5k ⭐",
      "no install, runs with npx"
    ],
    "repo": "https://github.com/voidcosmos/npkill",
    "links": [
      {
        "label": "Open on GitHub",
        "url": "https://github.com/voidcosmos/npkill"
      },
      {
        "label": "How to use",
        "url": "https://github.com/voidcosmos/npkill#usage"
      }
    ],
    "steps": [
      "Open a terminal in your projects folder",
      "Run: npx npkill",
      "↓ ↑ to move, Space to delete"
    ],
    "tips": [
      "Skip anything marked ⚠, apps still use those."
    ],
    "keywords": [
      "node_modules",
      "disk space full",
      "npkill",
      "npm",
      "free up space"
    ],
    "postedOn": "2026-11-03",
    "keyword": "CLEAN",
    "live": [
      {
        "platform": "YouTube",
        "url": "https://www.youtube.com/shorts/fladMJOXk5g"
      },
      {
        "platform": "Instagram",
        "url": "https://www.instagram.com/reel/DfSPGeLgVsx/"
      },
      {
        "platform": "Facebook",
        "url": "https://www.facebook.com/reel/4418122285065971/"
      },
      {
        "platform": "X",
        "url": "https://x.com/stakynlabs/status/2117667319401042384"
      },
      {
        "platform": "Threads",
        "url": "https://www.threads.com/@stakynlabs/post/DfSPMgPk6lw"
      }
    ]
  },
  {
    "slug": "unslop",
    "series": "Steal This Repo",
    "episode": "Day 1/30",
    "category": "ai",
    "name": "unslop",
    "title": "unslop fixes AI-looking UI",
    "tagline": "fix AI-looking UI",
    "hook": "Bro, your app still screams AI. Here's the free fix.",
    "facts": [
      "Free",
      "CC BY 4.0",
      "5k+ ⭐",
      "Claude Code & Codex"
    ],
    "repo": "https://github.com/heydamir/unslop",
    "links": [
      {
        "label": "Open on GitHub",
        "url": "https://github.com/heydamir/unslop"
      },
      {
        "label": "Install steps",
        "url": "https://github.com/heydamir/unslop#install"
      }
    ],
    "steps": [
      "Copy skills/unslop into ~/.claude/skills",
      "Type: /unslop this page"
    ],
    "tips": [
      "It finds the slop, then redesigns pass by pass ✨"
    ],
    "keywords": [
      "unslop",
      "ai generated ui",
      "vibe coding",
      "claude code skill",
      "ui design"
    ],
    "postedOn": "2026-11-03",
    "keyword": "UNSLOP",
    "live": [
      {
        "platform": "YouTube",
        "url": "https://www.youtube.com/shorts/ykYmN3cfaqc"
      },
      {
        "platform": "Instagram",
        "url": "https://www.instagram.com/reel/DfRJNLqgiJx/"
      },
      {
        "platform": "Facebook",
        "url": "https://www.facebook.com/reel/2557520178058653/"
      },
      {
        "platform": "X",
        "url": "https://x.com/stakynlabs/status/2117651949827047760"
      },
      {
        "platform": "Threads",
        "url": "https://www.threads.com/@stakynlabs/post/DfRJUZWk3SP"
      }
    ]
  },
  {
    "slug": "cloudflare-tunnel",
    "series": "Ask Stakyn",
    "episode": "Day 3/30",
    "category": "webdev",
    "name": "Cloudflare Tunnel",
    "title": "Client wants to see my localhost → Cloudflare Tunnel",
    "tagline": "share your localhost",
    "hook": "Bro, your client can't see localhost? Don't deploy.",
    "facts": [
      "Free",
      "Apache-2.0",
      "16k ⭐",
      "no account needed"
    ],
    "repo": "https://github.com/cloudflare/cloudflared",
    "links": [
      {
        "label": "Open on GitHub",
        "url": "https://github.com/cloudflare/cloudflared"
      },
      {
        "label": "Setup steps",
        "url": "https://github.com/cloudflare/cloudflared#trycloudflare"
      }
    ],
    "steps": [
      "Install it. Mac: brew install cloudflared · Windows: winget install --id Cloudflare.cloudflared",
      "Start your app, then run: cloudflared tunnel --url http://localhost:3000",
      "Send your client the trycloudflare.com link it prints. Done."
    ],
    "tips": [
      "Want to stop? Ctrl+C. If Vite says the host is blocked, add \".trycloudflare.com\" to server.allowedHosts and you're good."
    ],
    "keywords": [
      "share localhost",
      "cloudflare tunnel",
      "localhost public url",
      "ngrok alternative",
      "client demo"
    ],
    "postedOn": "2026-11-04",
    "keyword": "TUNNEL",
    "live": [
      {
        "platform": "YouTube",
        "url": "https://www.youtube.com/shorts/FYCyxXQK9Q0"
      },
      {
        "platform": "Instagram",
        "url": "https://www.instagram.com/reel/DfUmXqqAvHz/"
      },
      {
        "platform": "Facebook",
        "url": "https://www.facebook.com/reel/1130981936241933/"
      },
      {
        "platform": "X",
        "url": "https://x.com/stakynlabs/status/2118058460315341133"
      },
      {
        "platform": "Threads",
        "url": "https://www.threads.com/@stakynlabs/post/DfUmcSziLi1"
      }
    ]
  },
  {
    "slug": "floorplan",
    "series": "Steal This Repo",
    "episode": "Day 2/30",
    "category": "ai",
    "name": "Floorplan",
    "title": "Floorplan maps your AI-built app",
    "tagline": "a map of your codebase",
    "hook": "Bro, don't touch your Claude-built app without this.",
    "facts": [
      "Free repo",
      "MIT",
      "2.4k ⭐",
      "Claude Code & Codex"
    ],
    "repo": "https://github.com/haydenschmitty/floorplan",
    "links": [
      {
        "label": "Open on GitHub",
        "url": "https://github.com/haydenschmitty/floorplan"
      },
      {
        "label": "Setup steps",
        "url": "https://github.com/haydenschmitty/floorplan#install"
      }
    ],
    "steps": [
      "Run: claude plugin marketplace add haydenschmitty/floorplan",
      "Then: claude plugin install floorplan@floorplan",
      "Start a new session and ask: Make me a floorplan of this app 🗺️"
    ],
    "tips": [
      "You'll have your map in a few minutes. It's yours, nothing gets committed."
    ],
    "keywords": [
      "codebase map",
      "vibe coding",
      "claude code plugin",
      "understand your code",
      "floorplan"
    ],
    "postedOn": "2026-11-04",
    "keyword": "MAP",
    "live": [
      {
        "platform": "YouTube",
        "url": "https://www.youtube.com/shorts/FhOHYObF3mk"
      },
      {
        "platform": "Instagram",
        "url": "https://www.instagram.com/reel/DfUlH-SAKb5/"
      },
      {
        "platform": "Facebook",
        "url": "https://www.facebook.com/reel/1159389149981966/"
      },
      {
        "platform": "X",
        "url": "https://x.com/stakynlabs/status/2118058264936247725"
      },
      {
        "platform": "Threads",
        "url": "https://www.threads.com/@stakynlabs/post/DfUlTUWk-EU"
      }
    ]
  },
  {
    "slug": "craft-anything",
    "series": "Steal This Repo",
    "episode": "Day 3/30",
    "category": "ai",
    "name": "Craft Anything",
    "title": "Craft Anything shows how any app is built",
    "tagline": "see how any app is built",
    "hook": "Bro, don't copy your favourite app. Study it first, free.",
    "facts": [
      "Free",
      "MIT / Apache-2.0",
      "3.4k ⭐",
      "top repo on Trendshift"
    ],
    "repo": "https://github.com/storytold/craft-anything",
    "links": [
      {
        "label": "Open on GitHub",
        "url": "https://github.com/storytold/craft-anything"
      },
      {
        "label": "Downloads",
        "url": "https://github.com/storytold/craft-anything#downloads"
      }
    ],
    "steps": [
      "Download the app for your computer (Releases page)",
      "Sign in to Claude Code on that computer",
      "Pick a site you own, say what you want, press Start"
    ],
    "tips": [
      "Only use it on apps you own or may study 🙏"
    ],
    "keywords": [
      "craft anything",
      "how apps are built",
      "claude code",
      "reverse engineering",
      "rust"
    ],
    "postedOn": "2026-11-04",
    "keyword": "CRAFT",
    "live": [
      {
        "platform": "YouTube",
        "url": "https://www.youtube.com/shorts/AhB9SMP8fVI"
      },
      {
        "platform": "Instagram",
        "url": "https://www.instagram.com/reel/DfUmoNAAdr8/"
      },
      {
        "platform": "Facebook",
        "url": "https://www.facebook.com/reel/1134836882816083/"
      },
      {
        "platform": "X",
        "url": "https://x.com/stakynlabs/status/2118058616691507521"
      },
      {
        "platform": "Threads",
        "url": "https://www.threads.com/@stakynlabs/post/DfUmriokvBm"
      }
    ]
  },
  {
    "slug": "lazygit",
    "series": "Ask Stakyn",
    "episode": "Day 4/30",
    "category": "terminal",
    "name": "lazygit",
    "title": "I forget git commands → lazygit",
    "tagline": "git in one key",
    "hook": "Bro, don't Google git again. Your free fix is one key.",
    "facts": [
      "Free",
      "MIT",
      "81.6k ⭐",
      "Mac, Windows, Linux"
    ],
    "repo": "https://github.com/jesseduffield/lazygit",
    "links": [
      {
        "label": "Open on GitHub",
        "url": "https://github.com/jesseduffield/lazygit"
      },
      {
        "label": "Install steps",
        "url": "https://github.com/jesseduffield/lazygit#installation"
      }
    ],
    "steps": [
      "Install: Mac brew install lazygit · Windows winget install -e --id=JesseDuffield.lazygit",
      "Open your project folder in the terminal and type lazygit",
      "Space stages, c commits, Shift+P pushes, z undoes, ? shows every key"
    ],
    "tips": [],
    "keywords": [
      "lazygit",
      "git commands",
      "git undo commit",
      "git terminal ui",
      "learn git"
    ],
    "postedOn": "2026-11-05",
    "keyword": "GIT",
    "live": [
      {
        "platform": "YouTube",
        "url": "https://www.youtube.com/shorts/w2KRchUppXQ"
      },
      {
        "platform": "Instagram",
        "url": "https://www.instagram.com/reel/DfWv7fpAz8M/"
      },
      {
        "platform": "Facebook",
        "url": "https://www.facebook.com/reel/1823586808981839/"
      },
      {
        "platform": "X",
        "url": "https://x.com/stakynlabs/status/2118351853893419445"
      },
      {
        "platform": "Threads",
        "url": "https://www.threads.com/@stakynlabs/post/DfWwDt2E1S8"
      }
    ]
  },
  {
    "slug": "voicestudio",
    "series": "Steal This Repo",
    "episode": "Day 4/30",
    "category": "ai",
    "name": "VoiceStudio",
    "title": "VoiceStudio, a free local ElevenLabs alternative",
    "tagline": "a free, local ElevenLabs alternative",
    "hook": "Bro, don't pay for AI voices. Run them on your laptop.",
    "facts": [
      "Free",
      "AGPL-3.0",
      "98.8k ⭐",
      "646 languages"
    ],
    "repo": "https://github.com/debpalash/VoiceStudio",
    "links": [
      {
        "label": "Open on GitHub",
        "url": "https://github.com/debpalash/VoiceStudio"
      },
      {
        "label": "Downloads",
        "url": "https://github.com/debpalash/VoiceStudio/releases/latest"
      }
    ],
    "steps": [
      "Download the app for Mac, Windows or Linux",
      "Open the Model Manager and download the default voice model once",
      "Type your script and hit Synthesize. It all stays on your machine"
    ],
    "tips": [
      "Only clone a voice with its owner's permission 🙏"
    ],
    "keywords": [
      "elevenlabs alternative",
      "ai voice cloning",
      "text to speech free",
      "local ai",
      "voice studio"
    ],
    "postedOn": "2026-11-05",
    "keyword": "VOICE",
    "live": [
      {
        "platform": "YouTube",
        "url": "https://www.youtube.com/shorts/4HPZKRfb7KQ"
      },
      {
        "platform": "Instagram",
        "url": "https://www.instagram.com/reel/DfWvUeiAd6K/"
      },
      {
        "platform": "Facebook",
        "url": "https://www.facebook.com/reel/1797750071480510/"
      },
      {
        "platform": "X",
        "url": "https://x.com/stakynlabs/status/2118351693490610446"
      },
      {
        "platform": "Threads",
        "url": "https://www.threads.com/@stakynlabs/post/DfWvfX8EyeT"
      }
    ]
  }
]
