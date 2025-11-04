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
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Separator } from "@/components/ui/separator";
import { marked } from "marked";
import DOMPurify from "dompurify";
import { useMemo } from "react";
import { longCurrencyFormatter } from "@mint-boutique/formatters";
import { Image } from "@/components/image.jsx";

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
        <div className="space-y-12">
          <div className="grid grid-cols-[2fr_3fr] gap-8">
            <Carousel opts={{ loop: true }} className="mx-12">
              <CarouselContent>
                {product?.imageUrls.map((url) => (
                  <CarouselItem key={url} className="aspect-4/5">
                    <Image
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
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Variant</TableHead>
                    <TableHead>Price</TableHead>
                    <TableHead>Stock</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {product?.variants.map((variant) => (
                    <TableRow key={variant.id}>
                      <TableCell>{variant.name}</TableCell>
                      <TableCell>
                        {longCurrencyFormatter.format(variant.price)}
                      </TableCell>
                      <TableCell>{variant.stockQuantity}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </div>
          <div className="space-y-8">
            <div className="flex items-center gap-4">
              <span className="font-bold">Description</span>
              <Separator className="flex-1" />
            </div>
            <p
              className="prose max-w-none dark:prose-invert"
              dangerouslySetInnerHTML={{
                __html: DOMPurify.sanitize(marked.parse(product?.desc ?? "")),
              }}
            ></p>
          </div>
        </div>
      </LoadingOverlay>
    </ShowView>
  );
}
