import { useState } from "react";
import { cn } from "@/lib/utils.js";
import { ImageIcon } from "lucide-react";

export function Image({ ...props }) {
  const [error, setError] = useState(false);

  if (!props.src || error) {
    return (
      <div
        className={cn(
          "flex justify-center items-center bg-neutral-200 dark:bg-neutral-800",
          props.className,
        )}
        style={{
          width: props.width,
          height: props.height,
          ...props.style,
        }}
      >
        <ImageIcon className="size-1/3 text-neutral-400 dark:text-neutral-600" />
      </div>
    );
  }

  return (
    <img
      loading="lazy"
      style={{
        objectFit: "cover",
        ...props.style,
      }}
      {...props}
      onError={() => setError(true)}
    />
  );
}
