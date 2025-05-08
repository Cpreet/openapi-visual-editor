import { OpenAPIV3 } from "openapi-types";
import { Badge } from "../ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";

interface ResponseDisplayProps {
  response: OpenAPIV3.ResponseObject;
}

const ResponseDisplay = ({ response }: ResponseDisplayProps) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Badge variant="outline">Response</Badge>
          {response.description && (
            <span className="text-sm text-gray-500">
              {response.description}
            </span>
          )}
        </CardTitle>
      </CardHeader>
      <CardContent>
        {response.content && (
          <div className="space-y-4">
            {Object.entries(response.content).map(
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
                </div>
              )
            )}
          </div>
        )}
        {response.headers && (
          <div className="mt-4">
            <div className="text-sm font-medium mb-2">Headers:</div>
            <div className="space-y-2">
              {Object.entries(response.headers).map(([name, header]) => (
                <div key={name} className="flex items-start gap-2">
                  <Badge variant="outline" className="font-mono">
                    {name}
                  </Badge>
                  <div className="text-sm text-gray-500">
                    {typeof header === "object" &&
                      "description" in header &&
                      header.description}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default ResponseDisplay;
