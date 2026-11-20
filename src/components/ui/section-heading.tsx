import clsx from "clsx";

export function SectionHeading({
  eyebrow,
  title,
  description,
  align = "left",
  as: Tag = "h2",
}: {
  eyebrow?: string;
  title: string;
  description?: string;
  align?: "left" | "center";
  as?: "h1" | "h2";
}) {
  return (
    <div className={clsx("max-w-2xl", align === "center" && "mx-auto text-center")}>
      {eyebrow && <p className="eyebrow">{eyebrow}</p>}
      <Tag className={clsx("mt-3 text-3xl leading-tight md:text-[2.5rem]", Tag === "h1" && "md:text-5xl")}>{title}</Tag>
      {description && <p className="mt-4 text-base leading-relaxed text-muted md:text-lg">{description}</p>}
    </div>
  );
}
