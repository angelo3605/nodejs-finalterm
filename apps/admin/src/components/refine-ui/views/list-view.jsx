"use client";
import { useResourceParams, useUserFriendlyName } from "@refinedev/core";
import { Breadcrumb } from "@/components/refine-ui/layout/breadcrumb";
import { Separator } from "@/components/ui/separator";
import { CreateButton } from "@/components/refine-ui/buttons/create";
import { cn } from "@/lib/utils";

export function ListView({ children, className }) {
  return (
    <div className={cn("flex flex-col", "gap-4", className)}>{children}</div>
  );
}

export const ListViewHeader = ({
  canCreate,
  resource: resourceFromProps,
  title: titleFromProps,
  wrapperClassName,
  headerClassName,
}) => {
  const getUserFriendlyName = useUserFriendlyName();

  const { resource, identifier } = useResourceParams({
    resource: resourceFromProps,
  });
  const resourceName = identifier ?? resource?.name;

  const isCreateButtonVisible = canCreate ?? !!resource?.create;

  const title =
    titleFromProps ??
    getUserFriendlyName(
      resource?.meta?.label ?? identifier ?? resource?.name,
      "plural",
    );

  return (
    <div className={cn("flex flex-col", "gap-4", wrapperClassName)}>
      <div className="flex items-center relative gap-2">
        <div className="bg-background z-[2] pr-4">
          <Breadcrumb />
        </div>
        <Separator className={cn("absolute", "left-0", "right-0", "z-[1]")} />
      </div>
      <div className={cn("flex", "justify-between", "gap-4", headerClassName)}>
        <h2 className="text-2xl font-bold">{title}</h2>
        {isCreateButtonVisible && (
          <div className="flex items-center gap-2">
            <CreateButton resource={resourceName} />
          </div>
        )}
      </div>
    </div>
  );
};

ListView.displayName = "ListView";
