import type { IconType } from "react-icons";
import {
  SiJavascript,
  SiTypescript,
  SiPython,
  SiReact,
  SiNextdotjs,
  SiTailwindcss,
  SiNodedotjs,
  SiSupabase,
  SiGit,
  SiGithub,
  SiVercel,
  SiFigma,
} from "react-icons/si";

export type Tech = {
  name: string;
  category: string;
  icon: IconType;
};

export const techStack: Tech[] = [
  { name: "JavaScript", category: "Language", icon: SiJavascript },
  { name: "TypeScript", category: "Language", icon: SiTypescript },
  { name: "Python", category: "Language", icon: SiPython },
  { name: "React", category: "Frontend", icon: SiReact },
  { name: "Next.js", category: "Frontend", icon: SiNextdotjs },
  { name: "Tailwind CSS", category: "Frontend", icon: SiTailwindcss },
  { name: "Node.js", category: "Backend", icon: SiNodedotjs },
  { name: "Supabase", category: "Database", icon: SiSupabase },
  { name: "Git", category: "Tools", icon: SiGit },
  { name: "GitHub", category: "Tools", icon: SiGithub },
  { name: "Vercel", category: "Cloud & DevOps", icon: SiVercel },
  { name: "Figma", category: "Tools", icon: SiFigma },
];