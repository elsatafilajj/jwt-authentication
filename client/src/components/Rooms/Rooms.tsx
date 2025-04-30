import React from "react";
import CreateRoomModal from "../Modals/CreateRoomModal";
import { useQuery } from "@tanstack/react-query";
import { adminFetchRooms } from "../../api/apiRooms";

const Rooms = () => {
  const { data, isLoading, isError, error } = useQuery({
    queryKey: ["rooms"],
    queryFn: adminFetchRooms,
  });

  if (isLoading) return <p>Loading rooms...</p>;
  if (isError) return <p>Error: {(error as Error).message}</p>;

  return (
    <div className="max-w-3xl w-md overflow-y-scroll max-h-60 mx-auto mt-10 p-6 bg-green-100 rounded-2xl shadow-lg space-y-4">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-semibold text-green-800">Join a Room</h1>
        <CreateRoomModal />
      </div>
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
