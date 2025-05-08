import { OpenAPIV3 } from "openapi-types";
import { Badge } from "../ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";

interface HeaderDisplayProps {
  header: OpenAPIV3.HeaderObject;
}

const HeaderDisplay = ({ header }: HeaderDisplayProps) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Badge variant="outline">Header</Badge>
          {header.required && <Badge variant="secondary">Required</Badge>}
        </CardTitle>
      </CardHeader>
      <CardContent>
        {header.description && (
          <p className="text-sm text-gray-500 mb-4">{header.description}</p>
        )}
        <div className="space-y-4">
          {header.schema && (
            <div>
              <div className="text-sm font-medium mb-2">Schema:</div>
              <pre className="text-sm bg-gray-50 0 p-2 rounded overflow-x-auto">
                {JSON.stringify(header.schema, null, 2)}
              </pre>
            </div>
          )}
          {header.examples && (
            <div>
              <div className="text-sm font-medium mb-2">Examples:</div>
              <div className="space-y-2">
                {Object.entries(header.examples).map(([name, example]) => (
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
          {header.content && (
            <div>
              <div className="text-sm font-medium mb-2">Content:</div>
              <div className="space-y-2">
                {Object.entries(header.content).map(
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

export default HeaderDisplay;
