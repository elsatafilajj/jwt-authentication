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

  console.log("admin", response.data);
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
    if (error.response && error.response.status === 404) {
      console.warn("No rooms found for user.");
      return [];
    }

    throw error;
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

export const deleteRoomById = async (id: string) => {
  const token = localStorage.getItem("token");
  const response = await axiosInstance.delete(`/rooms/${id}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return response.data;
};

export const editRoomById = async (id: string, data: { name: string }) => {
  const token = localStorage.getItem("token");
  const response = await axiosInstance.patch(`/rooms/${id}`, data, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return response.data;
};

export const joinRoomById = async (roomId: string) => {
  const token = localStorage.getItem("accessToken");
  console.log("Token:", token);
  const response = await axiosInstance.patch(
    `/rooms/${roomId}`,
    {},

    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );
  console.log(response.data);
  return response.data;
};
