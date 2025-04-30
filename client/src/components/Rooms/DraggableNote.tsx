import React from "react";
import { Note } from "../../api/apiNotes";
import { useEffect, useRef, useState } from "react";
import debounce from "lodash.debounce";
import { useDrag } from "react-dnd";
import { useParams } from "react-router-dom";

interface DraggableNoteProps {
  note: { id: string; position: { x: number; y: number }; content: string };
  moveNote: (id: string, newX: number, newY: number) => void;
  updateNoteText: (id: string, updatedNote: Partial<Note>) => void;
  deleteNote: ({ roomId, id }: { roomId: string; id: string }) => void;
  isLocked: boolean;
}

const DraggableNote = ({
  note,
  moveNote,
  updateNoteText,
  deleteNote,
  isLocked,
}: DraggableNoteProps) => {
  const currentRoomId = useParams();
  const dragRef = useRef<HTMLDivElement>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [localContent, setLocalContent] = useState(note.content);

  useEffect(() => {
    setLocalContent(note.content);
  }, [note.content]);

  const debouncedSave = useRef(
    debounce((newContent: string) => {
      if (newContent !== note.content) {
        updateNoteText(note.id, {
          content: newContent,
          position: {
            x: dragRef.current?.offsetLeft ?? note.position.x,
            y: dragRef.current?.offsetTop ?? note.position.y,
          },
        });
      }
    }, 1000)
  ).current;

  useEffect(() => {
    debouncedSave(localContent);
  }, [localContent]);

  const [{ isDragging }, drag] = useDrag({
    type: "NOTE",
    canDrag: !isEditing && !isLocked,
    item: { ...note, type: "NOTE" },
    end: (item, monitor) => {
      const delta = monitor.getDifferenceFromInitialOffset();
      if (delta) {
        const { x: dx, y: dy } = delta;

        const newX = item.position.x + dx;
        const newY = item.position.y + dy;

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
      }  p-4  w-[270px] h-[270px] cursor-${isEditing ? "text" : "move"} 
      ${isLocked ? " bg-green-200 " : "bg-green-300"}  
      transition-all`}
      style={{
        position: "absolute",
        left: note.position.x,
        top: note.position.y,
      }}
      onClick={() => setIsEditing(true)}
      onMouseDown={stopPropagation}
    >
      {!isLocked && isEditing ? (
        <div>
          <textarea
            autoFocus
            value={localContent}
            onChange={(e) => setLocalContent(e.target.value)}
            onBlur={() => setIsEditing(false)}
            className="w-full h-full resize-none border-none outline-none bg-transparent text-sm text-green-800 "
            disabled={isLocked}
          />
        </div>
      ) : (
        <div>
          <textarea
            placeholder={!isLocked ? "Type anything, @mention anyone" : ""}
            className="w-full h-full resize-none border-none outline-none bg-transparent text-sm text-green-800 "
            disabled={isLocked}
            defaultValue={note.content}
          />
        </div>
      )}

      {!isLocked ? (
        <button
          onClick={() => {
            if (currentRoomId.roomId) {
              deleteNote({ roomId: currentRoomId.roomId, id: note.id });
            }
          }}
          className="absolute top-2 right-2 text-green-600 hover:text-green-700 rounded-full p-1 hover:bg-green-100 transition-all"
        >
          X
        </button>
      ) : (
        <button className="absolute top-2 right-2 text-green-600 hover:text-green-700 rounded-full p-1 hover:bg-green-100 transition-all">
          ✓
        </button>
      )}
    </div>
  );
};

export default DraggableNote;
