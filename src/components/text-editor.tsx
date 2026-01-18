import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Placeholder from '@tiptap/extension-placeholder';
import { Box, IconButton, Tooltip, Sheet } from "@mui/joy";
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
      icon: <Bold size={18} />,
      action: () => editor.chain().focus().toggleBold().run(),
      active: "bold",
      label: "Tebal",
    },
    {
      icon: <Italic size={18} />,
      action: () => editor.chain().focus().toggleItalic().run(),
      active: "italic",
      label: "Miring",
    },
    {
      icon: <Heading2 size={18} />,
      action: () => editor.chain().focus().toggleHeading({ level: 2 }).run(),
      active: "heading",
      label: "Judul",
    },
    {
      icon: <Quote size={18} />,
      action: () => editor.chain().focus().toggleBlockquote().run(),
      active: "blockquote",
      label: "Kutipan",
    },
    {
      icon: <List size={18} />,
      action: () => editor.chain().focus().toggleBulletList().run(),
      active: "bulletList",
      label: "List",
    },
    {
      icon: <ListOrdered size={18} />,
      action: () => editor.chain().focus().toggleOrderedList().run(),
      active: "orderedList",
      label: "List Angka",
    },
    {
      icon: <Code size={18} />,
      action: () => editor.chain().focus().toggleCodeBlock().run(),
      active: "codeBlock",
      label: "Kode",
    },
  ];

  return (
    <Box
      sx={{
        display: "flex",
        gap: 0.5,
        p: 1,
        borderBottom: "1px solid",
        borderColor: "divider",
        flexWrap: "wrap",
        bgcolor: "background.level1",
      }}
    >
      {buttons.map((btn, index) => (
        <Tooltip key={index} title={btn.label} variant="soft">
          <IconButton
            color={editor.isActive(btn.active) ? "primary" : "neutral"}
            size="sm"
            variant={editor.isActive(btn.active) ? "solid" : "plain"}
            onClick={btn.action}
          >
            {btn.icon}
          </IconButton>
        </Tooltip>
      ))}

      <Box sx={{ ml: "auto", display: "flex", gap: 0.5 }}>
        <IconButton
          size="sm"
          onClick={() => editor.chain().focus().undo().run()}
        >
          <Undo size={18} />
        </IconButton>
        <IconButton
          size="sm"
          onClick={() => editor.chain().focus().redo().run()}
        >
          <Redo size={18} />
        </IconButton>
      </Box>
    </Box>
  );
};

export default function BlogEditor({
  value,
  onChange,
}: {
  value: string;
  onChange: (val: string) => void;
}) {
  const editor = useEditor({
    extensions: [
      StarterKit,
      Placeholder.configure({
        placeholder: "Tuliskan isi konten Anda di sini...",
      }),
    ],
    content: value,
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML());
    },
  });

  return (
    <Sheet
      sx={{
        borderRadius: "md",
        overflow: "hidden",
        "&:focus-within": {
          ring: "2px solid",
          borderColor: "primary.500",
        },
      }}
      variant="outlined"
    >
      <MenuBar editor={editor} />
      <Box
        sx={{
          p: 2,
          minHeight: "400px",
          maxHeight: "600px",
          overflowY: "auto",
          "& .ProseMirror": {
            outline: "none",
            fontSize: "1rem",
            lineHeight: 1.6,
            fontFamily: "body",
          },
          "& .ProseMirror h2": {
            fontSize: "1.75rem",
            fontWeight: "bold",
            mt: 2,
            mb: 1,
          },
          "& .ProseMirror blockquote": {
            borderLeft: "4px solid",
            borderColor: "primary.300",
            pl: 2,
            fontStyle: "italic",
            my: 2,
            color: "neutral.600",
          },
          "& .ProseMirror ul, & .ProseMirror ol": { pl: 3 },
          "& .ProseMirror code": {
            bgcolor: "neutral.softBg",
            p: "2px 4px",
            borderRadius: "4px",
            fontFamily: "code",
          },
        }}
      >
        <EditorContent editor={editor} />
      </Box>
    </Sheet>
  );
}
