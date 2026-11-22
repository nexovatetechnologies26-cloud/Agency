import Image from "next/image";

/**
 * An admin-provided image URL served through Next's image optimiser: resized to the
 * size it is shown at, converted to AVIF/WebP and cached — a 4 MB photo arrives as ~60 KB.
 *
 * - default: fills its parent (the parent must be positioned and sized, e.g. `relative aspect-[4/5]`)
 * - `natural`: full width with the image's own height (article and case-study images)
 * Anything that is not an http(s) or site-relative URL is passed through untouched.
 */
export function RemoteImage({
  src,
  alt,
  sizes,
  className,
  priority,
  natural,
}: {
  src: string;
  alt: string;
  sizes: string;
  className?: string;
  priority?: boolean;
  natural?: boolean;
}) {
  const optimisable = /^https?:\/\//i.test(src) || src.startsWith("/");
  if (natural) {
    return <Image src={src} alt={alt} width={1600} height={1000} sizes={sizes} priority={priority} unoptimized={!optimisable} className={className} />;
  }
  return <Image src={src} alt={alt} fill sizes={sizes} priority={priority} unoptimized={!optimisable} className={className} />;
}
