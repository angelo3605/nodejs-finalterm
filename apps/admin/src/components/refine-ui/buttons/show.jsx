"use client";
import React from "react";
import { useShowButton } from "@refinedev/core";
import { Eye } from "lucide-react";
import { Button } from "@/components/ui/button";

export const ShowButton = React.forwardRef(
  (
    { resource, recordItemId, accessControl, meta, children, onClick, ...rest },
    ref,
  ) => {
    const { hidden, disabled, LinkComponent, to, label } = useShowButton({
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
              <Eye className="h-4 w-4" />
              <span>{label}</span>
            </div>
          )}
        </LinkComponent>
      </Button>
    );
  },
);

ShowButton.displayName = "ShowButton";
