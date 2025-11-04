import { useEditor, EditorContent, useEditorState } from "@tiptap/react";
import { BubbleMenu } from "@tiptap/react/menus";
import StarterKit from "@tiptap/starter-kit";
import { Markdown } from "@tiptap/markdown";
import { Bold, Italic, Pilcrow, Heading1, Heading2 } from "lucide-react";
import { Button } from "./ui/button";
import { Separator } from "./ui/separator";
import { ScrollArea } from "./ui/scroll-area";
import {
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  FormControl,
} from "./ui/form";
import { useEffect } from "react";
import { Placeholder } from "@tiptap/extensions";

const menuItems = [
  {
    type: "button",
    action: "toggleHeading",
    isActive: "heading",
    attrs: { level: 1 },
    icon: <Heading1 />,
  },
  {
    type: "button",
    action: "toggleHeading",
    isActive: "heading",
    attrs: { level: 2 },
    icon: <Heading2 />,
  },
  {
    type: "button",
    action: "setParagraph",
    isActive: "paragraph",
    icon: <Pilcrow />,
  },
  {
    type: "separator",
  },
  {
    type: "button",
    action: "toggleBold",
    isActive: "bold",
    icon: <Bold />,
  },
  {
    type: "button",
    action: "toggleItalic",
    isActive: "italic",
    icon: <Italic />,
  },
];

function getStateKey(state, isActive, attrs) {
  return `${state}_${isActive}${isActive === "heading" ? attrs.level : ""}`;
}

function MenuBar({ editor }) {
  const editorState = useEditorState({
    editor,
    selector: (ctx) =>
      menuItems.reduce((state, item) => {
        if (item.isActive) {
          state[getStateKey("is", item.isActive, item.attrs)] =
            ctx.editor.isActive(item.isActive, item.attrs ?? {});
        }
        if (item.can) {
          state[getStateKey("can", item.isActive, item.attrs)] = ctx.editor
            .can()
            .chain()
            [item.can](item.attrs ?? {})
            .run();
        }
        return state;
      }, {}),
  });

  return menuItems.map((item, i) => {
    if (item.type === "separator") {
      return <Separator key={i} orientation="vertical" className="h-8! mx-1" />;
    }

    return (
      <Button
        key={i}
        type="button"
        variant="ghost"
        onClick={() =>
          editor
            .chain()
            .focus()
            [item.action](item.attrs ?? {})
            .run()
        }
        disabled={
          item.can
            ? !state[getStateKey("can", item.isActive, item.attrs)]
            : false
        }
        className={
          item.isActive &&
          editorState[getStateKey("is", item.isActive, item.attrs)] &&
          "text-secondary-foreground bg-secondary"
        }
      >
        {item.icon} {item.label}
      </Button>
    );
  });
}

export function TiptapEditor({
  control,
  name,
  label,
  height,
  className,
  disabled,
  placeholder,
}) {
  return (
    <FormField
      control={control}
      name={name}
      render={({ field }) => {
        const editor = useEditor({
          extensions: [
            StarterKit,
            Markdown,
            Placeholder.configure({ placeholder }),
          ],
          content: "",
          contentType: "markdown",
          onUpdate: ({ editor }) => field.onChange(editor.getMarkdown()),
        });

        useEffect(() => {
          if (
            editor.getMarkdown() === "" &&
            field.value !== editor.getMarkdown()
          ) {
            editor.commands.setContent(field.value || "", {
              contentType: "markdown",
            });
          }
        }, [field.value, editor]);

        useEffect(() => {
          editor.setEditable(!disabled);
        }, [disabled]);

        return (
          <FormItem className={className}>
            {label && <FormLabel>{label}</FormLabel>}
            <FormControl>
              <div>
                <BubbleMenu
                  editor={editor}
                  className="flex flex-wrap items-center gap-1 p-1 bg-background border rounded shadow"
                >
                  <MenuBar editor={editor} />
                </BubbleMenu>
                <ScrollArea className="w-full dark:bg-input/30 border rounded-md shadow-xs focus-within:ring-3 focus-within:border-primary ring-primary/40 transition">
                  <EditorContent
                    editor={editor}
                    className="prose-sm whitespace-pre-wrap wrap-break-word m-4 flex-1 after:content-[''] after:block after:h-5"
                    style={{ height: height ?? 300 }}
                  />
                </ScrollArea>
              </div>
            </FormControl>
          </FormItem>
        );
      }}
    />
  );
}
