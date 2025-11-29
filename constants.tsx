import { AttackScenario, AttackID } from './types';
import { Database, Server, UserRound, Globe, Router, Bot, Usb, Skull } from 'lucide-react';
import React from 'react';

export const ACTOR_ICONS: Record<string, React.FC<any>> = {
  user: UserRound,
  hacker: Skull,
  server: Server,
  database: Database,
  dns: Globe,
  router: Router,
  bot: Bot,
  pendrive: Usb,
};

export const ATTACK_SCENARIOS: Record<AttackID, AttackScenario> = {
  [AttackID.PHISHING]: {
    id: AttackID.PHISHING,
    category: 'Social',
    title: "Phishing Attack",
    shortDescription: "Deceptive emails to obtain sensitive information.",
    actors: ['hacker', 'user', 'server'],
    actorNames: {
      hacker: "Attacker",
      user: "Employee",
      server: "Corp Portal"
    },
    prevention: [
      "Verify sender email addresses carefully.",
      "Don't click suspicious links.",
      "Enable Multi-Factor Authentication (MFA)."
    ],
    layout: {
      positions: {
        hacker: { top: '30%', left: '15%' },
        user: { top: '30%', left: '50%' },
        server: { top: '30%', left: '85%' },
      },
      connections: [
        { from: 'hacker', to: 'user', type: 'dashed', color: 'stroke-red-500', label: '1. Phishing Link' },
        { from: 'user', to: 'hacker', type: 'dashed', color: 'stroke-red-500', label: '3. Credentials' },
        { from: 'hacker', to: 'server', type: 'solid', color: 'stroke-red-500', label: '4. Access' },
        { from: 'user', to: 'server', type: 'solid', color: 'stroke-slate-600', label: '2. Login Page' }
      ]
    },
    steps: [
      {
        id: 0,
        description: "The attacker drafts a deceptive email mimicking a legitimate service.",
        actorStates: { hacker: { status: 'active' }, user: { status: 'normal' }, server: { status: 'normal' } }
      },
      {
        id: 1,
        description: "Attacker sends the phishing email with a malicious link to the user.",
        activePacket: { id: 'p1', from: 'hacker', to: 'user', type: 'malware', label: 'Fake Email', color: 'bg-red-500' },
        actorStates: { hacker: { status: 'active' }, user: { status: 'normal' } }
      },
      {
        id: 2,
        description: "User falls for the trap, clicks the link, and enters their credentials on a fake site.",
        actorStates: { user: { status: 'compromised', label: 'Entered Creds' } }
      },
      {
        id: 3,
        description: "The stolen credentials are sent directly back to the attacker.",
        activePacket: { id: 'p2', from: 'user', to: 'hacker', type: 'data', label: 'Password', color: 'bg-yellow-500' },
        actorStates: { user: { status: 'compromised' }, hacker: { status: 'active', label: 'Has Access' } }
      },
      {
        id: 4,
        description: "Attacker uses the stolen credentials to access the legitimate server.",
        activePacket: { id: 'p3', from: 'hacker', to: 'server', type: 'request', label: 'Login', color: 'bg-red-500' },
        actorStates: { hacker: { status: 'active' }, server: { status: 'compromised' } }
      }
    ]
  },
  [AttackID.RANSOMWARE]: {
    id: AttackID.RANSOMWARE,
    category: 'Malware',
    title: "Ransomware",
    shortDescription: "Malware encrypts files and demands payment.",
    actors: ['hacker', 'pendrive', 'user', 'database'],
    actorNames: {
      hacker: "Attacker",
      pendrive: "Infected USB",
      user: "Workstation",
      database: "File Server"
    },
    prevention: [
      "Keep regular offline backups.",
      "Keep software and OS updated.",
      "Use strong endpoint protection."
    ],
    layout: {
      positions: {
        hacker: { top: '20%', left: '10%' },
        pendrive: { top: '50%', left: '25%' },
        user: { top: '50%', left: '55%' },
        database: { top: '50%', left: '85%' },
      },
      connections: [
        { from: 'hacker', to: 'pendrive', type: 'dashed', color: 'stroke-purple-500' },
        { from: 'pendrive', to: 'user', type: 'dashed', color: 'stroke-purple-500', label: 'Infect' },
        { from: 'user', to: 'database', type: 'solid', color: 'stroke-purple-500', label: 'Spread' }
      ]
    },
    steps: [
      {
        id: 0,
        description: "Attacker loads malware onto a physical device (Pen Drive) or prepares an email exploit.",
        actorStates: { hacker: { status: 'active' }, pendrive: { status: 'infected' }, user: { status: 'normal' }, database: { status: 'normal' } }
      },
      {
        id: 1,
        description: "Infected Pen Drive is connected to the user's system.",
        activePacket: { id: 'r1', from: 'pendrive', to: 'user', type: 'malware', label: 'Payload', color: 'bg-purple-600' },
        actorStates: { user: { status: 'normal' } }
      },
      {
        id: 2,
        description: "The malware executes and begins encrypting files on the user's system.",
        actorStates: { user: { status: 'infected', label: 'Encrypting...' } }
      },
      {
        id: 3,
        description: "The infection spreads to connected network storage/databases.",
        activePacket: { id: 'r2', from: 'user', to: 'database', type: 'malware', label: 'Spread', color: 'bg-purple-600' },
        actorStates: { user: { status: 'infected' }, database: { status: 'infected' } }
      },
      {
        id: 4,
        description: "Data is locked. A ransom note is displayed demanding payment.",
        actorStates: { user: { status: 'offline', label: 'LOCKED' }, database: { status: 'offline', label: 'LOCKED' }, hacker: { status: 'active', label: 'Pay Me' } }
      }
    ]
  },
  [AttackID.DOS]: {
    id: AttackID.DOS,
    category: 'Network',
    title: "Denial of Service (DoS)",
    shortDescription: "Overloading a system to disrupt normal functioning.",
    actors: ['hacker', 'bot', 'server', 'user'],
    actorNames: {
      hacker: "Attacker",
      bot: "Botnet",
      server: "Target Server",
      user: "Legitimate User"
    },
    prevention: [
      "Implement rate limiting.",
      "Use traffic analysis and firewalls.",
      "Use Content Delivery Networks (CDNs)."
    ],
    layout: {
      positions: {
        hacker: { top: '50%', left: '10%' },
        bot: { top: '50%', left: '35%' },
        server: { top: '50%', left: '85%' },
        user: { top: '20%', left: '60%' },
      },
      connections: [
        { from: 'hacker', to: 'bot', type: 'dashed', color: 'stroke-red-500', label: 'Command' },
        { from: 'bot', to: 'server', type: 'solid', color: 'stroke-red-500', label: 'Flood Traffic' },
        { from: 'user', to: 'server', type: 'dashed', color: 'stroke-slate-600', label: 'Request' }
      ]
    },
    steps: [
      {
        id: 0,
        description: "Hacker controls a Bot (or Botnet) to generate massive traffic.",
        actorStates: { hacker: { status: 'active' }, bot: {status: 'active'}, server: { status: 'normal' }, user: { status: 'normal' } }
      },
      {
        id: 1,
        description: "Hacker commands the bot to flood the target server.",
        activePacket: { id: 'd1', from: 'hacker', to: 'bot', type: 'malware', label: 'Attack!', color: 'bg-red-600' },
        actorStates: { server: { status: 'normal' } }
      },
      {
        id: 2,
        description: "Bot floods the server with overwhelming requests.",
        activePacket: { id: 'd2', from: 'bot', to: 'server', type: 'malware', label: 'FLOOD', color: 'bg-red-600' },
        actorStates: { server: { status: 'infected', label: 'Overloaded' } }
      },
      {
        id: 3,
        description: "Legitimate user attempts to access the server.",
        activePacket: { id: 'd3', from: 'user', to: 'server', type: 'request', label: 'Hello?', color: 'bg-blue-400' },
        actorStates: { user: { status: 'normal' } }
      },
      {
        id: 4,
        description: "Server cannot respond to the legitimate user. Service is denied.",
        actorStates: { server: { status: 'offline' }, user: { status: 'offline', label: 'Timeout' } }
      }
    ]
  },
  [AttackID.MITM]: {
    id: AttackID.MITM,
    category: 'Network',
    title: "Man-in-the-Middle (MitM)",
    shortDescription: "Intercepting communication between two parties.",
    actors: ['user', 'hacker', 'server'],
    actorNames: {
      user: "Victim",
      hacker: "Intercepter",
      server: "Bank"
    },
    prevention: [
      "Use VPNs on public Wi-Fi.",
      "Ensure websites use HTTPS.",
      "Avoid sensitive transactions on public networks."
    ],
    layout: {
      positions: {
        user: { top: '50%', left: '15%' },
        hacker: { top: '50%', left: '50%' },
        server: { top: '50%', left: '85%' },
      },
      connections: [
        { from: 'user', to: 'hacker', type: 'dashed', color: 'stroke-red-500', label: 'Intercepted' },
        { from: 'hacker', to: 'server', type: 'dashed', color: 'stroke-red-500', label: 'Relayed' },
        // Visual trick: A faint line showing original connection broken
        { from: 'user', to: 'server', type: 'dashed', color: 'stroke-slate-800', label: 'X Original' } 
      ]
    },
    steps: [
      {
        id: 0,
        description: "User attempts to connect to a server, but Hacker intercepts the network path.",
        actorStates: { user: { status: 'normal' }, hacker: { status: 'active' }, server: { status: 'normal' } }
      },
      {
        id: 1,
        description: "User sends login data. Hacker intercepts it before it reaches the server.",
        activePacket: { id: 'm1', from: 'user', to: 'hacker', type: 'data', label: 'Login Data', color: 'bg-blue-400' },
        actorStates: { hacker: { status: 'active' } }
      },
      {
        id: 2,
        description: "Hacker captures and reads the sensitive data.",
        actorStates: { hacker: { status: 'compromised', label: 'Stolen!' } }
      },
      {
        id: 3,
        description: "Hacker forwards the request to the server to maintain the illusion.",
        activePacket: { id: 'm2', from: 'hacker', to: 'server', type: 'request', label: 'Relayed', color: 'bg-red-500' },
        actorStates: { server: { status: 'normal' } }
      },
      {
        id: 4,
        description: "Server responds to Hacker, who relays it back to User. The User has no idea.",
        activePacket: { id: 'm3', from: 'server', to: 'hacker', type: 'response', label: 'OK', color: 'bg-green-500' },
        actorStates: { user: { status: 'normal' } }
      }
    ]
  },
  [AttackID.SQL_INJECTION]: {
    id: AttackID.SQL_INJECTION,
    category: 'Web',
    title: "SQL Injection",
    shortDescription: "Exploiting database queries to gain unauthorized access.",
    actors: ['hacker', 'server', 'database'],
    actorNames: {
      hacker: "Attacker",
      server: "Web App",
      database: "User DB"
    },
    prevention: [
      "Use prepared statements (parameterized queries).",
      "Validate and sanitize all user inputs.",
      "Limit database permissions."
    ],
    layout: {
      positions: {
        hacker: { top: '50%', left: '15%' },
        server: { top: '50%', left: '50%' },
        database: { top: '50%', left: '85%' },
      },
      connections: [
        { from: 'hacker', to: 'server', type: 'solid', color: 'stroke-red-500', label: '1. Malicious Input' },
        { from: 'server', to: 'database', type: 'solid', color: 'stroke-slate-500', label: '2. Query' },
        { from: 'database', to: 'server', type: 'dashed', color: 'stroke-yellow-500', label: '3. All Data' },
        { from: 'server', to: 'hacker', type: 'dashed', color: 'stroke-yellow-500', label: '4. Dump' }
      ]
    },
    steps: [
      {
        id: 0,
        description: "Hacker identifies a vulnerable input field on a website.",
        actorStates: { hacker: { status: 'active' }, server: { status: 'normal' }, database: { status: 'normal' } }
      },
      {
        id: 1,
        description: "Hacker injects a malicious SQL command (e.g., ' OR 1=1 --).",
        activePacket: { id: 's1', from: 'hacker', to: 'server', type: 'malware', label: "' OR 1=1", color: 'bg-red-500' },
        actorStates: { hacker: { status: 'active' } }
      },
      {
        id: 2,
        description: "Server constructs a database query with the malicious input.",
        activePacket: { id: 's2', from: 'server', to: 'database', type: 'request', label: "SELECT *", color: 'bg-red-500' },
        actorStates: { server: { status: 'compromised' } }
      },
      {
        id: 3,
        description: "Database executes the manipulated query, returning all user records.",
        activePacket: { id: 's3', from: 'database', to: 'server', type: 'data', label: "ALL USERS", color: 'bg-yellow-500' },
        actorStates: { database: { status: 'compromised' } }
      },
      {
        id: 4,
        description: "Server displays the sensitive data to the hacker.",
        activePacket: { id: 's4', from: 'server', to: 'hacker', type: 'data', label: "Data Dump", color: 'bg-yellow-500' },
        actorStates: { hacker: { status: 'active', label: 'Success' } }
      }
    ]
  },
  [AttackID.XSS]: {
    id: AttackID.XSS,
    category: 'Web',
    title: "Cross-Site Scripting (XSS)",
    shortDescription: "Injecting malicious scripts into websites viewed by others.",
    actors: ['hacker', 'server', 'database', 'user'],
    actorNames: {
      hacker: "Attacker",
      server: "Web Server",
      database: "DB",
      user: "Site Visitor"
    },
    prevention: [
      "Sanitize HTML input.",
      "Use Content Security Policy (CSP).",
      "Encode data on output."
    ],
    layout: {
      positions: {
        hacker: { top: '20%', left: '15%' },
        server: { top: '50%', left: '45%' },
        database: { top: '80%', left: '45%' },
        user: { top: '50%', left: '85%' },
      },
      connections: [
        { from: 'hacker', to: 'server', type: 'solid', color: 'stroke-red-500', label: '1. Inject Script' },
        { from: 'server', to: 'database', type: 'solid', color: 'stroke-slate-500' },
        { from: 'database', to: 'server', type: 'solid', color: 'stroke-slate-500' },
        { from: 'server', to: 'user', type: 'dashed', color: 'stroke-red-400', label: '3. Serve Script' },
        { from: 'user', to: 'hacker', type: 'dashed', color: 'stroke-yellow-500', label: '4. Cookies' }
      ]
    },
    steps: [
      {
        id: 0,
        description: "Hacker finds a site that displays user comments without sanitization.",
        actorStates: { hacker: { status: 'active' }, server: { status: 'normal' }, database: { status: 'normal' }, user: { status: 'normal' } }
      },
      {
        id: 1,
        description: "Hacker posts a comment containing a malicious script tag.",
        activePacket: { id: 'x1', from: 'hacker', to: 'server', type: 'malware', label: '<script>', color: 'bg-red-500' },
        actorStates: { hacker: { status: 'active' } }
      },
      {
        id: 2,
        description: "Server saves the comment to the database.",
        activePacket: { id: 'x2', from: 'server', to: 'database', type: 'data', label: 'Save', color: 'bg-gray-400' },
        actorStates: { database: { status: 'infected' } }
      },
      {
        id: 3,
        description: "Legitimate user visits the page. Server serves the malicious comment.",
        activePacket: { id: 'x3', from: 'server', to: 'user', type: 'response', label: 'Page+Script', color: 'bg-red-400' },
        actorStates: { user: { status: 'normal' } }
      },
      {
        id: 4,
        description: "Script executes in user's browser, sending cookies to Hacker.",
        activePacket: { id: 'x4', from: 'user', to: 'hacker', type: 'data', label: 'Cookies', color: 'bg-yellow-500' },
        actorStates: { user: { status: 'compromised' }, hacker: { status: 'active', label: 'Session Stolen' } }
      }
    ]
  },
  [AttackID.ZERO_DAY]: {
    id: AttackID.ZERO_DAY,
    category: 'Malware',
    title: "Zero-Day Exploit",
    shortDescription: "Attacking a software vulnerability before the vendor knows.",
    actors: ['hacker', 'server', 'database'],
    actorNames: {
      hacker: "APT Group",
      server: "Vulnerable App",
      database: "Core DB"
    },
    prevention: [
      "Use intrusion detection systems (IDS).",
      "Apply network segmentation.",
      "Monitor vendor security bulletins constantly."
    ],
    layout: {
      positions: {
        hacker: { top: '50%', left: '15%' },
        server: { top: '50%', left: '50%' },
        database: { top: '50%', left: '85%' },
      },
      connections: [
        { from: 'hacker', to: 'server', type: 'dashed', color: 'stroke-red-600', label: '1. Unknown Exploit' },
        { from: 'server', to: 'database', type: 'solid', color: 'stroke-slate-500' },
        { from: 'database', to: 'server', type: 'solid', color: 'stroke-slate-500' },
        { from: 'server', to: 'hacker', type: 'dashed', color: 'stroke-yellow-500', label: '3. Leak Data' }
      ]
    },
    steps: [
      {
        id: 0,
        description: "Hacker discovers a vulnerability in the server software that no one else knows about.",
        actorStates: { hacker: { status: 'active', label: 'Scanning' }, server: { status: 'normal' }, database: { status: 'normal' } }
      },
      {
        id: 1,
        description: "Hacker launches a targeted attack using the specialized exploit code.",
        activePacket: { id: 'z1', from: 'hacker', to: 'server', type: 'malware', label: '0-Day Payload', color: 'bg-red-700' },
        actorStates: { hacker: { status: 'active' } }
      },
      {
        id: 2,
        description: "The server has no patch for this specific attack and executes the payload.",
        actorStates: { server: { status: 'compromised', label: 'Exploited' } }
      },
      {
        id: 3,
        description: "The exploit grants access to the backend database.",
        activePacket: { id: 'z2', from: 'server', to: 'database', type: 'request', label: 'Dump DB', color: 'bg-red-500' },
        actorStates: { database: { status: 'infected' } }
      },
      {
        id: 4,
        description: "Sensitive data is exfiltrated before the vendor can release a patch.",
        activePacket: { id: 'z3', from: 'server', to: 'hacker', type: 'data', label: 'Secrets', color: 'bg-yellow-500' },
        actorStates: { hacker: { status: 'active', label: 'Data Stolen' } }
      }
    ]
  },
  [AttackID.DNS_SPOOFING]: {
    id: AttackID.DNS_SPOOFING,
    category: 'Network',
    title: "DNS Spoofing",
    shortDescription: "Redirecting traffic by corrupting DNS records.",
    actors: ['user', 'dns', 'hacker', 'server'],
    actorNames: {
      user: "Victim",
      dns: "DNS Resolver",
      hacker: "Spoofer",
      server: "Real Bank"
    },
    prevention: [
      "Use DNSSEC (Domain Name System Security Extensions).",
      "Regularly monitor DNS records.",
      "Use encrypted DNS (DoH/DoT)."
    ],
    layout: {
      positions: {
        user: { top: '50%', left: '10%' },
        dns: { top: '20%', left: '40%' },
        hacker: { top: '80%', left: '40%' }, // Fake site/server
        server: { top: '50%', left: '80%' }, // Real site
      },
      connections: [
        { from: 'user', to: 'dns', type: 'solid', color: 'stroke-blue-400', label: '1. Where is bank.com?' },
        { from: 'hacker', to: 'user', type: 'dashed', color: 'stroke-red-500', label: '2. Fake IP' },
        { from: 'user', to: 'hacker', type: 'solid', color: 'stroke-red-500', label: '3. Connects to Fake' },
        { from: 'dns', to: 'user', type: 'dashed', color: 'stroke-slate-700', label: 'Too Late' } 
      ]
    },
    steps: [
      {
        id: 0,
        description: "User wants to visit 'bank.com' and queries the DNS server for its IP address.",
        actorStates: { user: { status: 'active' }, dns: { status: 'normal' }, hacker: { status: 'active', label: 'Listening' }, server: { status: 'normal' } }
      },
      {
        id: 1,
        description: "User sends the DNS request.",
        activePacket: { id: 'dn1', from: 'user', to: 'dns', type: 'request', label: 'Query', color: 'bg-blue-500' },
        actorStates: { dns: { status: 'active' } }
      },
      {
        id: 2,
        description: "Hacker intercepts or beats the legitimate DNS server with a fake response.",
        activePacket: { id: 'dn2', from: 'hacker', to: 'user', type: 'response', label: 'Fake IP', color: 'bg-red-500' },
        actorStates: { hacker: { status: 'active' } }
      },
      {
        id: 3,
        description: "User's computer accepts the fake IP address for 'bank.com'.",
        actorStates: { user: { status: 'compromised', label: 'Poisoned Cache' } }
      },
      {
        id: 4,
        description: "User sends their login credentials to the Hacker's fake website instead of the real one.",
        activePacket: { id: 'dn3', from: 'user', to: 'hacker', type: 'data', label: 'Login Info', color: 'bg-yellow-500' },
        actorStates: { hacker: { status: 'active', label: 'Stolen!' }, server: { status: 'normal', label: 'Idle' } }
      }
    ]
  },
  [AttackID.CSRF]: {
    id: AttackID.CSRF,
    category: 'Web',
    title: "CSRF (Cross-Site Request Forgery)",
    shortDescription: "Tricking a browser into performing an unwanted action.",
    actors: ['hacker', 'user', 'server'],
    actorNames: {
      hacker: "Malicious Site",
      user: "Victim (Logged In)",
      server: "Bank API"
    },
    prevention: [
      "Use Anti-CSRF tokens.",
      "Set SameSite cookie attribute to Strict.",
      "Require re-authentication for sensitive actions."
    ],
    layout: {
      positions: {
        hacker: { top: '50%', left: '15%' },
        user: { top: '50%', left: '50%' },
        server: { top: '50%', left: '85%' },
      },
      connections: [
        { from: 'hacker', to: 'user', type: 'solid', color: 'stroke-red-500', label: '1. Auto-submit Form' },
        { from: 'user', to: 'server', type: 'dashed', color: 'stroke-red-500', label: '2. Transfer Req + Cookies' },
        { from: 'server', to: 'user', type: 'solid', color: 'stroke-green-500', label: '3. Success' }
      ]
    },
    steps: [
      {
        id: 0,
        description: "User is logged into their bank account. Session cookies are active.",
        actorStates: { user: { status: 'active', label: 'Logged In' }, hacker: { status: 'active' }, server: { status: 'normal' } }
      },
      {
        id: 1,
        description: "User visits a malicious site (or clicks a link) controlled by the attacker.",
        activePacket: { id: 'c1', from: 'hacker', to: 'user', type: 'malware', label: 'Hidden Form', color: 'bg-red-500' },
        actorStates: { hacker: { status: 'active' } }
      },
      {
        id: 2,
        description: "The malicious site automatically triggers a request to the bank (e.g., Transfer $1000).",
        actorStates: { user: { status: 'compromised', label: 'Unaware' } }
      },
      {
        id: 3,
        description: "The browser includes the user's session cookies with the request automatically.",
        activePacket: { id: 'c2', from: 'user', to: 'server', type: 'request', label: 'Pay Hacker', color: 'bg-red-500' },
        actorStates: { server: { status: 'normal' } }
      },
      {
        id: 4,
        description: "Bank server sees valid cookies and processes the transfer.",
        activePacket: { id: 'c3', from: 'server', to: 'user', type: 'response', label: 'Transfer OK', color: 'bg-green-500' },
        actorStates: { user: { status: 'compromised', label: 'Money Lost' } }
      }
    ]
  },
  [AttackID.SSRF]: {
    id: AttackID.SSRF,
    category: 'Web',
    title: "SSRF (Server-Side Request Forgery)",
    shortDescription: "Abusing a server to make requests to internal resources.",
    actors: ['hacker', 'server', 'database'],
    actorNames: {
      hacker: "Attacker",
      server: "Public Web App",
      database: "Internal Admin"
    },
    prevention: [
      "Validate user-supplied URLs.",
      "Use an allow-list for outgoing requests.",
      "Isolate sensitive internal services."
    ],
    layout: {
      positions: {
        hacker: { top: '50%', left: '15%' },
        server: { top: '50%', left: '50%' },
        database: { top: '50%', left: '85%' },
      },
      connections: [
        { from: 'hacker', to: 'server', type: 'solid', color: 'stroke-red-500', label: '1. Fetch http://localhost' },
        { from: 'server', to: 'database', type: 'dashed', color: 'stroke-red-500', label: '2. Internal Req' },
        { from: 'database', to: 'server', type: 'dashed', color: 'stroke-yellow-500', label: '3. Admin Data' },
        { from: 'server', to: 'hacker', type: 'solid', color: 'stroke-yellow-500', label: '4. Proxy Response' }
      ]
    },
    steps: [
      {
        id: 0,
        description: "Hacker finds a feature that fetches URLs (e.g., 'Upload from URL').",
        actorStates: { hacker: { status: 'active', label: 'Scanning' }, server: { status: 'normal' }, database: { status: 'normal', label: 'Private' } }
      },
      {
        id: 1,
        description: "Hacker submits a URL pointing to an internal service (e.g., localhost:8080/admin).",
        activePacket: { id: 'ss1', from: 'hacker', to: 'server', type: 'malware', label: 'GET /admin', color: 'bg-red-500' },
        actorStates: { hacker: { status: 'active' } }
      },
      {
        id: 2,
        description: "The web server blindly makes a request to the internal address.",
        activePacket: { id: 'ss2', from: 'server', to: 'database', type: 'request', label: 'GET /admin', color: 'bg-red-500' },
        actorStates: { server: { status: 'compromised' } }
      },
      {
        id: 3,
        description: "The internal service responds because the request comes from a trusted server.",
        activePacket: { id: 'ss3', from: 'database', to: 'server', type: 'data', label: 'Admin Keys', color: 'bg-yellow-500' },
        actorStates: { database: { status: 'active' } }
      },
      {
        id: 4,
        description: "The web server relays the internal data back to the hacker.",
        activePacket: { id: 'ss4', from: 'server', to: 'hacker', type: 'data', label: 'Admin Keys', color: 'bg-yellow-500' },
        actorStates: { hacker: { status: 'active', label: 'Got Access' } }
      }
    ]
  },
  [AttackID.BROKEN_AUTH]: {
    id: AttackID.BROKEN_AUTH,
    category: 'Web',
    title: "Broken Authentication",
    shortDescription: "Compromising passwords, keys, or session tokens.",
    actors: ['hacker', 'server', 'database'],
    actorNames: {
      hacker: "Attacker",
      server: "Login Portal",
      database: "User DB"
    },
    prevention: [
      "Implement Multi-Factor Authentication (MFA).",
      "Do not ship with default credentials.",
      "Limit failed login attempts."
    ],
    layout: {
      positions: {
        hacker: { top: '50%', left: '15%' },
        server: { top: '50%', left: '50%' },
        database: { top: '50%', left: '85%' },
      },
      connections: [
        { from: 'hacker', to: 'server', type: 'solid', color: 'stroke-red-500', label: '1. Brute Force' },
        { from: 'server', to: 'database', type: 'solid', color: 'stroke-slate-500', label: '2. Check' },
        { from: 'database', to: 'server', type: 'dashed', color: 'stroke-yellow-500', label: '3. Valid' },
        { from: 'server', to: 'hacker', type: 'solid', color: 'stroke-yellow-500', label: '4. Token' }
      ]
    },
    steps: [
      {
        id: 0,
        description: "Attacker obtains a list of common usernames and passwords (credential stuffing).",
        actorStates: { hacker: { status: 'active', label: 'Loading List' }, server: { status: 'normal' }, database: { status: 'normal' } }
      },
      {
        id: 1,
        description: "Attacker automates login attempts, trying thousands of combinations.",
        activePacket: { id: 'ba1', from: 'hacker', to: 'server', type: 'malware', label: 'Try: Admin/123', color: 'bg-red-500' },
        actorStates: { hacker: { status: 'active' } }
      },
      {
        id: 2,
        description: "Server checks the credentials against the database.",
        activePacket: { id: 'ba2', from: 'server', to: 'database', type: 'request', label: 'Verify', color: 'bg-blue-500' },
        actorStates: { server: { status: 'active' } }
      },
      {
        id: 3,
        description: "A weak password matches. Database confirms validity.",
        activePacket: { id: 'ba3', from: 'database', to: 'server', type: 'response', label: 'Match Found', color: 'bg-green-500' },
        actorStates: { database: { status: 'active' } }
      },
      {
        id: 4,
        description: "Server issues a session token to the attacker. Account takeover complete.",
        activePacket: { id: 'ba4', from: 'server', to: 'hacker', type: 'key', label: 'Session Token', color: 'bg-yellow-500' },
        actorStates: { hacker: { status: 'active', label: 'Logged In' }, server: { status: 'compromised' } }
      }
    ]
  },
  [AttackID.IDOR]: {
    id: AttackID.IDOR,
    category: 'Web',
    title: "IDOR (Insecure Direct Object References)",
    shortDescription: "Accessing unauthorized data by manipulating ID parameters.",
    actors: ['user', 'server', 'database'],
    actorNames: {
      user: "Attacker (Logged In)",
      server: "API",
      database: "Records DB"
    },
    prevention: [
      "Implement proper access control checks.",
      "Use indirect object references (e.g., random GUIDs).",
      "Validate user ownership for every data request."
    ],
    layout: {
      positions: {
        user: { top: '50%', left: '15%' },
        server: { top: '50%', left: '50%' },
        database: { top: '50%', left: '85%' },
      },
      connections: [
        { from: 'user', to: 'server', type: 'solid', color: 'stroke-red-500', label: '1. GET /inv?id=101' },
        { from: 'server', to: 'database', type: 'solid', color: 'stroke-red-500', label: '2. Query ID=101' },
        { from: 'database', to: 'server', type: 'dashed', color: 'stroke-yellow-500', label: '3. Data 101' },
        { from: 'server', to: 'user', type: 'solid', color: 'stroke-yellow-500', label: '4. Leak' }
      ]
    },
    steps: [
      {
        id: 0,
        description: "Attacker logs in legally and sees their own invoice at URL: /invoices?id=100.",
        actorStates: { user: { status: 'active', label: 'ID: 100' }, server: { status: 'normal' }, database: { status: 'normal' } }
      },
      {
        id: 1,
        description: "Attacker changes the ID parameter in the URL from 100 to 101 to see someone else's data.",
        activePacket: { id: 'id1', from: 'user', to: 'server', type: 'malware', label: 'GET ?id=101', color: 'bg-red-500' },
        actorStates: { user: { status: 'active' } }
      },
      {
        id: 2,
        description: "The server fails to check if the user OWNS record 101 and just queries the DB.",
        activePacket: { id: 'id2', from: 'server', to: 'database', type: 'request', label: 'Find 101', color: 'bg-red-500' },
        actorStates: { server: { status: 'compromised' } }
      },
      {
        id: 3,
        description: "Database returns the record for ID 101.",
        activePacket: { id: 'id3', from: 'database', to: 'server', type: 'data', label: 'Invoice 101', color: 'bg-yellow-500' },
        actorStates: { database: { status: 'active' } }
      },
      {
        id: 4,
        description: "Server sends the sensitive data of another user back to the attacker.",
        activePacket: { id: 'id4', from: 'server', to: 'user', type: 'data', label: 'Stolen Data', color: 'bg-yellow-500' },
        actorStates: { user: { status: 'active', label: 'Success' } }
      }
    ]
  },
  [AttackID.DICTIONARY]: {
    id: AttackID.DICTIONARY,
    category: 'Web',
    title: "Dictionary Attack",
    shortDescription: "Guessing passwords using a list of common words.",
    actors: ['hacker', 'server', 'database'],
    actorNames: {
      hacker: "Attacker",
      server: "Login System",
      database: "User Table"
    },
    prevention: [
      "Enforce strong password complexity policies.",
      "Implement account lockouts after failed attempts.",
      "Throttle login requests."
    ],
    layout: {
      positions: {
        hacker: { top: '50%', left: '15%' },
        server: { top: '50%', left: '50%' },
        database: { top: '50%', left: '85%' },
      },
      connections: [
        { from: 'hacker', to: 'server', type: 'solid', color: 'stroke-red-500', label: '1. Guess' },
        { from: 'server', to: 'database', type: 'solid', color: 'stroke-slate-500' },
        { from: 'database', to: 'server', type: 'dashed', color: 'stroke-slate-500' },
        { from: 'server', to: 'hacker', type: 'solid', color: 'stroke-slate-400', label: '4. Result' }
      ]
    },
    steps: [
      {
        id: 0,
        description: "Attacker targets a specific user account using a common wordlist.",
        actorStates: { hacker: { status: 'active', label: 'Wordlist Loaded' }, server: { status: 'normal' }, database: { status: 'normal' } }
      },
      {
        id: 1,
        description: "Attacker attempts the first password: 'password123'.",
        activePacket: { id: 'da1', from: 'hacker', to: 'server', type: 'request', label: 'Try: password123', color: 'bg-red-400' },
        actorStates: { hacker: { status: 'active' } }
      },
      {
        id: 2,
        description: "Server checks database. The password is incorrect.",
        activePacket: { id: 'da2', from: 'server', to: 'hacker', type: 'response', label: 'Failed', color: 'bg-gray-500' },
        actorStates: { server: { status: 'active' } }
      },
      {
        id: 3,
        description: "Attacker attempts the next password: 'admin'.",
        activePacket: { id: 'da3', from: 'hacker', to: 'server', type: 'request', label: 'Try: admin', color: 'bg-red-400' },
        actorStates: { hacker: { status: 'active' } }
      },
      {
        id: 4,
        description: "Correct password found! Access granted.",
        activePacket: { id: 'da4', from: 'server', to: 'hacker', type: 'key', label: 'Access Token', color: 'bg-green-500' },
        actorStates: { hacker: { status: 'active', label: 'Success' }, server: { status: 'compromised' } }
      }
    ]
  },
  [AttackID.CMD_INJECTION]: {
    id: AttackID.CMD_INJECTION,
    category: 'Web',
    title: "Command Injection",
    shortDescription: "Executing arbitrary operating system commands on the server.",
    actors: ['hacker', 'server', 'database'],
    actorNames: {
      hacker: "Attacker",
      server: "Vulnerable App",
      database: "System Shell" // Representing OS
    },
    prevention: [
      "Avoid calling OS commands directly.",
      "Use language-specific APIs instead of shell commands.",
      "Sanitize input to remove command separators (e.g., ; | &)."
    ],
    layout: {
      positions: {
        hacker: { top: '50%', left: '15%' },
        server: { top: '50%', left: '50%' },
        database: { top: '50%', left: '85%' },
      },
      connections: [
        { from: 'hacker', to: 'server', type: 'solid', color: 'stroke-red-500', label: '1. Input' },
        { from: 'server', to: 'database', type: 'solid', color: 'stroke-red-500', label: '2. Exec' },
        { from: 'database', to: 'server', type: 'dashed', color: 'stroke-yellow-500', label: '3. Output' },
        { from: 'server', to: 'hacker', type: 'dashed', color: 'stroke-yellow-500', label: '4. Display' }
      ]
    },
    steps: [
      {
        id: 0,
        description: "App has a feature to 'ping' an IP address, but doesn't validate input.",
        actorStates: { hacker: { status: 'active' }, server: { status: 'normal' }, database: { status: 'normal', label: 'OS Shell' } }
      },
      {
        id: 1,
        description: "Hacker enters '8.8.8.8; cat /etc/passwd' to chain commands.",
        activePacket: { id: 'ci1', from: 'hacker', to: 'server', type: 'malware', label: '; cat /passwd', color: 'bg-red-500' },
        actorStates: { hacker: { status: 'active' } }
      },
      {
        id: 2,
        description: "Server passes the entire string to the system shell.",
        activePacket: { id: 'ci2', from: 'server', to: 'database', type: 'request', label: 'Exec Command', color: 'bg-red-500' },
        actorStates: { server: { status: 'compromised' } }
      },
      {
        id: 3,
        description: "Shell executes ping, THEN executes 'cat', reading sensitive system files.",
        activePacket: { id: 'ci3', from: 'database', to: 'server', type: 'data', label: 'User List', color: 'bg-yellow-500' },
        actorStates: { database: { status: 'compromised' } }
      },
      {
        id: 4,
        description: "Server returns the sensitive file contents to the browser.",
        activePacket: { id: 'ci4', from: 'server', to: 'hacker', type: 'data', label: 'System Files', color: 'bg-yellow-500' },
        actorStates: { hacker: { status: 'active', label: 'Pwned' } }
      }
    ]
  },
  [AttackID.BUFFER_OVERFLOW]: {
    id: AttackID.BUFFER_OVERFLOW,
    category: 'General',
    title: "Buffer Overflow",
    shortDescription: "Overwriting adjacent memory by sending too much data.",
    actors: ['hacker', 'server', 'database'],
    actorNames: {
      hacker: "Attacker",
      server: "Application",
      database: "Memory Stack"
    },
    prevention: [
      "Use memory-safe languages (Rust, Java, Python).",
      "Implement bounds checking.",
      "Use ASLR (Address Space Layout Randomization)."
    ],
    layout: {
      positions: {
        hacker: { top: '50%', left: '15%' },
        server: { top: '50%', left: '50%' },
        database: { top: '50%', left: '85%' },
      },
      connections: [
        { from: 'hacker', to: 'server', type: 'solid', color: 'stroke-red-500', label: '1. Payload > Buffer' },
        { from: 'server', to: 'database', type: 'solid', color: 'stroke-red-500', label: '2. Write to Stack' },
        { from: 'database', to: 'server', type: 'dashed', color: 'stroke-purple-500', label: '3. Crash/Shell' },
      ]
    },
    steps: [
      {
        id: 0,
        description: "Application allocates a fixed-size buffer (e.g., 8 bytes) for user input.",
        actorStates: { hacker: { status: 'active', label: 'Crafting' }, server: { status: 'normal' }, database: { status: 'normal', label: '[Buffer | Ret]' } }
      },
      {
        id: 1,
        description: "Attacker sends a payload much larger than the buffer (e.g., 64 bytes of 'A').",
        activePacket: { id: 'bo1', from: 'hacker', to: 'server', type: 'malware', label: 'AAAAAAAAAAAAAAAA...', color: 'bg-red-600' },
        actorStates: { hacker: { status: 'active' } }
      },
      {
        id: 2,
        description: "Application fails to check length and copies data to memory.",
        activePacket: { id: 'bo2', from: 'server', to: 'database', type: 'request', label: 'Copy Data', color: 'bg-red-600' },
        actorStates: { server: { status: 'compromised' } }
      },
      {
        id: 3,
        description: "The data overflows the buffer, overwriting the return address pointer.",
        actorStates: { database: { status: 'compromised', label: 'OVERFLOWED!' } }
      },
      {
        id: 4,
        description: "The program crashes or jumps to malicious code injected by the attacker.",
        activePacket: { id: 'bo3', from: 'database', to: 'server', type: 'malware', label: 'Exec Shellcode', color: 'bg-purple-600' },
        actorStates: { server: { status: 'offline', label: 'CRASHED' }, hacker: { status: 'active', label: 'Control' } }
      }
    ]
  },
  [AttackID.DRIVE_BY_DOWNLOAD]: {
    id: AttackID.DRIVE_BY_DOWNLOAD,
    category: 'Web',
    title: "Drive-by Download",
    shortDescription: "Unintentional malware download upon visiting a compromised site.",
    actors: ['user', 'server', 'hacker'],
    actorNames: {
      user: "Victim",
      server: "Legit Website",
      hacker: "Exploit Kit"
    },
    prevention: [
      "Keep browsers and plugins updated.",
      "Use ad-blockers and script blockers.",
      "Uninstall unnecessary plugins (Flash, Java)."
    ],
    layout: {
      positions: {
        user: { top: '50%', left: '15%' },
        server: { top: '50%', left: '50%' },
        hacker: { top: '20%', left: '80%' },
      },
      connections: [
        { from: 'hacker', to: 'server', type: 'dashed', color: 'stroke-red-500', label: '1. Inject Iframe' },
        { from: 'user', to: 'server', type: 'solid', color: 'stroke-slate-500', label: '2. Visit Page' },
        { from: 'server', to: 'user', type: 'dashed', color: 'stroke-red-400', label: '3. Serve + Exploit' },
        { from: 'hacker', to: 'user', type: 'solid', color: 'stroke-purple-500', label: '4. Silent Download' }
      ]
    },
    steps: [
      {
        id: 0,
        description: "Hacker compromises a legitimate website and injects a hidden iframe.",
        actorStates: { hacker: { status: 'active' }, server: { status: 'infected', label: 'Hacked' }, user: { status: 'normal' } }
      },
      {
        id: 1,
        description: "User visits the legitimate website, unaware of the danger.",
        activePacket: { id: 'db1', from: 'user', to: 'server', type: 'request', label: 'Get Homepage', color: 'bg-blue-500' },
        actorStates: { user: { status: 'active' } }
      },
      {
        id: 2,
        description: "Server responds with the page content, but also loads the hidden exploit kit.",
        activePacket: { id: 'db2', from: 'server', to: 'user', type: 'response', label: 'Page + Malware', color: 'bg-red-400' },
        actorStates: { server: { status: 'infected' } }
      },
      {
        id: 3,
        description: "The exploit kit scans the user's browser for outdated plugins.",
        actorStates: { user: { status: 'normal', label: 'Scanning...' }, hacker: { status: 'active' } }
      },
      {
        id: 4,
        description: "A vulnerability is found. Malware is silently downloaded and executed.",
        activePacket: { id: 'db3', from: 'hacker', to: 'user', type: 'malware', label: 'Ransomware.exe', color: 'bg-purple-600' },
        actorStates: { user: { status: 'compromised', label: 'Infected' } }
      }
    ]
  }
};