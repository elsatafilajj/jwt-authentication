import { useState, useRef } from "react";

import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";

import {
  useTransformContext,
  TransformWrapper,
  TransformComponent,
} from "react-zoom-pan-pinch";

import { useDrop } from "react-dnd";
import DraggableNote, { Note } from "./DraggableNote";

interface DroppableCanvasProps {
  notes: Note[];
  setNotes: React.Dispatch<React.SetStateAction<Note[]>>;
  setIsDragging: (dragging: boolean) => void;
  scale: number; // current scale value
}

interface DroppableCanvasProps {
  notes: Note[];
  setNotes: React.Dispatch<React.SetStateAction<Note[]>>;
  setIsDragging: (dragging: boolean) => void;
}

const DroppableCanvas = ({
  notes,
  setNotes,
  setIsDragging,
}: DroppableCanvasProps) => {
  const ref = useRef<HTMLDivElement | null>(null);
  const { scale = 1 } = useTransformContext();

  const [{ isOver }, drop] = useDrop(() => ({
    accept: "NOTE",
    drop: (item: { id: number }, monitor) => {
      const offset = monitor.getClientOffset();
      if (!offset) return;

      const canvas = ref.current;
      if (!canvas) return;

      const canvasRect = canvas.getBoundingClientRect();

      // Adjust the drop coordinates using the current scale
      const newX = (offset.x - canvasRect.left) / scale;
      const newY = (offset.y - canvasRect.top) / scale;

      setNotes((prev) =>
        prev.map((note) =>
          note.id === item.id
            ? { ...note, position: { x: newX, y: newY } }
            : note
        )
      );
    },
    collect: (monitor) => ({
      isOver: monitor.isOver(),
    }),
  }));

  return (
    <div
      ref={(node) => {
        ref.current = node;
        drop(node);
      }}
      id="canvas-area"
      className={`relative w-[2000px] h-[1200px] border rounded overflow-hidden ${
        isOver ? "bg-emerald-100" : "bg-emerald-50"
      }`}
    >
      {notes.map((note) => (
        <DraggableNote
          key={note.id}
          note={note}
          setIsDragging={setIsDragging}
        />
      ))}
    </div>
  );
};

const BrainstormDashboard = () => {
  const [isDragging, setIsDragging] = useState(false);
  const [notes, setNotes] = useState<Note[]>([
    { id: 1, content: "Note 1", position: { x: 100, y: 100 } },
    { id: 2, content: "Note 2", position: { x: 200, y: 150 } },
  ]);

  return (
    <DndProvider backend={HTML5Backend}>
      <TransformWrapper
        minScale={0.3}
        maxScale={3}
        limitToBounds={false}
        centerZoomedOut={true}
        panning={{ disabled: isDragging }}
        pinch={{ disabled: isDragging }}
        wheel={{ wheelDisabled: isDragging }}
        doubleClick={{ disabled: true }}
      >
        <TransformComponent>
          <DroppableCanvas
            notes={notes}
            setNotes={setNotes}
            setIsDragging={setIsDragging}
          />
        </TransformComponent>
      </TransformWrapper>
    </DndProvider>
  );
};

export default BrainstormDashboard;
