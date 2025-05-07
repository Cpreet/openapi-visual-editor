import { useState, useEffect } from "react";
import {
  loadOpenApiSchemaFromJSON,
  loadOpenApiSchemaFromYAML,
  useOpenApiStore,
} from "@/lib/store";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Info, Route, Component } from "lucide-react";
import { useCheckConnections } from "@/hooks/useCheckConnection";
import { SchemaOverview } from "./schema-overview";
import { Endpoints } from "./endpoints";
import { Components } from "./components";

const SchemaViewer = () => {
  const { openApi } = useOpenApiStore();
  const [importFile] = useState<File | null>(null);
  const [selectedTab, setSelectedTab] = useState("overview");
  const { status, checkStatus } = useCheckConnections();
  const [securityCredentials, setSecurityCredentials] = useState<
    Record<string, string>
  >({});

  useEffect(() => {
    if (importFile) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const content = e.target?.result as string;
        const extension = importFile.name.split(".").pop();
        if (extension === "yaml") {
          loadOpenApiSchemaFromYAML(content);
        } else if (extension === "json") {
          loadOpenApiSchemaFromJSON(content);
        }
      };
      reader.readAsText(importFile);
    }
  }, [importFile]);

  useEffect(() => {
    if (openApi?.servers) {
      checkStatus(openApi.servers.map((server) => server.url));
    }
  }, [openApi?.servers, checkStatus]);

  const handleSecurityCredentialChange = (scheme: string, value: string) => {
    setSecurityCredentials((prev) => ({
      ...prev,
      [scheme]: value,
    }));
  };

  if (!openApi) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-center">
          <h2 className="text-2xl font-semibold mb-2">
            No OpenAPI Schema Found
          </h2>
          <p className="text-gray-500">
            Import an OpenAPI schema to start viewing
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col">
      {/* Header */}
      <div className="p-6 border-b">
        <div className="flex items-center justify-between mb-4">
          <h1 className="text-2xl font-bold">API Schema</h1>
        </div>
        <Tabs value={selectedTab} onValueChange={setSelectedTab}>
          <TabsList>
            <TabsTrigger value="overview" className="flex items-center gap-2">
              <Info className="size-4" />
              Overview
            </TabsTrigger>
            <TabsTrigger value="endpoints" className="flex items-center gap-2">
              <Route className="size-4" />
              Endpoints
            </TabsTrigger>
            <TabsTrigger value="components" className="flex items-center gap-2">
              <Component className="size-4" />
              Components
            </TabsTrigger>
          </TabsList>
          {/* Content */}
          <ScrollArea className="flex-1">
            <div className="p-6">
              <TabsContent value="overview" className="mt-0">
                <SchemaOverview
                  openApi={openApi}
                  status={status}
                  securityCredentials={securityCredentials}
                  onSecurityCredentialChange={handleSecurityCredentialChange}
                />
              </TabsContent>
              <TabsContent value="endpoints" className="mt-0">
                <Endpoints paths={openApi.paths || {}} />
              </TabsContent>
              <TabsContent value="components" className="mt-0">
                <Components schemas={openApi.components?.schemas || {}} />
              </TabsContent>
            </div>
          </ScrollArea>
        </Tabs>
      </div>
    </div>
  );
};

export default SchemaViewer;
