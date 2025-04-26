import React from "react";
import CreateRoomModal from "../Modals/CreateRoomModal";
import { useQuery } from "@tanstack/react-query";
import { fetchRoomsByUserId } from "../../api/apiRooms";
import Room from "./Room";

const Dashboard = () => {
  const { data, isLoading, isError, error } = useQuery({
    queryKey: ["rooms"],
    queryFn: fetchRoomsByUserId,
  });

  if (isLoading)
    return <p className="text-center text-gray-600">Loading rooms...</p>;
  if (isError)
    return (
      <p className="text-center text-red-600">
        Error: {(error as Error).message}
      </p>
    );

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-100 to-white px-8 py-12">
      <div className="max-w-7xl mx-auto">
        <header className="flex items-center justify-between mb-10">
          <h1 className="ml-5 text-3xl font-bold text-gray-800 tracking-tight">
            Join a Room
          </h1>
          <CreateRoomModal />
        </header>

        {data.length === 0 ? (
          <p>You haven't created any rooms yet.</p>
        ) : (
          <ul className="w-full grid gap-6 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {data?.map((room) => (
              <Room key={room.id} data={room} />
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
