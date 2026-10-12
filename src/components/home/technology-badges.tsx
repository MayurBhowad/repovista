const VISIBLE_TECHNOLOGIES = 4;

export function TechnologyBadges({
  technologies,
}: {
  technologies: readonly string[];
}) {
  if (technologies.length === 0) {
    return null;
  }

  const visible = technologies.slice(0, VISIBLE_TECHNOLOGIES);
  const hiddenCount = technologies.length - visible.length;

  return (
    <ul aria-label="Technologies" className="flex flex-wrap gap-2">
      {visible.map((technology) => (
        <li key={technology}>
          <span className="inline-flex max-w-full items-center rounded-full border border-border bg-secondary px-2.5 py-1 text-xs font-medium text-secondary-foreground">
            <span className="truncate">{technology}</span>
          </span>
        </li>
      ))}
      {hiddenCount > 0 ? (
        <li>
          <span className="inline-flex items-center rounded-full border border-border bg-secondary px-2.5 py-1 text-xs font-medium text-secondary-foreground">
            <span className="sr-only">
              {hiddenCount} more {hiddenCount === 1 ? "technology" : "technologies"}
            </span>
            <span aria-hidden="true">+{hiddenCount}</span>
          </span>
        </li>
      ) : null}
    </ul>
  );
}
