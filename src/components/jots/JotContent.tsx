import { useEffect, useRef, useState } from "react";
type Props = {
  content: string,
  id:string,
  handleUpdate: (id: string, content: string) => void
}
export default function JotContent({ content ,id,handleUpdate }: Props) {
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const [editingContent, setEditingContent] = useState<string>(content);


useEffect(() => {
  const textarea = textareaRef.current;

  if (!textarea) return;

  // const cursorPosition = textarea.selectionStart;

  textarea.style.height = "auto";
  textarea.style.height = `${textarea.scrollHeight + 5}px`;

  // textarea.setSelectionRange(cursorPosition, cursorPosition);
}, [content]);

  return (
    <textarea
      ref={textareaRef}
      className="jot-content mb-2"
      value={editingContent}
      onChange={(e) => setEditingContent(e.target.value)}
      onBlur={() => handleUpdate(id, editingContent)}
      id={"jot-" + id}
      name={"jot-" + id}
    />
  );
}