"use client";

import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  useReactTable,
} from "@tanstack/react-table";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { ArrowUpCircleIcon, PencilIcon, Trash2Icon } from "lucide-react";
import { FileType } from "@/typings";
import { Button } from "../ui/button";
import { useAppStore } from "@/store/store";
import { useShallow } from "zustand/react/shallow";

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[];
  data: TData[];
}

export function DataTable<TData, TValue>({
  columns,
  data,
}: DataTableProps<TData, TValue>) {
  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
  });

  const [setFileId, setFileName, setIsDeleteModelOpen, setIsRenameModelOpen] =
    useAppStore(
      useShallow((state) => [
        state.setFileId,
        state.setFileName,
        state.setIsDeleteModelOpen,
        state.setIsRenameModelOpen,
      ])
    );

  const openDeleteModel = (id: string) => {
    setFileId(id);
    setIsDeleteModelOpen(true);
  };

  const openRenameModel = (id: string, filename: string) => {
    setFileId(id);
    setFileName(filename);
    setIsRenameModelOpen(true);
  };

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          {table.getHeaderGroups().map((headerGroup) => (
            <TableRow key={headerGroup.id}>
              {headerGroup.headers.map((header) => {
                return (
                  <TableHead key={header.id}>
                    {header.isPlaceholder
                      ? null
                      : flexRender(
                          header.column.columnDef.header,
                          header.getContext()
                        )}
                  </TableHead>
                );
              })}
              <TableHead key={headerGroup.id}></TableHead>
            </TableRow>
          ))}
        </TableHeader>
        <TableBody>
          {table.getRowModel().rows?.length ? (
            table.getRowModel().rows.map((row) => (
              <TableRow
                key={row.id}
                data-state={row.getIsSelected() && "selected"}
              >
                {row.getVisibleCells().map((cell) => (
                  <TableCell key={cell.id}>
                    {cell.column.id === "fileName" ? (
                      <p
                        onClick={() =>
                          openRenameModel(
                            (row.original as FileType).id,
                            (row.original as FileType).fileName
                          )
                        }
                        className="underline decoration-transparent hover:decoration-blue-500 flex items-center hover:text-blue-500 hover:cursor-pointer transition-all"
                      >
                        {cell.getValue() as string}{" "}
                        <PencilIcon size={15} className="ml-2" />
                      </p>
                    ) : (
                      flexRender(cell.column.columnDef.cell, cell.getContext())
                    )}
                  </TableCell>
                ))}

                <TableCell key={(row.original as FileType).id}>
                  <Button
                    variant={"outline"}
                    onClick={() =>
                      openDeleteModel((row.original as FileType).id)
                    }
                  >
                    <Trash2Icon size={20} />
                  </Button>
                </TableCell>
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell
                colSpan={columns.length + 1}
                className="h-24 text-center"
              >
                <div className="flex justify-center gap-3 items-center">
                  You don&apos;t have any Files, Start Uploading files Here{" "}
                  <ArrowUpCircleIcon />
                </div>
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
}
