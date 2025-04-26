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
import * as Yup from "yup";
import { Input } from "../../components/ui/input";

import { ToggleGroup, ToggleGroupItem } from "../../components/ui/toggle-group";
import { Button } from "../ui/button";
import { Label } from "../../components/ui/label";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createRoom } from "../../api/apiRooms";
import { toast } from "react-toastify";
import { useAuth } from "../../store/auth-context";

const CreateRoomModal = () => {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  const { mutateAsync } = useMutation({
    mutationFn: createRoom,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["rooms"] });
      toast.success("Room is Created 🎉!");
    },
  });

  const validationSchema = Yup.object({
    name: Yup.string()
      .min(2, "Too Short")
      .max(50, "Too Long!")
      .required("Name is required"),
    description: Yup.string().min(5, "Too Short").max(100, "Too Long!"),
    visibility: Yup.string().required("Visibility is required"),
    password: Yup.string()
      .min(6, "Password must be at least 6 characters")
      .required("Password is required"),
  });

  return (
    <Sheet>
      <SheetTrigger className="flex items-center gap-2 px-4 py-2 bg-gradient-to-br from-green-300 to-green-500 hover:from-green-400 hover:to-green-600 text-black font-medium rounded-xl shadow-md transition-all duration-200">
        <img src="/plus-line-icon.svg" alt="Add" className="w-4 h-4" />
        <span>Add Room</span>
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
          validationSchema={validationSchema}
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
