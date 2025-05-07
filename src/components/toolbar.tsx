import { Download } from "lucide-react";
import { useState } from "react";

import { SidebarTrigger } from "@/components/ui/sidebar";
import { Button } from "@/components/ui/button";

const Toolbar = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  console.log("modal button", isModalOpen)
  return (
    <div className="flex items-center justify-between w-full h-12 border-b p-2">
      <div className="flex items-center gap-2">
        <SidebarTrigger />
        <h2 className="text-lg font-bold">Dashboard</h2>
      </div>
      <div className="flex items-center gap-2">
        <Button variant="outline" onClick={() => setIsModalOpen(true)}>
          <Download className="size-4" />
          <span>Import/Export</span>
        </Button>
      </div>
    </div>
  )
}

export default Toolbar;
