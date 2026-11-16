import { FaGithub, FaLinkedinIn } from "react-icons/fa";
import { contact } from "@/data/contact";

const links = [
  { href: contact.github, label: "GitHub", icon: FaGithub },
  { href: contact.linkedin, label: "LinkedIn", icon: FaLinkedinIn },
];

export default function SocialLinks() {
  return (
    <ul className="fixed bottom-6 left-6 z-40 hidden flex-col gap-5 md:flex">
      {links.map(({ href, label, icon: Icon }) => (
        <li key={label}>
          <a
            href={href}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={label}
            className="block text-2xl text-foreground/80 transition-all duration-200 hover:-translate-y-0.5 hover:text-accent"
          >
            <Icon />
          </a>
        </li>
      ))}
    </ul>
  );
}