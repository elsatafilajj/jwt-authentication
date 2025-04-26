import React, { useState } from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "../../components/ui/dropdown-menu";
import { BsThreeDots } from "react-icons/bs";
import DeleteRoomModal from "./DeleteRoomModal";
import EditRoomModal from "./EditRoomModal";

const RoomDropDownMenu = ({ data }) => {
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger className="bg-[#d7ffdc] p-2 rounded-full">
          <BsThreeDots className="text-xl text-[#44aa51]" />
        </DropdownMenuTrigger>
        <DropdownMenuContent>
          <DropdownMenuItem onClick={() => setShowEditModal(true)}>
            Edit
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem onClick={() => setShowDeleteModal(true)}>
            Delete
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      {showEditModal && (
        <EditRoomModal
          data={data}
          open={showEditModal}
          onOpenChange={setShowEditModal}
        />
      )}

      {showDeleteModal && (
        <DeleteRoomModal
          data={data}
          open={showDeleteModal}
          onOpenChange={setShowDeleteModal}
        />
      )}
    </>
  );
};

export default RoomDropDownMenu;
