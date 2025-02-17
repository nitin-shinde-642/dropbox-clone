"use client";

import { FileType } from "@/typings";
import { ColumnDef } from "@tanstack/react-table";
import { FileIcon, defaultStyles } from "react-file-icon";
import prettyBytes from "pretty-bytes";
import { COLOR_EXTENSION_MAP } from "@/constant";
import { getDownloadURL, ref } from "firebase/storage";
import { storage } from "@/firebase";

export const columns: ColumnDef<FileType>[] = [
  {
    accessorKey: "type",
    header: "Type",
    cell: ({ row }) => {
      const filename = row.getValue("fileName") as string;
      const extension = filename.split(".").at(-1);
      return (
        <div className="w-10">
          <FileIcon
            extension={extension}
            labelColor={COLOR_EXTENSION_MAP[extension!]}
            {...defaultStyles[extension as keyof typeof defaultStyles]}
          />
        </div>
      );
    },
  },
  {
    accessorKey: "fileName",
    header: "FileName",
  },
  {
    accessorKey: "timestamp",
    header: "Date Added",
    cell: ({ renderValue }) => {
      return (
        <div className="flex flex-col">
          <div className="text-sm">
            {(renderValue() as Date).toLocaleDateString()}
          </div>
          <div className="text-xs">
            {(renderValue() as Date).toLocaleTimeString()}
          </div>
        </div>
      );
    },
  },
  {
    accessorKey: "size",
    header: "Size",
    cell: ({ renderValue }) => {
      return <span>{prettyBytes(renderValue() as number)}</span>;
    },
  },
  {
    accessorKey: "downloadUrl",
    header: "Link",
    cell: ({ row }) => {
      const handleDownload = async () => {
        try {
          const rowId = row.getValue("id") as string; // Assuming row ID is the filename
          const customFileName = row.getValue("fileName") as string;

          const fileRef = ref(storage, rowId);
          const fileUrl = await getDownloadURL(fileRef);

          // Create an anchor element to trigger download
          const link = document.createElement("a");
          link.href = fileUrl;
          link.download = customFileName; // Set custom file name
          document.body.appendChild(link);
          link.click();
          document.body.removeChild(link);
        } catch (error) {
          console.error("Error downloading file:", error);
        }
      };

      return (
        <button
          onClick={handleDownload}
          className="text-blue-500 underline hover:text-blue-600"
        >
          Download
        </button>
      );
    },
  },
];
