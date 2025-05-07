import { OpenAPIV3 } from "openapi-types";
import { Badge } from "@/components/ui/badge";
import { Server, Shield, Info, Route, Component } from "lucide-react";
import { sanitizeMarkdownOrHtml } from "@/lib/utils";
import { STATUS_COLORS } from "@/lib/constants";
import { SecurityInput } from "@/components/schema-viewer/security-input";
import { useState } from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
interface SchemaOverviewProps {
  openApi: OpenAPIV3.Document;
  status: Array<{ status: string }>;
  securityCredentials: Record<string, string>;
  onSecurityCredentialChange: (scheme: string, value: string) => void;
}

const isSecuritySchemeObject = (
  scheme: OpenAPIV3.ReferenceObject | OpenAPIV3.SecuritySchemeObject
): scheme is OpenAPIV3.SecuritySchemeObject => {
  return "type" in scheme;
};

export const SchemaOverview = ({
  openApi,
  status,
  securityCredentials,
  onSecurityCredentialChange,
}: SchemaOverviewProps) => {
  const [selectedSecurityScheme, setSelectedSecurityScheme] =
    useState<string>("");

  return (
    <div className="space-y-6">
      {/* Servers and Security Row */}
      <div className="flex gap-6">
        {/* Servers Card */}
        {openApi.servers && openApi.servers.length > 0 && (
          <div className="flex-1 bg-background rounded-lg border p-6">
            <div className="flex items-center gap-2 mb-4">
              <Server className="size-5" />
              <h2 className="text-lg font-semibold">Servers</h2>
            </div>
            <div className="space-y-3">
              {openApi.servers.map((server, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between p-3 bg-accent dark:bg-card rounded-md"
                >
                  <div className="flex items-center gap-3">
                    <Badge variant="outline" className="font-mono">
                      {server.url}
                    </Badge>
                    {server.description && (
                      <span className="text-sm">
                        {server.description}
                      </span>
                    )}
                  </div>
                  <div className="flex items-center gap-2">
                    {status[index] && (
                      <Badge
                        className={
                          STATUS_COLORS[
                          status[index].status as keyof typeof STATUS_COLORS
                          ] || "default"
                        }
                      >
                        {status[index].status}
                      </Badge>
                    )}
                    {server.variables &&
                      Object.keys(server.variables).length > 0 && (
                        <div className="flex gap-2">
                          {Object.entries(server.variables).map(
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
                      )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Security Card */}
        {openApi.components?.securitySchemes &&
          Object.keys(openApi.components?.securitySchemes).length > 0 && (
            <div className="flex-1 bg-background rounded-lg border p-6">
              <div className="flex items-center gap-2 mb-4 justify-between">
                <div className="flex items-center gap-2">
                  <Shield className="size-5" />
                  <h2 className="text-lg font-semibold">
                    Security Requirements
                  </h2>
                </div>
                <Select
                  value={selectedSecurityScheme}
                  onValueChange={setSelectedSecurityScheme}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select a security scheme" />
                  </SelectTrigger>
                  <SelectContent>
                    {Object.keys(openApi.components?.securitySchemes).map(
                      (scheme) => (
                        <SelectItem key={scheme} value={scheme}>
                          {scheme}
                        </SelectItem>
                      )
                    )}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-3">
                {openApi.components?.securitySchemes &&
                  Object.keys(openApi.components?.securitySchemes).length >
                  0 && (
                    <div className="flex flex-col gap-2">
                      {selectedSecurityScheme && (
                        <div className="flex flex-col gap-2">
                          <Badge variant="outline">
                            {selectedSecurityScheme}
                          </Badge>
                          {selectedSecurityScheme &&
                            isSecuritySchemeObject(
                              openApi.components?.securitySchemes?.[
                              selectedSecurityScheme
                              ]
                            ) ? (
                            <SecurityInput
                              scheme={selectedSecurityScheme}
                              securityScheme={
                                openApi.components?.securitySchemes?.[
                                selectedSecurityScheme
                                ]
                              }
                              securityCredentials={securityCredentials}
                              onSecurityCredentialChange={
                                onSecurityCredentialChange
                              }
                            />
                          ) : null}
                        </div>
                      )}
                    </div>
                  )}
              </div>
            </div>
          )}
      </div>

      {/* API Info Card */}
      <div className="bg-background 0 rounded-lg border p-6">
        <div className="flex items-start justify-between">
          <div>
            <h2 className="text-2xl font-bold mb-2">{openApi.info.title}</h2>
            <div className="flex items-center gap-2">
              <Badge variant="outline" className="font-mono">
                {openApi.info.version}
              </Badge>
              {openApi.info.contact && (
                <Badge variant="secondary">
                  <a
                    href={openApi.info.contact.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-1"
                  >
                    <Info className="size-3" />
                    Contact
                  </a>
                </Badge>
              )}
              {openApi.info.license && (
                <Badge variant="secondary">
                  <a
                    href={openApi.info.license.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-1"
                  >
                    <Shield className="size-3" />
                    {openApi.info.license.name}
                  </a>
                </Badge>
              )}
            </div>
            <div
              className="my-4 prose prose-base dark:prose-invert"
              dangerouslySetInnerHTML={{
                __html: sanitizeMarkdownOrHtml(openApi.info.description || ""),
              }}
            />
          </div>
          <div className="flex flex-col items-end gap-2">
            <div className="text-sm text-gray-500">
              <div className="flex items-center gap-2">
                <Route className="w-4 h-4" />
                {Object.keys(openApi.paths || {}).length} Endpoints
              </div>
            </div>
            <div className="text-sm text-gray-500">
              <div className="flex items-center gap-2">
                <Component className="w-4 h-4" />
                {Object.keys(openApi.components?.schemas || {}).length} Schemas
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
