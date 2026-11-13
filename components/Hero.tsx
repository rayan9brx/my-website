export default function Hero() {
  return (
    <section className="mx-auto max-w-4xl px-6 py-24">
      <h1 className="text-4xl font-bold sm:text-6xl">Hi, I&apos;m Rayan 👋</h1>
      <p className="mt-6 max-w-xl text-lg text-gray-600 dark:text-gray-400">
        I build things with AI and share the journey in public.
      </p>
      <div className="mt-8 flex gap-4">
        <a
          href="https://x.com/Barga_Ray"
          target="_blank"
          rel="noopener noreferrer"
          className="rounded-lg bg-black px-5 py-2 text-white dark:bg-white dark:text-black"
        >
          Follow on X
        </a>
        <a
          href="https://github.com/YOUR_USERNAME"
          target="_blank"
          rel="noopener noreferrer"
          className="rounded-lg border border-gray-300 px-5 py-2 dark:border-gray-700"
        >
          GitHub
        </a>
      </div>
    </section>
  );
}