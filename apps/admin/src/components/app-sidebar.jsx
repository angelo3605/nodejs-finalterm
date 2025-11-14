import { Sidebar, SidebarContent, SidebarFooter } from "./ui/sidebar";
import { NavMain } from "./nav-main";
import { NavUser } from "./nav-user";

export function AppSidebar() {
  return (
    <Sidebar>
      <SidebarContent className="pt-14">
        <NavMain />
      </SidebarContent>
      <SidebarFooter>
        <NavUser />
      </SidebarFooter>
    </Sidebar>
  );
}
