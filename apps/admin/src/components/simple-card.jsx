import { Pencil, Trash } from "lucide-react";
import { EditButton } from "@/components/refine-ui/buttons/edit";
import { DeleteButton } from "@/components/refine-ui/buttons/delete";

function strToOkLchHue(str) {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = str.charCodeAt(i) + ((hash << 5) - hash);
  }
  return Math.abs(hash) % 360;
}

export function SimpleCard({ resource, slug, name, imageUrl, FallbackIcon }) {
  return (
    <div className="flex flex-col overflow-hidden border rounded">
      {imageUrl ? (
        <img src={imageUrl} className="aspect-2/1 object-cover" />
      ) : (
        <div
          className="aspect-2/1 flex justify-center items-center"
          style={{
            background: `oklch(70% 0.3 ${strToOkLchHue(slug)}deg / 0.2)`,
          }}
        >
          <FallbackIcon
            className="size-12"
            style={{
              color: `color-mix(in oklch, oklch(50% 0.5 ${strToOkLchHue(slug)}deg / 0.5) 75%, var(--foreground) 25%)`,
            }}
          />
        </div>
      )}
      <div className="flex justify-between items-center gap-2 p-4">
        <span className="font-bold truncate">{name}</span>
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
