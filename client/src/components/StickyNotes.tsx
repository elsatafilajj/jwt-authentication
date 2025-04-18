import React from "react";
import { useRef, useState } from "react";
import { useDrop } from "react-dnd";
import { TransformWrapper, TransformComponent } from "react-zoom-pan-pinch";
import DraggableNote from "./DraggableNote";
import Sidebar from "./Sidebar";

import {
  createNote,
  deleteNote,
  fetchNotes,
  Note,
  updateNote,
} from "../api/apiNotes";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-toastify";

const StickyNotes = () => {
  const queryClient = useQueryClient();
  const dropRef = useRef<HTMLDivElement>(null);
  const [notes, setNotes] = useState<Note[]>([]);

  const { data: userNotes } = useQuery({
    queryKey: ["notes"],
    queryFn: fetchNotes,
  });

  const { mutateAsync } = useMutation({
    mutationFn: createNote,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["notes"] });
      toast.success("You created a note! 🎉");
    },
    onError: (error) => {
      console.error(error);
      toast.error("Something went wrong!");
    },
  });

  const { mutate: editNote } = useMutation({
    mutationFn: ({
      id,
      updatedNote,
    }: {
      id: string;
      updatedNote: Partial<Note>;
    }) => updateNote(id, updatedNote),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["notes"] });
      toast.success("Note is updated! 🎉");
    },
  });

  const { mutate: removeNote } = useMutation({
    mutationFn: (id: string) => deleteNote(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["notes"] });
      toast.success("Note is deleted");
    },
  });

  const moveNote = (id: string, newX: number, newY: number) => {
    setNotes((prev) =>
      prev.map((note) =>
        note.id === id ? { ...note, position: { x: newX, y: newY } } : note
      )
    );

    const updatedNote = userNotes?.find((note: Note) => note.id === id);
    if (updatedNote) {
      editNote({
        id: updatedNote.id,
        updatedNote: {
          position: { x: newX, y: newY },
          content: updatedNote.content || "",
        },
      });
    }
  };

  const [, drop] = useDrop({
    accept: "NOTE",
    drop: (item: Note, monitor) => {
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
        id: "",
        position: { x, y },
        title: "Untitled",
        content: "New Note",
      };
      mutateAsync(newNote as Note);
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
              {userNotes?.map((note: Note) => (
                <DraggableNote
                  key={note.id}
                  note={{
                    id: note.id,
                    position: note.position ?? { x: 0, y: 0 },
                    content: note.content,
                  }}
                  moveNote={moveNote}
                  updateNoteText={(id, updatedNote) =>
                    editNote({
                      id,
                      updatedNote: {
                        ...updatedNote,
                        position: note.position,
                      },
                    })
                  }
                  deleteNote={removeNote}
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
