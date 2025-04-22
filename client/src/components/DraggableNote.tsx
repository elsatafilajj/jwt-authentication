import React from "react";
import { Note } from "../api/apiNotes";
import { useEffect, useRef, useState } from "react";
import debounce from "lodash.debounce";
import { useDrag } from "react-dnd";

interface DraggableNoteProps {
  note: { id: string; position: { x: number; y: number }; content: string };
  moveNote: (id: string, newX: number, newY: number) => void;
  updateNoteText: (id: string, updatedNote: Partial<Note>) => void;
  deleteNote: (id: string) => void;
}

const DraggableNote = ({
  note,
  moveNote,
  updateNoteText,
  deleteNote,
}: DraggableNoteProps) => {
  const dragRef = useRef<HTMLDivElement>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [localContent, setLocalContent] = useState(note.content);

  useEffect(() => {
    setLocalContent(note.content);
  }, [note.content]);

  const debouncedSave = useRef(
    debounce((newContent: string) => {
      if (newContent !== note.content) {
        updateNoteText(note.id, { content: newContent });
      }
    }, 1000)
  ).current;

  useEffect(() => {
    debouncedSave(localContent);
  }, [localContent]);

  const [{ isDragging }, drag] = useDrag({
    type: "NOTE",
    canDrag: !isEditing,
    item: { ...note, type: "NOTE" },
    end: (item, monitor) => {
      const delta = monitor.getDifferenceFromInitialOffset();
      if (delta) {
        const newX = item.position.x + delta.x;
        const newY = item.position.y + delta.y;
        moveNote(item.id, newX, newY);
      }
    },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  });

  drag(dragRef);

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
        <div>
          <textarea
            autoFocus
            placeholder="Type anything, @mention anyone"
            value={localContent}
            onChange={(e) => setLocalContent(e.target.value)}
            onBlur={() => setIsEditing(false)}
            className="w-full h-full resize-none border-none outline-none bg-transparent text-sm text-green-800"
          />
        </div>
      ) : (
        <div className="text-green-800">{note.content}</div>
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
