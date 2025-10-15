import { useForm } from "react-hook-form";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "./ui/dialog";
import { Button } from "./ui/button";
import { DropZone } from "./drop-zone";
import { Image } from "lucide-react";

export function ImageManager() {
  const form = useForm({
    defaultValues: { images: [] },
  });

  const files = form.watch("images");

  const onSubmit = ({ images }) => console.log(images);

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline">
          <Image /> Select image(s)
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-4xl">
        <DialogHeader>
          <DialogTitle>Image Manager</DialogTitle>
        </DialogHeader>
        <div className="grid grid-cols-3">
          <div>
            <DropZone control={form.control} name="images" maxFiles={5} maxSize={5_000_000} accepts={{ "images/*": [] }} />
            <Button onClick={form.handleSubmit(onSubmit)}>Submit</Button>
          </div>
          <div className="col-span-2"></div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
