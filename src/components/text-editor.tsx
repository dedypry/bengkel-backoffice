import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Placeholder from "@tiptap/extension-placeholder";
import { Button, Card, CardBody, Tooltip } from "@heroui/react";
import {
  Bold,
  Italic,
  List,
  Quote,
  Heading2,
  Undo,
  Redo,
  Code,
  ListOrdered,
} from "lucide-react";

const MenuBar = ({ editor }: { editor: any }) => {
  if (!editor) return null;

  const buttons = [
    {
      icon: <Bold size={16} />,
      action: () => editor.chain().focus().toggleBold().run(),
      active: "bold",
      label: "TEBAL",
    },
    {
      icon: <Italic size={16} />,
      action: () => editor.chain().focus().toggleItalic().run(),
      active: "italic",
      label: "MIRING",
    },
    {
      icon: <Heading2 size={16} />,
      action: () => editor.chain().focus().toggleHeading({ level: 2 }).run(),
      active: "heading",
      label: "JUDUL",
    },
    {
      icon: <Quote size={16} />,
      action: () => editor.chain().focus().toggleBlockquote().run(),
      active: "blockquote",
      label: "KUTIPAN",
    },
    {
      icon: <List size={16} />,
      action: () => editor.chain().focus().toggleBulletList().run(),
      active: "bulletList",
      label: "LIST BULLET",
    },
    {
      icon: <ListOrdered size={16} />,
      action: () => editor.chain().focus().toggleOrderedList().run(),
      active: "orderedList",
      label: "LIST ANGKA",
    },
    {
      icon: <Code size={16} />,
      action: () => editor.chain().focus().toggleCodeBlock().run(),
      active: "codeBlock",
      label: "KODE",
    },
  ];

  return (
    <div className="flex flex-wrap items-center gap-1 p-2 border-b border-gray-200 bg-gray-50/50">
      {buttons.map((btn, index) => (
        <Tooltip
          key={index}
          classNames={{
            content: "text-[9px] font-black tracking-widest uppercase",
          }}
          content={btn.label}
          radius="sm"
        >
          <Button
            isIconOnly
            className={
              editor.isActive(btn.active)
                ? "bg-gray-900 text-white"
                : "text-gray-500"
            }
            radius="sm"
            size="sm"
            variant={editor.isActive(btn.active) ? "solid" : "light"}
            onPress={btn.action}
          >
            {btn.icon}
          </Button>
        </Tooltip>
      ))}

      <div className="ml-auto flex gap-1 border-l pl-2 border-gray-200">
        <Button
          isIconOnly
          radius="sm"
          size="sm"
          variant="light"
          onPress={() => editor.chain().focus().undo().run()}
        >
          <Undo size={16} />
        </Button>
        <Button
          isIconOnly
          radius="sm"
          size="sm"
          variant="light"
          onPress={() => editor.chain().focus().redo().run()}
        >
          <Redo size={16} />
        </Button>
      </div>
    </div>
  );
};

export default function BlogEditor({
  disabled,
  value,
  onChange,
}: {
  disabled?: boolean;
  value: string;
  onChange: (val: string) => void;
}) {
  const editor = useEditor({
    extensions: [
      StarterKit,
      Placeholder.configure({
        placeholder: "Tuliskan rincian atau rekomendasi teknis di sini...",
      }),
    ],
    content: value,
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML());
    },
  });

  if (disabled) {
    return (
      <Card>
        <CardBody>
          <div
            dangerouslySetInnerHTML={{ __html: value }}
            className="text-sm text-gray-500"
          />
        </CardBody>
      </Card>
    );
  }

  return (
    <div className="w-full border border-gray-200 rounded-sm overflow-hidden focus-within:border-gray-900 transition-colors bg-white">
      <MenuBar editor={editor} />
      <div className="p-4 min-h-[300px] max-h-[500px] overflow-y-auto">
        <style
          dangerouslySetInnerHTML={{
            __html: `
          .ProseMirror { outline: none; }
          .ProseMirror p { margin-bottom: 1rem; font-size: 13px; font-weight: 500; color: #374151; }
          .ProseMirror h2 { font-size: 1.25rem; font-weight: 900; text-transform: uppercase; margin-top: 1.5rem; margin-bottom: 0.75rem; letter-spacing: -0.025em; color: #111827; }
          .ProseMirror blockquote { border-left: 4px solid #111827; padding-left: 1rem; margin: 1.5rem 0; font-weight: 700; text-transform: uppercase; font-size: 12px; color: #4b5563; }
          .ProseMirror ul { list-style-type: disc; padding-left: 1.5rem; margin-bottom: 1rem; }
          .ProseMirror ol { list-style-type: decimal; padding-left: 1.5rem; margin-bottom: 1rem; }
          .ProseMirror code { background-color: #f3f4f6; padding: 0.2rem 0.4rem; border-radius: 2px; font-family: monospace; font-size: 0.875rem; color: #1f2937; }
          .ProseMirror p.is-editor-empty:first-child::before {
            content: attr(data-placeholder);
            float: left;
            color: #adb5bd;
            pointer-events: none;
            height: 0;
            font-size: 13px;
            font-weight: 600;
            text-transform: uppercase;
            letter-spacing: 0.05em;
          }
        `,
          }}
        />
        <EditorContent editor={editor} />
      </div>
    </div>
  );
}
