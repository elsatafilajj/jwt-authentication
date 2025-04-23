import React, { useEffect } from "react";
import { useRef, useState } from "react";
import { useDrop } from "react-dnd";
import { TransformWrapper, TransformComponent } from "react-zoom-pan-pinch";
import DraggableNote from "./DraggableNote";
import Sidebar from "./Sidebar";
import { useSocket } from "../store/socket-context";

import {
  createNote,
  deleteNote,
  fetchNotes,
  Note,
  updateNote,
} from "../api/apiNotes";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-toastify";
import { useAuth } from "../store/auth-context";
import { SocketEvents } from "../types/socketEvents";

const StickyNotes = () => {
  const queryClient = useQueryClient();
  const dropRef = useRef<HTMLDivElement>(null);
  const [, setNotes] = useState<Note[]>([]);
  const socket = useSocket();
  const { user, isPending } = useAuth();

  const { data: userNotes, isLoading } = useQuery({
    queryKey: ["notes"],
    queryFn: fetchNotes,
  });

  const { mutateAsync } = useMutation({
    mutationFn: createNote,
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["notes"] });
      toast.success("You created a note! 🎉");

      socket?.emit("note-created", data);
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

    onSuccess: (variables) => {
      queryClient.invalidateQueries({ queryKey: ["notes"] });
      toast.success("Note updated! 🎉");
      socket?.emit("note-updated", variables);
    },
  });

  const { mutate: removeNote } = useMutation({
    mutationFn: (id: string) => deleteNote(id),
    onSuccess: (id) => {
      queryClient.invalidateQueries({ queryKey: ["notes"] });
      toast.success("Note deleted!");
      socket?.emit("note-deleted", id);
    },
  });

  const moveNote = (id: string, newX: number, newY: number) => {
    const updatedNote = userNotes?.find((note: Note) => note.id === id);
    if (updatedNote) {
      editNote({
        id: updatedNote.id,
        updatedNote: {
          position: { x: newX, y: newY },
          content: updatedNote.content || "",
        },
      });
      socket?.emit(SocketEvents.NoteMoved, updatedNote);
    }
  };

  const [, drop] = useDrop({
    accept: "NOTE",
    drop: (item: Note, monitor) => {
      const offset = monitor.getClientOffset();
      const boundingRect = dropRef.current?.getBoundingClientRect();

      if (!offset || !boundingRect) return;

      let state;

      const { scale, positionX, positionY } = state;

      const rawX = offset.x - boundingRect.left;
      const rawY = offset.y - boundingRect.top;

      const x = (rawX - positionX) / scale;
      const y = (rawY - positionY) / scale;

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
        content: "",
      };
      mutateAsync(newNote as Note);

      socket?.emit("new-note", newNote);
    },
  });

  drag(dropRef);

  useEffect(() => {
    if (!socket) return;

    socket.on("note-created", (newNote) => {
      queryClient.invalidateQueries({ queryKey: ["notes"] });
      queryClient.refetchQueries({ queryKey: ["notes"] });
      // toast.success("New note added by another user!");
      console.log(newNote);
    });

    socket.on("note-updated", (updatedNote) => {
      queryClient.invalidateQueries({ queryKey: ["notes"] });
      // toast.success("A note was updated by another user!");
      console.log(updatedNote);
    });

    socket.on("note-deleted", (noteId) => {
      queryClient.invalidateQueries({ queryKey: ["notes"] });
      // toast.success("A note was deleted by another user!");
      console.log(noteId);
    });

    socket.on("note-moved", (updatedNote) => {
      queryClient.invalidateQueries({ queryKey: ["notes"] });
      // toast.success("A note was moved by another user!");
      console.log(updatedNote);
    });

    return () => {
      socket.off("note-created");
      socket.off("note-updated");
      socket.off("note-deleted");
      socket.off("note-moved");
    };
  }, [socket, queryClient]);

  let isNoteEnabled;

  if (user && !isPending) {
    isNoteEnabled = user.email;
  }
  return (
    <div className="flex flex-col h-screen">
      <header className="bg-green-700 text-white p-4 text-center font-semibold ">
        Sticky Notes App
      </header>
      <div className="flex flex-1">
        <Sidebar />
        <TransformWrapper>
          {({ state }) => (
            <TransformComponent>
              <div
                ref={dropRef}
                id="canvas-area"
                className="relative bg-green-50 w-[50000px] h-[50000px] pt-16"
              >
                {userNotes &&
                  !isLoading &&
                  userNotes?.map((note: Note) => (
                    <DraggableNote
                      isLocked={note.userId !== isNoteEnabled}
                      key={note.id}
                      note={{
                        id: note.id,
                        position: note.position ?? { x: 0, y: 0 },
                        content: note.content,
                      }}
                      moveNote={isNoteEnabled && moveNote}
                      updateNoteText={(id, updatedNote) =>
                        editNote({
                          id,
                          updatedNote,
                        })
                      }
                      deleteNote={removeNote}
                    />
                  ))}
              </div>
            </TransformComponent>
          )}
        </TransformWrapper>
      </div>
    </div>
  );
};

export default StickyNotes;
