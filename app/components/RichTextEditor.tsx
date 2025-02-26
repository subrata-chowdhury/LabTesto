import { Color } from '@tiptap/extension-color'
import ListItem from '@tiptap/extension-list-item'
import TextStyle from '@tiptap/extension-text-style'
import { EditorContent, Editor, useEditor } from '@tiptap/react'
import Underline from '@tiptap/extension-underline'
import StarterKit from '@tiptap/starter-kit'
import React, { useEffect } from 'react'
import Table from '@tiptap/extension-table'
import TableCell from '@tiptap/extension-table-cell'
import TableHeader from '@tiptap/extension-table-header'
import TableRow from '@tiptap/extension-table-row'
import TextAlign from '@tiptap/extension-text-align'
import Image from 'next/image'

//icons
import italicIcon from '@/assets/TextEditor/italic.svg'
import paragraphIcon from '@/assets/TextEditor/paragraph.svg'
import rowDeleteIcon from '@/assets/TextEditor/row-delete.svg'
import splitCellsHorizontalIcon from '@/assets/TextEditor/split-cells-horizontal.svg'
import strikethroughIcon from '@/assets/TextEditor/strikethrough.svg'
import tableAddColumnLeftIcon from '@/assets/TextEditor/table-add-column-left.svg'
import tableAddColumnRightIcon from '@/assets/TextEditor/table-add-column-right.svg'
import tableAddRowAboveIcon from '@/assets/TextEditor/table-add-row-above.svg'
import tableAddRowBelowIcon from '@/assets/TextEditor/table-add-row-below.svg'
import tableCellMergeIcon from '@/assets/TextEditor/table-cell-merge.svg'
import tableDeleteIcon from '@/assets/TextEditor/table-delete.svg'
import alignCenterIcon from '@/assets/TextEditor/align-center.svg'
import alignLeftIcon from '@/assets/TextEditor/align-left.svg'
import alignRightIcon from '@/assets/TextEditor/align-right.svg'
import boldIcon from '@/assets/TextEditor/bold.svg'
import bulletListIcon from '@/assets/TextEditor/bullet-list.svg'
import bulletListRomanIcon from '@/assets/TextEditor/bullet-list-roman.svg'
import codeIcon from '@/assets/TextEditor/code.svg'
import columnDeleteIcon from '@/assets/TextEditor/column-delete.svg'
import insertTableIcon from '@/assets/TextEditor/insert-table.svg'

const MenuBar = ({ editor }: { editor: Editor | null }) => {
    if (!editor) {
        return null
    }

    return (
        <div className="control-group">
            <div className="button-group">
                <button
                    onClick={() => editor.chain().focus().toggleBold().run()}
                    disabled={
                        !editor.can()
                            .chain()
                            .focus()
                            .toggleBold()
                            .run()
                    }
                    className={(editor.isActive('bold') ? 'is-active' : '')}
                    title="Bold"
                >
                    <Image width={18} height={18} src={boldIcon} alt="Bold" />
                </button>
                <button
                    onClick={() => editor.chain().focus().toggleItalic().run()}
                    disabled={
                        !editor.can()
                            .chain()
                            .focus()
                            .toggleItalic()
                            .run()
                    }
                    className={(editor.isActive('italic') ? 'is-active' : '')}
                    title="Italic"
                >
                    <Image width={18} height={18} src={italicIcon} alt="Italic" />
                </button>
                <button
                    onClick={() => editor.chain().focus().toggleUnderline().run()}
                    disabled={
                        !editor.can()
                            .chain()
                            .focus()
                            .toggleUnderline()
                            .run()
                    }
                    className={(editor.isActive('underline') ? 'is-active' : '')}
                    title="Underline"
                >
                    U
                </button>
                <button
                    onClick={() => editor.chain().focus().toggleStrike().run()}
                    disabled={
                        !editor.can()
                            .chain()
                            .focus()
                            .toggleStrike()
                            .run()
                    }
                    className={(editor.isActive('strike') ? 'is-active' : '')}
                    title="Strikethrough"
                >
                    <Image width={18} height={18} src={strikethroughIcon} alt="Strike" />
                </button>
                <button
                    onClick={() => editor.chain().focus().toggleCode().run()}
                    disabled={
                        !editor.can()
                            .chain()
                            .focus()
                            .toggleCode()
                            .run()
                    }
                    className={(editor.isActive('code') ? 'is-active' : '')}
                    title="Code"
                >
                    <Image width={18} height={18} src={codeIcon} alt="Code" />
                </button>
                <button onClick={() => editor.chain().focus().unsetAllMarks().run()} title="Clear marks">
                    Clear marks
                </button>
                <button onClick={() => editor.chain().focus().clearNodes().run()} title="Clear nodes">
                    Clear nodes
                </button>
                <button
                    onClick={() => editor.chain().focus().setParagraph().run()}
                    className={(editor.isActive('paragraph') ? 'is-active' : '')}
                    title="Paragraph"
                >
                    <Image width={18} height={18} src={paragraphIcon} alt="Paragraph" />
                </button>
                <button
                    onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
                    className={(editor.isActive('heading', { level: 1 }) ? 'is-active' : '')}
                    title="Heading 1"
                >
                    H1
                </button>
                <button
                    onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
                    className={(editor.isActive('heading', { level: 2 }) ? 'is-active' : '')}
                    title="Heading 2"
                >
                    H2
                </button>
                <button
                    onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
                    className={(editor.isActive('heading', { level: 3 }) ? 'is-active' : '')}
                    title="Heading 3"
                >
                    H3
                </button>
                <button
                    onClick={() => editor.chain().focus().toggleHeading({ level: 4 }).run()}
                    className={(editor.isActive('heading', { level: 4 }) ? 'is-active' : '')}
                    title="Heading 4"
                >
                    H4
                </button>
                <button
                    onClick={() => editor.chain().focus().toggleHeading({ level: 5 }).run()}
                    className={(editor.isActive('heading', { level: 5 }) ? 'is-active' : '')}
                    title="Heading 5"
                >
                    H5
                </button>
                <button
                    onClick={() => editor.chain().focus().toggleHeading({ level: 6 }).run()}
                    className={(editor.isActive('heading', { level: 6 }) ? 'is-active' : '')}
                    title="Heading 6"
                >
                    H6
                </button>
                <button
                    onClick={() => editor.chain().focus().toggleBulletList().run()}
                    className={(editor.isActive('bulletList') ? 'is-active' : '')}
                    title="Bullet List"
                >
                    <Image width={18} height={18} src={bulletListIcon} alt="Bullet list" />
                </button>
                <button
                    onClick={() => editor.chain().focus().toggleOrderedList().run()}
                    className={(editor.isActive('orderedList') ? 'is-active' : '')}
                    title="Ordered List"
                >
                    <Image width={18} height={18} src={bulletListRomanIcon} alt="Ordered list" />
                </button>
                <button
                    onClick={() => editor.chain().focus().toggleCodeBlock().run()}
                    className={(editor.isActive('codeBlock') ? 'is-active' : '')}
                    title="Code Block"
                >
                    Code block
                </button>
                <button
                    onClick={() => editor.chain().focus().toggleBlockquote().run()}
                    className={(editor.isActive('blockquote') ? 'is-active' : '')}
                    title="Blockquote"
                >
                    Blockquote
                </button>
                <button onClick={() => editor.chain().focus().setHorizontalRule().run()} title="Horizontal Rule">
                    Horizontal rule
                </button>
                <button onClick={() => editor.chain().focus().setHardBreak().run()} title="Hard Break">
                    Hard break
                </button>
                <button
                    onClick={() => editor.chain().focus().undo().run()}
                    disabled={
                        !editor.can()
                            .chain()
                            .focus()
                            .undo()
                            .run()
                    }
                    title="Undo"
                >
                    Undo
                </button>
                <button
                    onClick={() => editor.chain().focus().redo().run()}
                    disabled={
                        !editor.can()
                            .chain()
                            .focus()
                            .redo()
                            .run()
                    }
                    title="Redo"
                >
                    Redo
                </button>
                <button
                    onClick={() => editor.chain().focus().setColor('#958DF1').run()}
                    className={(editor.isActive('textStyle', { color: '#958DF1' }) ? 'is-active' : '')}
                    title="Purple"
                >
                    Purple
                </button>
                <button
                    onClick={() => editor.chain().focus().setTextAlign('center').run()}
                    className={(editor.isActive({ textAlign: 'center' }) ? 'is-active' : '')}
                    title="Align Center"
                >
                    <Image width={18} height={18} src={alignCenterIcon} alt="Center" />
                </button>
                <button
                    onClick={() => editor.chain().focus().setTextAlign('left').run()}
                    className={(editor.isActive({ textAlign: 'left' }) ? 'is-active' : '')}
                    title="Align Left"
                >
                    <Image width={18} height={18} src={alignLeftIcon} alt="Left" />
                </button>
                <button
                    onClick={() => editor.chain().focus().setTextAlign('right').run()}
                    className={(editor.isActive({ textAlign: 'right' }) ? 'is-active' : '')}
                    title="Align Right"
                >
                    <Image width={18} height={18} src={alignRightIcon} alt="Right" />
                </button>
            </div>
            <div className="button-group">
                <button onClick={() => editor.chain().focus().insertTable({ rows: 3, cols: 3, withHeaderRow: true }).run()} title="Insert Table">
                    <Image width={18} height={18} src={insertTableIcon} alt="Insert table" />
                </button>
                <button disabled onClick={() => editor.chain().focus().insertContent('', {
                    parseOptions: {
                        preserveWhitespace: false,
                    },
                }).run()} title="Insert HTML Table">
                    Insert HTML table
                </button>
                <button onClick={() => editor.chain().focus().addColumnBefore().run()} disabled={!editor.can().addColumnBefore()} title="Add Column Before">
                    <Image width={18} height={18} src={tableAddColumnLeftIcon} alt="Add column before" />
                </button>
                <button onClick={() => editor.chain().focus().addColumnAfter().run()} disabled={!editor.can().addColumnAfter()} title="Add Column After">
                    <Image width={18} height={18} src={tableAddColumnRightIcon} alt="Add column after" />
                </button>
                <button onClick={() => editor.chain().focus().deleteColumn().run()} disabled={!editor.can().deleteColumn()} title="Delete Column">
                    <Image width={18} height={18} src={columnDeleteIcon} alt="Delete column" />
                </button>
                <button onClick={() => editor.chain().focus().addRowBefore().run()} disabled={!editor.can().addRowBefore()} title="Add Row Before">
                    <Image width={18} height={18} src={tableAddRowAboveIcon} alt="Add row before" />
                </button>
                <button onClick={() => editor.chain().focus().addRowAfter().run()} disabled={!editor.can().addRowAfter()} title="Add Row After">
                    <Image width={18} height={18} src={tableAddRowBelowIcon} alt="Add row after" />
                </button>
                <button onClick={() => editor.chain().focus().deleteRow().run()} disabled={!editor.can().deleteRow()} title="Delete Row">
                    <Image width={18} height={18} src={rowDeleteIcon} alt="Delete row" />
                </button>
                <button onClick={() => editor.chain().focus().deleteTable().run()} disabled={!editor.can().deleteTable()} title="Delete Table">
                    <Image width={18} height={18} src={tableDeleteIcon} alt="Delete table" />
                </button>
                <button onClick={() => editor.chain().focus().mergeCells().run()} disabled={!editor.can().mergeCells()} title="Merge Cells">
                    <Image width={18} height={18} src={tableCellMergeIcon} alt="Merge cells" />
                </button>
                <button onClick={() => editor.chain().focus().splitCell().run()} disabled={!editor.can().splitCell()} title="Split Cell">
                    <Image width={18} height={18} src={splitCellsHorizontalIcon} alt="Split cell" />
                </button>
                <button onClick={() => editor.chain().focus().toggleHeaderColumn().run()} disabled={!editor.can().toggleHeaderColumn()} title="Toggle Header Column">
                    ToggleHeaderColumn
                </button>
                <button onClick={() => editor.chain().focus().toggleHeaderRow().run()} disabled={!editor.can().toggleHeaderRow()} title="Toggle Header Row">
                    Toggle header row
                </button>
                <button onClick={() => editor.chain().focus().toggleHeaderCell().run()} disabled={!editor.can().toggleHeaderCell()} title="Toggle Header Cell">
                    Toggle header cell
                </button>
                <button onClick={() => editor.chain().focus().mergeOrSplit().run()} disabled={!editor.can().mergeOrSplit()} title="Merge or Split">
                    Merge or split
                </button>
                <button onClick={() => editor.chain().focus().setCellAttribute('backgroundColor', '#FAF594').run()} disabled={!editor.can().setCellAttribute('backgroundColor', '#FAF594')} title="Set Cell Attribute">
                    Set cell attribute
                </button>
                <button onClick={() => editor.chain().focus().fixTables().run()} disabled={!editor.can().fixTables()} title="Fix Tables">
                    Fix tables
                </button>
                <button onClick={() => editor.chain().focus().goToNextCell().run()} disabled={!editor.can().goToNextCell()} title="Go to Next Cell">
                    Go to next cell
                </button>
                <button onClick={() => editor.chain().focus().goToPreviousCell().run()} disabled={!editor.can().goToPreviousCell()} title="Go to Previous Cell">
                    Go to previous cell
                </button>
            </div>
        </div>
    )
}

const CustomTableCell = TableCell.extend({
    addAttributes() {
        return {
            // extend the existing attributes …
            ...this.parent?.(),

            // and add a new one …
            backgroundColor: {
                default: null,
                parseHTML: element => element.getAttribute('data-background-color'),
                renderHTML: attributes => {
                    return {
                        'data-background-color': attributes.backgroundColor,
                        style: `background-color: ${attributes.backgroundColor}`,
                    }
                },
            },
        }
    },
})

const extensions = [
    Color.configure({ types: [TextStyle.name, ListItem.name] }),
    TextStyle,
    Underline,
    TextStyle,
    StarterKit.configure({
        bulletList: {
            keepMarks: true,
            keepAttributes: false, // TODO : Making this as `false` becase marks are not preserved when I try to preserve attrs, awaiting a bit of help
        },
        orderedList: {
            keepMarks: true,
            keepAttributes: false, // TODO : Making this as `false` becase marks are not preserved when I try to preserve attrs, awaiting a bit of help
        },
    }),
    TextAlign.configure({
        types: ['heading', 'paragraph'],
    }),
    // StarterKit,
    Table.configure({
        resizable: true,
    }),
    TableRow,
    TableHeader,
    // Default TableCell
    // TableCell,
    // Custom TableCell with backgroundColor attribute
    CustomTableCell,
]

const RichTextEditor = ({ value, onChange }: { value: string, onChange: (content: string) => void }) => {
    const editor = useEditor({
        extensions: extensions,
        content: value,
        immediatelyRender: false
    })

    useEffect(() => {
        if (editor) {
            editor.commands.setContent(value)
        }
    }, [value, editor])

    useEffect(() => {
        if (editor) {
            const updateHandler = () => {
                const content = editor.getHTML()
                onChange(content)
            }
            editor.on('update', updateHandler)
            return () => {
                editor.off('update', updateHandler)
            }
        }
    }, [editor, onChange])

    return (
        <div>
            <MenuBar editor={editor} />
            <EditorContent editor={editor} />
        </div>
    )
}

export default RichTextEditor