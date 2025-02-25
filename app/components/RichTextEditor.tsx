import { Color } from '@tiptap/extension-color'
import ListItem from '@tiptap/extension-list-item'
import TextStyle from '@tiptap/extension-text-style'
import { EditorContent, Editor, useEditor } from '@tiptap/react'
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
                >
                    <Image width={18} height={18} src={italicIcon} alt="Italic" />
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
                >
                    <Image width={18} height={18} src={codeIcon} alt="Code" />
                </button>
                <button onClick={() => editor.chain().focus().unsetAllMarks().run()}>
                    Clear marks
                </button>
                <button onClick={() => editor.chain().focus().clearNodes().run()}>
                    Clear nodes
                </button>
                <button
                    onClick={() => editor.chain().focus().setParagraph().run()}
                    className={(editor.isActive('paragraph') ? 'is-active' : '')}
                >
                    <Image width={18} height={18} src={paragraphIcon} alt="Paragraph" />
                </button>
                <button
                    onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
                    className={(editor.isActive('heading', { level: 1 }) ? 'is-active' : '')}
                >
                    H1
                </button>
                <button
                    onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
                    className={(editor.isActive('heading', { level: 2 }) ? 'is-active' : '')}
                >
                    H2
                </button>
                <button
                    onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
                    className={(editor.isActive('heading', { level: 3 }) ? 'is-active' : '')}
                >
                    H3
                </button>
                <button
                    onClick={() => editor.chain().focus().toggleHeading({ level: 4 }).run()}
                    className={(editor.isActive('heading', { level: 4 }) ? 'is-active' : '')}
                >
                    H4
                </button>
                <button
                    onClick={() => editor.chain().focus().toggleHeading({ level: 5 }).run()}
                    className={(editor.isActive('heading', { level: 5 }) ? 'is-active' : '')}
                >
                    H5
                </button>
                <button
                    onClick={() => editor.chain().focus().toggleHeading({ level: 6 }).run()}
                    className={(editor.isActive('heading', { level: 6 }) ? 'is-active' : '')}
                >
                    H6
                </button>
                <button
                    onClick={() => editor.chain().focus().toggleBulletList().run()}
                    className={(editor.isActive('bulletList') ? 'is-active' : '')}
                >
                    <Image width={18} height={18} src={bulletListIcon} alt="Bullet list" />
                </button>
                <button
                    onClick={() => editor.chain().focus().toggleOrderedList().run()}
                    className={(editor.isActive('orderedList') ? 'is-active' : '')}
                >
                    <Image width={18} height={18} src={bulletListRomanIcon} alt="Bullet list" />
                </button>
                <button
                    onClick={() => editor.chain().focus().toggleCodeBlock().run()}
                    className={(editor.isActive('codeBlock') ? 'is-active' : '')}
                >
                    Code block
                </button>
                <button
                    onClick={() => editor.chain().focus().toggleBlockquote().run()}
                    className={(editor.isActive('blockquote') ? 'is-active' : '')}
                >
                    Blockquote
                </button>
                <button onClick={() => editor.chain().focus().setHorizontalRule().run()}>
                    Horizontal rule
                </button>
                <button onClick={() => editor.chain().focus().setHardBreak().run()}>
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
                >
                    Redo
                </button>
                <button
                    onClick={() => editor.chain().focus().setColor('#958DF1').run()}
                    className={(editor.isActive('textStyle', { color: '#958DF1' }) ? 'is-active' : '')}
                >
                    Purple
                </button>
                <button
                    onClick={() => editor.chain().focus().setTextAlign('center').run()}
                    className={(editor.isActive({ textAlign: 'center' }) ? 'is-active' : '')}
                >
                    <Image width={18} height={18} src={alignCenterIcon} alt="Center" />
                </button>
                <button
                    onClick={() => editor.chain().focus().setTextAlign('left').run()}
                    className={(editor.isActive({ textAlign: 'left' }) ? 'is-active' : '')}
                >
                    <Image width={18} height={18} src={alignLeftIcon} alt="Left" />
                </button>
                <button
                    onClick={() => editor.chain().focus().setTextAlign('right').run()}
                    className={(editor.isActive({ textAlign: 'right' }) ? 'is-active' : '')}
                >
                    <Image width={18} height={18} src={alignRightIcon} alt="Right" />
                </button>
            </div>
            <div className="button-group">
                <button onClick={() => editor.chain().focus().insertTable({ rows: 3, cols: 3, withHeaderRow: true }).run()}>
                    <Image width={18} height={18} src={insertTableIcon} alt="Insert table" />
                </button>
                <button onClick={() => editor.chain().focus().insertContent('', {
                    parseOptions: {
                        preserveWhitespace: false,
                    },
                }).run()}>
                    Insert HTML table
                </button>
                <button onClick={() => editor.chain().focus().addColumnBefore().run()} disabled={!editor.can().addColumnBefore()}>
                    <Image width={18} height={18} src={tableAddColumnLeftIcon} alt="Add column before" />
                </button>
                <button onClick={() => editor.chain().focus().addColumnAfter().run()} disabled={!editor.can().addColumnAfter()}>
                    <Image width={18} height={18} src={tableAddColumnRightIcon} alt="Add column after" />
                </button>
                <button onClick={() => editor.chain().focus().deleteColumn().run()} disabled={!editor.can().deleteColumn()}>
                    <Image width={18} height={18} src={columnDeleteIcon} alt="Delete column" />
                </button>
                <button onClick={() => editor.chain().focus().addRowBefore().run()} disabled={!editor.can().addRowBefore()}>
                    <Image width={18} height={18} src={tableAddRowAboveIcon} alt="Add row before" />
                </button>
                <button onClick={() => editor.chain().focus().addRowAfter().run()} disabled={!editor.can().addRowAfter()}>
                    <Image width={18} height={18} src={tableAddRowBelowIcon} alt="Add row after" />
                </button>
                <button onClick={() => editor.chain().focus().deleteRow().run()} disabled={!editor.can().deleteRow()}>
                    <Image width={18} height={18} src={rowDeleteIcon} alt="Delete row" />
                </button>
                <button onClick={() => editor.chain().focus().deleteTable().run()} disabled={!editor.can().deleteTable()}>
                    <Image width={18} height={18} src={tableDeleteIcon} alt="Delete table" />
                </button>
                <button onClick={() => editor.chain().focus().mergeCells().run()} disabled={!editor.can().mergeCells()}>
                    <Image width={18} height={18} src={tableCellMergeIcon} alt="Merge cells" />
                </button>
                <button onClick={() => editor.chain().focus().splitCell().run()} disabled={!editor.can().splitCell()}>
                    <Image width={18} height={18} src={splitCellsHorizontalIcon} alt="Split cell" />
                </button>
                <button onClick={() => editor.chain().focus().toggleHeaderColumn().run()} disabled={!editor.can().toggleHeaderColumn()}>
                    ToggleHeaderColumn
                </button>
                <button onClick={() => editor.chain().focus().toggleHeaderRow().run()} disabled={!editor.can().toggleHeaderRow()}>
                    Toggle header row
                </button>
                <button onClick={() => editor.chain().focus().toggleHeaderCell().run()} disabled={!editor.can().toggleHeaderCell()}>
                    Toggle header cell
                </button>
                <button onClick={() => editor.chain().focus().mergeOrSplit().run()} disabled={!editor.can().mergeOrSplit()}>
                    Merge or split
                </button>
                <button onClick={() => editor.chain().focus().setCellAttribute('backgroundColor', '#FAF594').run()} disabled={!editor.can().setCellAttribute('backgroundColor', '#FAF594')}>
                    Set cell attribute
                </button>
                <button onClick={() => editor.chain().focus().fixTables().run()} disabled={!editor.can().fixTables()}>
                    Fix tables
                </button>
                <button onClick={() => editor.chain().focus().goToNextCell().run()} disabled={!editor.can().goToNextCell()}>
                    Go to next cell
                </button>
                <button onClick={() => editor.chain().focus().goToPreviousCell().run()} disabled={!editor.can().goToPreviousCell()}>
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