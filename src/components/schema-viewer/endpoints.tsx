import { OpenAPIV3 } from "openapi-types";
import { Badge } from "@/components/ui/badge";

const HTTP_METHOD_COLORS = {
  GET: "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200",
  POST: "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200",
  PUT: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200",
  DELETE: "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200",
  PATCH:
    "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200",
  HEAD: "bg-gray-100 text-gray-800 0 dark:text-gray-200",
  OPTIONS: "bg-gray-100 text-gray-800 0 dark:text-gray-200",
};

const isParameterObject = (
  param: OpenAPIV3.ReferenceObject | OpenAPIV3.ParameterObject
): param is OpenAPIV3.ParameterObject => {
  return "name" in param;
};

const isResponseObject = (
  response: OpenAPIV3.ReferenceObject | OpenAPIV3.ResponseObject
): response is OpenAPIV3.ResponseObject => {
  return "description" in response;
};

interface EndpointsProps {
  paths: OpenAPIV3.PathsObject;
}

export const Endpoints = ({ paths }: EndpointsProps) => {
  return (
    <div className="space-y-6">
      {Object.entries(paths).map(([path, pathItem]) => (
        <div key={path} className="bg-card 0 rounded-lg border">
          <div className="p-4 border-b">
            <h3 className="font-mono text-lg">{path}</h3>
          </div>
          <div className="divide-y">
            {Object.entries(
              pathItem as Record<string, OpenAPIV3.OperationObject>
            ).map(([method, operation]) => (
              <div key={`${path}-${method}`} className="p-4">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <Badge
                      className={
                        HTTP_METHOD_COLORS[
                        method.toUpperCase() as keyof typeof HTTP_METHOD_COLORS
                        ]
                      }
                    >
                      {method.toUpperCase()}
                    </Badge>
                    <div>
                      <p className="font-medium">
                        {operation.summary || "No summary"}
                      </p>
                      {operation.description && (
                        <p className="text-sm text-gray-500 mt-1">
                          {operation.description}
                        </p>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    {operation.tags && (
                      <div className="flex gap-1">
                        {operation.tags.map((tag) => (
                          <Badge key={tag} variant="secondary">
                            {tag}
                          </Badge>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
                {operation.parameters && operation.parameters.length > 0 && (
                  <div className="mt-4">
                    <h4 className="text-sm font-medium mb-2">Parameters</h4>
                    <div className="space-y-2">
                      {operation.parameters.map(
                        (param, index) =>
                          isParameterObject(param) && (
                            <div
                              key={index}
                              className="flex items-center gap-2 text-sm"
                            >
                              <Badge variant="outline" className="font-mono">
                                {param.name}
                              </Badge>
                              <span className="text-gray-500">
                                in {param.in}
                              </span>
                              {param.required && (
                                <Badge variant="destructive">Required</Badge>
                              )}
                            </div>
                          )
                      )}
                    </div>
                  </div>
                )}
                {operation.responses && (
                  <div className="mt-4">
                    <h4 className="text-sm font-medium mb-2">Responses</h4>
                    <div className="space-y-2">
                      {Object.entries(operation.responses).map(
                        ([code, response]) =>
                          isResponseObject(response) && (
                            <div
                              key={code}
                              className="flex items-center gap-2 text-sm"
                            >
                              <Badge
                                variant={
                                  code.startsWith("2")
                                    ? "default"
                                    : code.startsWith("4") ||
                                      code.startsWith("5")
                                      ? "destructive"
                                      : "secondary"
                                }
                              >
                                {code}
                              </Badge>
                              <span className="text-gray-500">
                                {response.description}
                              </span>
                            </div>
                          )
                      )}
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
