import { useEffect, useState } from "react";
import { useOpenApiStore } from "@/lib/store";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Copy,
  Edit,
  Trash,
  Plus,
  Search,
  Box,
  ChevronRight,
  ChevronDown,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import SchemaDisplay from "@/components/component-editor/schema-display";
import ResponseDisplay from "@/components/component-editor/response-display";
import ParameterDisplay from "@/components/component-editor/parameter-display";
import RequestBodyDisplay from "@/components/component-editor/request-body-display";
import ExampleDisplay from "@/components/component-editor/example-display";
import HeaderDisplay from "@/components/component-editor/header-display";
import SecuritySchemeDisplay from "@/components/component-editor/security-scheme-display";
import LinkDisplay from "@/components/component-editor/link-display";
import CallbackDisplay from "@/components/component-editor/callback-display";

type ComponentType =
  | "schemas"
  | "responses"
  | "parameters"
  | "examples"
  | "requestBodies"
  | "headers"
  | "securitySchemes"
  | "links"
  | "callbacks";

interface ComponentGroup {
  name: string;
  components: Record<string, any>;
}

const ComponentEditor = () => {
  const { openApi } = useOpenApiStore();
  const [selectedType, setSelectedType] = useState<ComponentType>("schemas");
  const [components, setComponents] = useState<Record<string, any>>({});
  const [searchQuery, setSearchQuery] = useState("");
  const [isAddingComponent, setIsAddingComponent] = useState(false);
  const [expandedGroups, setExpandedGroups] = useState<Set<string>>(new Set());
  const [newComponent, setNewComponent] = useState<{
    name: string;
    component: any;
    group?: string;
  }>({
    name: "",
    component: {},
  });

  useEffect(() => {
    if (openApi?.components) {
      setComponents(openApi.components[selectedType] || {});
    }
  }, [openApi, selectedType]);

  const addComponent = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    const componentName = newComponent.group
      ? `${newComponent.group}/${newComponent.name}`
      : newComponent.name;

    setComponents({
      ...components,
      [componentName]: newComponent.component,
    });
    setNewComponent({
      name: "",
      component: {},
    });
    setIsAddingComponent(false);
  };

  const removeComponent = (name: string) => {
    const newComponents = { ...components };
    delete newComponents[name];
    setComponents(newComponents);
  };

  const toggleGroup = (groupName: string) => {
    const newExpanded = new Set(expandedGroups);
    if (newExpanded.has(groupName)) {
      newExpanded.delete(groupName);
    } else {
      newExpanded.add(groupName);
    }
    setExpandedGroups(newExpanded);
  };

  const groupComponents = (): ComponentGroup[] => {
    const groups: Record<string, Record<string, any>> = {};
    const rootComponents: Record<string, any> = {};

    Object.entries(components).forEach(([name, component]) => {
      const parts = name.split("/");
      if (parts.length > 1) {
        const groupName = parts[0];
        const componentName = parts.slice(1).join("/");
        if (!groups[groupName]) {
          groups[groupName] = {};
        }
        groups[groupName][componentName] = component;
      } else {
        rootComponents[name] = component;
      }
    });

    return [
      { name: "Root", components: rootComponents },
      ...Object.entries(groups).map(([name, components]) => ({
        name,
        components,
      })),
    ];
  };

  const filteredGroups = groupComponents()
    .map((group) => ({
      ...group,
      components: Object.entries(group.components).filter(
        ([name, component]) =>
          name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          (component.description?.toLowerCase() || "").includes(
            searchQuery.toLowerCase()
          )
      ),
    }))
    .filter((group) => group.components.length > 0);

  const renderComponentForm = () => {
    const commonFields = (
      <>
        <div className="col-span-2">
          <Label>Group (Optional)</Label>
          <Input
            value={newComponent.group || ""}
            onChange={(e) =>
              setNewComponent({ ...newComponent, group: e.target.value })
            }
            placeholder="Enter group name (e.g., users, auth)"
            className="mt-1"
          />
        </div>
        <div className="col-span-2">
          <Label>Name</Label>
          <Input
            value={newComponent.name}
            onChange={(e) =>
              setNewComponent({ ...newComponent, name: e.target.value })
            }
            placeholder={`Enter ${selectedType.slice(0, -1)} name`}
            className="mt-1"
          />
        </div>
      </>
    );

    switch (selectedType) {
      case "schemas":
        return (
          <>
            {commonFields}
            <div className="col-span-2">
              <Label>Schema Definition (JSON)</Label>
              <Textarea
                value={JSON.stringify(newComponent.component, null, 2)}
                onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => {
                  try {
                    const parsed = JSON.parse(e.target.value);
                    setNewComponent({
                      ...newComponent,
                      component: parsed,
                    });
                  } catch (error) {
                    // Invalid JSON, don't update
                  }
                }}
                placeholder="Enter schema definition in JSON format"
                className="mt-1 font-mono h-48"
              />
            </div>
          </>
        );
      case "responses":
        return (
          <>
            {commonFields}
            <div className="col-span-2">
              <Label>Description</Label>
              <Input
                value={newComponent.component.description || ""}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                  setNewComponent({
                    ...newComponent,
                    component: {
                      ...newComponent.component,
                      description: e.target.value,
                    },
                  })
                }
                placeholder="Response description"
                className="mt-1"
              />
            </div>
            <div className="col-span-2">
              <Label>Content (JSON)</Label>
              <Textarea
                value={JSON.stringify(
                  newComponent.component.content || {},
                  null,
                  2
                )}
                onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => {
                  try {
                    const parsed = JSON.parse(e.target.value);
                    setNewComponent({
                      ...newComponent,
                      component: {
                        ...newComponent.component,
                        content: parsed,
                      },
                    });
                  } catch (error) {
                    // Invalid JSON, don't update
                  }
                }}
                placeholder="Enter response content in JSON format"
                className="mt-1 font-mono h-48"
              />
            </div>
          </>
        );
      case "parameters":
        return (
          <>
            {commonFields}
            <div className="col-span-2">
              <Label>Description</Label>
              <Input
                value={newComponent.component.description || ""}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                  setNewComponent({
                    ...newComponent,
                    component: {
                      ...newComponent.component,
                      description: e.target.value,
                    },
                  })
                }
                placeholder="Parameter description"
                className="mt-1"
              />
            </div>
            <div className="col-span-1">
              <Label>In</Label>
              <Select
                value={newComponent.component.in || "query"}
                onValueChange={(value) =>
                  setNewComponent({
                    ...newComponent,
                    component: {
                      ...newComponent.component,
                      in: value,
                    },
                  })
                }
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="query">Query</SelectItem>
                  <SelectItem value="header">Header</SelectItem>
                  <SelectItem value="path">Path</SelectItem>
                  <SelectItem value="cookie">Cookie</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="col-span-1">
              <Label>Required</Label>
              <Select
                value={String(newComponent.component.required || false)}
                onValueChange={(value) =>
                  setNewComponent({
                    ...newComponent,
                    component: {
                      ...newComponent.component,
                      required: value === "true",
                    },
                  })
                }
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="true">Yes</SelectItem>
                  <SelectItem value="false">No</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </>
        );
      default:
        return (
          <>
            {commonFields}
            <div className="col-span-2">
              <Label>Component Definition (JSON)</Label>
              <Textarea
                value={JSON.stringify(newComponent.component, null, 2)}
                onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => {
                  try {
                    const parsed = JSON.parse(e.target.value);
                    setNewComponent({
                      ...newComponent,
                      component: parsed,
                    });
                  } catch (error) {
                    // Invalid JSON, don't update
                  }
                }}
                placeholder="Enter component definition in JSON format"
                className="mt-1 font-mono h-48"
              />
            </div>
          </>
        );
    }
  };

  const renderComponentDisplay = (component: any) => {
    switch (selectedType) {
      case "schemas":
        return <SchemaDisplay schema={component} />;
      case "responses":
        return <ResponseDisplay response={component} />;
      case "parameters":
        return <ParameterDisplay parameter={component} />;
      case "requestBodies":
        return <RequestBodyDisplay requestBody={component} />;
      case "examples":
        return <ExampleDisplay example={component} />;
      case "headers":
        return <HeaderDisplay header={component} />;
      case "securitySchemes":
        return <SecuritySchemeDisplay securityScheme={component} />;
      case "links":
        return <LinkDisplay link={component} />;
      case "callbacks":
        return <CallbackDisplay callback={component} />;
      default:
        return (
          <div className="mt-2">
            <pre className="text-sm bg-gray-50 0 p-2 rounded overflow-x-auto">
              {JSON.stringify(component, null, 2)}
            </pre>
          </div>
        );
    }
  };

  if (!openApi) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-center">
          <h2 className="text-2xl font-semibold mb-2">
            No OpenAPI Schema Found
          </h2>
          <p className="text-gray-500">
            Import an OpenAPI schema to start managing components
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col">
      {/* Header */}
      <div className="p-6 border-b">
        <div className="flex items-center justify-between mb-4">
          <h1 className="text-2xl font-bold">Components</h1>
          <Button onClick={() => setIsAddingComponent(true)}>
            <Plus className="w-4 h-4 mr-2" />
            Add Component
          </Button>
        </div>
        <div className="flex gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <Input
              placeholder="Search components..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>
      </div>

      {/* Component Type Tabs */}
      <Tabs
        value={selectedType}
        onValueChange={(value) => setSelectedType(value as ComponentType)}
      >
        <TabsList className="w-full justify-start border-b rounded-none px-6">
          <TabsTrigger value="schemas">Schemas</TabsTrigger>
          <TabsTrigger value="responses">Responses</TabsTrigger>
          <TabsTrigger value="parameters">Parameters</TabsTrigger>
          <TabsTrigger value="examples">Examples</TabsTrigger>
          <TabsTrigger value="requestBodies">Request Bodies</TabsTrigger>
          <TabsTrigger value="headers">Headers</TabsTrigger>
          <TabsTrigger value="securitySchemes">Security Schemes</TabsTrigger>
          <TabsTrigger value="links">Links</TabsTrigger>
          <TabsTrigger value="callbacks">Callbacks</TabsTrigger>
        </TabsList>
      </Tabs>

      {/* Add Component Form */}
      {isAddingComponent && (
        <div className="p-6 border-b bg-gray-50 0">
          <div className="max-w-2xl mx-auto">
            <h2 className="text-lg font-semibold mb-4">Add New Component</h2>
            <div className="grid grid-cols-2 gap-4">
              {renderComponentForm()}
            </div>
            <div className="flex justify-end gap-2 mt-4">
              <Button
                variant="outline"
                onClick={() => setIsAddingComponent(false)}
              >
                Cancel
              </Button>
              <Button onClick={addComponent}>Add Component</Button>
            </div>
          </div>
        </div>
      )}

      {/* Components List */}
      <ScrollArea className="flex-1">
        <div className="p-6">
          {filteredGroups.length === 0 ? (
            <div className="text-center py-12">
              <Box className="w-12 h-12 mx-auto text-gray-400 mb-4" />
              <p className="text-gray-500">No components found</p>
              {searchQuery && (
                <p className="text-sm text-gray-400 mt-2">
                  Try adjusting your search query
                </p>
              )}
            </div>
          ) : (
            <div className="space-y-4">
              {filteredGroups.map((group) => (
                <Collapsible
                  key={group.name}
                  open={expandedGroups.has(group.name)}
                  onOpenChange={() => toggleGroup(group.name)}
                >
                  <CollapsibleTrigger className="w-full">
                    <div className="flex items-center justify-between p-2 hover:bg-gray-50 dark:hover:bg-gray-800 rounded-lg">
                      <div className="flex items-center gap-2">
                        {expandedGroups.has(group.name) ? (
                          <ChevronDown className="w-4 h-4" />
                        ) : (
                          <ChevronRight className="w-4 h-4" />
                        )}
                        <h3 className="font-semibold">{group.name}</h3>
                        <Badge variant="secondary">
                          {group.components.length}
                        </Badge>
                      </div>
                    </div>
                  </CollapsibleTrigger>
                  <CollapsibleContent>
                    <div className="pl-6 space-y-4 mt-2">
                      {group.components.map(([name, component]) => (
                        <div
                          key={name}
                          className="bg-white 0 rounded-lg border p-4"
                        >
                          <div className="flex items-start justify-between">
                            <div className="flex-1">
                              <div className="flex items-center gap-3 mb-2">
                                <Badge variant="outline" className="font-mono">
                                  {name}
                                </Badge>
                              </div>
                              {renderComponentDisplay(component)}
                            </div>
                            <div className="flex items-center gap-2">
                              <Button
                                variant="ghost"
                                size="icon"
                                onClick={() => {
                                  navigator.clipboard.writeText(name);
                                }}
                              >
                                <Copy className="w-4 h-4" />
                              </Button>
                              <Button
                                variant="ghost"
                                size="icon"
                                onClick={() => {
                                  const [group, ...nameParts] = name.split("/");
                                  setNewComponent({
                                    name: nameParts.join("/"),
                                    component,
                                    group: group === "Root" ? undefined : group,
                                  });
                                  setIsAddingComponent(true);
                                }}
                              >
                                <Edit className="w-4 h-4" />
                              </Button>
                              <Button
                                variant="ghost"
                                size="icon"
                                onClick={() => removeComponent(name)}
                              >
                                <Trash className="w-4 h-4" />
                              </Button>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CollapsibleContent>
                </Collapsible>
              ))}
            </div>
          )}
        </div>
      </ScrollArea>
    </div>
  );
};

export default ComponentEditor;
