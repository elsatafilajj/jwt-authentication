import React, { useEffect } from "react";
import { useRef } from "react";
import { useDrop } from "react-dnd";
import { TransformWrapper, TransformComponent } from "react-zoom-pan-pinch";
import DraggableNote from "./DraggableNote";
import Sidebar from "../Layout/Sidebar";
import { useSocket } from "../../store/socket-context";

import {
  createNote,
  deleteNote,
  fetchNotes,
  Note,
  updateNote,
} from "../../api/apiNotes";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-toastify";
import { useAuth } from "../../store/auth-context";
import { SocketEvents } from "../../types/socketEvents";
import { useParams } from "react-router-dom";

const StickyNotes = () => {
  const currentRoomId = useParams();
  const roomId = currentRoomId.roomId || "defaultRoomId";
  const queryClient = useQueryClient();
  const dropRef = useRef<HTMLDivElement>(null);
  const socket = useSocket();
  const { user, isPending } = useAuth();

  const { data: userNotes, isLoading } = useQuery({
    queryKey: ["notes", roomId],
    queryFn: () => fetchNotes(roomId),
  });

  const { mutateAsync } = useMutation({
    mutationFn: (newNote: {
      content: string;
      position: { x: number; y: number };
      roomId: string;
    }) => createNote(newNote),
    onSuccess: (data) => {
      queryClient.invalidateQueries({
        queryKey: ["notes", roomId],
      });
      toast.success("You created a note! 🎉");
      socket?.emit(SocketEvents.NoteCreated, data);
    },
    onError: (error) => {
      console.error(error);
      toast.error("Something went wrong!");
    },
  });

  const { mutate: editNote } = useMutation({
    mutationFn: ({
      roomId,
      id,
      updatedNote,
    }: {
      roomId: string;
      id: string;
      updatedNote: Partial<Note>;
    }) => updateNote(roomId, id, updatedNote),

    onSuccess: (variables) => {
      queryClient.invalidateQueries({
        queryKey: ["notes", roomId],
      });
      toast.success("Note updated! 🎉");
      socket?.emit(SocketEvents.NoteUpdated, variables);
    },
  });

  const { mutate: removeNote } = useMutation({
    mutationFn: ({ roomId, id }: { roomId: string; id: string }) =>
      deleteNote(roomId, id),
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({
        queryKey: ["notes", roomId],
      });
      toast.success("Note deleted!");
      socket?.emit(SocketEvents.NoteDeleted, id);
    },
  });

  const moveNote = (id: string, newX: number, newY: number) => {
    const updatedNote = userNotes?.find((note: Note) => note.id === id);
    if (updatedNote) {
      editNote({
        roomId: roomId,
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
        // id: "",
        position: { x, y },
        // title: "Untitled",
        content: "",
        roomId: roomId,
        userId: user.email,
      };

      mutateAsync(newNote as Note);
      socket?.emit("new-note", newNote);
    },
  });

  drag(dropRef);

  useEffect(() => {
    if (!socket) return;

    socket.on(SocketEvents.NoteCreated, (newNote) => {
      if (newNote.roomId === roomId) {
        queryClient.setQueryData(["notes", roomId], (old: []) => {
          if (!old) return [newNote];
          return [...old, newNote];
        });
      }
    });

    socket.on(SocketEvents.NoteUpdated, (updatedNote) => {
      if (updatedNote.roomId === roomId) {
        queryClient.invalidateQueries({ queryKey: ["notes", roomId] });
      }
    });

    socket.on(SocketEvents.NoteDeleted, (noteId) => {
      queryClient.invalidateQueries({ queryKey: ["notes", roomId] });
      console.log(noteId);
    });

    socket.on(SocketEvents.NoteMoved, (updatedNote) => {
      if (updatedNote.roomId === roomId) {
        queryClient.invalidateQueries({ queryKey: ["notes", roomId] });
      }
    });

    return () => {
      socket.off(SocketEvents.NoteCreated);
      socket.off(SocketEvents.NoteUpdated);
      socket.off(SocketEvents.NoteDeleted);
      socket.off(SocketEvents.NoteMoved);
    };
  }, [socket, queryClient, roomId]);

  let isNoteEnabled;

  if (user && !isPending) {
    isNoteEnabled = user.email;
  }
  return (
    <div className="flex flex-col h-screen">
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
                          roomId: roomId,
                          id,
                          updatedNote,
                        })
                      }
                      deleteNote={({ roomId, id }) =>
                        removeNote({ roomId, id })
                      }
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
