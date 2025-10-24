import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ChevronsUpDown, Store, LogOut, CircleUserRound } from "lucide-react";
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
              <Avatar className="h-8 w-8 rounded-lg">
                <AvatarImage src="" alt={user?.fullName} />
                <AvatarFallback className="rounded-lg">
                  {user?.fullName.slice(0, 2).toUpperCase()}
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
            <DropdownMenuItem>
              <CircleUserRound className="text-inherit" />
              <span>Account</span>
            </DropdownMenuItem>
            <DropdownMenuItem>
              <Store className="text-inherit" />
              <span>Return to Store</span>
            </DropdownMenuItem>
            <DropdownMenuItem onSelect={() => logout()}>
              <LogOut className="text-inherit" />
              <span>Log out</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </SidebarMenuItem>
    </SidebarMenu>
  );
}
