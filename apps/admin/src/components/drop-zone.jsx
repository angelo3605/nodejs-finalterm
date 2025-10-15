import { useDropzone } from "react-dropzone";
import { FormField, FormItem, FormLabel, FormMessage } from "./ui/form";
import { useEffect, useState } from "react";
import { Button } from "./ui/button";
import { Trash } from "lucide-react";

const constructKey = (file) => file.name + file.lastModified;

export function FilePreviews({ files, onRemove }) {
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
          <div key={key} className="grid grid-cols-[auto_1fr_auto] items-center gap-4 border rounded-md overflow-hidden pr-[0.375rem]">
            {url ? <img src={url} alt={file.name} className="size-[3rem] object-cover" /> : <div></div>}
            <p className="text-sm truncate">{file.name}</p>
            <Button variant="ghost" size="icon" onClick={() => onRemove(file)}>
              <Trash />
            </Button>
          </div>
        );
      })}
    </div>
  );
}

export function DropZone({ control, name, label, maxSize, accepts, maxFiles }) {
  return (
    <FormField
      control={control}
      name={name}
      defaultValue={[]}
      render={({ field: { value, onChange } }) => {
        const onDrop = (acceptedFiles) => {
          const newFiles = [...(value || []), ...acceptedFiles].slice(0, maxFiles);
          onChange(newFiles);
        };

        const onRemove = (removedFile) => {
          const updatedFiles = value?.filter((file) => file !== removedFile) || [];
          onChange(updatedFiles);
        };

        const { getRootProps, getInputProps } = useDropzone({ onDrop, maxSize, accepts, maxFiles });

        return (
          <FormItem>
            {label && <FormLabel>{label}</FormLabel>}
            <div {...getRootProps()} className="h-[5rem] border-2 border-dashed rounded-md">
              <input {...getInputProps()} />
            </div>
            <FilePreviews files={value || []} onRemove={onRemove} />
            {/* <FormMessage /> */}
          </FormItem>
        );
      }}
    />
  );
}
