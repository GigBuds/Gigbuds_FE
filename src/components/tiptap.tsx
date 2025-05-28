'use client'
import { useEditor, EditorContent } from '@tiptap/react'
import { StarterKit } from '@tiptap/starter-kit'
import '@/components/tiptap-node/list-node/list-node.scss'
import BulletList from '@tiptap/extension-bullet-list'
import ListItem from '@tiptap/extension-list-item'

export default function Tiptap({ value, onChange }: Readonly<{ value: string, onChange: (value: string) => void }>) {
  const editor = useEditor({
    extensions: [
      StarterKit,
      BulletList,
      ListItem
    ],
    content: value,
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML());
    },
  })

  return <EditorContent editor={editor} />
}
