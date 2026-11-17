export type Project = {
  title: string;
  description: string;
  tags: string[];
  github?: string;
  live?: string;
};

export const projects: Project[] = [
  {
    title: "Restaurant Website",
    description:
      "A full-stack restaurant website with online reservations, an admin dashboard, and an AI menu assistant.",
    tags: ["React", "Spring Boot", "PostgreSQL", "AI"],
    github: "https://github.com/rayan9brx/Restaurant-website",
  },
  {
    title: "Conduit Blog Platform",
    description:
      "A blogging platform with user accounts and JWT authentication.",
    tags: ["ASP.NET Core", "Vue.js", "JWT"],
    // github: "https://github.com/rayan9brx/YOUR-REPO",
  },
  {
    title: "Personal Website",
    description:
      "My portfolio, built from scratch with Next.js, TypeScript, and Tailwind CSS. It has a custom dark theme, animated sections, and typed data files.",
    tags: ["Next.js", "TypeScript", "Tailwind CSS"],
    github: "https://github.com/rayan9brx/my-website",
    live: "https://rayanbrigui.vercel.app",
  },
];