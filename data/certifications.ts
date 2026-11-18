export type Certification = {
  title: string;
  issuer: string;
  /** Display string, e.g. "May 2025". */
  issued: string;
  description: string;
  tags: string[];
  /** Shown as the large featured card. */
  featured?: boolean;
  /** Public link to the credential (e.g. from LinkedIn). */
  credentialUrl?: string;
  /** Path under /certificates/, e.g. "/certificates/stanford-ml.jpg". */
  image?: string;
};

export const certifications: Certification[] = [
  {
    title: "Supervised Machine Learning: Regression and Classification",
    issuer: "Stanford University",
    issued: "May 2025",
    featured: true,
    description:
      "A course on supervised machine learning, covering regression and classification.",
    tags: ["Machine Learning", "Regression", "Classification"],
    // credentialUrl: "PASTE_LINK_FROM_LINKEDIN",
    // image: "/certificates/stanford-ml.jpg",
  },
  {
    title: "Claude Code 101",
    issuer: "Anthropic",
    issued: "Jun 2026",
    description:
      "A course on AI-assisted programming with Claude Code, including subagents.",
    tags: ["Claude Code", "AI-Assisted Programming", "Subagents"],
    // credentialUrl: "PASTE_LINK_FROM_LINKEDIN",
  },
];
