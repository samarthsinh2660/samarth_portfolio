/**
 * Content for Ankit Dularia's portfolio. Edit values here and they flow
 * through every component.
 */

export const profile = {
  name: "Samarth Vala",
  firstName: "Samarth",
  role: "A Software Engineer",
  statement:
    "I turn ideas into fast, reliable web & mobile products — from real-time systems and multi-tenant SaaS to open-source core contributions.",
  location: "Available for work",
  email: "samarthsinh2660@gmail.com",
  resumeHref:
    "https://drive.google.com/file/d/1bUSvPTNkp8d1923yXfvhbvoZEgYG58dX/view?usp=drive_link",
  bio: "I'm Samarth Vala — a software engineer who ships production systems and contributes to open-source core. I've built a payroll & HR platform for 400+ employees, a real-time communication suite for 500+ users, and UNIUN — a decentralized second brain with fully on-device AI. I contribute to Webpack, CNCF Backstage, and C2SI, and I study Computer Science at PDEU with a 9.58 CGPA.",
  github: "https://github.com/samarthsinh2660",
  linkedin: "https://www.linkedin.com/in/samarth-vala-489a3428a/",
  brand: "Samarth Vala",
  socials: [
    { label: "GitHub", href: "https://github.com/samarthsinh2660" },
    { label: "LinkedIn", href: "https://www.linkedin.com/in/samarth-vala-489a3428a/" },
  ],
};

export const aboutStats = [
  { value: "1.5+", label: "Years of Experience" },
  { value: "20+", label: "Completed Projects" },
  { value: "10+", label: "Clients Worldwide" },
];

/** "What I can do for you" accordion */
export type Service = {
  title: string;
  points: string[];
};

export const servicesIntro =
  "As a software engineer, I take products from the first line of infrastructure to the last pixel of the interface — fast, reliable, and built to ship.";

export const services: Service[] = [
  {
    title: "Web Development",
    points: [
      "Production web apps with Next.js, React, and TypeScript",
      "REST and GraphQL APIs (Apollo, Express, NestJS)",
      "Real-time features with WebSockets and Socket.io",
      "Multi-tenant SaaS architecture and auth",
    ],
  },
  {
    title: "Backend & Systems",
    points: [
      "Node.js, Go, and Java (Spring) services",
      "PostgreSQL, MySQL, MongoDB, Redis, Prisma",
      "System design, data isolation, and audit trails",
      "Testing with Jest, Cypress, and Testcontainers",
    ],
  },
  {
    title: "Mobile Development",
    points: [
      "Cross-platform apps with React Native, Expo, and Flutter",
      "Real-time messaging, presence, and offline-first sync",
      "Push notifications and multi-device sessions",
      "App delivery for iOS and Android",
    ],
  },
  {
    title: "DevOps & AI",
    points: [
      "Docker, CI/CD with GitHub Actions and Jenkins",
      "AWS, Azure, Vercel, and Nginx deployments",
      "LLM gateways, on-device AI, and GraphRAG",
      "OpenAI-compatible APIs and agentic systems",
    ],
  },
];

export type Project = {
  slug: string;
  title: string;
  blurb: string;
  /** small pill tags shown on the work card, e.g. Academic Project · App · 8 min read */
  tags: string[];
  image: string;
  link: string;
  category: string;
  /** card colour theme on the work section */
  theme: "red" | "cream";
  featured?: boolean;
  stats: { value: string; label: string }[];
  role: string;
  timeline: string;
  year: string;
  overview: string;
  highlights: string[];
};

export const projects: Project[] = [
  {
    slug: "uniun",
    title: "UNIUN — Decentralized Second Brain",
    blurb:
      "A decentralized, offline-first knowledge and social platform with fully on-device AI — your notes, identity, and models stay on your device. No servers, no algorithmic feed.",
    tags: ["Flutter", "Go", "Nostr", "On-device AI"],
    image: "/work/uniun.png",
    link: "https://uniun.in/",
    category: "Privacy-first · Knowledge",
    theme: "cream",
    featured: true,
    stats: [
      { value: "100%", label: "On-device AI" },
      { value: "E2E", label: "Encrypted & user-owned" },
    ],
    role: "Full-Stack & AI Engineer",
    timeline: "2026",
    year: "2026",
    overview:
      "UNIUN fuses personal note-taking, social networking, and fully on-device AI into a decentralized, offline-first platform where your data never leaves your device. It runs lightweight local models grounded in your own notes, with user-owned identity, MLS-encrypted channels and DMs, and a self-hostable relay.",
    highlights: [
      "Offline-first knowledge graph with an interactive canvas linking notes and references.",
      "On-device AI chat grounded in your notes, plus autonomous agents for scheduled actions.",
      "User-owned keypair identity, MLS end-to-end encryption, and an open-source, self-hostable stack.",
    ],
  },
  {
    slug: "uniun-inference",
    title: "UNIUN Inference Platform — AI Gateway",
    blurb:
      "A Go-based LLM inference gateway routing OpenAI-compatible requests across Anthropic, OpenAI, and self-hosted models — with token-metered subscription and credit billing.",
    tags: ["Go", "PostgreSQL", "Razorpay", "OpenAI API"],
    image: "/work/uniun-inference.png",
    link: "https://uniun.in/ai-inference",
    category: "AI Infrastructure",
    theme: "cream",
    featured: true,
    stats: [
      { value: "3+", label: "Model providers routed" },
      { value: "1", label: "key · every model" },
    ],
    role: "Backend & AI Engineer",
    timeline: "2026",
    year: "2026",
    overview:
      "A production LLM inference gateway that routes OpenAI-compatible requests across Anthropic, OpenAI, and self-hosted models. It layers subscription and credit billing with precise token metering, Razorpay payments, and audited usage — including an upstream fix for streaming charges.",
    highlights: [
      "OpenAI-compatible gateway routing across multiple upstream providers and self-hosted models.",
      "Subscription and credit billing with token metering, Razorpay, and fully audited usage.",
      "Contributed an upstream streaming-charge correctness fix.",
    ],
  },
  {
    slug: "inventory-saas",
    title: "Multi-Tenant Inventory Management",
    blurb:
      "A production multi-tenant SaaS where every factory gets its own isolated MySQL database — real-time stock, invoicing, BOM formulas, audit trails, and automated backups.",
    tags: ["Node.js", "TypeScript", "React Native", "MySQL"],
    image: "/work/inventory.png",
    link: "https://inventory-system-launch-site.vercel.app/",
    category: "B2B SaaS",
    theme: "cream",
    stats: [
      { value: "1:1", label: "DB per tenant" },
      { value: "4h", label: "automated backups" },
    ],
    role: "Full-Stack Engineer",
    timeline: "2025",
    year: "2025",
    overview:
      "A production-ready inventory platform where each factory gets a fully isolated MySQL database — true tenant isolation, not just a tenant_id column. It includes self-serve onboarding, per-tenant connection pooling, a full inventory suite with multi-level BOM, invoicing, audit logging, and automated backups.",
    highlights: [
      "One database per tenant with self-serve onboarding that provisions schema and admin automatically.",
      "Full inventory suite — multi-location stock, BOM formulas, invoicing, and audit trails.",
      "React Native client with barcode scanning, role-based access, and offline-safe operations.",
    ],
  },
  {
    slug: "payroll-studio",
    title: "Payroll Studio — Payroll & HR",
    blurb:
      "A custom payroll & HR platform for an Indian SMB — biometric attendance, a three-pass payroll engine, and government-submission-ready statutory reports (PF, ESIC, PT, TDS).",
    tags: ["Next.js", "React 19", "Express", "MySQL"],
    image: "/work/payroll.png",
    link: "#",
    category: "HR-Tech · Fintech",
    theme: "cream",
    stats: [
      { value: "400+", label: "employees" },
      { value: "Gov", label: "ready statutory reports" },
    ],
    role: "Full-Stack Engineer",
    timeline: "2026",
    year: "2026",
    overview:
      "An end-to-end payroll & HR web app built for a real client, in production. It integrates biometric attendance, a three-pass payroll engine mirrored on the frontend for exact payslip previews, and government-format statutory PDFs (PF, ESI, PT, TDS).",
    highlights: [
      "Three-pass payroll engine with frontend/backend parity for exact payslip previews.",
      "Government-format statutory reports — PF (12-column), ESI, PT summaries.",
      "Cypress E2E plus unit and testcontainers integration tests on the backend.",
    ],
  },
  {
    slug: "enterprise-chat",
    title: "Enterprise Chat — Communication Suite",
    blurb:
      "A WhatsApp-style real-time enterprise chat for admins and employees — Redis-backed presence, media sharing, read receipts, and push notifications across iOS, Android, and web.",
    tags: ["React Native", "Socket.io", "Node.js", "Redis"],
    image: "/work/enterprise-chat.png",
    link: "#",
    category: "Enterprise Communication",
    theme: "cream",
    stats: [
      { value: "500+", label: "users" },
      { value: "Real-time", label: "presence & delivery" },
    ],
    role: "Mobile & Backend Engineer",
    timeline: "2025",
    year: "2025",
    overview:
      "A real-time enterprise chat platform with Redis-backed heartbeat presence, one-way typed state flow (backend → socket → Redux → UI), and secure multi-device sessions with admin-controlled force-logout. Built with Expo for iOS, Android, and web.",
    highlights: [
      "Redis-backed presence with live online/offline and read events over Socket.io.",
      "Role-based administration, moderated chat requests, and secure multi-device sessions.",
      "Cross-platform Expo client with a typed API/socket layer and thin screens.",
    ],
  },
  {
    slug: "billreward",
    title: "BillReward — Scan Bills, Earn Cashback",
    blurb:
      "A mobile-first cashback platform where users upload purchase bills and an AI OCR pipeline (FastAPI + Google Vision + GPT-4o) extracts and verifies them for rewards.",
    tags: ["Expo", "FastAPI", "Node.js", "AI / OCR"],
    image: "/work/billreward.png",
    link: "#",
    category: "Consumer Fintech · AI",
    theme: "cream",
    stats: [
      { value: "AI", label: "OCR extraction" },
      { value: "iOS/Android", label: "+ admin console" },
    ],
    role: "Full-Stack & AI Engineer",
    timeline: "2025",
    year: "2025",
    overview:
      "A cashback app where users upload bills that flow through an AI extraction pipeline — pypdf and OpenCV + Google Vision for text, GPT-4o for parsing — with a Node.js backend and a Next.js admin console for review, payouts, and analytics.",
    highlights: [
      "AI OCR pipeline combining Google Vision and GPT-4o for reliable bill extraction.",
      "Expo app with OTA updates plus a Next.js admin console for review and payouts.",
      "Typed Node.js backend with the Result pattern, Zod validation, and cursor pagination.",
    ],
  },
  {
    slug: "uttarakhand-next",
    title: "Uttarakhand Next — Digital News",
    blurb:
      "A premium digital news publication powered by a modern GraphQL backend (Apollo + MySQL) and a Next.js frontend with optimized imagery.",
    tags: ["Next.js", "GraphQL", "Apollo", "MySQL"],
    image: "/work/uttarakhand-next.png",
    link: "https://un-frontend-neon.vercel.app/",
    category: "Media · Publishing",
    theme: "cream",
    stats: [
      { value: "GraphQL", label: "Apollo backend" },
      { value: "Live", label: "deployed on Vercel" },
    ],
    role: "Full-Stack Engineer",
    timeline: "2025",
    year: "2025",
    overview:
      "A premium digital publication chronicling Uttarakhand's socio-economic and cultural stories, powered by an Apollo GraphQL backend (Node.js, Express 5, MySQL) and a Next.js frontend with optimized imagery.",
    highlights: [
      "Apollo Server GraphQL API over Express 5 and MySQL 8.",
      "Next.js frontend with editorial pages, archives, and optimized images.",
      "Deployed and live on Vercel.",
    ],
  },
  {
    slug: "billbridge",
    title: "BillBridge OCR — Bills to Excel / Tally",
    blurb:
      "Point a camera at any bill and it lands as clean, structured rows in Excel or Tally — an AI OCR + LLM parsing pipeline with batch processing.",
    tags: ["FastAPI", "Google Vision", "LLM", "Node.js"],
    image: "/work/billbridge.png",
    link: "#",
    category: "B2B Productivity · AI",
    theme: "cream",
    stats: [
      { value: "Batch", label: "bill processing" },
      { value: "Excel/Tally", label: "structured export" },
    ],
    role: "Backend & AI Engineer",
    timeline: "2026",
    year: "2026",
    overview:
      "A bill-to-spreadsheet automation tool: photograph any bill and it becomes clean, structured rows in Excel or Tally, using the same proven OCR + LLM pipeline as BillReward with batch processing for stacks of bills.",
    highlights: [
      "OCR + LLM pipeline (OpenCV, Google Vision, LLM parsing) that returns structured rows, not raw text.",
      "Batch mode to process a folder or stack of bills in one go.",
      "Direct export to Excel and Tally formats.",
    ],
  },
];

export const featuredProjects = projects.filter((p) => p.featured);

export function getProject(slug: string) {
  return projects.find((p) => p.slug === slug);
}

export type Experience = {
  title: string;
  company: string;
  link?: string;
  location?: string;
  date: string;
  points: string[];
  kind: "work" | "opensource";
};

export const experiences: Experience[] = [
  {
    title: "Software Engineer Intern",
    company: "OpsHub, Inc.",
    link: "https://www.opshub.com/",
    location: "Ahmedabad",
    date: "May 2026 – Jul 2026",
    kind: "work",
    points: [
      "Resolved production Azure DevOps synchronization failures in OpsHub Integration Manager — Test Plan/Suite links, special-character Area & Iteration paths, and large-scale reference-field mapping — restoring reliable enterprise sync.",
      "Built automatic SSL certificate renewal with live recovery, enabling dynamic certificate updates without server restarts and improving secure-integration reliability.",
      "Enhanced the Jenkins CI/CD pipeline to publish automated test reports directly to pull requests, speeding up code review with immediate access to test results.",
    ],
  },
  {
    title: "Full-Stack Engineer",
    company: "Shital Infotech",
    link: "https://www.shitalinfotech.com/",
    location: "Ahmedabad",
    date: "Mar 2026 – May 2026",
    kind: "work",
    points: [
      "Engineered a production payroll & HR platform for 400+ employees with biometric attendance and auditable payroll — cutting manual payroll work by 80%+.",
      "Automated statutory payroll (PF, ESIC, Professional Tax, TDS, Gujarat Form 5) into government-submission-ready reports, improving accuracy and compliance.",
    ],
  },
  {
    title: "iOS Mobile Developer",
    company: "Newtech Infosoft",
    link: "https://newtechinfosoft.com/",
    location: "Ahmedabad",
    date: "Nov 2025 – Dec 2025",
    kind: "work",
    points: [
      "Delivered a real-time enterprise communication platform for 500+ users with presence, media sharing, read receipts, and push notifications.",
      "Centralized communication with role-based administration, moderated chat requests, and secure multi-device sessions.",
    ],
  },
  {
    title: "Software Engineer Intern (Web & Mobile)",
    company: "BasicTech",
    link: "https://basictech.in/",
    location: "Remote",
    date: "Jun 2025 – Oct 2025",
    kind: "work",
    points: [
      "Built Go-ToIMS, a multi-tenant inventory platform, reducing manual operations by 65% and improving fulfillment speed by 30%.",
      "Established CI/CD delivery workflows, increasing deployment reliability by 90%.",
    ],
  },
  {
    title: "Open Source Contributor",
    company: "Webpack · CNCF Backstage · C2SI",
    link: "https://github.com/samarthsinh2660",
    date: "Dec 2025 – Present",
    kind: "opensource",
    points: [
      "Authored 6+ merged PRs to Webpack core — runtime errors, export analysis, stats output, and regex generation — improving compiler correctness.",
      "Landed 4+ PRs to CNCF Backstage fixing table layouts, catalog tag rendering, and nested accordion state.",
      "Shipped 7+ accepted PRs to C2SI (Webiu) improving UI, API versioning, error handling, and backend test reliability.",
    ],
  },
];

/**
 * Tech stack — rendered as shields.io badges in a marquee. Split into rows so
 * they can scroll in alternating directions.
 */
const badge = (label: string, logo: string, color: string, logoColor = "white") =>
  `https://img.shields.io/badge/${label}-${color}?style=for-the-badge&logo=${logo}&logoColor=${logoColor}`;

export const techRows: string[][] = [
  // Languages
  [
    badge("C", "c", "00599C"),
    badge("C%23", "csharp", "239120"),
    badge("C%2B%2B", "cplusplus", "00599C"),
    badge("Java", "openjdk", "ED8B00"),
    badge("Python", "python", "3670A0", "ffdd54"),
    badge("Go", "go", "00ADD8"),
    badge("Dart", "dart", "0175C2"),
    badge("PHP", "php", "777BB4"),
    badge("TypeScript", "typescript", "007ACC"),
    badge("JavaScript", "javascript", "323330", "F7DF1E"),
    badge("HTML5", "html5", "E34F26"),
    badge("CSS3", "css3", "1572B6"),
    badge("Bash", "gnubash", "121011"),
    badge("PowerShell", "powershell", "5391FE"),
  ],
  // Frameworks & libraries
  [
    badge("React", "react", "20232a", "61DAFB"),
    badge("React%20Native", "react", "20232a", "61DAFB"),
    badge("Next.js", "nextdotjs", "000000"),
    badge("Node.js", "nodedotjs", "6DA55F"),
    badge("Express", "express", "404d59", "61DAFB"),
    badge("NestJS", "nestjs", "E0234E"),
    badge("Redux", "redux", "593d88"),
    badge("React%20Query", "reactquery", "FF4154"),
    badge("React%20Router", "reactrouter", "CA4245"),
    badge("Tailwind%20CSS", "tailwindcss", "38B2AC"),
    badge("Bootstrap", "bootstrap", "8511FA"),
    badge("Three.js", "threedotjs", "000000"),
    badge("Flutter", "flutter", "02569B"),
    badge("Expo", "expo", "1C1E24"),
    badge("Angular", "angular", "DD0031"),
    badge("Django", "django", "092E20"),
    badge("Flask", "flask", "000000"),
    badge("FastAPI", "fastapi", "005571"),
    badge("GraphQL", "graphql", "E10098"),
    badge("Apollo", "apollographql", "311C87"),
    badge("Vite", "vite", "646CFF"),
    badge("Webpack", "webpack", "8DD6F9", "black"),
    badge("Streamlit", "streamlit", "FE4B4B"),
  ],
  // Data, ML & databases
  [
    badge("MongoDB", "mongodb", "4ea94b"),
    badge("MySQL", "mysql", "4479A1"),
    badge("PostgreSQL", "postgresql", "316192"),
    badge("Redis", "redis", "DD0031"),
    badge("SQLite", "sqlite", "07405e"),
    badge("SQL%20Server", "microsoftsqlserver", "CC2927"),
    badge("Prisma", "prisma", "3982CE"),
    badge("Supabase", "supabase", "3ECF8E"),
    badge("Appwrite", "appwrite", "FD366E"),
    badge("Firebase", "firebase", "039BE5"),
    badge("PyTorch", "pytorch", "EE4C2C"),
    badge("TensorFlow", "tensorflow", "FF6F00"),
    badge("scikit--learn", "scikitlearn", "F7931E"),
    badge("NumPy", "numpy", "013243"),
    badge("Pandas", "pandas", "150458"),
    badge("Matplotlib", "matplotlib", "3F4F75"),
    badge("Plotly", "plotly", "3F4F75"),
    badge("SciPy", "scipy", "0C55A5"),
  ],
  // Cloud, DevOps & tools
  [
    badge("AWS", "amazonwebservices", "FF9900"),
    badge("Azure", "microsoftazure", "0072C6"),
    badge("Google%20Cloud", "googlecloud", "4285F4"),
    badge("Cloudflare", "cloudflare", "F38020"),
    badge("Vercel", "vercel", "000000"),
    badge("Netlify", "netlify", "000000", "00C7B7"),
    badge("Render", "render", "46E3B7"),
    badge("Docker", "docker", "0db7ed"),
    badge("Nginx", "nginx", "009639"),
    badge("Jenkins", "jenkins", "2C5263"),
    badge("GitHub%20Actions", "githubactions", "2671E5"),
    badge("Git", "git", "F05033"),
    badge("GitHub", "github", "121011"),
    badge("Jest", "jest", "C21325"),
    badge("Vitest", "vitest", "252529", "FCC72B"),
    badge("Playwright", "playwright", "2EAD33"),
    badge("Cypress", "cypress", "69D3A7"),
    badge("Selenium", "selenium", "43B02A"),
    badge("ESLint", "eslint", "4B3263"),
    badge("Postman", "postman", "FF6C37"),
    badge("Jira", "jira", "0A0FFF"),
    badge("npm", "npm", "CB3837"),
    badge("Yarn", "yarn", "2C8EBB"),
  ],
];
