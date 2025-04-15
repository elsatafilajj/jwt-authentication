import { useRef, useState } from "react";
import { useDrop } from "react-dnd";

import { TransformWrapper, TransformComponent } from "react-zoom-pan-pinch";
import DraggableNote from "./DraggableNote";
import Sidebar from "./Sidebar";

// export interface moveNoteProps {
//   id: number;
//   newX: number;
//   newY: number;
// }

let idCounter = 2;

const StickyNotes = () => {
  const dropRef = useRef<HTMLDivElement>(null);

  const [notes, setNotes] = useState([
    { id: 1, x: 100, y: 100, text: "Welcome!" },
  ]);

  const moveNote = (id: number, newX: number, newY: number) => {
    setNotes((prev) =>
      prev.map((note) =>
        note.id === id ? { ...note, x: newX, y: newY } : note
      )
    );
  };

  const [, drop] = useDrop({
    accept: ["NEW_NOTE"],
    drop: (item, monitor) => {
      const offset = monitor.getClientOffset();
      const boundingRect = document
        .getElementById("canvas-area")
        ?.getBoundingClientRect();

      if (offset && boundingRect) {
        const x = offset.x - boundingRect.left;
        const y = offset.y - boundingRect.top;

        const newNote = {
          id: idCounter++,
          x,
          y,
          text: "New Sticky",
        };
        setNotes((prev) => [...prev, newNote]);
      }
    },
  });

  drop(dropRef);

  return (
    <div style={{ display: "flex", height: "100vh" }}>
      <Sidebar />
      <TransformWrapper>
        <TransformComponent>
          <div
            ref={dropRef}
            id="canvas-area"
            style={{
              width: "5000px",
              height: "5000px",
              position: "relative",
              background: "#fffef0",
            }}
          >
            {notes.map((note) => (
              <DraggableNote key={note.id} note={note} moveNote={moveNote} />
            ))}
          </div>
        </TransformComponent>
      </TransformWrapper>
    </div>
  );
};

export default StickyNotes;
