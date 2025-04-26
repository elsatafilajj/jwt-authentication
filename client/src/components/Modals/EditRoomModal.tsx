import React from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "../../components/ui/dialog";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { editRoomById } from "../../api/apiRooms";
import { toast } from "react-toastify";
import * as Yup from "yup";
import { Formik, Form } from "formik";
import { Field } from "formik";
import { Input } from "../ui/input";

const EditRoomModal = ({ data, open, onOpenChange }) => {
  const queryClient = useQueryClient();

  const { mutate: editRoom } = useMutation({
    mutationFn: ({ id, name }: { id: string; name: string }) =>
      editRoomById(id, { name }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["rooms"] });
      toast.success("The room is updated!");
      onOpenChange(false);
    },
  });

  const validationSchema = Yup.object({
    name: Yup.string().min(2, "Too Short").max(15, "Too Long"),
  });
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      {/* <DialogTrigger>Open</DialogTrigger> */}
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Edit Room</DialogTitle>
          <DialogDescription>
            Make changes to your Room here. Click save when you're done.
          </DialogDescription>

          <Formik
            initialValues={{
              name: data?.name || "",
            }}
            validationSchema={validationSchema}
            onSubmit={(values) => {
              editRoom({ id: data.id, name: values.name });
            }}
          >
            <Form className="space-y-4 md:space-y-6" action="#">
              <Field name="name">
                {({ field, meta }) => (
                  <div>
                    <Input {...field} placeholder="Change Room name" required />
                    {meta.touched && meta.error ? (
                      <div className="text-red-500 text-sm">{meta.error}</div>
                    ) : null}
                  </div>
                )}
              </Field>

              <button
                type="submit"
                className="w-full text-white bg-green-600 hover:bg-green-700 focus:ring-4 focus:outline-none focus:ring-green-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center"
              >
                Save
              </button>
            </Form>
          </Formik>
        </DialogHeader>
      </DialogContent>
    </Dialog>
  );
};

export default EditRoomModal;
