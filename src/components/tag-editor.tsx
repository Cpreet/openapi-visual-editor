import { useEffect, useState } from "react";
import { Copy, Edit, Trash, Plus, Search, Tag } from "lucide-react";
import { OpenAPIV3 } from "openapi-types";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useOpenApiStore } from "@/lib/store";

const TagEditor = () => {
  const { openApi } = useOpenApiStore();
  const [tags, setTags] = useState<OpenAPIV3.TagObject[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [isAddingTag, setIsAddingTag] = useState(false);
  const [newTag, setNewTag] = useState<OpenAPIV3.TagObject>({
    name: "",
    description: "",
  });

  useEffect(() => {
    if (openApi) {
      setTags(openApi.tags || []);
    }
  }, [openApi]);

  const addTag = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    setTags([...tags, newTag]);
    setNewTag({
      name: "",
      description: "",
    });
    setIsAddingTag(false);
  };

  const removeTag = (name: string) => {
    setTags(tags.filter((tag) => tag.name !== name));
  };

  const filteredTags = tags.filter(
    (tag) =>
      tag.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      tag.description?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (!openApi) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-center">
          <h2 className="text-2xl font-semibold mb-2">
            No OpenAPI Schema Found
          </h2>
          <p className="text-gray-500">
            Import an OpenAPI schema to start managing tags
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
          <h1 className="text-2xl font-bold">API Tags</h1>
          <Button onClick={() => setIsAddingTag(true)}>
            <Plus className="w-4 h-4 mr-2" />
            Add Tag
          </Button>
        </div>
        <div className="flex gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <Input
              placeholder="Search tags..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>
      </div>

      {/* Add Tag Form */}
      {isAddingTag && (
        <div className="p-6 border-b bg-gray-50 0">
          <div className="max-w-2xl mx-auto">
            <h2 className="text-lg font-semibold mb-4">Add New Tag</h2>
            <div className="grid grid-cols-2 gap-4">
              <div className="col-span-2">
                <Label>Name</Label>
                <Input
                  value={newTag.name}
                  onChange={(e) =>
                    setNewTag({ ...newTag, name: e.target.value })
                  }
                  placeholder="users"
                  className="mt-1"
                />
              </div>
              <div className="col-span-2">
                <Label>Description</Label>
                <Input
                  value={newTag.description}
                  onChange={(e) =>
                    setNewTag({ ...newTag, description: e.target.value })
                  }
                  placeholder="Operations about users"
                  className="mt-1"
                />
              </div>
            </div>
            <div className="flex justify-end gap-2 mt-4">
              <Button variant="outline" onClick={() => setIsAddingTag(false)}>
                Cancel
              </Button>
              <Button onClick={addTag}>Add Tag</Button>
            </div>
          </div>
        </div>
      )}

      {/* Tags List */}
      <ScrollArea className="flex-1">
        <div className="p-6">
          {filteredTags.length === 0 ? (
            <div className="text-center py-12">
              <Tag className="w-12 h-12 mx-auto text-gray-400 mb-4" />
              <p className="text-gray-500">No tags found</p>
              {searchQuery && (
                <p className="text-sm text-gray-400 mt-2">
                  Try adjusting your search query
                </p>
              )}
            </div>
          ) : (
            <div className="space-y-4">
              {filteredTags.map((tag) => (
                <div key={tag.name} className="bg-card 0 rounded-lg border p-4">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <Badge variant="outline" className="font-mono">
                          {tag.name}
                        </Badge>
                        {tag.description && (
                          <p className="text-sm text-gray-500">
                            {tag.description}
                          </p>
                        )}
                      </div>
                      {tag.externalDocs && (
                        <div className="mt-2">
                          <a
                            href={tag.externalDocs.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-sm text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 flex items-center gap-1"
                          >
                            <Copy className="w-3 h-3" />
                            {tag.externalDocs.description ||
                              "External Documentation"}
                          </a>
                        </div>
                      )}
                    </div>
                    <div className="flex items-center gap-2">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => {
                          navigator.clipboard.writeText(tag.name);
                        }}
                      >
                        <Copy className="w-4 h-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => {
                          setNewTag(tag);
                          setIsAddingTag(true);
                        }}
                      >
                        <Edit className="w-4 h-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => removeTag(tag.name)}
                      >
                        <Trash className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </ScrollArea>
    </div>
  );
};

export default TagEditor;
