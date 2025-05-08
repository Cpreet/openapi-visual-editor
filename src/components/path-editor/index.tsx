import { useEffect, useState } from "react";
import { Plus, Search, Filter } from "lucide-react";
import { useOpenApiStore } from "@/lib/store";
import { OpenAPIV3 } from "openapi-types";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ScrollArea } from "@/components/ui/scroll-area";
import { constructFullUrl } from "@/lib/utils";
import { type PathOperation } from "@/lib/types";
import { PathItem } from "./path-item";

const PathEditor = () => {
  const { openApi } = useOpenApiStore();
  const [paths, setPaths] = useState<OpenAPIV3.PathsObject>({});
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedMethod, setSelectedMethod] = useState<string | null>(null);
  const [isAddingPath, setIsAddingPath] = useState(false);
  const [newPath, setNewPath] = useState<{
    path: string;
    method: OpenAPIV3.HttpMethods;
    summary: string;
  }>({
    path: "",
    method: OpenAPIV3.HttpMethods.GET,
    summary: "",
  });
  const [requestStates, setRequestStates] = useState<Record<string, any>>({});
  const [responseData, setResponseData] = useState<Record<string, any>>({});
  const [isLoading, setIsLoading] = useState<Record<string, boolean>>({});

  useEffect(() => {
    if (openApi) {
      setPaths(openApi.paths || {});
    }
  }, [openApi]);

  const addPath = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    const updatedPaths = { ...paths };
    if (!updatedPaths[newPath.path]) {
      updatedPaths[newPath.path] = {};
    }
    (updatedPaths[newPath.path] as Record<string, PathOperation>)[
      newPath.method.toLowerCase()
    ] = {
      summary: newPath.summary,
      responses: {
        "200": {
          description: "Successful operation",
        },
      },
    };
    setPaths(updatedPaths);
    setNewPath({
      path: "",
      method: OpenAPIV3.HttpMethods.GET,
      summary: "",
    });
    setIsAddingPath(false);
  };

  const removePath = (path: string, method: string) => {
    const updatedPaths = { ...paths };
    if (updatedPaths[path]) {
      delete (updatedPaths[path] as Record<string, PathOperation>)[
        method.toLowerCase()
      ];
      if (Object.keys(updatedPaths[path]).length === 0) {
        delete updatedPaths[path];
      }
    }
    setPaths(updatedPaths);
  };

  const handleRequest = async (
    path: string,
    method: string,
    operation: PathOperation
  ) => {
    const requestId = `${path}-${method}`;
    setIsLoading((prev) => ({ ...prev, [requestId]: true }));

    try {
      const currentState = requestStates[requestId] || {};
      let url = path;
      const queryParams = new URLSearchParams();

      operation.parameters?.forEach((param: any) => {
        if (param.in === "path" && currentState[param.name]) {
          url = url.replace(`{${param.name}}`, currentState[param.name]);
        } else if (param.in === "query" && currentState[param.name]) {
          queryParams.append(param.name, currentState[param.name]);
        }
      });

      if (queryParams.toString()) {
        url += `?${queryParams.toString()}`;
      }

      const baseUrl = currentState.server || openApi?.servers?.[0]?.url || "";
      const fullUrl = constructFullUrl(baseUrl, url);

      const headers: Record<string, string> = {
        "Content-Type": "application/json",
      };

      operation.parameters?.forEach((param: any) => {
        if (param.in === "header" && currentState[param.name]) {
          headers[param.name] = currentState[param.name];
        }
      });

      const response = await fetch(fullUrl, {
        method: method.toUpperCase(),
        headers,
        body:
          method !== "GET" && currentState.body
            ? JSON.stringify(currentState.body)
            : undefined,
      });

      const data = await response.json();

      setResponseData((prev) => ({
        ...prev,
        [requestId]: {
          status: response.status,
          data,
          headers: Object.fromEntries(response.headers.entries()),
        },
      }));
    } catch (error) {
      setResponseData((prev) => ({
        ...prev,
        [requestId]: {
          error: error instanceof Error ? error.message : "An error occurred",
        },
      }));
    } finally {
      setIsLoading((prev) => ({ ...prev, [requestId]: false }));
    }
  };

  const updateRequestState = (
    path: string,
    method: string,
    field: string,
    value: any
  ) => {
    const requestId = `${path}-${method}`;
    setRequestStates((prev) => ({
      ...prev,
      [requestId]: {
        ...prev[requestId],
        [field]: value,
      },
    }));
  };

  const filteredPaths = Object.entries(paths).filter(([path, pathItem]) => {
    if (!pathItem) return false;
    const matchesSearch =
      path.toLowerCase().includes(searchQuery.toLowerCase()) ||
      Object.entries(pathItem as Record<string, PathOperation>).some(
        ([_, operation]) =>
          operation.summary?.toLowerCase().includes(searchQuery.toLowerCase())
      );
    const matchesMethod =
      !selectedMethod ||
      Object.keys(pathItem).some(
        (method) => method.toLowerCase() === selectedMethod.toLowerCase()
      );
    return matchesSearch && matchesMethod;
  });

  if (!openApi) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-center">
          <h2 className="text-2xl font-semibold mb-2">
            No OpenAPI Schema Found
          </h2>
          <p className="text-gray-500">
            Import an OpenAPI schema to start editing paths
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
          <h1 className="text-2xl font-bold">API Endpoints</h1>
          <Button onClick={() => setIsAddingPath(true)}>
            <Plus className="w-4 h-4 mr-2" />
            Add Endpoint
          </Button>
        </div>
        <div className="flex gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <Input
              placeholder="Search endpoints..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
          <Select
            value={selectedMethod || ""}
            onValueChange={setSelectedMethod}
          >
            <SelectTrigger className="w-[180px]">
              <Filter className="w-4 h-4 mr-2" />
              <SelectValue placeholder="Filter by method" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value={"all"}>All Methods</SelectItem>
              {Object.values(OpenAPIV3.HttpMethods).map((method) => (
                <SelectItem key={method} value={method}>
                  {method}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Add Path Form */}
      {isAddingPath && (
        <div className="p-6 border-b bg-gray-50 0">
          <div className="max-w-2xl mx-auto">
            <h2 className="text-lg font-semibold mb-4">Add New Endpoint</h2>
            <div className="grid grid-cols-3 gap-4">
              <div className="col-span-1">
                <Input
                  value={newPath.path}
                  onChange={(e) =>
                    setNewPath({ ...newPath, path: e.target.value })
                  }
                  placeholder="/api/v1/resource"
                />
              </div>
              <div className="col-span-1">
                <Select
                  value={newPath.method}
                  onValueChange={(value) =>
                    setNewPath({
                      ...newPath,
                      method: value as OpenAPIV3.HttpMethods,
                    })
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {Object.values(OpenAPIV3.HttpMethods).map((method) => (
                      <SelectItem key={method} value={method}>
                        {method}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="col-span-1">
                <Input
                  value={newPath.summary}
                  onChange={(e) =>
                    setNewPath({ ...newPath, summary: e.target.value })
                  }
                  placeholder="Brief description"
                />
              </div>
            </div>
            <div className="flex justify-end gap-2 mt-4">
              <Button variant="outline" onClick={() => setIsAddingPath(false)}>
                Cancel
              </Button>
              <Button onClick={addPath}>Add Endpoint</Button>
            </div>
          </div>
        </div>
      )}

      {/* Paths List */}
      <ScrollArea className="flex-1">
        <div className="p-6">
          {filteredPaths.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-500">No endpoints found</p>
            </div>
          ) : (
            <div className="space-y-6">
              {filteredPaths.map(([path, pathItem]) => (
                <PathItem
                  key={path}
                  path={path}
                  pathItem={pathItem as Record<string, PathOperation>}
                  requestStates={requestStates}
                  responseData={responseData}
                  isLoading={isLoading}
                  onRequestStateChange={updateRequestState}
                  onSendRequest={handleRequest}
                  onEditPath={(path, method, operation) => {
                    setNewPath({
                      path,
                      method: method.toUpperCase() as OpenAPIV3.HttpMethods,
                      summary: operation.summary || "",
                    });
                    setIsAddingPath(true);
                  }}
                  onRemovePath={removePath}
                />
              ))}
            </div>
          )}
        </div>
      </ScrollArea>
    </div>
  );
};

export default PathEditor;
