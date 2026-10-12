"use client";

import { ImageIcon } from "lucide-react";
import Image from "next/image";
import { useState } from "react";
import { displayableImageSource } from "@/components/home/format";

export function ProjectImage({
  src,
  alt,
  sizes,
  priority = false,
}: {
  src: string | null;
  alt: string;
  sizes: string;
  priority?: boolean;
}) {
  const [failed, setFailed] = useState(false);
  const source = failed ? null : displayableImageSource(src);

  if (!source) {
    return <ImagePlaceholder />;
  }

  return (
    <div className="relative aspect-[16/10] bg-muted">
      {source.startsWith("/") ? (
        <Image
          src={source}
          alt={alt}
          fill
          sizes={sizes}
          priority={priority}
          className="object-cover"
          onError={() => setFailed(true)}
        />
      ) : (
        // Remote curated images load in the browser. They are not sent
        // through the image optimizer, which would have to fetch arbitrary hosts.
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={source}
          alt={alt}
          className="absolute inset-0 size-full object-cover"
          loading={priority ? "eager" : "lazy"}
          decoding="async"
          referrerPolicy="no-referrer"
          fetchPriority={priority ? "high" : "auto"}
          onError={() => setFailed(true)}
        />
      )}
    </div>
  );
}

function ImagePlaceholder() {
  return (
    <div
      aria-hidden="true"
      className="flex aspect-[16/10] items-center justify-center bg-accent/70 text-accent-foreground"
    >
      <ImageIcon className="size-8 opacity-70" />
    </div>
  );
}
