import { useRef, useState } from "react";
import { useDrag } from "react-dnd";

interface DraggableNoteProps {
  note: { id: number; x: number; y: number; text: string };
  moveNote: (id: number, newX: number, newY: number) => void;
  updateNoteText: (id: number, newText: string) => void;
  deleteNote: (id: number) => void;
}

const DraggableNote = ({
  note,
  moveNote,
  updateNoteText,
  deleteNote,
}: DraggableNoteProps) => {
  const dragRef = useRef<HTMLDivElement>(null);
  const [isEditing, setIsEditing] = useState(false);

  const [{ isDragging }, drag] = useDrag({
    type: "NOTE",
    item: { ...note, type: "NOTE" },
    end: (item, monitor) => {
      const delta = monitor.getDifferenceFromInitialOffset();
      if (delta) {
        const newX = item.x + delta.x;
        const newY = item.y + delta.y;
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
    <>
      <div
        ref={dragRef}
        className={`absolute ${
          isDragging ? "opacity-50" : "opacity-100"
        } bg-green-200 p-4 rounded-lg shadow-lg w-[300px] h-[300px] cursor-${
          isEditing ? "text" : "move"
        } transition-all`}
        style={{
          left: note.x,
          top: note.y,
        }}
        onClick={() => setIsEditing(true)}
        onMouseDown={stopPropagation}
      >
        {isEditing ? (
          <div>
            <textarea
              autoFocus
              placeholder="Type anything, @mention anyone"
              value={note.text}
              onChange={(e) => updateNoteText(note.id, e.target.value)}
              onBlur={() => setIsEditing(false)}
              className="w-full h-full resize-none border-none outline-none bg-transparent text-sm text-green-800"
            />
          </div>
        ) : (
          <div className="text-green-800">{note.text}</div>
        )}

        {/* Delete button in the top-right corner */}
        <button
          onClick={() => deleteNote(note.id)}
          className="absolute top-2 right-2 text-green-600 hover:text-green-700 rounded-full p-1 hover:bg-green-100 transition-all"
        >
          X
        </button>
      </div>
    </>
  );
};

export default DraggableNote;
