import type { OpenAPIV3 } from "openapi-types";

import { useOpenApiStore } from "@/lib/store";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ScrollArea } from "@/components/ui/scroll-area";
import { FileText, Mail, Link, User, Shield } from "lucide-react";

export const InfoEditor = () => {
  const { openApi, setOpenApi } = useOpenApiStore();

  if (!openApi) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-center">
          <h2 className="text-2xl font-semibold mb-2">
            No OpenAPI Schema Found
          </h2>
          <p className="text-gray-500">
            Import an OpenAPI schema to start editing information
          </p>
        </div>
      </div>
    );
  }

  const updateInfo = (updates: Partial<OpenAPIV3.InfoObject>) => {
    setOpenApi({
      ...openApi,
      info: {
        ...openApi.info,
        ...updates,
      },
    });
  };

  return (
    <div className="h-full flex flex-col">
      {/* Header */}
      <div className="p-6 border-b">
        <h1 className="text-2xl font-bold mb-2">API Information</h1>
        <p className="text-gray-500">Basic information about your API</p>
      </div>

      {/* Main Content */}
      <ScrollArea className="flex-1">
        <div className="p-6 max-w-4xl mx-auto">
          <div className="space-y-8">
            {/* Basic Information */}
            <div className="bg-card 0 rounded-lg border p-6">
              <h2 className="text-lg font-semibold mb-4">Basic Information</h2>
              <div className="grid grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label>Title</Label>
                  <Input
                    value={openApi.info?.title ?? ""}
                    onChange={(e) => updateInfo({ title: e.target.value })}
                    placeholder="My API"
                    className="font-medium"
                  />
                </div>
                <div className="space-y-2">
                  <Label>Version</Label>
                  <Input
                    value={openApi.info?.version ?? ""}
                    onChange={(e) => updateInfo({ version: e.target.value })}
                    placeholder="1.0.0"
                    className="font-mono"
                  />
                </div>
                <div className="col-span-2 space-y-2">
                  <Label>Description</Label>
                  <Input
                    value={openApi.info?.description ?? ""}
                    onChange={(e) =>
                      updateInfo({ description: e.target.value })
                    }
                    placeholder="A detailed description of your API"
                  />
                </div>
              </div>
            </div>

            {/* Contact Information */}
            <div className="bg-card 0 rounded-lg border p-6">
              <div className="flex items-center gap-2 mb-4">
                <User className="w-5 h-5" />
                <h2 className="text-lg font-semibold">Contact Information</h2>
              </div>
              <div className="grid grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label>Name</Label>
                  <Input
                    value={openApi.info?.contact?.name ?? ""}
                    onChange={(e) =>
                      updateInfo({
                        contact: {
                          ...openApi.info?.contact,
                          name: e.target.value,
                        },
                      })
                    }
                    placeholder="John Doe"
                  />
                </div>
                <div className="space-y-2">
                  <Label>Email</Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                    <Input
                      value={openApi.info?.contact?.email ?? ""}
                      onChange={(e) =>
                        updateInfo({
                          contact: {
                            ...openApi.info?.contact,
                            email: e.target.value,
                          },
                        })
                      }
                      placeholder="contact@example.com"
                      className="pl-10"
                    />
                  </div>
                </div>
                <div className="col-span-2 space-y-2">
                  <Label>URL</Label>
                  <div className="relative">
                    <Link className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                    <Input
                      value={openApi.info?.contact?.url ?? ""}
                      onChange={(e) =>
                        updateInfo({
                          contact: {
                            ...openApi.info?.contact,
                            url: e.target.value,
                          },
                        })
                      }
                      placeholder="https://example.com/contact"
                      className="pl-10"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* License Information */}
            <div className="bg-card 0 rounded-lg border p-6">
              <div className="flex items-center gap-2 mb-4">
                <Shield className="w-5 h-5" />
                <h2 className="text-lg font-semibold">License Information</h2>
              </div>
              <div className="grid grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label>Name</Label>
                  <Input
                    value={openApi.info?.license?.name ?? ""}
                    onChange={(e) =>
                      updateInfo({
                        license: {
                          ...openApi.info?.license,
                          name: e.target.value,
                        },
                      })
                    }
                    placeholder="MIT"
                  />
                </div>
                <div className="space-y-2">
                  <Label>URL</Label>
                  <div className="relative">
                    <Link className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                    <Input
                      value={openApi.info?.license?.url ?? ""}
                      onChange={(e) =>
                        updateInfo({
                          license: {
                            ...openApi.info?.license,
                            name: openApi.info?.license?.name ?? "MIT",
                            url: e.target.value,
                          },
                        })
                      }
                      placeholder="https://opensource.org/licenses/MIT"
                      className="pl-10"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Terms of Service */}
            <div className="bg-card 0 rounded-lg border p-6">
              <div className="flex items-center gap-2 mb-4">
                <FileText className="size-5" />
                <h2 className="text-lg font-semibold">Terms of Service</h2>
              </div>
              <div className="space-y-2">
                <Label>URL</Label>
                <div className="relative">
                  <Link className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <Input
                    value={openApi.info?.termsOfService ?? ""}
                    onChange={(e) =>
                      updateInfo({ termsOfService: e.target.value })
                    }
                    placeholder="https://example.com/terms"
                    className="pl-10"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </ScrollArea>
    </div>
  );
};
