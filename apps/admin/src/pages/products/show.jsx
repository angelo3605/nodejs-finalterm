import { useShow } from "@refinedev/core";
import { LoadingOverlay } from "@/components/refine-ui/layout/loading-overlay";
import {
  ShowView,
  ShowViewHeader,
} from "@/components/refine-ui/views/show-view";
import { Hash } from "lucide-react";
import { useParams } from "react-router";

export function ShowProduct() {
  const { slug } = useParams();

  const {
    query: { data, isLoading },
  } = useShow({
    resource: "products",
    id: slug,
  });

  return (
    <ShowView>
      <ShowViewHeader headerClassName="mint-show-header" />
      <LoadingOverlay loading={isLoading}>
        <div className="flex items-center gap-4 p-4 bg-gradient-to-tl from-muted to-transparent border rounded-md">
          <h3 className="font-bold text-xl">{data?.data.name}</h3>
          <span className="flex items-center gap-2 opacity-75">
            <Hash className="size-4" />
            ID: {data?.data.id}
          </span>
        </div>
      </LoadingOverlay>
    </ShowView>
  );
}
