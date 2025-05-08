import { OpenAPIV3 } from "openapi-types";
import { Badge } from "../ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";

interface LinkDisplayProps {
  link: OpenAPIV3.LinkObject;
}

const LinkDisplay = ({ link }: LinkDisplayProps) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Badge variant="outline">Link</Badge>
          {link.operationId && (
            <span className="text-sm font-mono">{link.operationId}</span>
          )}
        </CardTitle>
      </CardHeader>
      <CardContent>
        {link.description && (
          <p className="text-sm text-gray-500 mb-4">{link.description}</p>
        )}
        <div className="space-y-4">
          {link.operationRef && (
            <div className="flex items-center gap-2">
              <Badge variant="outline">Operation Ref</Badge>
              <span className="text-sm font-mono">{link.operationRef}</span>
            </div>
          )}
          {link.parameters && (
            <div>
              <div className="text-sm font-medium mb-2">Parameters:</div>
              <div className="space-y-2">
                {Object.entries(link.parameters).map(([name, value]) => (
                  <div key={name} className="flex items-start gap-2">
                    <Badge variant="outline" className="font-mono">
                      {name}
                    </Badge>
                    <span className="text-sm">{value}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
          {link.requestBody && (
            <div>
              <div className="text-sm font-medium mb-2">Request Body:</div>
              <pre className="text-sm bg-gray-50 0 p-2 rounded overflow-x-auto">
                {JSON.stringify(link.requestBody, null, 2)}
              </pre>
            </div>
          )}
          {link.server && (
            <div>
              <div className="text-sm font-medium mb-2">Server:</div>
              <div className="flex items-center gap-2">
                <Badge variant="outline">URL</Badge>
                <span className="text-sm">{link.server.url}</span>
              </div>
              {link.server.description && (
                <p className="text-sm text-gray-500 mt-1">
                  {link.server.description}
                </p>
              )}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default LinkDisplay;
