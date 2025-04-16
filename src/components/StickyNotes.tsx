import { useEffect, useRef, useState } from "react";
import { useDrop } from "react-dnd";
import { TransformWrapper, TransformComponent } from "react-zoom-pan-pinch";
import DraggableNote from "./DraggableNote";
import Sidebar from "./Sidebar";

type Note = {
  id: number;
  x: number;
  y: number;
  text: string;
};

type DragItem = {
  type: string;
  id: number;
  x?: number;
  y?: number;
  text?: string;
};

let idCounter = 2;

const StickyNotes = () => {
  const dropRef = useRef<HTMLDivElement>(null);
  const [notes, setNotes] = useState<Note[]>(() => {
    const savedNotes = localStorage.getItem("notes");
    return savedNotes ? JSON.parse(savedNotes) : [];
  });

  useEffect(() => {
    localStorage.setItem("notes", JSON.stringify(notes));
  }, [notes]);

  const moveNote = (id: number, newX: number, newY: number) => {
    setNotes((prev) =>
      prev.map((note) =>
        note.id === id ? { ...note, x: newX, y: newY } : note
      )
    );
  };

  const updateNoteText = (id: number, newText: string) => {
    setNotes((prev) =>
      prev.map((note) => (note.id === id ? { ...note, text: newText } : note))
    );
  };

  const deleteNote = (id: number) => {
    setNotes((prev) => {
      const updatedNotes = prev.filter((note) => note.id !== id);

      localStorage.setItem("notes", JSON.stringify(updatedNotes));
      return updatedNotes;
    });
  };

  const [, drop] = useDrop<DragItem>({
    accept: "NOTE",
    drop: (item, monitor) => {
      const offset = monitor.getClientOffset();
      const boundingRect = dropRef.current?.getBoundingClientRect();

      if (!offset || !boundingRect) return;

      const x = offset.x - boundingRect.left;
      const y = offset.y - boundingRect.top;

      moveNote(item.id, x, y);
    },
    collect: (monitor) => ({
      isOver: monitor.isOver(),
    }),
  });

  drop(dropRef);

  const [, drag] = useDrop({
    accept: "NEW_NOTE",
    drop: (item, monitor) => {
      const offset = monitor.getClientOffset();
      const boundingRect = document
        .getElementById("canvas-area")
        ?.getBoundingClientRect();
      if (!offset || !boundingRect) return;
      const x = offset.x - boundingRect.left;
      const y = offset.y - boundingRect.top;
      const newNote = {
        id: idCounter++,
        x,
        y,
        text: "",
      };
      setNotes((prev) => [...prev, newNote]);
    },
  });

  drag(dropRef);

  return (
    <div className="flex flex-col h-screen">
      <header className="bg-green-700 text-white p-4 text-center font-semibold shadow-md">
        Sticky Notes App
      </header>
      <div className="flex flex-1">
        <Sidebar />
        <TransformWrapper>
          <TransformComponent>
            <div
              ref={dropRef}
              id="canvas-area"
              className="relative bg-green-50 w-[5000px] h-[5000px] pt-16"
            >
              {notes.map((note) => (
                <DraggableNote
                  key={note.id}
                  note={note}
                  moveNote={moveNote}
                  updateNoteText={updateNoteText}
                  deleteNote={deleteNote}
                />
              ))}
            </div>
          </TransformComponent>
        </TransformWrapper>
      </div>
    </div>
  );
};

export default StickyNotes;
