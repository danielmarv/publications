import { ColumnDef } from "@tanstack/react-table";

// Define the columns for the table
export const columns: ColumnDef<any, any>[] = [
    {
        header: "Dapartment Name",
        accessorKey: "department",
        cell: (info) => info.getValue(),
    },
  {
    header: "Actions",
    id: "actions",
    cell: (info) => (
      <div className="flex">
        <button
          className="bg-red-500 text-black py-1 px-2 rounded"
          onClick={() => handleDelete(info.row.original)}>
          Delete
        </button>
      </div>
    ),
  },
];

const handleDelete = (file) => {
  console.log("Deleting file:", file.title);
};
