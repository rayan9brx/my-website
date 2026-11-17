import type { IconType } from "react-icons";
import { FaJava } from "react-icons/fa";
import {
  SiJavascript,
  SiTypescript,
  SiPython,
  SiReact,
  SiNextdotjs,
  SiVuedotjs,
  SiTailwindcss,
  SiSpringboot,
  SiDotnet,
  SiNodedotjs,
  SiPostgresql,
  SiSupabase,
  SiGit,
  SiVercel,
  SiFigma,
} from "react-icons/si";

export type Tech = {
  name: string;
  category: string;
  icon: IconType;
};

export const techStack: Tech[] = [
  { name: "TypeScript", category: "Language", icon: SiTypescript },
  { name: "JavaScript", category: "Language", icon: SiJavascript },
  { name: "Java", category: "Language", icon: FaJava },
  { name: "Python", category: "Language", icon: SiPython },
  { name: "React", category: "Frontend", icon: SiReact },
  { name: "Next.js", category: "Frontend", icon: SiNextdotjs },
  { name: "Vue.js", category: "Frontend", icon: SiVuedotjs },
  { name: "Tailwind CSS", category: "Frontend", icon: SiTailwindcss },
  { name: "Spring Boot", category: "Backend", icon: SiSpringboot },
  { name: "ASP.NET Core", category: "Backend", icon: SiDotnet },
  { name: "Node.js", category: "Backend", icon: SiNodedotjs },
  { name: "PostgreSQL", category: "Database", icon: SiPostgresql },
  { name: "Supabase", category: "Database", icon: SiSupabase },
  { name: "Git & GitHub", category: "Tools", icon: SiGit },
  { name: "Vercel", category: "Cloud & DevOps", icon: SiVercel },
  { name: "Figma", category: "Design", icon: SiFigma },
];