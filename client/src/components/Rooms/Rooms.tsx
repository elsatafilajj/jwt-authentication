import React from "react";
import CreateRoomModal from "../Modals/CreateRoomModal";
import { useQuery } from "@tanstack/react-query";
import { fetchRoomsByUserId } from "../../api/apiRooms";

const Rooms = () => {
  const { data, isLoading, isError, error } = useQuery({
    queryKey: ["rooms"],
    queryFn: fetchRoomsByUserId,
  });

  if (isLoading) return <p>Loading rooms...</p>;
  if (isError) return <p>Error: {(error as Error).message}</p>;

  return (
    <div className="max-w-3xl mx-auto mt-10 p-6 bg-green-100 rounded-2xl shadow-lg">
      <h1 className="text-2xl font-semibold text-green-800 mb-4">
        Join a Room
      </h1>
      <CreateRoomModal />
      <div>
        <ul>
          {data?.map((room) => (
            <li key={room.id}>{room.name}</li>
          ))}
        </ul>
      </div>
    </div>
  );
};
export default Rooms;
