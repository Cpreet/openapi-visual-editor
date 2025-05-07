import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"
import { marked } from "marked"
import DOMPurify from "dompurify"
import * as YAML from "yaml"

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

export const sanitizeMarkdownOrHtml = (inp: string) => {
  if (inp.startsWith("<")) {
    return DOMPurify.sanitize(inp)
  }
  const html = marked.parse(inp, { async: false })
  return DOMPurify.sanitize(html)
}


export const detectSchemaLanguage = (content: string): "json" | "yaml" | null => {
  try {
    JSON.parse(content)
    return "json"
  } catch {
    console.error("not json")
  }

  try {
    YAML.parse(content)
    return "yaml"
  } catch {
    console.error("not yaml")
  }

  return null
}


export const detectSchemaStandard = (content: string): "openapi" | "arazzo" | null => {
  if (Object.keys(content).includes("arazzo")) {
    return "arazzo";
  }

  if (Object.keys(content).includes("openapi")) {
    return "openapi";
  }

  return null
};
