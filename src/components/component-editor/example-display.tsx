import { OpenAPIV3 } from "openapi-types";
import { Badge } from "../ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";

interface ExampleDisplayProps {
  example: OpenAPIV3.ExampleObject;
}

const ExampleDisplay = ({ example }: ExampleDisplayProps) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Badge variant="outline">Example</Badge>
          {example.summary && (
            <span className="text-sm text-gray-500">{example.summary}</span>
          )}
        </CardTitle>
      </CardHeader>
      <CardContent>
        {example.description && (
          <p className="text-sm text-gray-500 mb-4">{example.description}</p>
        )}
        {example.value && (
          <div>
            <pre className="text-sm bg-gray-50 0 p-2 rounded overflow-x-auto">
              {JSON.stringify(example.value, null, 2)}
            </pre>
          </div>
        )}
        {example.externalValue && (
          <div className="mt-2">
            <div className="text-sm font-medium mb-1">External Value:</div>
            <a
              href={example.externalValue}
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm text-blue-500 hover:underline"
            >
              {example.externalValue}
            </a>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default ExampleDisplay;
