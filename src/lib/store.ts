import { create } from "zustand";
import { persist } from "zustand/middleware";
import { OpenAPIV3 } from "openapi-types";
import * as YAML from "yaml";

interface OpenApiState {
  openApi: OpenAPIV3.Document | null;
  setOpenApi: (openApi: OpenAPIV3.Document) => void;
}

interface ThemeState {
  theme: "light" | "dark";
  setTheme: (theme: "light" | "dark") => void;
  toggleTheme: () => void;
}

export const useOpenApiStore = create<OpenApiState>()(
  persist(
    (set) => ({
      openApi: null,
      setOpenApi: (openApi) => set({ openApi }),
    }),
    {
      name: "openapi-store",
    }
  )
);

export const useThemeStore = create<ThemeState>()(
  persist(
    (set) => ({
      theme: "light",
      setTheme: (theme) => set({ theme }),
      toggleTheme: () =>
        set((state) => ({
          theme: state.theme === "light" ? "dark" : "light",
        })),
    }),
    {
      name: "theme-store",
    }
  )
);

export const loadOpenApiSchemaFromYAML = (yaml: string) => {
  const openApi = YAML.parse(yaml) as OpenAPIV3.Document;
  useOpenApiStore.setState({ openApi });
};

export const loadOpenApiSchemaFromJSON = (json: string) => {
  const openApi = JSON.parse(json) as OpenAPIV3.Document;
  useOpenApiStore.setState({ openApi });
};
