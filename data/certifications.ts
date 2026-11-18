export type CertificationCategory = "python" | "ai" | "cloud" | "data";

export type Certification = {
  title: string;
  issuer: string;
  /** Display string in the form "Mon YYYY", e.g. "May 2025". */
  issued: string;
  description?: string;
  tags?: string[];
  category?: CertificationCategory;
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
    category: "ai",
    description:
      "A course on AI-assisted programming with Claude Code, including subagents.",
    tags: ["Claude Code", "AI-Assisted Programming", "Subagents"],
    // credentialUrl: "PASTE_LINK_FROM_LINKEDIN",
  },
  {
    title: "Claude Code in Action",
    issuer: "Anthropic",
    issued: "Jun 2026",
    category: "ai",
    // credentialUrl: "PASTE_LINK_FROM_LINKEDIN",
  },
  {
    title: "AWS Cloud Technical Essentials",
    issuer: "Amazon Web Services (AWS)",
    issued: "Apr 2026",
    category: "cloud",
    // credentialUrl: "PASTE_LINK_FROM_LINKEDIN",
  },
  {
    title: "Tools for Data Science",
    issuer: "IBM",
    issued: "Dec 2025",
    category: "data",
    // credentialUrl: "PASTE_LINK_FROM_LINKEDIN",
  },
  {
    title: "Linear Algebra for Machine Learning and Data Science",
    issuer: "DeepLearning.AI",
    issued: "Oct 2025",
    category: "data",
    // credentialUrl: "PASTE_LINK_FROM_LINKEDIN",
  },

  // ---------- Python ----------
  {
    title: "Programming for Everybody (Getting Started with Python)",
    issuer: "University of Michigan",
    issued: "Oct 2025",
    category: "python",
    // credentialUrl: "PASTE_LINK_FROM_LINKEDIN",
  },
  {
    title: "Intermediate Python",
    issuer: "DataCamp",
    issued: "Jan 2025",
    category: "python",
    // credentialUrl: "PASTE_LINK_FROM_LINKEDIN",
  },
  {
    title: "Introduction to Linear Modeling in Python",
    issuer: "DataCamp",
    issued: "Jan 2025",
    category: "python",
    // credentialUrl: "PASTE_LINK_FROM_LINKEDIN",
  },
  {
    title: "Data Manipulation with pandas",
    issuer: "DataCamp",
    issued: "Dec 2024",
    category: "python",
    // credentialUrl: "PASTE_LINK_FROM_LINKEDIN",
  },
  {
    title: "Intermediate Predictive Analytics in Python",
    issuer: "DataCamp",
    issued: "Dec 2024",
    category: "python",
    // credentialUrl: "PASTE_LINK_FROM_LINKEDIN",
  },
  {
    title: "Data Types in Python",
    issuer: "DataCamp",
    issued: "Dec 2024",
    category: "python",
    // credentialUrl: "PASTE_LINK_FROM_LINKEDIN",
  },
  {
    title: "Cleaning Data in Python",
    issuer: "DataCamp",
    issued: "Dec 2024",
    category: "python",
    // credentialUrl: "PASTE_LINK_FROM_LINKEDIN",
  },
];

// ---------- Helpers (deterministic, no Date objects) ----------

const MONTHS: Record<string, number> = {
  Jan: 0, Feb: 1, Mar: 2, Apr: 3, May: 4, Jun: 5,
  Jul: 6, Aug: 7, Sep: 8, Oct: 9, Nov: 10, Dec: 11,
};

/** Sortable number for an "issued" string like "May 2025" (0 if unparseable). */
function issuedKey(issued: string): number {
  const [month, year] = issued.trim().split(/\s+/);
  const y = Number.parseInt(year ?? "", 10);
  const m = MONTHS[(month ?? "").slice(0, 3)];
  return Number.isFinite(y) && m !== undefined ? y * 12 + m : 0;
}

/** Newest first; entries with the same date keep their order in the data. */
export function sortNewestFirst(list: Certification[]): Certification[] {
  return [...list].sort((a, b) => issuedKey(b.issued) - issuedKey(a.issued));
}

export const pythonCertifications = sortNewestFirst(
  certifications.filter((c) => c.category === "python"),
);

/** Unique values in first-seen order. */
export function unique<T>(values: T[]): T[] {
  return [...new Set(values)];
}

/** "A", "A and B", "A, B and C". */
export function formatList(items: string[]): string {
  if (items.length <= 1) return items.join("");
  return `${items.slice(0, -1).join(", ")} and ${items[items.length - 1]}`;
}
