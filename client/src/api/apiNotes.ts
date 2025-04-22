import axiosInstance from "./api";

export type Position = {
  x: number;
  y: number;
};

export type Note = {
  id: string;
  title: string;
  content: string;
  position: Position;
};

export const fetchNotes = async () => {
  const token = localStorage.getItem("token");
  const response = await axiosInstance.get("/notes", {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  console.log(response);
  return response.data;
};

export const createNote = async (newNote: Note) => {
  const response = await axiosInstance.post("/notes", {
    title: newNote.title,
    content: newNote.content,
    position: newNote.position,
  });

  return response.data;
};

export const updateNote = async (id: string, updatedNote: Partial<Note>) => {
  const response = await axiosInstance.put(`/notes/${id}`, updatedNote);
  return response.data;
};

export const deleteNote = async (id: string) => {
  const response = await axiosInstance.delete(`/notes/${id}`);
  return response.data;
};
