import { useEffect, useState } from "react";
import { OpenAPIV3 } from "openapi-types";
import { Copy, Edit, Trash, Plus, Search, Globe } from "lucide-react";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import { useOpenApiStore } from "@/lib/store";
import { useCheckConnections } from "@/hooks/use-check-connections";

export const ServerEditor = () => {
  const { openApi, setOpenApi } = useOpenApiStore();
  const [servers, setServers] = useState<OpenAPIV3.ServerObject[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [isAddingServer, setIsAddingServer] = useState(false);
  const [newServer, setNewServer] = useState<OpenAPIV3.ServerObject>({
    url: "",
    description: "",
    variables: {},
  });
  const { status, checkStatus } = useCheckConnections()

  useEffect(() => {
    if (openApi) {
      setServers(openApi.servers || []);
      checkStatus(openApi.servers?.map(server => server.url) || [])
    }
  }, [openApi, checkStatus]);

  const addServer = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    setServers([...servers, newServer]);
    if (openApi) {
      setOpenApi({
        ...openApi,
        servers: [...(openApi.servers || []), newServer],
      });
    }
    setNewServer({
      url: "",
      description: "",
      variables: {},
    });
    setIsAddingServer(false);
  };

  const removeServer = (url: string) => {
    setServers(servers.filter((server) => server.url !== url));
  };

  const filteredServers = servers.filter(
    (server) =>
      server.url.toLowerCase().includes(searchQuery.toLowerCase()) ||
      server.description?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (!openApi) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-center">
          <h2 className="text-2xl font-semibold mb-2">
            No OpenAPI Schema Found
          </h2>
          <p className="text-gray-500">
            Import an OpenAPI schema to start managing servers
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
          <h1 className="text-2xl font-bold">API Servers</h1>
          <Button onClick={() => setIsAddingServer(true)}>
            <Plus className="w-4 h-4 mr-2" />
            Add Server
          </Button>
        </div>
        <div className="flex gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <Input
              placeholder="Search servers..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>
      </div>

      {/* Add Server Form */}
      {isAddingServer && (
        <div className="p-6 border-b bg-gray-50 0">
          <div className="max-w-2xl mx-auto">
            <h2 className="text-lg font-semibold mb-4">Add New Server</h2>
            <div className="grid grid-cols-2 gap-4">
              <div className="col-span-2">
                <Label>Server URL</Label>
                <Input
                  value={newServer.url}
                  onChange={(e) =>
                    setNewServer({ ...newServer, url: e.target.value })
                  }
                  placeholder="https://api.example.com/v1"
                  className="mt-1"
                />
              </div>
              <div className="col-span-2">
                <Label>Description</Label>
                <Input
                  value={newServer.description}
                  onChange={(e) =>
                    setNewServer({ ...newServer, description: e.target.value })
                  }
                  placeholder="Production server"
                  className="mt-1"
                />
              </div>
            </div>
            <div className="flex justify-end gap-2 mt-4">
              <Button
                variant="outline"
                onClick={() => setIsAddingServer(false)}
              >
                Cancel
              </Button>
              <Button onClick={addServer}>Add Server</Button>
            </div>
          </div>
        </div>
      )}

      {/* Servers List */}
      <ScrollArea className="flex-1">
        <div className="p-6">
          {filteredServers.length === 0 ? (
            <div className="text-center py-12">
              <Globe className="w-12 h-12 mx-auto text-gray-400 mb-4" />
              <p className="text-gray-500">No servers found</p>
              {searchQuery && (
                <p className="text-sm text-gray-400 mt-2">
                  Try adjusting your search query
                </p>
              )}
            </div>
          ) : (
            <div className="space-y-4">
              {filteredServers.map((server, idx) => (
                <div
                  key={server.url}
                  className="bg-card 0 rounded-lg border p-4"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <Badge variant="outline" className="font-mono">
                          {server.url}
                        </Badge>
                        <Badge className={status[idx].color}>
                          {status[idx].status}
                        </Badge>
                        {server.description && (
                          <p className="text-sm text-gray-500">
                            {server.description}
                          </p>
                        )}
                      </div>
                      {Object.keys(server.variables || {}).length > 0 && (
                        <div className="mt-2">
                          <p className="text-sm font-medium mb-1">Variables:</p>
                          <div className="flex flex-wrap gap-2">
                            {Object.entries(server.variables || {}).map(
                              ([key, variable]) => (
                                <Badge
                                  key={key}
                                  variant="secondary"
                                  className="font-mono"
                                >
                                  {key}: {variable.default}
                                </Badge>
                              )
                            )}
                          </div>
                        </div>
                      )}
                    </div>
                    <div className="flex items-center gap-2">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => {
                          navigator.clipboard.writeText(server.url);
                        }}
                      >
                        <Copy className="w-4 h-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => {
                          setNewServer(server);
                          setIsAddingServer(true);
                        }}
                      >
                        <Edit className="w-4 h-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => removeServer(server.url)}
                      >
                        <Trash className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </ScrollArea>
    </div>
  );
};

