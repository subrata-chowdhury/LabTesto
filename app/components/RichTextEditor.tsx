// app/components/RichTextEditor.tsx
import { Color } from "@tiptap/extension-color";
import ListItem from "@tiptap/extension-list-item";
import { TextStyle } from "@tiptap/extension-text-style";
import { EditorContent, Editor, useEditor } from "@tiptap/react";
import Underline from "@tiptap/extension-underline";
import StarterKit from "@tiptap/starter-kit";
import React, { useEffect } from "react";
import { Table } from "@tiptap/extension-table";
import TableCell from "@tiptap/extension-table-cell";
import TableHeader from "@tiptap/extension-table-header";
import TableRow from "@tiptap/extension-table-row";
import TextAlign from "@tiptap/extension-text-align";
import Link from "@tiptap/extension-link";
import Image from "next/image";
import {
  FiUnderline,
  FiLink,
  FiCornerUpLeft,
  FiCornerUpRight,
  FiTrash2,
  FiMinus,
  FiDroplet,
} from "react-icons/fi";
import "@/styles/tiptap.css";

//icons
import italicIcon from "@/assets/TextEditor/italic.svg";
import paragraphIcon from "@/assets/TextEditor/paragraph.svg";
import rowDeleteIcon from "@/assets/TextEditor/row-delete.svg";
import splitCellsHorizontalIcon from "@/assets/TextEditor/split-cells-horizontal.svg";
import strikethroughIcon from "@/assets/TextEditor/strikethrough.svg";
import tableAddColumnLeftIcon from "@/assets/TextEditor/table-add-column-left.svg";
import tableAddColumnRightIcon from "@/assets/TextEditor/table-add-column-right.svg";
import tableAddRowAboveIcon from "@/assets/TextEditor/table-add-row-above.svg";
import tableAddRowBelowIcon from "@/assets/TextEditor/table-add-row-below.svg";
import tableCellMergeIcon from "@/assets/TextEditor/table-cell-merge.svg";
import tableDeleteIcon from "@/assets/TextEditor/table-delete.svg";
import alignCenterIcon from "@/assets/TextEditor/align-center.svg";
import alignLeftIcon from "@/assets/TextEditor/align-left.svg";
import alignRightIcon from "@/assets/TextEditor/align-right.svg";
import boldIcon from "@/assets/TextEditor/bold.svg";
import bulletListIcon from "@/assets/TextEditor/bullet-list.svg";
import bulletListRomanIcon from "@/assets/TextEditor/bullet-list-roman.svg";
import codeIcon from "@/assets/TextEditor/code.svg";
import columnDeleteIcon from "@/assets/TextEditor/column-delete.svg";
import insertTableIcon from "@/assets/TextEditor/insert-table.svg";

const MenuButton = ({
  onClick,
  disabled = false,
  isActive = false,
  title,
  children,
}: {
  onClick: () => void;
  disabled?: boolean;
  isActive?: boolean;
  title: string;
  children: React.ReactNode;
}) => (
  <button
    type="button"
    onClick={onClick}
    disabled={disabled}
    title={title}
    className={`p-1.5 rounded-lg flex items-center justify-center transition-all duration-200 min-w-[32px] h-[32px]
      ${
        isActive
          ? "bg-orange-100 text-orange-600 dark:bg-orange-500/20 dark:text-orange-400"
          : "text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-white/10"
      }
      ${disabled ? "opacity-40 cursor-not-allowed" : "cursor-pointer"}
    `}
  >
    {children}
  </button>
);

const Divider = () => (
  <div className="w-px h-6 bg-gray-300 dark:bg-white/10 mx-1 flex-shrink-0" />
);

const MenuBar = ({ editor }: { editor: Editor | null }) => {
  if (!editor) {
    return null;
  }

  const setLink = () => {
    const previousUrl = editor.getAttributes("link").href;
    const url = window.prompt("Enter the URL", previousUrl);
    if (url === null) return; // cancelled
    if (url === "") {
      editor.chain().focus().extendMarkRange("link").unsetLink().run();
      return;
    }
    editor.chain().focus().extendMarkRange("link").setLink({ href: url }).run();
  };

  return (
    <div className="flex flex-wrap items-center gap-y-2 gap-x-1 p-2 bg-gray-50 dark:bg-[#1a1a1a] border-b border-gray-200 dark:border-white/10 rounded-t-xl">
      {/* History Group */}
      <div className="flex items-center gap-1">
        <MenuButton
          onClick={() => editor.chain().focus().undo().run()}
          disabled={!editor.can().chain().focus().undo().run()}
          title="Undo"
        >
          <FiCornerUpLeft size={16} />
        </MenuButton>
        <MenuButton
          onClick={() => editor.chain().focus().redo().run()}
          disabled={!editor.can().chain().focus().redo().run()}
          title="Redo"
        >
          <FiCornerUpRight size={16} />
        </MenuButton>
      </div>

      <Divider />

      {/* Typography Group */}
      <div className="flex items-center gap-1">
        <MenuButton
          onClick={() => editor.chain().focus().setParagraph().run()}
          isActive={editor.isActive("paragraph")}
          title="Paragraph"
        >
          <Image
            width={16}
            height={16}
            src={paragraphIcon}
            alt="P"
            className="dark:invert"
          />
        </MenuButton>
        {[1, 2, 3, 4, 5, 6].map((level) => (
          <MenuButton
            key={level}
            onClick={() =>
              editor
                .chain()
                .focus()
                .toggleHeading({ level: level as any })
                .run()
            }
            isActive={editor.isActive("heading", { level })}
            title={`Heading ${level}`}
          >
            <span className="font-bold text-xs">H{level}</span>
          </MenuButton>
        ))}
      </div>

      <Divider />

      {/* Formatting Group */}
      <div className="flex items-center gap-1">
        <MenuButton
          onClick={() => editor.chain().focus().toggleBold().run()}
          disabled={!editor.can().chain().focus().toggleBold().run()}
          isActive={editor.isActive("bold")}
          title="Bold"
        >
          <Image
            width={16}
            height={16}
            src={boldIcon}
            alt="B"
            className="dark:invert"
          />
        </MenuButton>
        <MenuButton
          onClick={() => editor.chain().focus().toggleItalic().run()}
          disabled={!editor.can().chain().focus().toggleItalic().run()}
          isActive={editor.isActive("italic")}
          title="Italic"
        >
          <Image
            width={16}
            height={16}
            src={italicIcon}
            alt="I"
            className="dark:invert"
          />
        </MenuButton>
        <MenuButton
          onClick={() => editor.chain().focus().toggleUnderline().run()}
          disabled={!editor.can().chain().focus().toggleUnderline().run()}
          isActive={editor.isActive("underline")}
          title="Underline"
        >
          <FiUnderline size={16} />
        </MenuButton>
        <MenuButton
          onClick={() => editor.chain().focus().toggleStrike().run()}
          disabled={!editor.can().chain().focus().toggleStrike().run()}
          isActive={editor.isActive("strike")}
          title="Strikethrough"
        >
          <Image
            width={16}
            height={16}
            src={strikethroughIcon}
            alt="S"
            className="dark:invert"
          />
        </MenuButton>
        <MenuButton
          onClick={() => editor.chain().focus().toggleCode().run()}
          disabled={!editor.can().chain().focus().toggleCode().run()}
          isActive={editor.isActive("code")}
          title="Code"
        >
          <Image
            width={16}
            height={16}
            src={codeIcon}
            alt="Code"
            className="dark:invert"
          />
        </MenuButton>
        <MenuButton
          onClick={() => editor.chain().focus().unsetAllMarks().run()}
          title="Clear marks"
        >
          <FiTrash2 size={16} />
        </MenuButton>
      </div>

      <Divider />

      {/* Alignment Group */}
      <div className="flex items-center gap-1">
        <MenuButton
          onClick={() => editor.chain().focus().setTextAlign("left").run()}
          isActive={editor.isActive({ textAlign: "left" })}
          title="Align Left"
        >
          <Image
            width={16}
            height={16}
            src={alignLeftIcon}
            alt="L"
            className="dark:invert"
          />
        </MenuButton>
        <MenuButton
          onClick={() => editor.chain().focus().setTextAlign("center").run()}
          isActive={editor.isActive({ textAlign: "center" })}
          title="Align Center"
        >
          <Image
            width={16}
            height={16}
            src={alignCenterIcon}
            alt="C"
            className="dark:invert"
          />
        </MenuButton>
        <MenuButton
          onClick={() => editor.chain().focus().setTextAlign("right").run()}
          isActive={editor.isActive({ textAlign: "right" })}
          title="Align Right"
        >
          <Image
            width={16}
            height={16}
            src={alignRightIcon}
            alt="R"
            className="dark:invert"
          />
        </MenuButton>
        <MenuButton
          onClick={() => editor.chain().focus().setTextAlign("justify").run()}
          isActive={editor.isActive({ textAlign: "justify" })}
          title="Justify"
        >
          <span className="font-bold text-xs tracking-widest">|||</span>
        </MenuButton>
      </div>

      <Divider />

      {/* Lists & Objects Group */}
      <div className="flex items-center gap-1">
        <MenuButton
          onClick={() => editor.chain().focus().toggleBulletList().run()}
          isActive={editor.isActive("bulletList")}
          title="Bullet List"
        >
          <Image
            width={16}
            height={16}
            src={bulletListIcon}
            alt="UL"
            className="dark:invert"
          />
        </MenuButton>
        <MenuButton
          onClick={() => editor.chain().focus().toggleOrderedList().run()}
          isActive={editor.isActive("orderedList")}
          title="Ordered List"
        >
          <Image
            width={16}
            height={16}
            src={bulletListRomanIcon}
            alt="OL"
            className="dark:invert"
          />
        </MenuButton>
        <MenuButton
          onClick={() => editor.chain().focus().toggleBlockquote().run()}
          isActive={editor.isActive("blockquote")}
          title="Blockquote"
        >
          <span className="font-serif font-bold text-lg">"</span>
        </MenuButton>
        <MenuButton
          onClick={setLink}
          isActive={editor.isActive("link")}
          title="Hyperlink"
        >
          <FiLink size={16} />
        </MenuButton>
        <MenuButton
          onClick={() => editor.chain().focus().setHorizontalRule().run()}
          title="Horizontal Rule"
        >
          <FiMinus size={16} />
        </MenuButton>
        <MenuButton
          onClick={() => editor.chain().focus().setColor("#f97316").run()}
          isActive={editor.isActive("textStyle", { color: "#f97316" })}
          title="Highlight Orange"
        >
          <FiDroplet size={16} className="text-orange-500" />
        </MenuButton>
      </div>

      <Divider />

      {/* Table Group */}
      <div className="flex items-center gap-1">
        <MenuButton
          onClick={() =>
            editor
              .chain()
              .focus()
              .insertTable({ rows: 3, cols: 3, withHeaderRow: true })
              .run()
          }
          title="Insert Table"
        >
          <Image
            width={16}
            height={16}
            src={insertTableIcon}
            alt="Table"
            className="dark:invert"
          />
        </MenuButton>
        {editor.isActive("table") && (
          <>
            <MenuButton
              onClick={() => editor.chain().focus().addColumnBefore().run()}
              disabled={!editor.can().addColumnBefore()}
              title="Add Column Before"
            >
              <Image
                width={16}
                height={16}
                src={tableAddColumnLeftIcon}
                alt="+Col L"
                className="dark:invert"
              />
            </MenuButton>
            <MenuButton
              onClick={() => editor.chain().focus().addColumnAfter().run()}
              disabled={!editor.can().addColumnAfter()}
              title="Add Column After"
            >
              <Image
                width={16}
                height={16}
                src={tableAddColumnRightIcon}
                alt="+Col R"
                className="dark:invert"
              />
            </MenuButton>
            <MenuButton
              onClick={() => editor.chain().focus().deleteColumn().run()}
              disabled={!editor.can().deleteColumn()}
              title="Delete Column"
            >
              <Image
                width={16}
                height={16}
                src={columnDeleteIcon}
                alt="-Col"
                className="dark:invert"
              />
            </MenuButton>
            <MenuButton
              onClick={() => editor.chain().focus().addRowBefore().run()}
              disabled={!editor.can().addRowBefore()}
              title="Add Row Before"
            >
              <Image
                width={16}
                height={16}
                src={tableAddRowAboveIcon}
                alt="+Row U"
                className="dark:invert"
              />
            </MenuButton>
            <MenuButton
              onClick={() => editor.chain().focus().addRowAfter().run()}
              disabled={!editor.can().addRowAfter()}
              title="Add Row After"
            >
              <Image
                width={16}
                height={16}
                src={tableAddRowBelowIcon}
                alt="+Row D"
                className="dark:invert"
              />
            </MenuButton>
            <MenuButton
              onClick={() => editor.chain().focus().deleteRow().run()}
              disabled={!editor.can().deleteRow()}
              title="Delete Row"
            >
              <Image
                width={16}
                height={16}
                src={rowDeleteIcon}
                alt="-Row"
                className="dark:invert"
              />
            </MenuButton>
            <MenuButton
              onClick={() => editor.chain().focus().mergeCells().run()}
              disabled={!editor.can().mergeCells()}
              title="Merge Cells"
            >
              <Image
                width={16}
                height={16}
                src={tableCellMergeIcon}
                alt="Merge"
                className="dark:invert"
              />
            </MenuButton>
            <MenuButton
              onClick={() => editor.chain().focus().splitCell().run()}
              disabled={!editor.can().splitCell()}
              title="Split Cell"
            >
              <Image
                width={16}
                height={16}
                src={splitCellsHorizontalIcon}
                alt="Split"
                className="dark:invert"
              />
            </MenuButton>
            <MenuButton
              onClick={() => editor.chain().focus().deleteTable().run()}
              disabled={!editor.can().deleteTable()}
              title="Delete Table"
            >
              <Image
                width={16}
                height={16}
                src={tableDeleteIcon}
                alt="Del Table"
                className="dark:invert"
              />
            </MenuButton>
          </>
        )}
      </div>
    </div>
  );
};

const CustomTableCell = TableCell.extend({
  addAttributes() {
    return {
      ...this.parent?.(),
      backgroundColor: {
        default: null,
        parseHTML: (element) => element.getAttribute("data-background-color"),
        renderHTML: (attributes) => {
          if (!attributes.backgroundColor) {
            return {};
          }
          return {
            "data-background-color": attributes.backgroundColor,
            style: `background-color: ${attributes.backgroundColor}`,
          };
        },
      },
    };
  },
});

const extensions = [
  Link.configure({
    openOnClick: false,
    HTMLAttributes: {
      class:
        "text-blue-500 underline hover:text-blue-700 transition-colors cursor-pointer",
    },
  }),
  Color.configure({ types: [TextStyle.name, ListItem.name] }),
  TextStyle,
  Underline,
  StarterKit.configure({
    bulletList: {
      keepMarks: true,
      keepAttributes: false,
    },
    orderedList: {
      keepMarks: true,
      keepAttributes: false,
    },
  }),
  TextAlign.configure({
    types: ["heading", "paragraph"],
  }),
  Table.configure({
    resizable: true,
    HTMLAttributes: {
      class:
        "min-w-full border-collapse border border-gray-300 dark:border-gray-700 my-4",
    },
  }),
  TableRow.configure({
    HTMLAttributes: {
      class: "border-b border-gray-300 dark:border-gray-700",
    },
  }),
  TableHeader.configure({
    HTMLAttributes: {
      class:
        "bg-gray-100 dark:bg-gray-800 border border-gray-300 dark:border-gray-700 px-4 py-2 font-bold text-left",
    },
  }),
  CustomTableCell.configure({
    HTMLAttributes: {
      class: "border border-gray-300 dark:border-gray-700 px-4 py-2",
    },
  }),
];

const RichTextEditor = ({
  value,
  onChange,
}: {
  value: string;
  onChange: (content: string) => void;
}) => {
  const editor = useEditor({
    extensions: extensions,
    content: value,
    immediatelyRender: false,
    editorProps: {
      attributes: {
        class:
          "prose prose-sm sm:prose-base dark:prose-invert max-w-none focus:outline-none min-h-[200px] px-4 py-3",
      },
    },
  });

  useEffect(() => {
    if (editor && editor.getHTML() !== value) {
      editor.commands.setContent(value);
    }
  }, [value, editor]);

  useEffect(() => {
    if (editor) {
      const updateHandler = () => {
        const content = editor.getHTML();
        onChange(content);
      };
      editor.on("update", updateHandler);
      return () => {
        editor.off("update", updateHandler);
      };
    }
  }, [editor, onChange]);

  return (
    <div className="flex flex-col bg-white dark:bg-[#111] rounded-xl w-full">
      <MenuBar editor={editor} />
      <div className="bg-white dark:bg-[#111] rounded-b-xl overflow-hidden cursor-text">
        <EditorContent editor={editor} />
      </div>
    </div>
  );
};

export default RichTextEditor;
