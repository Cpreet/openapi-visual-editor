import { Copy } from "lucide-react";
import { useCopyToClipboard } from "@/hooks/use-copy-to-clipboard";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { type PathOperation } from "@/lib/types";

interface ResponseViewerProps {
  responseData: {
    status?: number;
    data?: any;
    headers?: Record<string, string>;
    error?: string;
  } | null;
  operation?: PathOperation;
}

export const ResponseViewer = ({
  responseData,
  operation,
}: ResponseViewerProps) => {
  const { copy } = useCopyToClipboard();

  return (
    <div className="space-y-4 border-l pl-3">
      <div className="flex items-center justify-between">
        <h4 className="text-lg font-semibold">Response</h4>
        {operation?.responses && (
          <div className="flex items-center gap-2">
            {Object.keys(operation.responses).map((code) => (
              <Badge
                key={code}
                variant={
                  code.startsWith("2")
                    ? "default"
                    : code.startsWith("4") || code.startsWith("5")
                    ? "destructive"
                    : "secondary"
                }
                className="text-xs"
              >
                {code}
              </Badge>
            ))}
          </div>
        )}
      </div>

      {responseData ? (
        <div className="space-y-4">
          {/* Response Description */}
          {operation?.responses &&
            responseData.status &&
            operation.responses[responseData.status.toString()] &&
            typeof operation.responses[responseData.status.toString()] ===
              "object" &&
            "description" in
              operation.responses[responseData.status.toString()] && (
              <div className="text-sm text-gray-500 bg-background 0 p-3 rounded-md">
                {Object.keys(
                  operation.responses[responseData.status.toString()]
                ).includes("description")
                  ? operation.responses[responseData.status.toString()]
                      .description
                  : "No description"}
              </div>
            )}

          <div className="flex items-center gap-2">
            <Badge
              className={
                responseData.status?.toString().startsWith("2")
                  ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
                  : "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200"
              }
            >
              {responseData.status}
            </Badge>
            {responseData.error && (
              <span className="text-red-500">{responseData.error}</span>
            )}
          </div>

          {/* Response Headers */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <h5 className="text-sm font-medium">Headers</h5>
              {responseData.headers && (
                <div className="flex items-center gap-2">
                  <Button
                    variant="secondary"
                    className="text-xs size-4"
                    size="icon"
                    onClick={() => {
                      copy(JSON.stringify(responseData.headers, null, 2));
                    }}
                  >
                    <Copy className="size-4" />
                  </Button>
                  <Badge variant="secondary" className="text-xs">
                    {Object.keys(responseData.headers).length} Headers
                  </Badge>
                </div>
              )}
            </div>
            <pre className="bg-background 0 p-3 rounded-md text-sm overflow-x-auto">
              {JSON.stringify(responseData.headers, null, 2)}
            </pre>
          </div>

          {/* Response Body */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <h5 className="text-sm font-medium">Body</h5>

              {responseData.data && (
                <>
                  <div className="flex items-center gap-2 group/data-body">
                    <Button
                      variant="secondary"
                      className="text-xs size-4"
                      size="icon"
                      onClick={() => {
                        copy(JSON.stringify(responseData.data, null, 2));
                      }}
                    >
                      <Copy className="size-4" />
                    </Button>
                    <Badge variant="secondary" className="text-xs">
                      {typeof responseData.data === "object" ? "JSON" : "Text"}
                    </Badge>
                  </div>
                </>
              )}
            </div>
            <div className="bg-background 0 p-3 rounded-md text-sm overflow-x-auto">
              <ScrollArea className="h-[300px]">
                <pre className="bg-background 0 p-3 rounded-md text-sm overflow-x-auto">
                  {JSON.stringify(responseData.data, null, 2)}
                </pre>
              </ScrollArea>
            </div>
          </div>
        </div>
      ) : (
        <p className="text-sm text-gray-500">No response yet</p>
      )}
    </div>
  );
};
