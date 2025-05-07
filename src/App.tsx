import { BrowserRouter as RouterProvider, Route, Routes } from "react-router"
import { ThemeProvider } from "@/components/theme-provider"
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar"
import AppSidebar from "./components/app-sidebar"
import Toolbar from "./components/toolbar"
import SchemaViewer from "./components/schema-viewer"
import { ServerEditor } from "./components/server-editor"

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
                <Route path="/servers" element={<ServerEditor />} />
              </Routes>
            </main>
          </SidebarInset>
        </SidebarProvider>
      </ThemeProvider>
    </RouterProvider>
  )
}

export default App
