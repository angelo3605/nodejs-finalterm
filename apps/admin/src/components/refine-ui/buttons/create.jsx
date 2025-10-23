"use client";;
import React from "react";
import { useCreateButton } from "@refinedev/core";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";

export const CreateButton = React.forwardRef(({ resource, accessControl, meta, children, onClick, ...rest }, ref) => {
  const { hidden, disabled, LinkComponent, to, label } = useCreateButton({
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
            <Plus className="w-4 h-4" />
            <span>{label ?? "Create"}</span>
          </div>
        )}
      </LinkComponent>
    </Button>
  );
});

CreateButton.displayName = "CreateButton";
