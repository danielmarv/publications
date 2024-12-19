import { ColumnDef } from "@tanstack/react-table";

// Define the columns for the table
export const createColumns = (handleDelete: (row: any) => void, handleEdit: (row: any) => void): ColumnDef<any, any>[] => [
  {
    header: "Department Name",
    accessorKey: "department", // Replace with the actual key for department name
    cell: (info) => info.getValue(),
  },
  {
    header: "Actions",
    id: "actions",
    cell: (info) => (
      <div className="flex gap-2">
        <button
          className="bg-blue-600 transition-colors text-white py-1 px-2 rounded-sm hover:bg-blue-500"
          onClick={() => handleEdit(info.row.original)}
        >
          Edit
        </button>
        <button
          className="bg-rose-600 transition-colors text-white py-1 px-2 rounded-sm hover:bg-rose-500"
          onClick={() => handleDelete(info.row.original)}
        >
          Delete
        </button>
      </div>
    ),
  },
];
