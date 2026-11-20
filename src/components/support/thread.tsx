import clsx from "clsx";
import { fmtDateTime } from "@/lib/format";

type Msg = { _id?: string; body: string; authorName?: string | null; fromStaff?: boolean | null; createdAt?: string | null };

/** Conversation view. `staffView` flips which side is "mine". */
export function Thread({ messages, staffView = false }: { messages: Msg[]; staffView?: boolean }) {
  return (
    <ul className="space-y-4">
      {messages.map((m, i) => {
        const mine = staffView ? m.fromStaff : !m.fromStaff;
        return (
          <li key={m._id ?? i} className={clsx("flex", mine && "justify-end")}>
            <div className={clsx("max-w-[85%] rounded-2xl px-4 py-3 text-sm", mine ? "bg-brand text-white" : "border border-line bg-white")}>
              <p className="whitespace-pre-wrap">{m.body}</p>
              <p className={clsx("mt-1.5 text-[11px]", mine ? "text-white/70" : "text-muted")}>
                {m.authorName} · {fmtDateTime(m.createdAt)}
              </p>
            </div>
          </li>
        );
      })}
    </ul>
  );
}
