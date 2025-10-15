"use client";

import { Toaster as Sonner } from "sonner";
import { useTheme } from "@/components/refine-ui/theme/theme-provider";

export function Toaster({
  ...props
}) {
  const { theme = "system" } = useTheme();

  return (
    <Sonner
      theme={theme}
      className="toaster group"
      style={
        {
          "--normal-bg": "var(--popover)",
          "--normal-text": "var(--popover-foreground)",
          "--normal-border": "var(--border)"
        }
      }
      {...props} />
  );
}
