import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";

/**
 * Combines tailwind classes with clsx and merges conflicts with tailwind-merge
 */
export function cn(...inputs) {
  return twMerge(clsx(inputs));
}
