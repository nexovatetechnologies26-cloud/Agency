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
      {eyebrow && <p className="label">{eyebrow}</p>}
      <Tag
        className={clsx(
          "serif-heading mt-4",
          Tag === "h1" ? "text-[2.4rem] leading-[1.04] md:text-[3.5rem]" : "text-[2rem] leading-[1.08] md:text-[2.75rem]",
        )}
      >
        {title}
      </Tag>
      {description && <p className="mt-5 text-body-lg text-muted">{description}</p>}
    </div>
  );
}
