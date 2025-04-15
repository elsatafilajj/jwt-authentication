import { useRef } from "react";
import { useDrag } from "react-dnd";

interface DraggableNoteProps {
  note: { id: number; x: number; y: number; text: string };
  moveNote: (id: number, newX: number, newY: number) => void;
}

const DraggableNote = ({ note, moveNote }: DraggableNoteProps) => {
  const dragRef = useRef<HTMLDivElement>(null);

  const [{ isDragging }, drag] = useDrag({
    type: "NOTE",
    item: { ...note },
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

  return (
    <div
      ref={dragRef}
      style={{
        position: "absolute",
        left: note.x,
        top: note.y,
        background: "#CCFFCC",
        padding: "10px",
        cursor: "move",
        opacity: isDragging ? 0.5 : 1,
        borderRadius: "8px",
        boxShadow: "0 2px 6px rgba(0,0,0,0.2)",
        width: "150px",
      }}
    >
      {note.text}
    </div>
  );
};

export default DraggableNote;
