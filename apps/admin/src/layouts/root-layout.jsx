import { Outlet } from "react-router";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";

import { SiteHeader } from "@/components/site-header";

export function RootLayout() {
  return (
    <SidebarProvider className="flex-col">
      <SiteHeader appName="Mint Boutique" />
      <div className="justify-center flex flex-1">
        <SidebarInset className="@container max-w-6xl flex-1 p-8">
          <Outlet />
        </SidebarInset>
      </div>
    </SidebarProvider>
  );
}
