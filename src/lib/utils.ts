import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"
import { marked } from "marked"
import DOMPurify from "dompurify"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export const getObjectOrArrayLength = (item) => {
  if (typeof item === "object") {
    return Object.keys(item).length
  }
  if (Array.isArray(item)) {
    return item.length
  }
  return 0
}

export const sanitizeMarkdownOrHtml = (inp: string) => {
  if (inp.startsWith("<")) {
    return DOMPurify.sanitize(inp)
  }
  const html = marked.parse(inp, { async: false })
  return DOMPurify.sanitize(html)
} 
