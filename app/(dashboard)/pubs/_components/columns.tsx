import { ColumnDef } from "@tanstack/react-table";
import { format } from "date-fns";

// Define the columns for the table
export const columns: ColumnDef<any, any>[] = [
  {
    header: "File Name",
    accessorKey: "title", 
    cell: (info) => info.getValue(),
  },
  {
    header: "Owner",
    accessorKey: "owner",
    cell: (info) => info.getValue(),
  },
  {
    header: "Description",
    accessorKey: "description",
    cell: (info) => info.getValue(),
  },
  {
    header: "Upload Date",
    accessorKey: "Created",
    cell: (info) => {
      const date = new Date(info.getValue());
      return format(date, "yyyy-MM-dd HH:mm");
    },
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

// Example handlers for "Download" and "Delete" buttons
const handleDownload = (file) => {
  console.log("Downloading file:", file.title);
};

const handleDelete = (file) => {
  console.log("Deleting file:", file.title);
};
