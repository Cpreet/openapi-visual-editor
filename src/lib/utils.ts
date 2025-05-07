import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export const getObjectOrArrayLength = (item: any) => {
  if (typeof item === "object") {
    return Object.keys(item).length
  }
  if (Array.isArray(item)) {
    return item.length
  }
  return 0
}
