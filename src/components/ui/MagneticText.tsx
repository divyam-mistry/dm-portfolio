"use client";

import { useEffect, useRef } from "react";
import { motion, useMotionValue, useSpring, useTransform, type MotionValue } from "framer-motion";
import { cn } from "@/lib/utils";

interface MagneticTextProps {
  text: string;
  className?: string;
  radius?: number;
  lift?: number;
}

function MagneticLetter({
  char,
  mouseX,
  mouseY,
  radius,
  lift,
}: {
  char: string;
  mouseX: MotionValue<number>;
  mouseY: MotionValue<number>;
  radius: number;
  lift: number;
}) {
  const ref = useRef<HTMLSpanElement>(null);
  const center = useRef({ x: -9999, y: -9999 });

  useEffect(() => {
    const measure = () => {
      const el = ref.current;
      if (!el) return;
      const rect = el.getBoundingClientRect();
      center.current = { x: rect.left + rect.width / 2, y: rect.top + rect.height / 2 };
    };
    measure();
    window.addEventListener("resize", measure);
    window.addEventListener("scroll", measure, { passive: true });
    return () => {
      window.removeEventListener("resize", measure);
      window.removeEventListener("scroll", measure);
    };
  }, []);

  // Only lift/scale toward the cursor — never shift horizontally, so the
  // word's letter spacing and reading order stay intact while hovering.
  const proximity = useTransform([mouseX, mouseY], (latest) => {
    const [mx, my] = latest as [number, number];
    const dist = Math.hypot(mx - center.current.x, my - center.current.y);
    if (dist > radius) return 0;
    return 1 - dist / radius;
  });
  const y = useTransform(proximity, (p) => -p * lift);
  const scale = useTransform(proximity, (p) => 1 + p * 0.12);

  const springY = useSpring(y, { stiffness: 260, damping: 20, mass: 0.4 });
  const springScale = useSpring(scale, { stiffness: 260, damping: 20, mass: 0.4 });

  return (
    <motion.span
      ref={ref}
      style={{ y: springY, scale: springScale }}
      className="inline-block will-change-transform"
    >
      {char === " " ? " " : char}
    </motion.span>
  );
}

export default function MagneticText({ text, className, radius = 90, lift = 10 }: MagneticTextProps) {
  const mouseX = useMotionValue(-9999);
  const mouseY = useMotionValue(-9999);

  useEffect(() => {
    const handleMove = (e: MouseEvent) => {
      mouseX.set(e.clientX);
      mouseY.set(e.clientY);
    };
    window.addEventListener("mousemove", handleMove);
    return () => window.removeEventListener("mousemove", handleMove);
  }, [mouseX, mouseY]);

  return (
    <span className={cn("inline-block", className)}>
      {text.split("").map((char, i) => (
        <MagneticLetter key={i} char={char} mouseX={mouseX} mouseY={mouseY} radius={radius} lift={lift} />
      ))}
    </span>
  );
}
