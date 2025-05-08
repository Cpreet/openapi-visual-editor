import { OpenAPIV3 } from "openapi-types";
import { Badge } from "../ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { ScrollArea } from "../ui/scroll-area";

interface CallbackDisplayProps {
  callback: OpenAPIV3.CallbackObject;
}

const CallbackDisplay = ({ callback }: CallbackDisplayProps) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Badge variant="outline">Callback</Badge>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <ScrollArea className="h-[300px] pr-4">
          <div className="space-y-4">
            {Object.entries(callback).map(([expression, pathItem]) => (
              <div key={expression} className="space-y-2">
                <div className="flex items-center gap-2">
                  <Badge variant="secondary" className="font-mono">
                    {expression}
                  </Badge>
                </div>
                <div className="pl-4 border-l-2 border-gray-200 dark:border-gray-700">
                  {Object.entries(pathItem).map(([method, operation]) => (
                    <div key={method} className="mt-2">
                      <div className="flex items-center gap-2">
                        <Badge variant="outline" className="uppercase">
                          {method}
                        </Badge>
                        {typeof operation === "object" &&
                          "summary" in operation && (
                            <span className="text-sm">{operation.summary}</span>
                          )}
                      </div>
                      {typeof operation === "object" &&
                        "description" in operation && (
                          <p className="text-sm text-gray-500 mt-1">
                            {operation.description}
                          </p>
                        )}
                      {typeof operation === "object" &&
                        "parameters" in operation && (
                          <div className="mt-2">
                            <div className="text-sm font-medium mb-1">
                              Parameters:
                            </div>
                            <div className="space-y-1">
                              {operation.parameters?.map((param, index) => (
                                <div
                                  key={index}
                                  className="flex items-center gap-2"
                                >
                                  {typeof param === "object" &&
                                    "name" in param && (
                                      <Badge
                                        variant="outline"
                                        className="font-mono"
                                      >
                                        param.name
                                      </Badge>
                                    )}
                                  {typeof param === "object" &&
                                    "description" in param && (
                                      <span className="text-sm text-gray-500">
                                        {param.description}
                                      </span>
                                    )}
                                </div>
                              ))}
                            </div>
                          </div>
                        )}
                      {typeof operation === "object" &&
                        "responses" in operation && (
                          <div className="mt-2">
                            <div className="text-sm font-medium mb-1">
                              Responses:
                            </div>
                            <div className="space-y-1">
                              {Object.entries(operation.responses).map(
                                ([code, response]) => (
                                  <div
                                    key={code}
                                    className="flex items-center gap-2"
                                  >
                                    <Badge
                                      variant="outline"
                                      className="font-mono"
                                    >
                                      {code}
                                    </Badge>
                                    {typeof response === "object" &&
                                      "description" in response && (
                                        <span className="text-sm text-gray-500">
                                          {response.description}
                                        </span>
                                      )}
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
        </ScrollArea>
      </CardContent>
    </Card>
  );
};

export default CallbackDisplay;
