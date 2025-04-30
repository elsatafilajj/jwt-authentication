import React from "react";
import { useAuth } from "../../store/auth-context";

import { Formik, Form } from "formik";
import * as Yup from "yup";

import { Skeleton } from "../ui/skeleton";
import { Input } from "../ui/input";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "../ui/alert-dialog";
import { Button } from "../ui/button";

import {
  Card,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "../../components/ui/card";

import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "../../components/ui/tabs";

import { Link } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { useMutation } from "@tanstack/react-query";
import { deleteUser, editPassword, editUser } from "../../api/api";
import { toast } from "react-toastify";
import { queryClient } from "../../App";

const Profile = () => {
  const { user, isDataLoading, logout } = useAuth();

  const validationSchemaEdit = Yup.object({
    username: Yup.string()
      .min(2, "Too Short")
      .max(50, "Too Long!")
      .required("Username is required"),
    email: Yup.string()
      .email("Invalid email address")
      .required("Email is required"),
  });
  const validationSchemaPassword = Yup.object({
    oldPassword: Yup.string()
      .min(6, "Password must be at least 6 characters")
      .required("Password is required"),
    newPassword: Yup.string()
      .min(6, "Password must be at least 6 characters")
      .required("Password is required"),
    confirmNewPassword: Yup.string()
      .oneOf([Yup.ref("newPassword")], "Passwords must match")
      .required("Confirm Password is required"),
  });

  const { mutateAsync: handleDelete, isPending } = useMutation({
    mutationFn: deleteUser,
    onSuccess: () => {
      toast.success("Your account has been deleted.");
      logout();
    },
  });

  const { mutateAsync: handleEdit, isPending: isEditPending } = useMutation({
    mutationFn: editUser,
    onSuccess: () => {
      toast.success("Your account has been changed.");
      queryClient.invalidateQueries({ queryKey: ["user"] });
      queryClient.invalidateQueries({ queryKey: ["admin"] });
    },
  });

  const { mutateAsync: handleEditPassword, isPending: isEditPasswordPending } =
    useMutation({
      mutationFn: editPassword,
      onSuccess: () => {
        toast.success("Your password has been changed.");
        logout();
      },
    });

  return isDataLoading ? (
    <Skeleton />
  ) : (
    <div className="h-screen flex justify-center backdrop-brightness-45 bg-green-100/80 items-center">
      <Card className="relative max-w-lg w-full mx-auto p-15 px-10">
        <Link className="absolute top-4 left-4" to="/">
          <ArrowLeft className="text-[var(--secondary)] size-7" />
        </Link>
        <CardHeader>
          <div className="flex justify-between">
            <CardTitle className="flex gap-3 text-2xl items-center text-slate-800">
              Edit your Profile info
            </CardTitle>

            {/* first letter */}
            <div className="rounded-full p-7 py-5 bg-[var(--primary)]/50 text-3xl -mb-10 text-center text-[var(--secondary)]">
              {user.username[0].toUpperCase()}
            </div>
          </div>
          <CardDescription>
            <p>Username: {user.username}</p>
            <p>Email: {user.email}</p>
            <p>Role: {user.role}</p>
          </CardDescription>
        </CardHeader>
        <CardFooter>
          <Tabs defaultValue="edit" className="w-[400px]">
            <TabsList>
              <TabsTrigger value="edit">Edit your info</TabsTrigger>
              <TabsTrigger value="change-password">Change password</TabsTrigger>
              <TabsTrigger value="delete-account">
                Delete your account
              </TabsTrigger>
            </TabsList>

            {/* the actual content */}
            <TabsContent value="edit">
              <Formik
                initialValues={{
                  username: user.username,
                  email: user.email,
                }}
                validationSchema={validationSchemaEdit}
                onSubmit={async (values) => {
                  await handleEdit({
                    userId: user.userId,
                    newEmail: values.email.trim(),
                    newUsername: values.username.trim(),
                  });
                }}
              >
                <Form className="flex flex-col gap-3">
                  <Input
                    type="text"
                    name="username"
                    label="Your Username"
                    placeholder="Username"
                  />

                  <Input
                    type="text"
                    name="email"
                    label="Your email"
                    placeholder="name@company.com"
                  />

                  <Button
                    type="submit"
                    className="max-w-24 w-full text-white bg-green-600 hover:bg-green-700  focus:outline-none rounded-lg px-5 py-2.5 mt-2 text-center"
                    disabled={isEditPending}
                  >
                    Change
                  </Button>
                </Form>
              </Formik>
            </TabsContent>
            <TabsContent value="change-password">
              <Formik
                initialValues={{
                  oldPassword: "",
                  newPassword: "",
                  confirmNewPassword: "",
                }}
                validationSchema={validationSchemaPassword}
                onSubmit={async (values) => {
                  await handleEditPassword({
                    userId: user.userId,
                    oldPassword: values.oldPassword.trim(),
                    newPassword: values.newPassword.trim(),
                    confirmNewPassword: values.confirmNewPassword.trim(),
                  });
                }}
              >
                <Form className="flex flex-col gap-3">
                  {/* Old password */}
                  <Input
                    type="password"
                    name="oldPassword"
                    label="Old password"
                    placeholder="••••••••"
                  />
                  {/* Password */}
                  <Input
                    type="password"
                    name="newPassword"
                    label="New password"
                    placeholder="••••••••"
                  />
                  {/* Confirm Password */}
                  <Input
                    type="password"
                    name="confirmNewPassword"
                    label="Confirm new password"
                    placeholder="••••••••"
                  />
                  {/* Submit Button */}
                  <Button
                    type="submit"
                    className="max-w-24 w-full text-white bg-green-600 hover:bg-green-700 focus:ring-4 focus:outline-none focus:ring-green-300 font-medium rounded-lg text-sm px-5 py-2.5 mt-2 text-center"
                    disabled={isEditPasswordPending}
                  >
                    {isEditPasswordPending ? "Changing..." : "Change"}
                  </Button>
                </Form>
              </Formik>
            </TabsContent>
            <TabsContent value="delete-account" className="flex justify-center">
              <AlertDialog>
                <AlertDialogTrigger className="bg-green-600 hover:bg-green-700 p-2 px-3 mt-10 align-middle rounded-2xl text-white text-sm">
                  Delete your account forever
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>
                      Are you sure? This action cannot be undone.
                    </AlertDialogTitle>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel
                      className="text-green-700"
                      disabled={isPending}
                    >
                      Cancel
                    </AlertDialogCancel>
                    <AlertDialogAction
                      className="bg-green-600 hover:bg-green-700"
                      onClick={() => {
                        handleDelete(user.userId);
                      }}
                      disabled={isPending}
                    >
                      Yes, I'm sure
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            </TabsContent>
          </Tabs>
        </CardFooter>
      </Card>
    </div>
  );
};

export default Profile;
