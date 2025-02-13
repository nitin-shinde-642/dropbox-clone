"use client";
import { useAppStore } from "@/store/store";
import { useShallow } from "zustand/react/shallow";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "./ui/dialog";
import { Button } from "./ui/button";
import { Loader2Icon, Trash2Icon } from "lucide-react";
import { useUser } from "@clerk/nextjs";
import { deleteObject, ref } from "firebase/storage";
import { db, storage } from "@/firebase";
import { deleteDoc, doc } from "firebase/firestore";
import { useState } from "react";
import toast from "react-hot-toast";

function DeleteModal() {
  const { user } = useUser();
  const [isPending, setIsPending] = useState(false);
  const [fileId,  isDeleteModelOpen, setIsDeleteModelOpen] =
    useAppStore(
      useShallow((state) => [
        state.fileId,
        state.isDeleteModelOpen,
        state.setIsDeleteModelOpen,
      ])
    );
  const deleteFile = async () => {
    if (!user || !fileId) return;
    setIsPending(true);

    const fileRef = ref(storage, `users/${user.id}/files/${fileId}`);
    try {
      deleteObject(fileRef)
        .then(async () => {
          deleteDoc(doc(db, `users/${user.id}/files/${fileId}`)).then(() => {
            toast.success("File Deleted Successfully!");
          });
        })
        .finally(() => {
          setIsDeleteModelOpen(false);
          setIsPending(false);
        });
    } catch (error) {
      console.log(error);
      toast.error(
        "Unable to delete file, something went wrong, please try again later!"
      );
    }
  };
  return (
    <Dialog
      open={isDeleteModelOpen}
      onOpenChange={(isOpen) => {
        setIsDeleteModelOpen(isOpen);
      }}
    >
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Are you absolutely sure you want to delete?</DialogTitle>
          <DialogDescription>
            This action cannot be undone. This will permanently delete your file
            from our servers.
          </DialogDescription>
        </DialogHeader>
        <div className="flex space-x-2 py-3">
          <Button
            size={"sm"}
            className="px-3 flex-1"
            variant={"ghost"}
            onClick={() => setIsDeleteModelOpen(false)}
          >
            <span className="sr-only">Cancel</span>
            <span>Cancel</span>
          </Button>
          <Button
            type="submit"
            variant={"destructive"}
            size={"sm"}
            className="px-3 flex-1"
            onClick={deleteFile}
          >
            {!isPending ? (
              <>
                Delete <Trash2Icon />
              </>
            ) : (
              <>
                Deleting... <Loader2Icon className="animate-spin" />
              </>
            )}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
export default DeleteModal;
