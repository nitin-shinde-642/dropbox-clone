"use client";

import { FileType } from "@/typings";
import { Button } from "../ui/button";
import { DataTable } from "./Table";
import { columns } from "./columns";
import { useUser } from "@clerk/nextjs";
import { useEffect, useState } from "react";
import { useCollection } from "react-firebase-hooks/firestore";
import { collection, orderBy, query } from "firebase/firestore";
import { db } from "@/firebase";
import { Skeleton } from "../ui/skeleton";

function TableWrapper() {
  const { user } = useUser();
  const [initialFiles, setInitialFiles] = useState<FileType[]>([]);
  const [sort, setSort] = useState<"asc" | "desc">("desc");

  const [docs] = useCollection(
    user &&
      query(
        collection(db, `users/${user.id}/files`),
        orderBy("timestamp", sort)
      )
  );

  useEffect(() => {
    if (!docs) return;

    const files: FileType[] = docs.docs.map((doc) => ({
      id: doc.id,
      fullName: doc.data().fullName,
      fileName: doc.data().fileName || doc.id,
      timestamp: new Date(doc.data().timestamp?.seconds * 1000) || undefined,
      profileImg: doc.data().profileImg,
      downloadUrl: doc.data().downloadUrl,
      size: doc.data().size,
      type: doc.data().type,
    }));

    setInitialFiles(files);
  }, [docs]);

  if (docs?.docs.length === undefined)
    return (
      <div>
        <div className="flex justify-between items-center mb-5">
          <h2 className="font-bold">All Files</h2>
          <Button
            variant={"outline"}
            onClick={() => setSort("asc" === sort ? "desc" : "asc")}
          >
            <Skeleton className="w-[109px] h-4" />
          </Button>
        </div>
        <div className="border rounded-lg">
          <div className="border-b h-12" />
          {[...Array(3)].map((_, i) => (
            <div key={i} className="flex items-center space-x-4 p-3 w-full">
              <Skeleton className="w-12 h-8" />
              <Skeleton className="w-full h-8" />
            </div>
          ))}
        </div>
      </div>
    );

  return (
    <div>
      <div className="flex justify-between items-center mb-5">
        <h2 className="font-bold">All Files</h2>
        <Button
          variant={"outline"}
          onClick={() => setSort("asc" === sort ? "desc" : "asc")}
        >
          Sort by: {sort === "desc" ? "Newest" : "Oldest"}
        </Button>
      </div>
      <DataTable columns={columns} data={initialFiles} />
    </div>
  );
}
export default TableWrapper;
