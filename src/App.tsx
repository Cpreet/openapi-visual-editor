import { BrowserRouter as RouterProvider, Route, Routes } from "react-router";
import { ThemeProvider } from "@/components/theme-provider";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import AppSidebar from "@/components/app-sidebar";
import Toolbar from "@/components/toolbar";
import SchemaViewer from "@/components/schema-viewer";
import { ServerEditor } from "@/components/server-editor";
import { InfoEditor } from "@/components/info-editor";
import PathEditor from "@/components/path-editor";
import ComponentEditor from "@/components/component-editor";
import TagEditor from "@/components/tag-editor";
import SecurityEditor from "@/components/security-editor";

function App() {
  return (
    <RouterProvider>
      <ThemeProvider>
        <SidebarProvider>
          <AppSidebar />
          <SidebarInset>
            <Toolbar />
            <main>
              <Routes>
                <Route path="/" element={<SchemaViewer />} />
                <Route path="/info" element={<InfoEditor />} />
                <Route path="/servers" element={<ServerEditor />} />
                <Route path="/paths" element={<PathEditor />} />
                <Route path="/components" element={<ComponentEditor />} />
                <Route path="/tags" element={<TagEditor />} />
                <Route path="/security" element={<SecurityEditor />} />
              </Routes>
            </main>
          </SidebarInset>
        </SidebarProvider>
      </ThemeProvider>
    </RouterProvider>
  );
}

export default App;
