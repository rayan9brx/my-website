export type InfoField = { label: string; value: string };
export type FocusItem = { title: string; text: string };
export type Stat = { value: string; label: string };

export const bio: InfoField[] = [
  { label: "Current role", value: "Frontend Development Intern – UI/UX " },
  { label: "Education", value: "Otto-von-Guericke University Magdeburg" },
  { label: "Location", value: "Germany" },
  { label: "Languages", value: "English, German, French, Arabic" },
];

export const focus: FocusItem[] = [
  {
    title: "Web Development",
    text: "Building modern, responsive apps with React, Next.js, and TypeScript.",
  },
  {
    title: "AI Products",
    text: "Exploring how to build useful products with AI and sharing it in public.",
  },
];

export const achievements: string[] = [
  "Built and deployed this personal website",
  "Building in public on X as @Barga_Ray",
];

export const stats: Stat[] = [
  { value: "1", label: "Project built" },
  { value: "2025", label: "Started building" },
  { value: "Full Stack & AI", label: "Main focus" },
];