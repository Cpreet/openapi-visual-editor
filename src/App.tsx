import { BrowserRouter as RouterProvider, Route, Routes } from "react-router"
import { ThemeProvider } from "@/components/theme-provider"
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar"
import AppSidebar from "./components/app-sidebar"

function App() {

  return (
    <RouterProvider>
      <ThemeProvider>
        <SidebarProvider>
          <AppSidebar />
          <SidebarInset>
            <main>
              <Routes>
                <Route path="/" element={<></>} />
              </Routes>
            </main>
          </SidebarInset>
        </SidebarProvider>
      </ThemeProvider>
    </RouterProvider>
  )
}

export default App
