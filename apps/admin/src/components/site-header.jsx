import { SidebarTrigger } from "./ui/sidebar";

export function SiteHeader({ appName, Logo }) {
  return (
    <header className="flex items-center w-full h-[3.5rem] gap-4 px-4 sticky top-0 bg-background border-b z-50">
      <SidebarTrigger />

      <div className="hidden sm:flex items-center gap-2">
        {/* <Logo className="size-7" /> */}
        <h3>{appName}</h3>
      </div>
    </header>
  );
}
