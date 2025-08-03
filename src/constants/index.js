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
} from "../assets";

// Import new tech icons
import cpp from "../assets/tech/c++.png";
import mysql from "../assets/tech/mysql.png";
import postgresql from "../assets/tech/postgres.png";

// 👇 You must import your custom logo image files here, e.g.:
import isro from "../assets/isro.png";       // 🛰️ Your ISRO uploaded logo
import bt from "../assets/basictech.png";    // 🏢 Your BasicTech logo
import storeit from "../assets/project/storeit.png";    // 📁 StoreIt project
import inventory from "../assets/project/inventory-project.jpeg";    // 📦 Inventory project

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
    title: "Web & App Development Intern",
    company_name: "BasicTech",
    icon: bt,
    iconBg: "#0d0d0d",
    date: "May 2024 - Present",
    points: [
      "Built 'Hill Quill' – a tourism and logistics platform for Uttarakhand.",
      "Developed a full-stack inventory management system using React Native, Node.js, and PostgreSQL.",
      "Implemented CI/CD pipelines, integrated API services, and deployed on AWS.",
    ],
  },
  {
    title: "Flight Software Developer – CubeSat Mission",
    company_name: "PDEU | SSP-X ISRO Team",
    icon: isro,
    iconBg: "#1a1a1a",
    date: "Jan 2024 - Present",
    points: [
      "Part of the official SSP-X team at PDEU in collaboration with ISRO, developing onboard flight software for a CubeSat mission.",
      "Designing and implementing system architecture for fault-tolerant operations, telemetry, and real-time control loops.",
      "Researching RTOS choices (RTEMS, FreeRTOS, etc.) and developing error handling, data communication, and ground station interfacing modules.",
      "Contributing to an academic review paper on CubeSat software architecture and fault-tolerant frameworks — currently in progress.",
    ],
  },
];

const testimonials = [
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
];

export { services, technologies, experiences, testimonials, projects };
