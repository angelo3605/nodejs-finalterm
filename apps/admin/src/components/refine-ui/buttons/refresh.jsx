"use client";;
import React from "react";
import { useRefreshButton } from "@refinedev/core";
import { RefreshCcw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export const RefreshButton = React.forwardRef((
  { resource, recordItemId, dataProviderName, meta, children, ...rest },
  ref,
) => {
  const {
    onClick: refresh,
    loading,
    label,
  } = useRefreshButton({
    resource,
    id: recordItemId,
    dataProviderName,
    meta,
  });

  const isDisabled = rest.disabled || loading;

  return (
    <Button
      onClick={(e) => {
        if (isDisabled) {
          e.preventDefault();
          return;
        }
        refresh();
      }}
      {...rest}
      ref={ref}
      disabled={isDisabled}>
      {children ?? (
        <div className="flex items-center gap-2">
          <RefreshCcw
            className={cn("h-4 w-4", {
              "animate-spin": loading,
            })} />
          <span>{label ?? "Refresh"}</span>
        </div>
      )}
    </Button>
  );
});

RefreshButton.displayName = "RefreshButton";
