import { useMemo } from "react";
import { Link } from "react-router";
import { useMenu } from "@refinedev/core";
import {
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
} from "./ui/sidebar";

export function NavMain() {
  const { menuItems, selectedKey } = useMenu();

  const sections = useMemo(
    () =>
      menuItems.reduce((acc, item) => {
        const section = item.meta?.section ?? "Other";

        if (!acc[section]) {
          acc[section] = [];
        }
        acc[section].push(item);

        return acc;
      }, {}),
    [menuItems],
  );

  return Object.entries(sections).map(([section, items]) => (
    <SidebarGroup key={section}>
      <SidebarGroupContent>
        {section !== "Other" && (
          <SidebarGroupLabel>{section}</SidebarGroupLabel>
        )}
        <SidebarMenu>
          {items.map((item) => (
            <SidebarMenuItem key={item.key}>
              <SidebarMenuButton
                asChild
                isActive={item.key === selectedKey}
                className={
                  item.key === selectedKey &&
                  "!bg-accent !text-accent-foreground"
                }
              >
                <Link to={item.route}>
                  {item.meta?.icon}
                  <span>{item.label}</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
          ))}
        </SidebarMenu>
      </SidebarGroupContent>
    </SidebarGroup>
  ));
}
