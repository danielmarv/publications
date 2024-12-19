import { ColumnDef } from "@tanstack/react-table";
import { format } from "date-fns";

export const columns: ColumnDef<any, any>[] = [
  {
    header: "File Name",
    accessorKey: "title", 
    cell: (info) => (
      <a href={info.row.original.url} target="_blank" rel="noopener noreferrer">
        {info.getValue()}
      </a>
    ),
  },
  {
    header: "File Type",
    accessorKey: "type",
    cell: (info) => info.getValue(),
  },
  {
    header: "Upload Date",
    accessorKey: "createdAt",
    cell: (info) => {
      const date = new Date(info.getValue());
      return format(date, "yyyy-MM-dd HH:mm");
    },
  },
  {
    header: "Favorites",
    accessorKey: "isFavorited",
    cell: (info) => (info.getValue() ? "⭐" : "☆"),
  },
  {
    header: "Actions",
    id: "actions",
    cell: (info) => (
      <div className="flex gap-2">
        <button
          className="bg-blue-500 text-white py-1 px-2 rounded"
          onClick={() => handleDownload(info.row.original)}>
          Download
        </button>
        <button
          className="bg-red-500 text-white py-1 px-2 rounded"
          onClick={() => handleDelete(info.row.original)}>
          Delete
        </button>
      </div>
    ),
  },
];

const handleDownload = (file) => {
  console.log("Downloading file:", file.title);
};

const handleDelete = (file) => {
  console.log("Deleting file:", file.title);
};
