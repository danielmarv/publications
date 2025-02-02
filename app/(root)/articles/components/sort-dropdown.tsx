"use client"

import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

interface SortDropdownProps {
  onSortChange: (value: string) => void
}

export function SortDropdown({ onSortChange }: SortDropdownProps) {
  return (
    <Select onValueChange={onSortChange}>
      <SelectTrigger className="w-[180px]">
        <SelectValue placeholder="Sort by" />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="date-desc">Newest First</SelectItem>
        <SelectItem value="date-asc">Oldest First</SelectItem>
        <SelectItem value="title-asc">Title A-Z</SelectItem>
        <SelectItem value="title-desc">Title Z-A</SelectItem>
      </SelectContent>
    </Select>
  )
}

