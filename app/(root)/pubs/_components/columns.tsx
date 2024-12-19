import { ColumnDef } from "@tanstack/react-table";
import { format } from "date-fns";

// Define the columns for the table
export const columns: ColumnDef<any, any>[] = [
  {
    header: "File Name",
    accessorKey: "title", // The key in the file data that represents the file name
    cell: (info) => (
      <a href={info.row.original.url} target="_blank" rel="noopener noreferrer">
        {info.getValue()}
      </a>
    ),
  },
  {
    header: "File Type",
    accessorKey: "type", // The key in the file data that represents the file type (e.g., image, pdf)
    cell: (info) => info.getValue(),
  },
  {
    header: "Upload Date",
    accessorKey: "createdAt", // The key in the file data that represents the file upload date
    cell: (info) => {
      const date = new Date(info.getValue());
      return format(date, "yyyy-MM-dd HH:mm");
    },
  },
  {
    header: "Favorites",
    accessorKey: "isFavorited", // Assuming this is a boolean field that indicates if the file is marked as a favorite
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

// Example handlers for "Download" and "Delete" buttons
const handleDownload = (file) => {
  console.log("Downloading file:", file.title);
};

const handleDelete = (file) => {
  console.log("Deleting file:", file.title);
};
