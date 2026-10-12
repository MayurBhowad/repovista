export function Hero() {
  return (
    <section aria-labelledby="hero-heading" className="max-w-3xl">
      <p className="text-sm font-medium text-primary">Collection</p>
      <h1
        id="hero-heading"
        className="mt-3 text-4xl font-semibold tracking-tight text-balance sm:text-5xl"
      >
        Explore projects, not repositories.
      </h1>
      <p className="mt-5 max-w-2xl text-lg leading-relaxed text-muted-foreground">
        A calm place to see what a project is, why it was built, and why it
        matters. Stars and forks stay nearby, without taking over the story.
      </p>
      <a
        href="#projects"
        className="mt-8 inline-flex min-h-11 items-center rounded-full bg-primary px-5 text-sm font-medium text-primary-foreground outline-none transition-colors hover:bg-primary/90 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
      >
        Browse projects
      </a>
    </section>
  );
}
