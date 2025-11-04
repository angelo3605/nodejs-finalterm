import { ThemeToggle } from "@/components/refine-ui/theme/theme-toggle";
import { SidebarTrigger } from "./ui/sidebar";

export function SiteHeader({ appName, Logo }) {
  return (
    <header className="flex items-center w-full h-14 gap-4 px-4 sticky top-0 bg-background border-b z-50">
      <SidebarTrigger />

      <div className="group hidden sm:flex items-center gap-4">
        <Logo className="size-7 group-hover:animate-spin" /> <h3 className="font-brand text-[1.375rem]">{appName}</h3>
      </div>

      <ThemeToggle className="ml-auto" />
    </header>
  );
}
