"use client"

import { EditorContent, useEditor } from "@tiptap/react"
import StarterKit from "@tiptap/starter-kit"
import { useEffect } from "react"

type RichTextProps = {
  content: unknown | null
  onChange: (json: unknown) => void
  placeholder?: string
}

/** Tiptap notes editor — outputs ProseMirror JSON, rendered in the editorial serif. */
export function RichText({ content, onChange, placeholder }: RichTextProps) {
  const editor = useEditor({
    immediatelyRender: false,
    extensions: [StarterKit],
    content: (content as object) ?? "",
    editorProps: {
      attributes: {
        class:
          "font-serif text-[0.95rem] leading-relaxed outline-none min-h-24 [&_p]:my-2 [&_ul]:my-2 [&_ul]:list-disc [&_ul]:pl-5 [&_ol]:my-2 [&_ol]:list-decimal [&_ol]:pl-5 [&_h1]:text-xl [&_h1]:font-semibold [&_h2]:text-lg [&_h2]:font-semibold [&_h1]:mt-3 [&_h2]:mt-3 [&_code]:rounded [&_code]:bg-muted [&_code]:px-1",
        "data-placeholder": placeholder ?? "Write a note…",
      },
    },
    onUpdate: ({ editor }) => onChange(editor.getJSON()),
  })

  // Keep editor content in sync when switching between items in the peek panel.
  useEffect(() => {
    if (!editor) return
    const current = JSON.stringify(editor.getJSON())
    const incoming = JSON.stringify((content as object) ?? editor.getJSON())
    if (current !== incoming) editor.commands.setContent((content as object) ?? "")
  }, [editor, content])

  return <EditorContent editor={editor} />
}
