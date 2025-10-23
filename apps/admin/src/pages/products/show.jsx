import { useShow } from "@refinedev/core";
import { LoadingOverlay } from "@/components/refine-ui/layout/loading-overlay";
import {
  ShowView,
  ShowViewHeader,
} from "@/components/refine-ui/views/show-view";
import { useParams } from "react-router";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { BadgeInfo } from "lucide-react";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";

export function ShowProduct() {
  const { slug } = useParams();

  const {
    query: { isLoading, data },
  } = useShow({
    resource: "products",
    id: slug,
  });
  const product = data?.data;

  return (
    <ShowView>
      <ShowViewHeader headerClassName="mint-show-header" />
      <LoadingOverlay loading={isLoading}>
        <div className="grid grid-cols-[40%_60%] gap-20">
          <Carousel opts={{ loop: true }}>
            <CarouselContent>
              {product?.imageUrls.map((url) => (
                <CarouselItem key={url} className="aspect-4/5">
                  <img
                    src={url}
                    className="size-full object-cover bg-muted rounded-xl"
                  />
                </CarouselItem>
              ))}
            </CarouselContent>
            <CarouselPrevious />
            <CarouselNext />
          </Carousel>
          <div className="space-y-4">
            <p className="text-muted-foreground">
              {product?.category.name} / {product?.brand.name}
            </p>
            <h2 className="font-bold text-3xl">{product?.name}</h2>
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-4">
                  <BadgeInfo /> Description
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className={cn(product?.desc || "text-muted-foreground")}>
                  {product?.desc ||
                    "This product is mysterious... no description yet"}
                </p>
              </CardContent>
            </Card>
            <div className="space-y-4">
              <span className="block font-bold">Variants</span>
              <div className="flex flex-wrap gap-2">
                {product?.variants.map((variant) => (
                  <Badge variant="outline" className="text-base">
                    {variant.name}
                  </Badge>
                ))}
              </div>
            </div>
          </div>
        </div>
      </LoadingOverlay>
    </ShowView>
  );
}
