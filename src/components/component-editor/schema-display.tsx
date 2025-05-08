import { OpenAPIV3 } from "openapi-types";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";

interface SchemaDisplayProps {
  schema: OpenAPIV3.SchemaObject;
}

const SchemaDisplay = ({ schema }: SchemaDisplayProps) => {
  const renderProperty = (name: string, property: OpenAPIV3.SchemaObject) => {
    return (
      <div
        key={name}
        className="pl-4 border-l-2 border-gray-200 dark:border-gray-700"
      >
        <div className="flex items-center gap-2">
          <span className="font-mono text-sm">{name}</span>
          <Badge variant="outline">{property.type}</Badge>
          {property.required && <Badge variant="secondary">Required</Badge>}
        </div>
        {property.description && (
          <p className="text-sm text-gray-500 mt-1">{property.description}</p>
        )}
        {property.enum && (
          <div className="mt-2 flex flex-wrap gap-1">
            {property.enum.map((value) => (
              <Badge
                key={String(value)}
                variant="outline"
                className="font-mono"
              >
                {String(value)}
              </Badge>
            ))}
          </div>
        )}
        {property.properties && (
          <div className="mt-2 space-y-2">
            {Object.entries(property.properties).map(([propName, prop]) =>
              renderProperty(propName, prop as OpenAPIV3.SchemaObject)
            )}
          </div>
        )}
      </div>
    );
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Badge variant="outline">{schema.type}</Badge>
          {schema.title && <span>{schema.title}</span>}
        </CardTitle>
      </CardHeader>
      <CardContent>
        {schema.description && (
          <p className="text-sm text-gray-500 mb-4">{schema.description}</p>
        )}
        <ScrollArea className="h-[300px] pr-4">
          {schema.properties && (
            <div className="space-y-4">
              {Object.entries(schema.properties).map(([name, property]) =>
                renderProperty(name, property as OpenAPIV3.SchemaObject)
              )}
            </div>
          )}
          {schema.enum && (
            <div className="flex flex-wrap gap-2 mt-4">
              {schema.enum.map((value) => (
                <Badge
                  key={String(value)}
                  variant="outline"
                  className="font-mono"
                >
                  {String(value)}
                </Badge>
              ))}
            </div>
          )}
        </ScrollArea>
      </CardContent>
    </Card>
  );
};

export default SchemaDisplay;
