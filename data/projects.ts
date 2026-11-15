export type Project = {
  title: string;
  description: string;
  tags: string[];
  github?: string;
  live?: string;
};

export const projects: Project[] = [
  {
    title: "Personal Website",
    description:
      "My portfolio, built from scratch with Next.js, TypeScript, and Tailwind CSS. It has a custom dark theme, animated sections, and typed data files.",
    tags: ["Next.js", "TypeScript", "Tailwind CSS"],
    github: "https://github.com/rayan9brx/my-website",
    live: "https://rayanbrigui.vercel.app",
  },
];