import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import { marked } from "marked";
import DOMPurify from "dompurify";
import * as YAML from "yaml";
import type { OpenAPIV3 } from "openapi-types";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const getObjectOrArrayLength = (item: any) => {
  if (typeof item === "object") {
    return Object.keys(item).length;
  }
  if (Array.isArray(item)) {
    return item.length;
  }
  return 0;
};

export const sanitizeMarkdownOrHtml = (inp: string) => {
  if (inp.startsWith("<")) {
    return DOMPurify.sanitize(inp);
  }
  const html = marked.parse(inp, { async: false });
  return DOMPurify.sanitize(html);
};

export const detectSchemaLanguage = (
  content: string
): "json" | "yaml" | null => {
  try {
    JSON.parse(content);
    return "json";
  } catch {
    console.error("not json");
  }

  try {
    YAML.parse(content);
    return "yaml";
  } catch {
    console.error("not yaml");
  }

  return null;
};

export const detectSchemaStandard = (
  content: string
): "openapi" | "arazzo" | null => {
  if (Object.keys(content).includes("arazzo")) {
    return "arazzo";
  }

  if (Object.keys(content).includes("openapi")) {
    return "openapi";
  }

  return null;
};

export function constructFullUrl(baseUrl: string, path: string): string {
  const base = new URL(baseUrl);

  if (!base.pathname.endsWith("/")) {
    base.pathname += "/";
  }

  if (path.startsWith("/")) {
    path = path.slice(1);
  }

  return new URL(path, base).toString();
}

export const isParameterObject = (
  param: any
): param is OpenAPIV3.ParameterObject => {
  return param && typeof param === "object" && "name" in param;
};

export const isReferenceObject = (
  param: any
): param is OpenAPIV3.ReferenceObject => {
  return param && typeof param === "object" && "$ref" in param;
};

export const isRequestBodyObject = (
  body: any
): body is OpenAPIV3.RequestBodyObject => {
  return body && typeof body === "object" && "content" in body;
};
