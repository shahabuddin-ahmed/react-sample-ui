import React, { type ReactNode } from "react";
import { motion, type Variants, type Transition } from "framer-motion";

interface FadeTransitionProps {
  children: ReactNode;
  className?: string;
  initial?: string;
  animate?: string;
  exit?: string;
}

export default function FadeTransition({
  children,
  className,
  initial,
  animate,
  exit,
}: FadeTransitionProps) {
  const pageVariants: Variants = {
    animate: {
      opacity: 1,
    },
    in: {
      opacity: 0,
    },
    out: {
      opacity: 0,
    },
  };

  const pageTransition: Transition = {
    type: "tween",
    ease: "anticipate",
    duration: 1,
  };

  return (
    <motion.div
      initial={initial ?? "in"}
      animate={animate ?? "animate"}
      exit={exit ?? "out"}
      transition={pageTransition}
      variants={pageVariants}
      className={className}
    >
      {children}
    </motion.div>
  );
}
