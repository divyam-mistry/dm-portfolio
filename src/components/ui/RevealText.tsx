"use client";

import { motion, type Variants } from "framer-motion";
import { cn } from "@/lib/utils";

const TAGS = {
  span: motion.span,
  h1: motion.h1,
  h2: motion.h2,
  h3: motion.h3,
  p: motion.p,
} as const;

interface RevealTextProps {
  text: string;
  as?: keyof typeof TAGS;
  className?: string;
  delay?: number;
  stagger?: number;
  once?: boolean;
}

const container: Variants = {
  hidden: {},
  visible: (stagger: number) => ({
    transition: { staggerChildren: stagger },
  }),
};

const word: Variants = {
  hidden: { opacity: 0, y: "100%" },
  visible: {
    opacity: 1,
    y: "0%",
    transition: { duration: 0.7, ease: [0.16, 1, 0.3, 1] },
  },
};

export default function RevealText({
  text,
  as: Tag = "span",
  className,
  delay = 0,
  stagger = 0.06,
  once = true,
}: RevealTextProps) {
  const words = text.split(" ");
  const MotionTag = TAGS[Tag];

  return (
    <MotionTag
      className={cn("inline-block", className)}
      initial="hidden"
      whileInView="visible"
      viewport={{ once, margin: "-10%" }}
      variants={container}
      custom={stagger}
      transition={{ delayChildren: delay }}
    >
      {words.map((w, i) => (
        <span key={i} className="inline-block overflow-hidden pb-[0.15em] align-bottom">
          <motion.span variants={word} className="inline-block">
            {w}
            {i !== words.length - 1 ? " " : ""}
          </motion.span>
        </span>
      ))}
    </MotionTag>
  );
}
