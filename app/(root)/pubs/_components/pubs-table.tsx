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
} from "@/components/ui/table"; // Import necessary UI components

// Generic DataTable component for any data type TData and TValue
interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[]; // Column definitions for the table
  data: TData[]; // Data for the table rows
  isLoading?: boolean; // Optional loading state
  noDataMessage?: string; // Optional message for no data available
}

export function DataTable<TData, TValue>({
  columns,
  data,
  isLoading = false,
  noDataMessage = "No results.",
}: DataTableProps<TData, TValue>) {
  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(), // Core row model for React Table
  });

  return (
    <div className="rounded-md border">
      {/* Display the table structure */}
      <Table>
        <TableHeader>
          {table.getHeaderGroups().map((headerGroup) => (
            <TableRow key={headerGroup.id}>
              {headerGroup.headers.map((header) => (
                <TableHead key={header.id}>
                  {/* Render column headers */}
                  {header.isPlaceholder
                    ? null
                    : flexRender(
                        header.column.columnDef.header,
                        header.getContext()
                      )}
                </TableHead>
              ))}
            </TableRow>
          ))}
        </TableHeader>
        <TableBody>
          {/* Loading State */}
          {isLoading ? (
            <TableRow>
              <TableCell colSpan={columns.length} className="h-24 text-center">
                <div className="animate-spin text-gray-500">Loading...</div>
              </TableCell>
            </TableRow>
          ) : (
            // Data Rows
            table.getRowModel().rows.length > 0 ? (
              table.getRowModel().rows.map((row) => (
                <TableRow key={row.id} data-state={row.getIsSelected() && "selected"}>
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>
                      {/* Render each cell */}
                      {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              // No Data Available State
              <TableRow>
                <TableCell colSpan={columns.length} className="h-24 text-center">
                  {noDataMessage}
                </TableCell>
              </TableRow>
            )
          )}
        </TableBody>
      </Table>
    </div>
  );
}
