import { useState } from "react";
import { Send, Server, FileJson, ListCheck, Lock } from "lucide-react";
import { OpenAPIV3 } from "openapi-types";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useOpenApiStore } from "@/lib/store";
import {
  isParameterObject,
  isReferenceObject,
  isRequestBodyObject,
} from "@/lib/utils";
import type { PathOperation } from "@/lib/types";
import SchemaObjEditor from "./schema-object-editor";
interface RequestFormProps {
  path: string;
  method: string;
  operation: PathOperation;
  requestState: any;
  isLoading: boolean;
  onRequestStateChange: (field: string, value: any) => void;
  onSendRequest: () => void;
}

const ParameterField = ({
  param,
  requestState,
  onRequestStateChange,
}: {
  param: OpenAPIV3.ParameterObject;
  requestState: any;
  onRequestStateChange: (field: string, value: any) => void;
}) => {
  return (
    <div className="space-y-2">
      <Label className="flex justify-between">
        <div className="flex flex-col gap-1">
          <span>{param.name}</span>
          {param.description && (
            <p className="text-xs text-gray-500">{param.description}</p>
          )}
        </div>
        <div className="flex items-center gap-2">
          <Badge variant="outline">{param.in}</Badge>
          {param.required && (
            <Badge variant="destructive" className="text-xs">
              Required
            </Badge>
          )}
        </div>
      </Label>
      <Input
        placeholder={`Enter ${param.name}`}
        value={requestState?.[param.name] || ""}
        onChange={(e) => onRequestStateChange(param.name, e.target.value)}
      />
      {param.example && (
        <p className="text-sm text-gray-500">Example: {param.example}</p>
      )}
    </div>
  );
};

const RequestBodyField = ({
  openApi,
  requestBody,
  requestState,
  onRequestStateChange,
}: {
  openApi: OpenAPIV3.Document;
  requestBody: OpenAPIV3.RequestBodyObject;
  requestState: any;
  onRequestStateChange: (field: string, value: any) => void;
}) => {
  const [value, setValue] = useState(requestState?.body || "");
  const [textEditor, setTextEditor] = useState(
    !!requestBody.content.schema?.schema
  );
  return (
    <div className="space-y-2">
      <Tabs defaultValue={Object.keys(requestBody.content)[0]}>
        <TabsList>
          {Object.entries(requestBody.content).map(([mediaType, _]) => (
            <TabsTrigger key={mediaType} value={mediaType}>
              {mediaType}
            </TabsTrigger>
          ))}
        </TabsList>
        {Object.entries(requestBody.content).map(([mediaType, schema]) => (
          <TabsContent key={mediaType} value={mediaType}>
            <div className="space-y-2">
              <div className="flex justify-between gap-2">
                <p className="text-sm text-gray-500">{mediaType}</p>
                <div className="flex items-center gap-2">
                  <p className="text-sm text-gray-500">Text Editor</p>
                  <Switch
                    checked={textEditor}
                    onCheckedChange={() => setTextEditor(!textEditor)}
                  />
                </div>
              </div>
              <div>
                {!textEditor ? (
                  schema.schema &&
                  isReferenceObject(schema.schema) && (
                    <SchemaObjEditor
                      schema={
                        openApi?.components?.schemas?.[
                          schema.schema.$ref.split("/").pop() ?? ""
                        ] as OpenAPIV3.SchemaObject
                      }
                      value={value}
                      onChange={(value) => setValue(value)}
                    />
                  )
                ) : (
                  <Textarea
                    placeholder={`Enter request body in ${mediaType}`}
                    value={requestState?.body || ""}
                    onChange={(e) =>
                      onRequestStateChange("body", e.target.value)
                    }
                  />
                )}
              </div>
            </div>
          </TabsContent>
        ))}
      </Tabs>
    </div>
  );
};

export const RequestForm = ({
  operation,
  requestState,
  isLoading,
  onRequestStateChange,
  onSendRequest,
}: RequestFormProps) => {
  const { openApi } = useOpenApiStore();
  const servers = openApi?.servers || [];

  return (
    <div className="space-y-4 border-r pr-3">
      <div className="flex items-center justify-between">
        <h4 className="text-lg font-semibold">Request</h4>
      </div>

      {/* Operation Description */}
      {operation.description && (
        <div className="text-sm text-gray-500 bg-background 0 p-3 rounded-md">
          {operation.description}
        </div>
      )}

      {/* Server Selection and Security Requirements */}
      <div className="flex justify-between gap-2">
        {servers.length > 0 && (
          <div className="space-y-2">
            <Label className="flex items-center gap-2">
              <Server className="w-4 h-4" />
              Server
            </Label>
            <Select
              value={requestState?.server || servers[0].url}
              onValueChange={(value) => onRequestStateChange("server", value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select a server" />
              </SelectTrigger>
              <SelectContent>
                {servers.map((server, index) => (
                  <SelectItem key={index} value={server.url}>
                    <div className="flex items-center gap-2">
                      <span>{server.url}</span>
                      {server.description && (
                        <Badge variant="secondary" className="text-xs">
                          {server.description}
                        </Badge>
                      )}
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        )}
        {operation.security && (
          <div className="flex flex-col items-end gap-2">
            <Label className="flex items-center gap-2">
              <Lock className="size-4" />
              Security
            </Label>
            <p className="text-sm text-gray-500">
              <Select>
                <SelectTrigger>
                  <SelectValue placeholder="Select a security requirement" />
                </SelectTrigger>
                {operation.security.map((secRequirement) => (
                  <SelectContent>
                    <SelectItem value={Object.keys(secRequirement)[0]}>
                      {Object.keys(secRequirement)[0]}
                    </SelectItem>
                  </SelectContent>
                ))}
              </Select>
            </p>
          </div>
        )}
      </div>

      {/* Parameters Section */}
      <Accordion type="multiple">
        <AccordionItem value="parameters" className="border-none">
          <AccordionTrigger
            className="border-none"
            disabled={!operation.parameters}
          >
            <div className="flex items-center gap-2">
              <h5 className="text-sm font-medium flex items-center gap-2">
                <ListCheck className="size-4" />
                Parameters
              </h5>
              {operation.parameters && operation.parameters.length > 0 && (
                <Badge variant="secondary" className="text-xs">
                  {operation.parameters.length}{" "}
                  {operation.parameters.length === 1
                    ? "Parameter"
                    : "Parameters"}
                </Badge>
              )}
            </div>
          </AccordionTrigger>
          <AccordionContent>
            <div className="space-y-4">
              {operation.parameters && operation.parameters.length > 0 ? (
                <div className="grid grid-cols-1 gap-4">
                  {operation.parameters.map((param: any, index: number) => {
                    if (isParameterObject(param)) {
                      return (
                        <ParameterField
                          key={index}
                          param={param}
                          requestState={requestState}
                          onRequestStateChange={onRequestStateChange}
                        />
                      );
                    }
                    if (isReferenceObject(param)) {
                      const parameterObject =
                        openApi?.components?.parameters?.[
                          param.$ref.split("/").pop() ?? ""
                        ];
                      return (
                        parameterObject &&
                        isParameterObject(parameterObject) && (
                          <ParameterField
                            key={index}
                            param={parameterObject}
                            requestState={requestState}
                            onRequestStateChange={onRequestStateChange}
                          />
                        )
                      );
                    }
                    return null;
                  })}
                </div>
              ) : (
                <p className="text-sm text-gray-500">No parameters required</p>
              )}
            </div>
          </AccordionContent>
        </AccordionItem>

        {/* Request Body Section */}
        <AccordionItem value="requestBody" className="border-none">
          <AccordionTrigger
            className="border-none"
            disabled={!operation.requestBody}
          >
            <div className="flex items-center justify-between">
              <h5 className="text-sm font-medium flex items-center gap-2">
                <FileJson className="size-4" />
                Request Body
              </h5>
            </div>
          </AccordionTrigger>
          <AccordionContent>
            {operation.requestBody &&
            isRequestBodyObject(operation.requestBody) ? (
              <div className="space-y-2">
                <RequestBodyField
                  openApi={openApi as OpenAPIV3.Document}
                  requestBody={operation.requestBody}
                  requestState={requestState}
                  onRequestStateChange={onRequestStateChange}
                />
              </div>
            ) : operation.requestBody &&
              isReferenceObject(operation.requestBody) ? (
              <RequestBodyField
                openApi={openApi as OpenAPIV3.Document}
                requestBody={
                  openApi?.components?.requestBodies?.[
                    operation.requestBody.$ref.split("/").pop() ?? ""
                  ] as OpenAPIV3.RequestBodyObject
                }
                requestState={requestState}
                onRequestStateChange={onRequestStateChange}
              />
            ) : (
              <p className="text-sm text-gray-500">No request body required</p>
            )}
          </AccordionContent>
        </AccordionItem>
      </Accordion>

      <Button className="w-full" onClick={onSendRequest} disabled={isLoading}>
        {isLoading ? (
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
            Sending...
          </div>
        ) : (
          <div className="flex items-center gap-2">
            <Send className="w-4 h-4" />
            Send Request
          </div>
        )}
      </Button>
    </div>
  );
};
