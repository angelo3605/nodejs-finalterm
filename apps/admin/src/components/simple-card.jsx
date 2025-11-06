import { Pencil, Trash } from "lucide-react";
import { EditButton } from "@/components/refine-ui/buttons/edit";
import { DeleteButton } from "@/components/refine-ui/buttons/delete";
import { Image } from "@/components/image.jsx";

export function SimpleCard({ resource, slug, name, imageUrl, FallbackIcon }) {
  return (
    <div className="flex flex-col overflow-hidden border rounded">
      <Image src={imageUrl} className="aspect-2/1 object-cover" />
      <div className="flex justify-between items-center gap-2 p-2 pl-4">
        <span className="truncate">{name}</span>
        <div className="flex gap-2">
          <EditButton
            size="icon"
            variant="outline"
            resource={resource}
            recordItemId={slug}
            meta={{ slug }}
          >
            <Pencil />
          </EditButton>
          <DeleteButton
            size="icon"
            variant="outline"
            resource={resource}
            recordItemId={slug}
            meta={{ slug }}
          >
            <Trash />
          </DeleteButton>
        </div>
      </div>
    </div>
  );
}
