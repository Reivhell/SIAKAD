import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function safeDispatchCustomEvent(name: string, detail?: any) {
  try {
    let event: any = null;
    if (typeof document !== 'undefined' && typeof document.createEvent === 'function') {
      try {
        event = document.createEvent('CustomEvent');
        if (event && typeof event.initCustomEvent === 'function') {
          event.initCustomEvent(name, false, false, detail);
        }
      } catch (innerErr) {
        // Fallback
      }
    }
    if (!event) {
      try {
        event = new CustomEvent(name, { detail });
      } catch (customErr) {
        // Safe fallback event object
        event = { type: name, detail };
      }
    }
    window.dispatchEvent(event);
  } catch (err) {
    console.warn(`Failed to dispatch custom event: ${name}`, err);
  }
}

