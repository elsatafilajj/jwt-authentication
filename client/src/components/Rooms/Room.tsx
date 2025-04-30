import React from "react";
import { IoPerson } from "react-icons/io5";
import { GoArrowRight } from "react-icons/go";
import RoomDropDownMenu from "../Modals/RoomDropDownMenu";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { joinRoomById } from "../../api/apiRooms";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

const Room = ({ data }) => {
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  const { mutateAsync } = useMutation({
    mutationFn: (roomId: string) => joinRoomById(roomId),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["rooms"] });
      toast.success(`You Joined the Room with id: ${variables}`);
    },
    onError: (error) => {
      console.error(error);
      toast.error("Something went wrong!");
    },
  });

  const handleEnteredRoom = async (roomId: string) => {
    try {
      console.log("Joining room with ID:", roomId);
      // await mutateAsync(roomId);
      navigate(`/rooms/${roomId}`);
    } catch (error) {
      console.error("Error joining room:", error);
    }
  };

  return (
    <li className="bg-white m-4 rounded-2xl max-w-[500px] w-full h-[250px] shadow-md hover:shadow-lg transition-shadow p-6 flex flex-col justify-between tracking-wider leading-none">
      <div className="flex justify-between items-start">
        <p className="text-2xl font-medium text-gray-800 break-words max-w-[400px]">
          {data.name}
        </p>
        <RoomDropDownMenu data={data} />
      </div>

      <div className="flex flex-wrap justify-between items-center text-gray-500 mt-4">
        <div className="flex items-center gap-2">
          <IoPerson />
          <span>{data.host}</span>
        </div>
        <span>{new Date(data.createdAt).toLocaleDateString()}</span>
      </div>

      <div className="flex mt-4 space-x-[-10px]">
        {data.participants.slice(0, 5).map((participant, index) => (
          <div
            key={index}
            className="w-10 h-10 rounded-full border-2 border-white bg-gray-300 text-center text-xs font-semibold flex items-center justify-center text-white bg-gradient-to-br from-green-400 to-green-600"
          >
            {participant[0].toUpperCase()}
          </div>
        ))}
        {data.participants.length > 5 && (
          <div className="w-10 h-10 rounded-full border-2 border-white bg-gray-200 text-gray-700 flex items-center justify-center text-sm font-semibold">
            +{data.participants.length - 5}
          </div>
        )}
      </div>

      <div className="mt-5">
        <button
          className="w-full flex items-center justify-center gap-2 bg-[#5bf371] hover:bg-green-400 text-black font-semibold py-3 rounded-4xl transition-colors"
          onClick={() => handleEnteredRoom(data.id)}
        >
          Enter Room
          <GoArrowRight className="text-lg" />
        </button>
      </div>
    </li>
  );
};

export default Room;
