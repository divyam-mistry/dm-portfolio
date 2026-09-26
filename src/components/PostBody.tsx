import type { ReactNode } from "react";
import type { BlogBlock } from "@/lib/blog";

/** Renders `inline code` spans inside body text. */
function inline(text: string): ReactNode[] {
  return text.split(/(`[^`]+`)/g).map((part, i) =>
    part.startsWith("`") && part.endsWith("`") ? (
      <code key={i} className="rounded border border-rule bg-paper-raised/60 px-1 py-0.5 font-mono text-[0.85em]">
        {part.slice(1, -1)}
      </code>
    ) : (
      part
    ),
  );
}

export default function PostBody({ blocks }: { blocks: BlogBlock[] }) {
  return (
    <div className="space-y-6">
      {blocks.map((block, i) => {
        switch (block.type) {
          case "p":
            return (
              <p key={i} className="pretty text-[16px] leading-[1.8] text-ink-soft sm:text-[17px]">
                {inline(block.text)}
              </p>
            );
          case "h2":
            return (
              <h2 key={i} className="pt-6 font-serif text-[1.65rem] leading-tight text-ink">
                {block.text}
              </h2>
            );
          case "quote":
            return (
              <blockquote key={i} className="border-l-2 border-accent pl-5 font-serif text-xl italic text-ink">
                {block.text}
              </blockquote>
            );
          case "code":
            return (
              <pre
                key={i}
                className="overflow-x-auto rounded-lg border border-rule bg-paper-raised/60 p-4 font-mono text-[13px] leading-relaxed text-ink-soft"
              >
                <code>{block.code}</code>
              </pre>
            );
          case "ul":
            return (
              <ul key={i} className="space-y-3">
                {block.items.map((item, j) => (
                  <li
                    key={j}
                    className="pretty grid grid-cols-[1rem_1fr] gap-3 text-[16px] leading-[1.8] text-ink-soft sm:text-[17px]"
                  >
                    <span aria-hidden className="mt-[0.1em] text-accent">
                      —
                    </span>
                    <span>{inline(item)}</span>
                  </li>
                ))}
              </ul>
            );
        }
      })}
    </div>
  );
}
