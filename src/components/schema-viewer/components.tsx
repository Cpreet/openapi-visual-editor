import { OpenAPIV3 } from "openapi-types";
import { Badge } from "@/components/ui/badge";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

const isSchemaObject = (
  schema: OpenAPIV3.ReferenceObject | OpenAPIV3.SchemaObject
): schema is OpenAPIV3.SchemaObject => {
  return "properties" in schema;
};

interface ComponentsProps {
  schemas: Record<string, OpenAPIV3.SchemaObject | OpenAPIV3.ReferenceObject>;
}

export const Components = ({ schemas }: ComponentsProps) => {
  return (
    <div className="space-y-6">
      {Object.entries(schemas).map(
        ([name, schema]) =>
          isSchemaObject(schema) && (
            <div key={name} className="bg-card 0 rounded-lg border">
              <div className="p-4 border-b">
                <h3 className="font-mono text-lg">{name}</h3>
                {schema.description && (
                  <div
                    className="text-sm text-gray-500 mt-1"
                    dangerouslySetInnerHTML={{
                      __html: schema.description,
                    }}
                  />
                )}
              </div>
              <div className="p-4">
                <Accordion type="single" collapsible>
                  <AccordionItem value="properties">
                    <AccordionTrigger>Properties</AccordionTrigger>
                    <AccordionContent>
                      {schema.properties && (
                        <div className="space-y-2">
                          {Object.entries(schema.properties).map(
                            ([propName, prop]) =>
                              isSchemaObject(prop) && (
                                <div
                                  key={propName}
                                  className="flex items-start gap-2 p-2 bg-gray-50 0 rounded-md"
                                >
                                  <div className="flex-1">
                                    <div className="flex items-center gap-2">
                                      <span className="font-mono">
                                        {propName}
                                      </span>
                                      {prop.type && (
                                        <Badge variant="outline">
                                          {prop.type}
                                        </Badge>
                                      )}
                                      {schema.required?.includes(propName) && (
                                        <Badge variant="destructive">
                                          Required
                                        </Badge>
                                      )}
                                    </div>
                                    {prop.description && (
                                      <p className="text-sm text-gray-500 mt-1">
                                        {prop.description}
                                      </p>
                                    )}
                                  </div>
                                </div>
                              )
                          )}
                        </div>
                      )}
                    </AccordionContent>
                  </AccordionItem>
                </Accordion>
              </div>
            </div>
          )
      )}
    </div>
  );
}
