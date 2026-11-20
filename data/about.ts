export type InfoField = { label: string; value: string };
export type FocusItem = { title: string; text: string };
export type Stat = { value: string; label: string };

export const bio: InfoField[] = [
  // Desktop fills column by column: first three on the left, last three on the right.
  { label: "Current role", value: "Frontend Development Intern" },
  { label: "Academic track", value: "B.Sc. Computer Science" },
  { label: "Location", value: "Magdeburg, Germany" },
  { label: "University", value: "Otto-von-Guericke University Magdeburg" },
  { label: "Program duration", value: "2023 – Present" },
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
  { value: "3+", label: "Project built" },
  { value: "2025", label: "Started building" },
  { value: "Full Stack & AI", label: "Main focus" },
];