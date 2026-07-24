/**
 * Content for Ankit Dularia's portfolio. Edit values here and they flow
 * through every component.
 */

export const profile = {
  name: "Ankit Dularia",
  firstName: "Ankit",
  role: "A User Experience Designer",
  /** hero statement band */
  statement:
    "At the heart of my design practice, I fuse storytelling with strategy to craft experiences that inform, engage, and inspire. My interfaces don't just solve problems, they tell stories that make technology feel human.",
  location: "Available for work",
  email: "ux.ankitdularia@gmail.com",
  resumeHref: "#",
  bio: "I'm Ankit Dularia — a User Experience Designer, Interaction Designer and Framer Developer passionate about crafting meaningful, intuitive, and lasting digital experiences.",
  linkedin: "https://www.linkedin.com/",
  instagram: "https://www.instagram.com/",
  brand: "AD Communications",
  socials: [
    { label: "LinkedIn", href: "https://www.linkedin.com/" },
    { label: "Instagram", href: "https://www.instagram.com/" },
  ],
};

export const aboutStats = [
  { value: "5+", label: "Years of Experience" },
  { value: "18+", label: "Completed Projects" },
  { value: "20+", label: "Clients on Worldwide" },
];

/** "What I can do for you" accordion */
export type Service = {
  title: string;
  points: string[];
};

export const servicesIntro =
  "As a digital designer, I am a visual storyteller, crafting experiences that connect deeply and spark creativity.";

export const services: Service[] = [
  {
    title: "UX/UI Design",
    points: [
      "Wireframing and prototyping",
      "User Interface design for web and mobile apps",
      "Usability testing and user feedback analysis",
      "Interaction design and micro-animations",
    ],
  },
  {
    title: "Graphic Design",
    points: [
      "Logo and brand identity design",
      "Social media graphics and ad creatives",
      "Infographics and data visualization",
      "Custom illustrations and icons",
    ],
  },
  {
    title: "Web Design",
    points: [
      "Responsive website design",
      "Landing page design and optimization",
      "Framer development and customization",
      "Website maintenance and updates",
    ],
  },
  {
    title: "Branding",
    points: [
      "Brand strategy and identity development",
      "Visual style guide creation",
      "Typography and color scheme selection",
      "Brand storytelling and messaging",
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
    slug: "clueless",
    title: "Making the Daily Dressing Dilemma Easier with AI",
    blurb:
      "Clueless understands your preferences and uses AI to make getting dressed smarter, helping you express yourself and turning the daily dressing dilemma into something fun and personal.",
    tags: ["Academic Project", "App", "8 min read"],
    image: "/ankit/sJoVppazDTKiw30wSRBfsg5jtFQ.png",
    link: "#",
    category: "Academic Project",
    theme: "red",
    featured: true,
    stats: [
      { value: "80%", label: "Task Success Rate" },
      { value: "2x", label: "Improvement in User Confidence" },
    ],
    role: "UX / UI Designer",
    timeline: "2024",
    year: "2024",
    overview:
      "Clueless is an AI-powered styling companion. It learns your wardrobe and personal taste, then turns the daily dressing dilemma into a fast, delightful, and personal experience.",
    highlights: [
      "AI-driven outfit recommendations based on personal preferences.",
      "Playful, expressive interface that makes getting dressed fun.",
      "Improved task success rate to 80% in usability testing.",
    ],
  },
  {
    slug: "great-place-to-work",
    title: "From Connection to Control",
    blurb:
      "Great Place to Work Combines a Professional Community App With a No-Code Admin Dashboard That Simplifies Management and Empowers Growth",
    tags: ["Community App", "App/Fourm", "5 min read"],
    image: "/ankit/MYnGe4rBtgw4bEiAYGrb1Yol0.png",
    link: "#",
    category: "Community App",
    theme: "cream",
    featured: true,
    stats: [
      { value: "2x", label: "Higher Engagement Predicted" },
      { value: "40%", label: "Reduced Navigation Time" },
    ],
    role: "Product Designer",
    timeline: "2024",
    year: "2024",
    overview:
      "Great Place to Work pairs a professional community app with a no-code admin dashboard, giving teams a single place to connect, manage, and grow — without touching code.",
    highlights: [
      "Professional community app with a no-code admin dashboard.",
      "Predicted 2x higher engagement across member touchpoints.",
      "Reduced navigation time by 40% with a simplified information architecture.",
    ],
  },
];

export const featuredProjects = projects.filter((p) => p.featured);

export function getProject(slug: string) {
  return projects.find((p) => p.slug === slug);
}
