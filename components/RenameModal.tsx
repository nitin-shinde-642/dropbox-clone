"use client";

import { useAppStore } from "@/store/store";
import { useUser } from "@clerk/nextjs";
import { useState } from "react";
import { useShallow } from "zustand/react/shallow";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "./ui/dialog";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Loader2Icon } from "lucide-react";
import { doc, updateDoc } from "firebase/firestore";
import { db } from "@/firebase";
import toast from "react-hot-toast";

function RenameModal() {
  const { user } = useUser();
  const [isPending, setIsPending] = useState(false);
  const [input, setInput] = useState("");
  const [fileId, fileName, isRenameModelOpen, setIsRenameModelOpen] =
    useAppStore(
      useShallow((state) => [
        state.fileId,
        state.fileName,
        state.isRenameModelOpen,
        state.setIsRenameModelOpen,
      ])
    );
  const renameFile = async () => {
    if (!user || !fileId || !fileName) return;
    setIsPending(true);
    await updateDoc(doc(db, `users/${user.id}/files/${fileId}`), {
      fileName: input,
    }).then(() => {
      setInput("");
      setIsRenameModelOpen(false);
      setIsPending(false);
      toast.success('File renamed successfully!')
    }).catch(()=>{
      toast.error('unable to rename file,something went wrong. Please try again later!')
    });
  };
  return (
    <Dialog
      open={isRenameModelOpen}
      onOpenChange={(isOpen) => {
        setIsRenameModelOpen(isOpen);
      }}
    >
      <DialogContent>
        <DialogHeader>
          <DialogTitle className="pb-5">Rename the File</DialogTitle>
          <Input
            id="link"
            defaultValue={fileName as string}
            onChange={(e) => setInput(e.target.value)}
            onKeyDownCapture={(e) => {
              if (e.key == "Enter") {
                renameFile();
              }
            }}
          />
          <div className="flex space-x-2 py-3">
            <Button
              size={"sm"}
              className="px-3 flex-1"
              variant={"ghost"}
              onClick={() => setIsRenameModelOpen(false)}
            >
              <span className="sr-only">Cancel</span>
              <span>Cancel</span>
            </Button>
            <Button
              type="submit"
              size={"sm"}
              className="px-3 flex-1"
              onClick={renameFile}
            >
              {!isPending ? (
                <>Rename</>
              ) : (
                <>
                  Renaming... <Loader2Icon className="animate-spin" />
                </>
              )}
            </Button>
          </div>
        </DialogHeader>
      </DialogContent>
    </Dialog>
  );
}
export default RenameModal;
