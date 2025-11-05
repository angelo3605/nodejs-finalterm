import { useEffect, useState } from "react";
import { useDropzone } from "react-dropzone";
import { Button } from "./ui/button";
import { FormField, FormItem, FormLabel } from "./ui/form";
import { Trash, Upload } from "lucide-react";
import { Image } from "@/components/image.jsx";
import { cn } from "@/lib/utils.js";

const constructKey = (file) => file.name + file.lastModified;

export function FilePreviews({ files, onRemove, disabled }) {
  const [urlMap, setUrlMap] = useState(new Map());

  useEffect(() => {
    const newUrlMap = new Map(urlMap);

    files.forEach((file) => {
      const key = constructKey(file);
      if (file.type.startsWith("image/") && !newUrlMap.has(key)) {
        newUrlMap.set(key, URL.createObjectURL(file));
      }
    });

    for (const [key, url] of newUrlMap) {
      if (!files.find((file) => key === constructKey(file))) {
        URL.revokeObjectURL(url);
        newUrlMap.delete(key);
      }
    }

    setUrlMap(newUrlMap);
  }, [files]);

  return (
    <div className="space-y-2">
      {files.map((file) => {
        const key = constructKey(file);
        const url = urlMap.get(key);

        return (
          <div
            key={key}
            className={cn(
              "grid grid-cols-[auto_1fr_auto] items-center gap-4 border rounded-md overflow-hidden pr-1.5",
              disabled && "opacity-75",
            )}
          >
            {url ? (
              <Image
                src={url}
                alt={file.name}
                className="size-12 object-cover"
              />
            ) : (
              <div></div>
            )}
            <p className="text-sm truncate">{file.name}</p>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => onRemove(file)}
              disabled={disabled}
            >
              <Trash />
            </Button>
          </div>
        );
      })}
    </div>
  );
}

export function DropZone({
  control,
  name,
  label,
  maxSize,
  accepts,
  maxFiles,
  disabled,
}) {
  return (
    <FormField
      control={control}
      name={name}
      defaultValue={[]}
      render={({ field: { value, onChange } }) => {
        const onDrop = (acceptedFiles) => {
          const newFiles = [...(value || []), ...acceptedFiles].slice(
            0,
            maxFiles,
          );
          onChange(newFiles);
        };

        const onRemove = (removedFile) => {
          const updatedFiles =
            value?.filter((file) => file !== removedFile) || [];
          onChange(updatedFiles);
        };

        const { getRootProps, getInputProps } = useDropzone({
          onDrop,
          maxSize,
          accepts,
          maxFiles,
          disabled,
        });

        return (
          <FormItem>
            {label && <FormLabel>{label}</FormLabel>}
            <div
              {...getRootProps()}
              className={cn(
                "flex flex-col items-center gap-4 p-4 border-2 border-dashed rounded-md cursor-pointer",
                disabled && "opacity-50 cursor-not-allowed",
              )}
            >
              <input {...getInputProps()} />
              <Upload />
              <p className="text-center">
                Upload {maxFiles} files
                <br />
                <span className="text-sm">
                  Drag and drop or{" "}
                  <span className="underline">select files</span> to upload
                </span>
              </p>
            </div>
            <FilePreviews
              files={value || []}
              onRemove={onRemove}
              disabled={disabled}
            />
            {/* <FormMessage /> */}
          </FormItem>
        );
      }}
    />
  );
}
