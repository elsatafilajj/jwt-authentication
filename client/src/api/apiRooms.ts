import axiosInstance from "./api";

interface Room {
  // id: string;
  description: string;
  name: string;
  password: string;
  host: string;
  // participants: string[];
}

export const adminFetchRooms = async () => {
  const token = localStorage.getItem("token");
  const response = await axiosInstance.get("/rooms", {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  // console.log("admin", response.data);
  return response.data;
};

export const fetchRoomsByUserId = async () => {
  const token = localStorage.getItem("accessToken");
  try {
    const response = await axiosInstance.get("/my-rooms", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    console.log("rooms", response.data);
    return response.data;
  } catch (error) {
    if (error.response === 404) {
      return {};
    }
  }
};

export const createRoom = async (newRoom: Room) => {
  const response = await axiosInstance.post("/rooms", {
    // id: newRoom.id,
    name: newRoom.name,
    description: newRoom.description,
    password: newRoom.password,
    host: newRoom.host,
    // participants: newRoom.participants,
  });
  return response.data;
};

export const joinRoom = async (userId: string) => {
  const token = localStorage.getItem("token");
  const response = await axiosInstance.post(`/rooms/{${userId}}/join`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return response.data;
};

export const deleteRoom = async (roomId: string) => {
  const token = localStorage.getItem("accessToken");
  const response = await axiosInstance.delete(`/rooms/{${roomId}}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return response.data;
};
