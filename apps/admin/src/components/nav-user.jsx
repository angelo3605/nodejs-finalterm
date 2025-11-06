import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  ChevronsUpDown,
  CircleUserRound,
  DoorOpen,
  LogOut,
  Store,
} from "lucide-react";
import { useGetIdentity, useLogout } from "@refinedev/core";

export function NavUser() {
  const { data: user } = useGetIdentity();

  const { mutate: logout } = useLogout();

  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <SidebarMenuButton size="lg">
              <Avatar>
                <AvatarFallback>
                  {user?.fullName.replace(" ", "").slice(0, 2).toUpperCase()}
                </AvatarFallback>
              </Avatar>
              <div className="grid flex-1 text-left text-sm leading-tight">
                <span className="truncate font-medium">{user?.fullName}</span>
                <span className="truncate text-xs">{user?.email}</span>
              </div>
              <ChevronsUpDown className="ml-auto size-4" />
            </SidebarMenuButton>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            side="top"
            className="w-(--radix-popper-anchor-width)"
          >
            <DropdownMenuItem asChild>
              <a href={`${import.meta.env.VITE_STORE_URL}/profile`}>
                <CircleUserRound className="text-inherit" />
                <span>Account</span>
              </a>
            </DropdownMenuItem>
            <DropdownMenuItem asChild>
              <a href={import.meta.env.VITE_STORE_URL}>
                <Store className="text-inherit" />
                <span>Return to Store</span>
              </a>
            </DropdownMenuItem>
            <DropdownMenuItem onSelect={() => logout()}>
              <DoorOpen className="text-inherit" />
              <span>Log out</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </SidebarMenuItem>
    </SidebarMenu>
  );
}
