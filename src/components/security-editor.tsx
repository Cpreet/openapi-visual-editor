import { useEffect, useState } from "react";
import { Copy, Edit, Trash, Plus, Search, Shield, LogIn } from "lucide-react";
import { OpenAPIV3 } from "openapi-types";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useOpenApiStore } from "@/lib/store";

type SecuritySchemeType = OpenAPIV3.SecuritySchemeObject["type"];

const SecurityEditor = () => {
  const { openApi } = useOpenApiStore();
  const [securitySchemes, setSecuritySchemes] = useState<
    Record<string, OpenAPIV3.SecuritySchemeObject>
  >({});
  const [searchQuery, setSearchQuery] = useState("");
  const [isAddingScheme, setIsAddingScheme] = useState(false);
  const [newScheme, setNewScheme] = useState<{
    name: string;
    scheme: OpenAPIV3.SecuritySchemeObject;
  }>({
    name: "",
    scheme: {
      type: "http",
      scheme: "bearer",
    } as OpenAPIV3.HttpSecurityScheme,
  });

  useEffect(() => {
    if (openApi?.components?.securitySchemes) {
      const schemes = openApi.components.securitySchemes as Record<
        string,
        OpenAPIV3.SecuritySchemeObject
      >;
      setSecuritySchemes(schemes);
    }
  }, [openApi]);

  const addScheme = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    setSecuritySchemes({
      ...securitySchemes,
      [newScheme.name]: newScheme.scheme,
    });
    setNewScheme({
      name: "",
      scheme: {
        type: "http",
        scheme: "bearer",
      } as OpenAPIV3.HttpSecurityScheme,
    });
    setIsAddingScheme(false);
  };

  const removeScheme = (name: string) => {
    const newSchemes = { ...securitySchemes };
    delete newSchemes[name];
    setSecuritySchemes(newSchemes);
  };

  const filteredSchemes = Object.entries(securitySchemes).filter(
    ([name, scheme]) =>
      name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      scheme.description?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleTypeChange = (value: SecuritySchemeType) => {
    let scheme: OpenAPIV3.SecuritySchemeObject;
    switch (value) {
      case "http":
        scheme = {
          type: "http",
          scheme: "bearer",
        } as OpenAPIV3.HttpSecurityScheme;
        break;
      case "apiKey":
        scheme = {
          type: "apiKey",
          name: "",
          in: "header",
        } as OpenAPIV3.ApiKeySecurityScheme;
        break;
      case "oauth2":
        scheme = {
          type: "oauth2",
          flows: {
            implicit: {
              authorizationUrl: "",
              scopes: {},
            },
            password: {
              tokenUrl: "",
              scopes: {},
            },
            clientCredentials: {
              tokenUrl: "",
              scopes: {},
            },
            authorizationCode: {
              authorizationUrl: "",
              tokenUrl: "",
              scopes: {},
            },
          },
        } as OpenAPIV3.OAuth2SecurityScheme;
        break;
      case "openIdConnect":
        scheme = {
          type: "openIdConnect",
          openIdConnectUrl: "",
        } as OpenAPIV3.OpenIdSecurityScheme;
        break;
      default:
        scheme = {
          type: "http",
          scheme: "bearer",
        } as OpenAPIV3.HttpSecurityScheme;
    }
    setNewScheme({ ...newScheme, scheme });
  };

  const renderSchemeFields = () => {
    const scheme = newScheme.scheme;
    switch (scheme.type) {
      case "http":
        return (
          <div className="col-span-2">
            <Label>Scheme</Label>
            <Select
              value={(scheme as OpenAPIV3.HttpSecurityScheme).scheme}
              onValueChange={(value) =>
                setNewScheme({
                  ...newScheme,
                  scheme: {
                    ...scheme,
                    scheme: value,
                  } as OpenAPIV3.HttpSecurityScheme,
                })
              }
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="bearer">Bearer</SelectItem>
                <SelectItem value="basic">Basic</SelectItem>
              </SelectContent>
            </Select>
          </div>
        );
      case "apiKey":
        return (
          <>
            <div className="col-span-2">
              <Label>Name</Label>
              <Input
                value={(scheme as OpenAPIV3.ApiKeySecurityScheme).name}
                onChange={(e) =>
                  setNewScheme({
                    ...newScheme,
                    scheme: {
                      ...scheme,
                      name: e.target.value,
                    } as OpenAPIV3.ApiKeySecurityScheme,
                  })
                }
                placeholder="X-API-Key"
                className="mt-1"
              />
            </div>
            <div className="col-span-2">
              <Label>Location</Label>
              <Select
                value={(scheme as OpenAPIV3.ApiKeySecurityScheme).in}
                onValueChange={(value) =>
                  setNewScheme({
                    ...newScheme,
                    scheme: {
                      ...scheme,
                      in: value as "header" | "query" | "cookie",
                    } as OpenAPIV3.ApiKeySecurityScheme,
                  })
                }
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="header">Header</SelectItem>
                  <SelectItem value="query">Query</SelectItem>
                  <SelectItem value="cookie">Cookie</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </>
        );
      case "oauth2":
        const oauth2Scheme = scheme as OpenAPIV3.OAuth2SecurityScheme;
        return (
          <>
            <div className="col-span-2">
              <Label>Implicit Flow</Label>
              <div className="space-y-2">
                <Input
                  value={oauth2Scheme.flows.implicit?.authorizationUrl || ""}
                  onChange={(e) =>
                    setNewScheme({
                      ...newScheme,
                      scheme: {
                        ...scheme,
                        flows: {
                          ...oauth2Scheme.flows,
                          implicit: {
                            ...oauth2Scheme.flows.implicit,
                            authorizationUrl: e.target.value,
                          },
                        },
                      } as OpenAPIV3.OAuth2SecurityScheme,
                    })
                  }
                  placeholder="Authorization URL"
                  className="mt-1"
                />
                {oauth2Scheme.flows.implicit?.authorizationUrl && (
                  <Button
                    className="w-full"
                    onClick={() =>
                      window.open(
                        oauth2Scheme.flows.implicit?.authorizationUrl,
                        "_blank"
                      )
                    }
                  >
                    Connect with OAuth2
                  </Button>
                )}
              </div>
            </div>
            <div className="col-span-2">
              <Label>Password Flow</Label>
              <div className="space-y-2">
                <Input
                  value={oauth2Scheme.flows.password?.tokenUrl || ""}
                  onChange={(e) =>
                    setNewScheme({
                      ...newScheme,
                      scheme: {
                        ...scheme,
                        flows: {
                          ...oauth2Scheme.flows,
                          password: {
                            ...oauth2Scheme.flows.password,
                            tokenUrl: e.target.value,
                          },
                        },
                      } as OpenAPIV3.OAuth2SecurityScheme,
                    })
                  }
                  placeholder="Token URL"
                  className="mt-1"
                />
                {oauth2Scheme.flows.password?.tokenUrl && (
                  <div className="space-y-2">
                    <Input placeholder="Username" className="mt-1" />
                    <Input
                      type="password"
                      placeholder="Password"
                      className="mt-1"
                    />
                    <Button className="w-full">
                      <LogIn className="w-4 h-4 mr-2" />
                      Login
                    </Button>
                  </div>
                )}
              </div>
            </div>
            <div className="col-span-2">
              <Label>Client Credentials Flow</Label>
              <Input
                value={oauth2Scheme.flows.clientCredentials?.tokenUrl || ""}
                onChange={(e) =>
                  setNewScheme({
                    ...newScheme,
                    scheme: {
                      ...scheme,
                      flows: {
                        ...oauth2Scheme.flows,
                        clientCredentials: {
                          ...oauth2Scheme.flows.clientCredentials,
                          tokenUrl: e.target.value,
                        },
                      },
                    } as OpenAPIV3.OAuth2SecurityScheme,
                  })
                }
                placeholder="Token URL"
                className="mt-1"
              />
            </div>
            <div className="col-span-2">
              <Label>Authorization Code Flow</Label>
              <div className="space-y-2">
                <Input
                  value={
                    oauth2Scheme.flows.authorizationCode?.authorizationUrl || ""
                  }
                  onChange={(e) =>
                    setNewScheme({
                      ...newScheme,
                      scheme: {
                        ...scheme,
                        flows: {
                          ...oauth2Scheme.flows,
                          authorizationCode: {
                            ...oauth2Scheme.flows.authorizationCode,
                            authorizationUrl: e.target.value,
                          },
                        },
                      } as OpenAPIV3.OAuth2SecurityScheme,
                    })
                  }
                  placeholder="Authorization URL"
                  className="mt-1"
                />
                <Input
                  value={oauth2Scheme.flows.authorizationCode?.tokenUrl || ""}
                  onChange={(e) =>
                    setNewScheme({
                      ...newScheme,
                      scheme: {
                        ...scheme,
                        flows: {
                          ...oauth2Scheme.flows,
                          authorizationCode: {
                            ...oauth2Scheme.flows.authorizationCode,
                            tokenUrl: e.target.value,
                          },
                        },
                      } as OpenAPIV3.OAuth2SecurityScheme,
                    })
                  }
                  placeholder="Token URL"
                  className="mt-1"
                />
                {oauth2Scheme.flows.authorizationCode?.authorizationUrl && (
                  <Button
                    className="w-full"
                    onClick={() =>
                      window.open(
                        oauth2Scheme.flows.authorizationCode?.authorizationUrl,
                        "_blank"
                      )
                    }
                  >
                    Connect with OAuth2
                  </Button>
                )}
              </div>
            </div>
          </>
        );
      case "openIdConnect":
        return (
          <div className="col-span-2">
            <Label>OpenID Connect URL</Label>
            <Input
              value={
                (scheme as OpenAPIV3.OpenIdSecurityScheme).openIdConnectUrl
              }
              onChange={(e) =>
                setNewScheme({
                  ...newScheme,
                  scheme: {
                    ...scheme,
                    openIdConnectUrl: e.target.value,
                  } as OpenAPIV3.OpenIdSecurityScheme,
                })
              }
              placeholder="https://example.com/.well-known/openid-configuration"
              className="mt-1"
            />
          </div>
        );
      default:
        return null;
    }
  };

  if (!openApi) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-center">
          <h2 className="text-2xl font-semibold mb-2">
            No OpenAPI Schema Found
          </h2>
          <p className="text-gray-500">
            Import an OpenAPI schema to start managing security schemes
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
          <h1 className="text-2xl font-bold">Security Schemes</h1>
          <Button onClick={() => setIsAddingScheme(true)}>
            <Plus className="w-4 h-4 mr-2" />
            Add Security Scheme
          </Button>
        </div>
        <div className="flex gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <Input
              placeholder="Search security schemes..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>
      </div>

      {/* Add Security Scheme Form */}
      {isAddingScheme && (
        <div className="p-6 border-b bg-gray-50 0">
          <div className="max-w-2xl mx-auto">
            <h2 className="text-lg font-semibold mb-4">
              Add New Security Scheme
            </h2>
            <div className="grid grid-cols-2 gap-4">
              <div className="col-span-2">
                <Label>Name</Label>
                <Input
                  value={newScheme.name}
                  onChange={(e) =>
                    setNewScheme({ ...newScheme, name: e.target.value })
                  }
                  placeholder="bearerAuth"
                  className="mt-1"
                />
              </div>
              <div className="col-span-2">
                <Label>Type</Label>
                <Select
                  value={newScheme.scheme.type}
                  onValueChange={handleTypeChange}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="http">HTTP</SelectItem>
                    <SelectItem value="apiKey">API Key</SelectItem>
                    <SelectItem value="oauth2">OAuth2</SelectItem>
                    <SelectItem value="openIdConnect">
                      OpenID Connect
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>
              {renderSchemeFields()}
              <div className="col-span-2">
                <Label>Description</Label>
                <Input
                  value={newScheme.scheme.description || ""}
                  onChange={(e) =>
                    setNewScheme({
                      ...newScheme,
                      scheme: {
                        ...newScheme.scheme,
                        description: e.target.value,
                      },
                    })
                  }
                  placeholder="Enter security scheme description"
                  className="mt-1"
                />
              </div>
            </div>
            <div className="flex justify-end gap-2 mt-4">
              <Button
                variant="outline"
                onClick={() => setIsAddingScheme(false)}
              >
                Cancel
              </Button>
              <Button onClick={addScheme}>Add Security Scheme</Button>
            </div>
          </div>
        </div>
      )}

      {/* Security Schemes List */}
      <ScrollArea className="flex-1">
        <div className="p-6">
          {filteredSchemes.length === 0 ? (
            <div className="text-center py-12">
              <Shield className="w-12 h-12 mx-auto text-gray-400 mb-4" />
              <p className="text-gray-500">No security schemes found</p>
              {searchQuery && (
                <p className="text-sm text-gray-400 mt-2">
                  Try adjusting your search query
                </p>
              )}
            </div>
          ) : (
            <div className="space-y-4">
              {filteredSchemes.map(([name, scheme]) => (
                <div key={name} className="bg-card 0 rounded-lg border p-4">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <Badge variant="outline" className="font-mono">
                          {name}
                        </Badge>
                        <Badge variant="secondary">{scheme.type}</Badge>
                        {scheme.type === "http" && (
                          <Badge variant="secondary">
                            {(scheme as OpenAPIV3.HttpSecurityScheme).scheme}
                          </Badge>
                        )}
                      </div>
                      {scheme.description && (
                        <p className="text-sm text-gray-500 mt-2">
                          {scheme.description}
                        </p>
                      )}
                    </div>
                    <div className="flex items-center gap-2">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => {
                          navigator.clipboard.writeText(name);
                        }}
                      >
                        <Copy className="w-4 h-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => {
                          setNewScheme({ name, scheme });
                          setIsAddingScheme(true);
                        }}
                      >
                        <Edit className="w-4 h-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => removeScheme(name)}
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

export default SecurityEditor;
