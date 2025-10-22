"use client";
import React from "react";
import { useEditButton } from "@refinedev/core";
import { Button } from "@/components/ui/button";
import { Pencil } from "lucide-react";

export const EditButton = React.forwardRef(
  (
    { resource, recordItemId, accessControl, meta, children, onClick, ...rest },
    ref,
  ) => {
    const { hidden, disabled, LinkComponent, to, label } = useEditButton({
      resource,
      id: recordItemId,
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
          }}
        >
          {children ?? (
            <div className="flex items-center gap-2 font-semibold">
              <Pencil className="h-4 w-4" />
              <span>{label}</span>
            </div>
          )}
        </LinkComponent>
      </Button>
    );
  },
);

EditButton.displayName = "EditButton";
