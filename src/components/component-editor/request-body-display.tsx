import { OpenAPIV3 } from "openapi-types";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface RequestBodyDisplayProps {
  requestBody: OpenAPIV3.RequestBodyObject;
}

const RequestBodyDisplay = ({ requestBody }: RequestBodyDisplayProps) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Badge variant="outline">Request Body</Badge>
          {requestBody.required && <Badge variant="secondary">Required</Badge>}
        </CardTitle>
      </CardHeader>
      <CardContent>
        {requestBody.description && (
          <p className="text-sm text-gray-500 mb-4">
            {requestBody.description}
          </p>
        )}
        {requestBody.content && (
          <div className="space-y-4">
            {Object.entries(requestBody.content).map(
              ([contentType, mediaType]) => (
                <div key={contentType} className="space-y-2">
                  <div className="flex items-center gap-2">
                    <Badge variant="secondary">{contentType}</Badge>
                    {mediaType.schema && (
                      <Badge variant="outline">
                        {typeof mediaType.schema === "object" &&
                        "type" in mediaType.schema
                          ? mediaType.schema.type
                          : "schema"}
                      </Badge>
                    )}
                  </div>
                  {mediaType.schema && (
                    <div className="mt-2">
                      <pre className="text-sm bg-gray-50 0 p-2 rounded overflow-x-auto">
                        {JSON.stringify(mediaType.schema, null, 2)}
                      </pre>
                    </div>
                  )}
                  {mediaType.example && (
                    <div className="mt-2">
                      <div className="text-sm font-medium mb-1">Example:</div>
                      <pre className="text-sm bg-gray-50 0 p-2 rounded overflow-x-auto">
                        {JSON.stringify(mediaType.example, null, 2)}
                      </pre>
                    </div>
                  )}
                  {mediaType.examples && (
                    <div className="mt-2">
                      <div className="text-sm font-medium mb-1">Examples:</div>
                      <div className="space-y-2">
                        {Object.entries(mediaType.examples).map(
                          ([name, example]) => (
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
                          )
                        )}
                      </div>
                    </div>
                  )}
                </div>
              )
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default RequestBodyDisplay;
