import { useState, useRef } from "react";
import * as YAML from "yaml";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Download, Upload, FileText, X as XIcon, LoaderPinwheel, LoaderIcon } from "lucide-react";
import {
  loadOpenApiSchemaFromJSON,
  loadOpenApiSchemaFromYAML,
  useOpenApiStore,
} from "@/lib/store";
import { detectSchemaStandard, detectSchemaLanguage } from "@/lib/utils";

interface ImportExportModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function ImportExportModal({ isOpen, onClose }: ImportExportModalProps) {
  const [activeTab, setActiveTab] = useState("import");
  const [importUrl, setImportUrl] = useState("");
  const [importContent, setImportContent] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const openApi = useOpenApiStore((state) => state.openApi);
  const fileInputRef = useRef<HTMLInputElement>(null);


  const handleImport = async () => {
    if (!importContent && !importUrl) return;

    setError(null);

    try {
      let content = "";
      if (importUrl) {
        const resp = await fetch(importUrl);
        if (resp.ok) {
          content = await resp.text()
        } else {
          content = importContent
        }
      }

      console.log(content)
      const lang = detectSchemaLanguage(content)
      if (!lang) throw new Error("Not a recognised markup")
      if (lang === "json") {
        const standard = detectSchemaStandard(JSON.parse(content))
        if (!standard) throw new Error("Not a recognied standard")
        if (standard === "arazzo") throw new Error("Arazzo support yet to be implemented")
        if (standard === "openapi") loadOpenApiSchemaFromJSON(content)
      }
      if (lang === "yaml") {
        const standard = detectSchemaStandard(YAML.parse(content))
        if (!standard) throw new Error("Not a recognied standard")
        if (standard === "arazzo") throw new Error("Arazzo support yet to be implemented")
        if (standard === "openapi") loadOpenApiSchemaFromYAML(content)
      }

      onClose();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to import schema");
    } finally {
      setIsLoading(false)
    }
  };

  const handleFileImport = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      const content = e.target?.result as string;

      try {
        const schemaType = detectSchemaStandard(content);

        if (schemaType === "openapi") {
          const extension = file.name.split(".").pop()?.toLowerCase();
          if (extension === "yaml" || extension === "yml") {
            loadOpenApiSchemaFromYAML(content);
          } else {
            loadOpenApiSchemaFromJSON(content);
          }
        } else {
          // TODO: Load Arazzo schema
          return;
        }
        onClose();
      } catch (err) {
        setError(
          err instanceof Error ? err.message : "Failed to import schema"
        );
      }
    };
    reader.readAsText(file);
  };

  const handleExport = (format: "json" | "yaml") => {
    if (openApi) {
      const content =
        format === "json"
          ? JSON.stringify(openApi, null, 2)
          : YAML.stringify(openApi);

      const blob = new Blob([content], { type: `text/${format}` });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `openapi-schema.${format}`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center">
      <div className="bg-background rounded-lg shadow-lg w-full max-w-2xl p-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold">Import/Export</h2>
          <Button variant="ghost" size="icon" onClick={onClose}>
            <XIcon className="size-4" />
          </Button>
        </div>

        <div className="mb-4 py-2 px-4 bg-muted rounded-lg">
          <p className="text-sm text-muted-foreground">
            Upload an OpenAPI or Arazzo schema file. The system will
            automatically detect the schema type. Supported formats: JSON, YAML
          </p>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="import">Import</TabsTrigger>
            <TabsTrigger value="export">Export</TabsTrigger>
          </TabsList>

          <TabsContent value="import" className="space-y-4">
            <div className="space-y-4">
              <div className="space-y-2">
                <Label>Import from URL</Label>
                <div className="flex gap-2 mt-1">
                  <Input
                    placeholder="Enter schema URL"
                    value={importUrl}
                    onChange={(e) => setImportUrl(e.target.value)}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label>Import from File</Label>
                <div className="flex gap-2 mt-1">
                  <Input
                    type="file"
                    accept=".json,.yaml,.yml"
                    onChange={handleFileImport}
                    className="hidden"
                    ref={fileInputRef}
                  />
                  <Button
                    variant="outline"
                    onClick={() => fileInputRef.current?.click()}
                    className="w-full"
                  >
                    <FileText className="size-4 mr-2" />
                    Choose File
                  </Button>
                </div>
              </div>

              <div className="space-y-2">
                <Label>Import from Content</Label>
                <Textarea
                  placeholder="Paste your schema here"
                  value={importContent}
                  onChange={(e) => setImportContent(e.target.value)}
                  className="mt-1 min-h-32 max-h-36 font-mono"
                />
                <Button
                  onClick={() => { setIsLoading(true); handleImport() }}
                  disabled={!importContent && !importUrl}
                  className="mt-2"
                >
                  {isLoading ?
                    <LoaderIcon className="size-4" />
                    : <Upload className="size-4 mr-2" />
                  }
                  Import
                </Button>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="export" className="space-y-4">
            <div className="space-y-4">
              <div>
                <Label>Export Format</Label>
                <div className="flex gap-2 mt-1">
                  <Button
                    onClick={() => handleExport("json")}
                    className="flex-1"
                    disabled={!openApi}
                  >
                    <Download className="size-4 mr-2" />
                    Export as JSON
                  </Button>
                  <Button
                    onClick={() => handleExport("yaml")}
                    className="flex-1"
                    disabled={!openApi}
                  >
                    <Download className="size-4 mr-2" />
                    Export as YAML
                  </Button>
                </div>
              </div>
            </div>
          </TabsContent>
        </Tabs>

        {error && (
          <div className="mt-4 p-3 bg-destructive/10 text-destructive rounded-md">
            {error}
          </div>
        )}
      </div>
    </div>
  );
}
