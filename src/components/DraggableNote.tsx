import { useEffect, useRef, useState } from "react";
import { useDrag } from "react-dnd";
import { Position } from "../api/apiNotes";

interface DraggableNoteProps {
  note: { id: string; position: Position; content: string };
  updateNoteText: ({
    id,
    newContent,
  }: {
    id: string;
    newContent: string;
  }) => void;
  deleteNote: (id: string) => void;
}

const DraggableNote = ({
  note,
  updateNoteText,
  deleteNote,
}: DraggableNoteProps) => {
  const dragRef = useRef<HTMLDivElement>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [localContent, setLocalContent] = useState(note.content);

  const [{ isDragging }, drag] = useDrag({
    type: "NOTE",
    item: { ...note, type: "NOTE" },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  });

  drag(dragRef);

  // Debounce logic
  useEffect(() => {
    const timeout = setTimeout(() => {
      if (localContent !== note.content) {
        updateNoteText({ id: note.id, newContent: localContent });
      }
    }, 500); // waits 500ms after user stops typing

    return () => clearTimeout(timeout); // clear on next keystroke
  }, [localContent]);

  const stopPropagation = (e: React.MouseEvent) => {
    e.stopPropagation();
  };

  return (
    <div
      ref={dragRef}
      className={`absolute ${
        isDragging ? "opacity-50" : "opacity-100"
      } bg-green-200 p-4 rounded-lg shadow-lg w-[300px] h-[300px] cursor-${
        isEditing ? "text" : "move"
      } transition-all`}
      style={{
        left: note.position.x,
        top: note.position.y,
      }}
      onClick={() => setIsEditing(true)}
      onMouseDown={stopPropagation}
    >
      {isEditing ? (
        <textarea
          autoFocus
          placeholder="Type anything, @mention anyone"
          value={localContent}
          onChange={(e) => setLocalContent(e.target.value)}
          // onKeyDown={(e) => {
          //   if (e.key === "Enter" && !e.shiftKey) {
          //     e.preventDefault();
          //     setIsEditing(false);
          //   }
          // }}
          onBlur={() => setIsEditing(false)}
          className="w-full h-full resize-none border-none outline-none bg-transparent text-sm text-green-800"
        />
      ) : (
        <div className="text-green-800 whitespace-pre-wrap">{note.content}</div>
      )}

      <button
        onClick={() => deleteNote(note.id)}
        className="absolute top-2 right-2 text-green-600 hover:text-green-700 rounded-full p-1 hover:bg-green-100 transition-all"
      >
        X
      </button>
    </div>
  );
};

export default DraggableNote;
