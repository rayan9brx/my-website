export type Project = {
  title: string;
  /** Short subtitle, e.g. "Blog Platform / Full Stack". */
  type: string;
  description: string;
  tools: string[];
  /** Lowercase path under /projects/, e.g. "/projects/restaurant.png". */
  image?: string;
  github?: string;
  live?: string;
};

export const projects: Project[] = [
  {
    title: "Restaurant Website",
    type: "Restaurant Platform / Full Stack",
    description:
      "A full-stack restaurant website with online reservations, an admin dashboard, and an AI menu assistant.",
    tools: ["React", "Spring Boot", "PostgreSQL", "AI"],
    github: "https://github.com/rayan9brx/Restaurant-website",
    image: "/projects/restaurant.png",
  },
  {
    title: "Conduit Blog Platform",
    type: "Blog Platform / Full Stack",
    description:
      "A full-stack blog platform based on the RealWorld specification, with user accounts, articles, comments and JWT authentication.",
    tools: [
      "ASP.NET Core",
      "C#",
      "Vue.js",
      "TypeScript",
      "Flutter",
      "SQLite",
      "JWT Authentication",
      "REST APIs",
    ],
    github: "https://github.com/rayan9brx/conduit-realworld-blog-platform",
    image: "/projects/conduit.png",
  },
  {
    title: "King's Last Castle",
    type: "Game / C# and MonoGame",
    description:
      "A tower-defense game focused on object-oriented game logic, enemy waves, towers, rendering and game-state management.",
    tools: ["C#", ".NET", "MonoGame", "Object-Oriented Programming"],
    github: "https://github.com/rayan9brx/kings-last-castle-monogame",
    image: "/projects/castle.png",
  },
  {
    title: "Finance Tracker",
    type: "Finance App / Full Stack",
    description:
      "A personal finance tracking application for managing income, expenses and transactions with a financial overview.",
    tools: ["Java", "Spring Boot", "TypeScript", "HTML", "CSS", "SQL"],
    image: "/projects/finance.png",
  },
  {
    title: "Personal Website",
    type: "Portfolio / Next.js",
    description:
      "My portfolio, built from scratch with Next.js, TypeScript and Tailwind CSS, with a custom dark theme, animated sections and an AI console.",
    tools: ["Next.js", "TypeScript", "Tailwind CSS"],
    github: "https://github.com/rayan9brx/my-website",
    live: "https://rayanbrigui.vercel.app",
    image: "/projects/website.png",
  },
];
