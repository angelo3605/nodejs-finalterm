import { Outlet } from "react-router";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";

import { SiteHeader } from "@/components/site-header";
import { AppSidebar } from "@/components/app-sidebar";

import Logo from "@/assets/logo.svg?react";

export function RootLayout() {
  return (
    <SidebarProvider className="flex-col">
      <SiteHeader appName="Mint Boutique" logo={<Logo className="size-7" />} />
      <div className="justify-center flex flex-1">
        <AppSidebar />
        <SidebarInset className="@container max-w-6xl flex-1 p-8">
          <Outlet />
        </SidebarInset>
      </div>
    </SidebarProvider>
  );
}
