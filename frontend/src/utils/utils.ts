import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function safeDispatchCustomEvent(name: string, detail?: any) {
  window.dispatchEvent(new CustomEvent(name, { detail }));
}

