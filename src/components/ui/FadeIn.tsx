"use client";

import { motion, type Variants } from "framer-motion";
import { type ReactNode } from "react";
import { cn } from "@/lib/utils";

const TAGS = {
  div: motion.div,
  li: motion.li,
} as const;

interface FadeInProps {
  children: ReactNode;
  as?: keyof typeof TAGS;
  className?: string;
  delay?: number;
  duration?: number;
  y?: number;
  once?: boolean;
}

export default function FadeIn({
  children,
  as = "div",
  className,
  delay = 0,
  duration = 0.8,
  y = 20,
  once = true,
}: FadeInProps) {
  const MotionTag = TAGS[as];
  const variants: Variants = {
    hidden: { opacity: 0, y },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration, delay, ease: [0.16, 1, 0.3, 1] },
    },
  };

  return (
    <MotionTag
      className={cn(className)}
      initial="hidden"
      whileInView="visible"
      viewport={{ once, margin: "-8% 0px" }}
      variants={variants}
    >
      {children}
    </MotionTag>
  );
}
