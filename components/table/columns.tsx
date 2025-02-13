"use client";

import { FileType } from "@/typings";
import { ColumnDef } from "@tanstack/react-table";
import { FileIcon, defaultStyles } from "react-file-icon";
import prettyBytes from "pretty-bytes";
import { COLOR_EXTENSION_MAP } from "@/constant";

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
      return (
        <a
          href={row.getValue("downloadUrl") as string}
          // download={row.getValue("fileName") as string}
          target="_blank"
          className="underline text-blue-500 hover:text-blue-600"
        >
          Download
        </a>
      );
    },
  },
];
