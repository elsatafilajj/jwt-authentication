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
  userId?: string;
  roomId: string;
};

export const fetchNotes = async (roomId: string) => {
  const token = localStorage.getItem("accessToken");
  const response = await axiosInstance.get(`/notes?roomId=${roomId}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  console.log("fetch", response.data);
  return response.data;
};

export const createNote = async (newNote: {
  content: string;
  position: { x: number; y: number };
  roomId: string;
}) => {
  const response = await axiosInstance.post("/notes", {
    // title: newNote.title,
    content: newNote.content,
    position: newNote.position,
    roomId: newNote.roomId,
  });

  return response.data;
};

export const updateNote = async (
  roomId: string,
  id: string,
  updatedNote: Partial<Note>
) => {
  const response = await axiosInstance.put(
    `/notes/${roomId}/${id}`,
    updatedNote
  );
  return response.data;
};

export const deleteNote = async (roomId: string, id: string) => {
  const response = await axiosInstance.delete(`/notes/${roomId}/${id}`);
  return response.data;
};
