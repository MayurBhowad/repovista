import Link from "next/link";

export default async function RepositoryPage(
  props: PageProps<"/repositories/[name]">,
) {
  const { name } = await props.params;

  return (
    <div className="max-w-2xl">
      <p className="text-sm font-medium text-primary">Project</p>
      <h1 className="mt-3 text-4xl font-semibold tracking-tight break-words">
        {name}
      </h1>
      <p className="mt-4 text-lg text-muted-foreground">Coming soon.</p>
      <Link
        href="/"
        className="mt-8 inline-flex rounded-full text-sm font-medium text-primary underline-offset-4 outline-none hover:underline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-ring"
      >
        Back to projects
      </Link>
    </div>
  );
}
