import { Link } from "react-router";
import { File, Moon, Sun, EllipsisVertical } from "lucide-react";
import { DynamicIcon } from "lucide-react/dynamic";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupAction,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { Badge } from "@/components/ui/badge";
import { getObjectOrArrayLength } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { useTheme } from "@/components/theme-provider"
import config from "./config.json";
import { useOpenApiStore } from "@/lib/store";

const AppSidebar = () => {
  const { openApi } = useOpenApiStore();
  const { theme, setTheme } = useTheme();

  return (
    <Sidebar collapsible="icon" variant="inset">
      <SidebarHeader>
        <div className="flex items-center gap-2">
          <File className="size-6" />
          <span className="text-lg font-bold">OpenAPI Editor</span>
        </div>
      </SidebarHeader>

      <SidebarContent className="gap-0">
        {config.groups.map((group) => (
          <Collapsible defaultOpen key={group.id}>
            <SidebarGroup key={group.id}>
              <div className="flex items-center gap-2 w-full">
                <SidebarGroupLabel
                  asChild
                  className="flex-1 hover:cursor-pointer hover:bg-muted transition-colors"
                >
                  <CollapsibleTrigger>{group.label}</CollapsibleTrigger>
                </SidebarGroupLabel>
                <Link to={`/`}>
                  <SidebarGroupAction>
                    <EllipsisVertical className="size-4" />
                  </SidebarGroupAction>
                </Link>
              </div>
              <CollapsibleContent>
                <SidebarGroupContent>
                  <SidebarMenu>
                    {group.items.map((item) => (
                      <SidebarMenuItem key={item.id}>
                        <Link to={item.path}>
                          <SidebarMenuButton className="transition-colors">
                            <span className="flex items-center gap-2">
                              <DynamicIcon name={item.icon as any} size={16} />
                              <span>{item.label}</span>
                            </span>
                            {item.id === "security" && !openApi?.security && (
                              <>
                                <span className="flex items-center gap-2">
                                  <Badge variant={"secondary"}>
                                    {getObjectOrArrayLength(
                                      openApi?.components?.securitySchemes
                                    )}
                                  </Badge>
                                </span>
                              </>
                            )}
                            {item.isDynamic && openApi && (
                              <>
                                <span className="flex items-center gap-2">
                                  {getObjectOrArrayLength(
                                    openApi[item.id as keyof typeof openApi]
                                  ) > 0 ? (
                                    <Badge variant={"secondary"}>
                                      {getObjectOrArrayLength(
                                        openApi[item.id as keyof typeof openApi]
                                      )}
                                    </Badge>
                                  ) : null}
                                </span>
                              </>
                            )}
                          </SidebarMenuButton>
                        </Link>
                      </SidebarMenuItem>
                    ))}
                  </SidebarMenu>
                </SidebarGroupContent>
              </CollapsibleContent>
            </SidebarGroup>
          </Collapsible>
        ))}
      </SidebarContent>

      <SidebarFooter>
        <div className="flex items-center justify-between px-4 py-2">
          <div className="text-sm text-muted-foreground">
            Version: {openApi?.info?.version || "1.0.0"}
          </div>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
            className="size-8"
          >
            {theme === "light" ? (
              <Moon className="size-4" />
            ) : (
              <Sun className="size-4" />
            )}
            <span className="sr-only">Toggle theme</span>
          </Button>
        </div>
      </SidebarFooter>
    </Sidebar>
  );
};

export default AppSidebar;
