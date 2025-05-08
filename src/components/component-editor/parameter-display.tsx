import { OpenAPIV3 } from "openapi-types";
import { Badge } from "../ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";

interface ParameterDisplayProps {
  parameter: OpenAPIV3.ParameterObject;
}

const ParameterDisplay = ({ parameter }: ParameterDisplayProps) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Badge variant="outline">{parameter.in}</Badge>
          {parameter.required && <Badge variant="secondary">Required</Badge>}
          {parameter.name && (
            <span className="font-mono text-sm">{parameter.name}</span>
          )}
        </CardTitle>
      </CardHeader>
      <CardContent>
        {parameter.description && (
          <p className="text-sm text-gray-500 mb-4">{parameter.description}</p>
        )}
        <div className="space-y-4">
          {parameter.schema && (
            <div>
              <div className="text-sm font-medium mb-2">Schema:</div>
              <pre className="text-sm bg-gray-50 0 p-2 rounded overflow-x-auto">
                {JSON.stringify(parameter.schema, null, 2)}
              </pre>
            </div>
          )}
          {parameter.examples && (
            <div>
              <div className="text-sm font-medium mb-2">Examples:</div>
              <div className="space-y-2">
                {Object.entries(parameter.examples).map(([name, example]) => (
                  <div key={name} className="flex items-start gap-2">
                    <Badge variant="outline" className="font-mono">
                      {name}
                    </Badge>
                    <pre className="text-sm bg-gray-50 0 p-2 rounded overflow-x-auto flex-1">
                      {typeof example === "object" &&
                        "value" in example &&
                        JSON.stringify(example.value, null, 2)}
                    </pre>
                  </div>
                ))}
              </div>
            </div>
          )}
          {parameter.content && (
            <div>
              <div className="text-sm font-medium mb-2">Content:</div>
              <div className="space-y-2">
                {Object.entries(parameter.content).map(
                  ([contentType, mediaType]) => (
                    <div key={contentType} className="space-y-2">
                      <Badge variant="secondary">{contentType}</Badge>
                      {mediaType.schema && (
                        <pre className="text-sm bg-gray-50 0 p-2 rounded overflow-x-auto mt-2">
                          {JSON.stringify(mediaType.schema, null, 2)}
                        </pre>
                      )}
                    </div>
                  )
                )}
              </div>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default ParameterDisplay;
