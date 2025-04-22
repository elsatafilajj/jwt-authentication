import { useEffect, useRef, useState } from "react";
import { useDrop } from "react-dnd";
import { TransformWrapper, TransformComponent } from "react-zoom-pan-pinch";
import DraggableNote from "./DraggableNote";
import Sidebar from "./Sidebar";
import { useMutation, useQuery } from "@tanstack/react-query";
import { toast } from "react-toastify";

import {
  createNote,
  fetchNotes,
  updateNote,
  deleteNote as deleteNoteApi,
} from "../api/apiNotes";

type Note = {
  id: string;
  position: { x: number; y: number };
  content: string;
};

type DragItem = {
  type: "NOTE" | "NEW_NOTE";
  id: string;
  position?: { x: number; y: number };
  content?: string;
};

const StickyNotes = () => {
  const dropRef = useRef<HTMLDivElement>(null);
  const hasInitialized = useRef(false);

  const { data: fetchedNotes, isPending } = useQuery({
    queryKey: ["notes"],
    queryFn: fetchNotes,
    // refetchOnWindowFocus: false,
  });

  const [notes, setNotes] = useState<Note[]>([]);

  useEffect(() => {
    if (!hasInitialized.current && !isPending && fetchedNotes?.length) {
      setNotes(fetchedNotes);
      // hasInitialized.current = true;
    }
  }, [fetchedNotes, isPending]);

  const { mutateAsync: createAsync } = useMutation({
    mutationFn: createNote,
    onSuccess: () => toast.success("You created a note!"),
  });

  const { mutateAsync: updateAsync } = useMutation({
    mutationFn: updateNote,
  });

  const { mutateAsync: deleteAsync } = useMutation({
    mutationFn: deleteNoteApi,
    onSuccess: () => toast.success("You deleted a note!"),
  });

  const moveNote = ({
    id,
    newX,
    newY,
  }: {
    id: string;
    newX: number;
    newY: number;
  }) => {
    setNotes((prev) =>
      prev.map((n) =>
        n.id === id ? { ...n, position: { x: newX, y: newY } } : n
      )
    );
    updateAsync({ id, x: newX, y: newY });
  };

  const updateNoteText = ({
    id,
    newContent,
  }: {
    id: string;
    newContent: string;
  }) => {
    setNotes((prev) =>
      prev.map((n) => (n.id === id ? { ...n, content: newContent } : n))
    );
    updateAsync({ id, newContent });
  };

  const deleteNote = (id: string) => {
    setNotes((prev) => prev.filter((n) => n.id !== id));
    deleteAsync(id);
  };

  const [{ isOver }, drop] = useDrop<DragItem, void, { isOver: boolean }>({
    accept: ["NOTE", "NEW_NOTE"],
    drop: (item, monitor) => {
      const offset = monitor.getClientOffset();
      const dropArea = dropRef.current?.getBoundingClientRect();
      if (!offset || !dropArea) return;

      const x = offset.x - dropArea.left;
      const y = offset.y - dropArea.top;

      if (item.type === "NOTE") {
        moveNote({ id: item.id, newX: x, newY: y });
      } else if (item.type === "NEW_NOTE") {
        createAsync(
          { position: { x, y }, content: "" },
          {
            onSuccess: (createdNote) => {
              setNotes((prev) => [
                ...prev,
                {
                  id: createdNote.id,
                  position: { x, y },
                  content: createdNote.content,
                },
              ]);
            },
          }
        );
      }
    },
    collect: (monitor) => ({
      isOver: monitor.isOver(),
    }),
  });

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
              ref={(node) => {
                drop(node);
                dropRef.current = node!;
              }}
              className={`relative bg-green-50 w-[5000px] h-[5000px] pt-16 ${
                isOver ? "ring-4 ring-green-300" : ""
              }`}
              id="canvas-area"
              onDragOver={(e) => e.preventDefault()}
              onDrop={(e) => e.preventDefault()}
            >
              {notes.map((note) => (
                <DraggableNote
                  key={note.id}
                  note={{
                    id: note.id,
                    position: note.position ?? { x: 700, y: 0 },
                    content: note.content,
                  }}
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
