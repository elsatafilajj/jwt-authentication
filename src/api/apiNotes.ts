import axiosInstance from "./api";

export const fetchNotes = async () => {
  const token = localStorage.getItem("accessToken");
  const response = await axiosInstance.get("/notes", {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return response.data;
};

export type Position = {
  x: number;
  y: number;
};

export interface Note {
  content: string;
  position: Position;
}

export const createNote = async (newNote: Note) => {
  const response = await axiosInstance.post("/notes", {
    content: newNote.content,
    position: newNote.position,
  });
  return response.data;
};

export const updateNote = async ({
  id,
  newContent,
  x,
  y,
}: {
  id: string;
  newContent?: string;
  x?: number;
  y?: number;
}) => {
  const updatePayload: {
    content?: string;
    position?: { x: number; y: number };
  } = {};

  if (newContent !== undefined) updatePayload.content = newContent;
  if (x !== undefined && y !== undefined) updatePayload.position = { x, y };

  const response = await axiosInstance.put(`/notes/${id}`, updatePayload);
  return response.data;
};

export const deleteNote = async (id: string) => {
  const response = await axiosInstance.delete(`/notes/${id}`);
  return response.data;
};
