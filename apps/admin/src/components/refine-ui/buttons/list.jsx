"use client";;
import React from "react";
import { useListButton } from "@refinedev/core";
import { Button } from "@/components/ui/button";
import { List } from "lucide-react";

export const ListButton = React.forwardRef(({ resource, accessControl, meta, children, onClick, ...rest }, ref) => {
  const { hidden, disabled, LinkComponent, to, label } = useListButton({
    resource,
    accessControl,
    meta,
  });

  const isDisabled = disabled || rest.disabled;
  const isHidden = hidden || rest.hidden;

  if (isHidden) return null;

  return (
    <Button {...rest} ref={ref} disabled={isDisabled} asChild>
      <LinkComponent
        to={to}
        replace={false}
        onClick={(e) => {
          if (isDisabled) {
            e.preventDefault();
            return;
          }
          if (onClick) {
            e.preventDefault();
            onClick(e);
          }
        }}>
        {children ?? (
          <div className="flex items-center gap-2 font-semibold">
            <List className="w-4 h-4" />
            <span>{label}</span>
          </div>
        )}
      </LinkComponent>
    </Button>
  );
});

ListButton.displayName = "ListButton";
