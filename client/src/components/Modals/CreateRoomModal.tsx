import React from "react";
import { Form, Formik } from "formik";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "../ui/sheet";
import { Input } from "../../components/ui/input";

import { ToggleGroup, ToggleGroupItem } from "../../components/ui/toggle-group";
import { Button } from "../ui/button";
import { Label } from "../../components/ui/label";
import { useMutation } from "@tanstack/react-query";
import { createRoom } from "../../api/apiRooms";
import { toast } from "react-toastify";
import { useAuth } from "../../store/auth-context";

const CreateRoomModal = () => {
  const { user } = useAuth();

  const { mutateAsync } = useMutation({
    mutationFn: createRoom,
    onSuccess: () => {
      toast.success("Room is Created 🎉!");
    },
  });

  return (
    <Sheet>
      <SheetTrigger className="px-6 py-2 bg-green-600 text-white font-semibold rounded-md hover:bg-green-700 transition">
        Create a Room
      </SheetTrigger>

      <SheetContent className="space-y-6 p-6">
        <SheetHeader className="space-y-2">
          <SheetTitle className="text-2xl font-bold text-gray-700">
            Create Your Room
          </SheetTitle>
          <SheetDescription className="text-gray-600">
            Customize your room and start collaborating!
          </SheetDescription>
        </SheetHeader>

        <Formik
          initialValues={{
            name: "",
            description: "",
            visibility: "public",
            password: "",
          }}
          onSubmit={(values, { resetForm }) => {
            mutateAsync({ host: user.email, ...values });
            resetForm();
            console.log(values);
          }}
        >
          <Form className="space-y-4 md:space-y-6">
            <div className="flex flex-col gap-1">
              <Input
                type="text"
                name="name"
                placeholder="e.g. Room Sync"
                label="Room Name"
              />
            </div>

            <div className="flex flex-col gap-1">
              <Input
                isTextArea={true}
                id="description"
                name="description"
                label="description"
                placeholder="Brief description of the room..."
                rows={3}
              />
            </div>

            <div className="flex flex-col gap-1">
              <Label className="text-sm font-medium text-gray-700">
                Visibility
              </Label>
              <ToggleGroup type="single" className="mt-1 gap-2">
                <ToggleGroupItem value="public">Public</ToggleGroupItem>
                <ToggleGroupItem value="private">Private</ToggleGroupItem>
              </ToggleGroup>
            </div>

            <div className="flex flex-col gap-1">
              <Input
                name="password"
                type="password"
                placeholder="Leave blank if public"
                label="Room Password"
              />
            </div>

            <Button
              type="submit"
              className="w-full mt-4 bg-green-600 hover:bg-green-700 transition"
            >
              Create Room
            </Button>
          </Form>
        </Formik>
      </SheetContent>
    </Sheet>
  );
};

export default CreateRoomModal;
