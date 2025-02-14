"use client";
import { db, storage } from "@/firebase";
import { cn } from "@/lib/utils";
import { useUser } from "@clerk/nextjs";
import {
  addDoc,
  collection,
  doc,
  serverTimestamp,
  updateDoc,
} from "firebase/firestore";
import {
  getDownloadURL,
  ref,
  uploadBytesResumable,
  UploadTask,
} from "firebase/storage";
import { useState } from "react";
import ReactDropzone from "react-dropzone";
import toast from "react-hot-toast";

const Dropzone = () => {
  const maxSize = 20 * 1024 * 1024;
  const [uploads, setUploads] = useState<
    {
      id: string;
      name: string;
      progress: number;
      loading: boolean;
      uploadTask?: UploadTask;
    }[]
  >([]);
  const { user } = useUser();

  const uploadFile = async (selectedFile: File) => {
    if (!user) return;

    const docRef = await addDoc(collection(db, `users/${user.id}/files`), {
      userId: user.id,
      fileName: selectedFile.name,
      fullName: user.fullName,
      profileImg: user.imageUrl,
      timestamp: serverTimestamp(),
      type: selectedFile.type,
      size: selectedFile.size,
    });

    const uploadId = docRef.id;
    const uploadTask = uploadBytesResumable(
      ref(storage, `users/${user.id}/files/${uploadId}`),
      selectedFile
    );

    setUploads((prev) => [
      ...prev,
      {
        id: uploadId,
        name: selectedFile.name,
        progress: 0,
        loading: true,
        uploadTask,
      },
    ]);

    uploadTask.on(
      "state_changed",
      (snapshot) => {
        const progress =
          (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        setUploads((prev) =>
          prev.map((upload) =>
            upload.id === uploadId ? { ...upload, progress } : upload
          )
        );
      },
      () => {
        toast.error("Upload failed!");
        setUploads((prev) => prev.filter((upload) => upload.id !== uploadId));
      },
      async () => {
        const downloadUrl = await getDownloadURL(uploadTask.snapshot.ref);
        await updateDoc(doc(db, "users", user.id, "files", docRef.id), {
          downloadUrl,
        });
        setUploads((prev) =>
          prev.map((upload) =>
            upload.id === uploadId ? { ...upload, loading: false } : upload
          )
        );
        toast.success("File uploaded successfully!");
      }
    );
  };

  const cancelUpload = (uploadId: string) => {
    setUploads((prev) => {
      const upload = prev.find((u) => u.id === uploadId);
      if (upload?.uploadTask) {
        upload.uploadTask.cancel();
      }
      return prev.filter((u) => u.id !== uploadId);
    });
    toast("Upload cancelled");
  };

  const onDrop = (acceptedFiles: File[]) => {
    acceptedFiles.forEach((file) => {
      uploadFile(file);
    });
  };

  return (
    <section className="m-4">
      <ReactDropzone minSize={0} maxSize={maxSize} onDrop={onDrop}>
        {({
          getRootProps,
          getInputProps,
          isDragActive,
          isDragReject,
          fileRejections,
        }) => {
          const isFileTooLarge =
            fileRejections.length > 0 && fileRejections[0].file.size > maxSize;
          return (
            <div>
              <div
                {...getRootProps()}
                className={cn(
                  "w-full h-52 flex justify-center items-center p-5 border border-dashed rounded-lg text-center transition-colors",
                  isDragActive ? "border-blue-500" : "border-gray-300"
                )}
              >
                <input {...getInputProps()} />
                {!isDragActive && "Click here or drop a file to upload!"}
                {isDragActive && !isDragReject && "Drop it like it's hot!"}
                {isDragReject &&
                  !isFileTooLarge &&
                  "File type not accepted, sorry!"}
                {isFileTooLarge && (
                  <div className="text-danger mt-2">File is too large.</div>
                )}
              </div>
              {uploads.length != 0 && (
                <div className="fixed bottom-4 border right-4 w-64 p-3 rounded-lg shadow-lg space-y-2">
                  {uploads.map(({ id, name, progress, loading }) => (
                    <div key={id} className="p-2 rounded-lg border-b">
                      <div className="flex justify-between items-center mb-1">
                        <span
                          className="font-medium truncate w-40"
                          title={name}
                        >
                          {name}
                        </span>
                        {loading ? (
                          <span className="text-sm text-gray-500">
                            Uploading...
                          </span>
                        ) : (
                          <span className="text-sm text-green-500">
                            Completed
                          </span>
                        )}
                      </div>
                      <div className="w-full rounded-full h-2.5 bg-gray-300 dark:bg-gray-500">
                        <div
                          className="bg-blue-600 h-2.5 rounded-full transition-all"
                          style={{ width: `${progress}%` }}
                        ></div>
                      </div>
                      {loading && (
                        <button
                          onClick={() => cancelUpload(id)}
                          className="mt-2 text-xs text-red-500 hover:text-red-700"
                        >
                          Cancel Upload
                        </button>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          );
        }}
      </ReactDropzone>
    </section>
  );
};

export default Dropzone;
