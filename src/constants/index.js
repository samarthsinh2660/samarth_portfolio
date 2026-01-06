import {
  mobile,
  backend,
  web,
  javascript,
  typescript,
  html,
  css,
  reactjs,
  redux,
  tailwind,
  nodejs,
  git,
  docker,
  mongodb,
  webpack,
  newtech,
  bt,
  storeit,
  inventory,
  fluentify,
  codeconnect,
} from "../assets";

// Import new tech icons
import cpp from "../assets/tech/c++.png";
import mysql from "../assets/tech/mysql.png";
import postgresql from "../assets/tech/postgres.png";

export const navLinks = [
  {
    id: "about",
    title: "About",
  },
  {
    id: "work",
    title: "Work",
  },
  {
    id: "contact",
    title: "Contact",
  },
];

const services = [
  {
    title: "Web Developer",
    icon: web,
  },
  {
    title: "React Native Developer",
    icon: mobile,
  },
  {
    title: "Backend Developer",
    icon: backend,
  },
  {
    title: "System Architect",
    icon: backend,
  },
];

const technologies = [
  {
    name: "HTML 5",
    icon: html,
  },
  {
    name: "CSS 3",
    icon: css,
  },
  {
    name: "JavaScript",
    icon: javascript,
  },
  {
    name: "TypeScript",
    icon: typescript,
  },
  {
    name: "React JS",
    icon: reactjs,
  },
  {
    name: "Redux Toolkit",
    icon: redux,
  },
  {
    name: "Tailwind CSS",
    icon: tailwind,
  },
  {
    name: "Node JS",
    icon: nodejs,
  },
  {
    name: "MongoDB",
    icon: mongodb,
  },
  {
    name: "MySQL",
    icon: mysql,
  },
  {
    name: "PostgreSQL",
    icon: postgresql,
  },
  {
    name: "git",
    icon: git,
  },
  {
    name: "docker",
    icon: docker,
  },
];

const experiences = [
  {
    title: "Core Contributor",
    company_name: "Webpack",
    icon: webpack,
    iconBg: "#ffffff",
    date: "December 2025 – Present",
    points: [
      "Authored 6+ merged pull requests to Webpack core, fixing export analysis, stats configuration bugs, runtime error handling, and CommonJS edge cases with full regression test coverage.",
      "Contributed internal optimizations demonstrating a 21% improvement in CodSpeed production benchmarks.",
    ],
  },
  {
    title: "Software Engineer Intern (Web & Mobile)",
    company_name: "BasicTech",
    icon: bt,
    iconBg: "#0d0d0d",
    date: "June 2025 – October 2025",
    points: [
      "Engineered HillQuill, a production-grade article publishing platform using Next.js, Node.js, MySQL, and analytics with role-based admin and author panels; increased user time-on-site by 40%.",
      "Designed and deployed Go-ToIMS, a multi-tenant inventory and manufacturing SaaS using React Native, Node.js, MySQL, Docker, and Azure with per-tenant database isolation ensuring zero cross-tenant data leakage.",
      "Orchestrated real-time inventory tracking and BOM-driven manufacturing workflows, reducing manual stock operations by 65% and improving order fulfillment speed by 30%.",
      "Automated CI/CD pipelines via GitHub Actions, reducing deployment failures by 80% and accelerating release cycles.",
    ],
  },
  {
    title: "Full-Stack Mobile Engineer (Freelance)",
    company_name: "NewTech InfoSoft",
    icon: newtech,
    iconBg: "#ffffff",
    date: "November 2025 – December 2025",
    points: [
      "Designed and developed a private enterprise-grade internal communication mobile app for 500 employees using React Native (Expo), Node.js, MySQL, Redis, and WebSockets.",
      "Enabled real-time 1-to-1 and group messaging with offline sync and multi-device presence handling 500+ daily messages with sub-150ms latency.",
      "Architected role-based admin tooling with audit logs and Redis-backed pub/sub for reliable real-time updates across devices.",
      "Deployed Dockerized backend behind Nginx with Azure Blob Storage and APNs, reducing notification noise by 40%.",
    ],
  },
];

const testimonials = [
  {
    testimonial:
      "Samarth developed the chat application for us, and the overall experience was excellent. The app works smoothly and is highly responsive. He ensured strong performance, paid attention to efficiency, and delivered the project on time without any delays.",
    name: "Niraj Shah",
    designation: "Founder",
    company: "NewTech InfoSoft",
    image: "https://randomuser.me/api/portraits/men/1.jpg",
  },
  {
    testimonial:
      "I've had the pleasure of working with Samarth on several projects, and I can say without hesitation that he's one of the most capable individuals I've collaborated with. His intelligence is matched only by his exceptional work ethic. Samarth consistently demonstrates strong ownership and accountability, helping us deliver projects ahead of schedule. He's someone I can always count on.",
    name: "Pranav Pandey",
    designation: "CTO",
    company: "Basic Tech",
    image: "https://randomuser.me/api/portraits/men/1.jpg",
  },
  {
    testimonial:
      "During his internship at Basic Tech, Samarth quickly proved himself as a capable engineer by single-handedly building a fully functional Inventory Management mobile app. He leveraged AI tools to streamline development while maintaining top-tier quality. What started as a learning project is now actively used by our clients—a testament to his initiative, problem-solving, and impact.",
    name: "Rushabh Agrawal",
    designation: "Founder",
    company: "Basic Tech",
    image: "https://randomuser.me/api/portraits/men/1.jpg",
  },
];

const projects = [
  {
    name: "Code Connect Live",
    description:
      "A modern, real-time collaborative code editor platform that enables developers to code together seamlessly with advanced features like live editing, chat, whiteboard, AI assistance, and immersive UI effects.",
    tags: [
      {
        name: "Next.js",
        color: "blue-text-gradient",
      },
      {
        name: "TypeScript",
        color: "green-text-gradient",
      },
      {
        name: "Socket.IO",
        color: "pink-text-gradient",
      },
      {
        name: "MongoDB",
        color: "orange-text-gradient",
      },
    ],
    image: codeconnect,
    source_code_link: "https://github.com/",
  },
  {
    name: "StoreIt",
    description:
      "Cloud-based platform to securely upload, organize, and share files with intuitive dashboards, robust search, and easy collaboration.",
    tags: [
      {
        name: "Next.js",
        color: "blue-text-gradient",
      },
      {
        name: "Tailwind CSS",
        color: "green-text-gradient",
      },
      {
        name: "StoreIt",
        color: "pink-text-gradient",
      },
    ],
    image: storeit,
    source_code_link: "https://store-it-lovat-nine.vercel.app/",
  },
  {
    name: "Inventory Management",
    description:
      "Inventory management solution with intuitive dashboard, real-time stock alerts, secure user roles, powerful product and location tracking, and audit trails—engineered for reliability and ease of use.",
    tags: [
      {
        name: "react-native",
        color: "blue-text-gradient",
      },
      {
        name: "nodejs",
        color: "green-text-gradient",
      },
      {
        name: "Mysql",
        color: "pink-text-gradient",
      },
    ],
    image: inventory,
    source_code_link: "https://sam2333-bolt-expo-nativewind--hmvtjgkldt.expo.app/",
  },
  {
    name: "Fluentify",
    description:
      "AI-powered language learning platform with personalized courses, interactive contests, real-time voice practice, and intelligent chatbot assistance. Supports multiple languages including Spanish, French, German, Italian, Japanese, and Hindi.",
    tags: [
      {
        name: "React",
        color: "blue-text-gradient",
      },
      {
        name: "Vite",
        color: "green-text-gradient",
      },
      {
        name: "Tailwind CSS",
        color: "pink-text-gradient",
      },
      {
        name: "AI",
        color: "orange-text-gradient",
      },
    ],
    image: fluentify,
    source_code_link: "https://github.com/samarthsinh2660/Fluentify-Frontend",
  },
];

export { services, technologies, experiences, testimonials, projects };
