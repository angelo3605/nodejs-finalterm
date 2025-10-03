import { Sidebar, SidebarContent, SidebarFooter } from "./ui/sidebar";
import { NavMain } from "./nav-main";

export function AppSidebar() {
  return (
    <Sidebar>
      <SidebarContent className="pt-[3.5rem]">
        <NavMain />
      </SidebarContent>
      <SidebarFooter></SidebarFooter>
    </Sidebar>
  );
}
