import { useEffect, useRef } from "react";
import { useDrag } from "react-dnd";

export interface Note {
  id: number;
  content: string;
  position: { x: number; y: number };
}

interface DraggableNoteProps {
  note: Note;
  setIsDragging: (draggging: boolean) => void;
}

const DraggableNote = ({ note, setIsDragging }: DraggableNoteProps) => {
  const ref = useRef<HTMLDivElement | null>(null);

  const [{ isDragging }, drag] = useDrag({
    type: "NOTE",
    item: () => {
      setIsDragging(true);
      return { id: note.id };
    },
    end: () => {
      setIsDragging(false);
    },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  });

  useEffect(() => {
    if (ref.current) {
      drag(ref.current);
    }
  }, [drag]);

  if (!note?.position) return null;

  return (
    <div
      ref={ref}
      className={`absolute w-60 h-50 p-2 bg-yellow-200 shadow-md cursor-move rounded ${
        isDragging ? "opacity-50" : "opacity-100"
      }`}
      style={{
        left: `${note.position.x}px`,
        top: `${note.position.y}px`,
      }}
    >
      {note.content}
    </div>
  );
};

export default DraggableNote;
