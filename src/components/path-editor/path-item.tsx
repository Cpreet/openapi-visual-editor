import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Copy, Edit, Trash } from "lucide-react";
import { type PathOperation } from "@/lib/types";
import { HTTP_METHOD_COLORS } from "@/lib/constants";
import { sanitizeMarkdownOrHtml } from "@/lib/utils";
import { RequestForm } from "./request-form";
import { ResponseViewer } from "./response-viewer";
import { Separator } from "../ui/separator";

interface PathItemProps {
  path: string;
  pathItem: Record<string, PathOperation>;
  requestStates: Record<string, any>;
  responseData: Record<string, any>;
  isLoading: Record<string, boolean>;
  onRequestStateChange: (
    path: string,
    method: string,
    field: string,
    value: any
  ) => void;
  onSendRequest: (
    path: string,
    method: string,
    operation: PathOperation
  ) => void;
  onEditPath: (path: string, method: string, operation: PathOperation) => void;
  onRemovePath: (path: string, method: string) => void;
}

export const PathItem = ({
  path,
  pathItem,
  requestStates,
  responseData,
  isLoading,
  onRequestStateChange,
  onSendRequest,
  onEditPath,
  onRemovePath,
}: PathItemProps) => {
  return (
    <div className="bg-card rounded-lg border shadow-2xl">
      <div className="p-4 border-b">
        <h3 className="font-mono text-lg">{path}</h3>
      </div>
      <div className="divide-y">
        {Object.entries(pathItem).map(([method, operation]) => {
          return (
            <Accordion collapsible type="single" key={`${path}-${method}`}>
              <AccordionItem value={`${path}-${method}`}>
                <AccordionTrigger className="px-4">
                  <div className="flex items-center justify-between w-full">
                    <div className="flex items-center gap-3">
                      <Badge
                        className={
                          HTTP_METHOD_COLORS[
                            method.toUpperCase() as keyof typeof HTTP_METHOD_COLORS
                          ] + " min-w-20 max-w-10"
                        }
                      >
                        {method.toUpperCase()}
                      </Badge>
                      <div>
                        <p className="font-medium">
                          {operation.summary || "No summary"}
                        </p>
                        {operation.description && (
                          <ScrollArea className="max-h-[100px] overflow-auto">
                            <div
                              className="prose prose-slate dark:prose-invert prose-sm"
                              dangerouslySetInnerHTML={{
                                __html: sanitizeMarkdownOrHtml(
                                  operation.description || "No description"
                                ),
                              }}
                            />
                          </ScrollArea>
                        )}
                      </div>
                    </div>
                    <div className="flex items-center gap-2 ml-10">
                      <Button
                        variant="outline"
                        size="icon"
                        onClick={(e) => {
                          e.stopPropagation();
                          navigator.clipboard.writeText(path);
                        }}
                      >
                        <Copy className="size-4" />
                      </Button>
                      <Button
                        variant="outline"
                        size="icon"
                        onClick={(e) => {
                          e.stopPropagation();
                          onEditPath(path, method, operation);
                        }}
                      >
                        <Edit className="size-4" />
                      </Button>
                      <Button
                        variant="outline"
                        size="icon"
                        onClick={(e) => {
                          e.stopPropagation();
                          onRemovePath(path, method);
                        }}
                      >
                        <Trash className="size-4" />
                      </Button>
                    </div>
                  </div>
                </AccordionTrigger>
                <AccordionContent>
                  <div className="grid grid-cols-2 gap-1 p-4">
                    <RequestForm
                      path={path}
                      method={method}
                      operation={operation}
                      requestState={requestStates[`${path}-${method}`]}
                      isLoading={isLoading[`${path}-${method}`]}
                      onRequestStateChange={(field, value) =>
                        onRequestStateChange(path, method, field, value)
                      }
                      onSendRequest={() =>
                        onSendRequest(path, method, operation)
                      }
                    />
                    <ResponseViewer
                      responseData={responseData[`${path}-${method}`]}
                      operation={operation}
                    />
                  </div>
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          );
        })}
      </div>
    </div>
  );
};
