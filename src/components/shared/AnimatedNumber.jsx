import { useEffect, useRef } from "react";
import { animate, useMotionValue, useReducedMotion } from "framer-motion";
import { formatINR } from "../../utils/formatters";

/**
 * Count-up number. Animates from the previous value to the new one,
 * formatting through formatINR (or a custom `format` fn) on every frame.
 * Respects prefers-reduced-motion.
 */
export default function AnimatedNumber({ value, format = formatINR, duration = 0.9, className = "" }) {
  const ref = useRef(null);
  const motionValue = useMotionValue(0);
  const reduceMotion = useReducedMotion();

  useEffect(() => {
    const target = Number.isFinite(Number(value)) ? Number(value) : 0;
    if (reduceMotion) {
      motionValue.set(target);
      if (ref.current) ref.current.textContent = format(target);
      return;
    }
    const controls = animate(motionValue, target, {
      duration,
      ease: "easeOut",
      onUpdate: (latest) => {
        if (ref.current) ref.current.textContent = format(latest);
      },
    });
    return () => controls.stop();
  }, [value, format, duration, reduceMotion, motionValue]);

  return (
    <span ref={ref} className={className} aria-live="polite">
      {format(Number(value) || 0)}
    </span>
  );
}
