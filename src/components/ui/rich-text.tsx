import { parseBlocks } from "@/lib/text";

/** Renders the simple content format (## headings, - lists, paragraphs) safely as React elements. */
export function RichText({ content }: { content: string }) {
  const blocks = parseBlocks(content);
  const out: React.ReactNode[] = [];
  let list: string[] = [];

  const flush = (key: number) => {
    if (list.length) {
      out.push(
        <ul key={`ul-${key}`} className="list-disc space-y-1.5 pl-5">
          {list.map((li, i) => <li key={i}>{li}</li>)}
        </ul>,
      );
      list = [];
    }
  };

  blocks.forEach((b, i) => {
    if (b.type === "li") return void list.push(b.text);
    flush(i);
    if (b.type === "h2") out.push(<h2 key={i} className="mt-10 text-2xl text-ink">{b.text}</h2>);
    else if (b.type === "h3") out.push(<h3 key={i} className="mt-8 text-xl text-ink">{b.text}</h3>);
    else out.push(<p key={i}>{b.text}</p>);
  });
  flush(blocks.length);

  return <div className="space-y-5 text-[16px] leading-relaxed text-ink/85">{out}</div>;
}
