"use client";

import { useEffect, useMemo, useRef } from "react";
import { motion, useSpring, useTransform } from "motion/react";
import { cn } from "@/lib/utils";

type SlidingNumberProps = {
  value: number;
  padStart?: number;
  decimalSeparator?: string;
  thousandSeparator?: string;
  decimalPlaces?: number;
  className?: string;
};

export function SlidingNumber({
  value,
  padStart = 0,
  decimalSeparator = ".",
  thousandSeparator = ",",
  decimalPlaces = 0,
  className,
}: SlidingNumberProps) {
  const spring = useSpring(value, { mass: 0.8, stiffness: 75, damping: 15 });
  const display = useTransform(spring, (current) =>
    current.toFixed(decimalPlaces).replace(".", decimalSeparator)
  );

  useEffect(() => {
    spring.set(value);
  }, [spring, value]);

  return (
    <motion.span className={cn("tabular-nums", className)}>
      {display}
    </motion.span>
  );
}
