"use client"

import { useState } from "react"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import { DatePicker } from "@/components/ui/date-picker"

interface FilterSidebarProps {
  categories: string[]
  onFilterChange: (filters: { categories: string[]; startDate: Date | null; endDate: Date | null }) => void
}

export function FilterSidebar({ categories, onFilterChange }: FilterSidebarProps) {
  const [selectedCategories, setSelectedCategories] = useState<string[]>([])
  const [startDate, setStartDate] = useState<Date | null>(null)
  const [endDate, setEndDate] = useState<Date | null>(null)

  const handleCategoryChange = (category: string, checked: boolean) => {
    const updatedCategories = checked
      ? [...selectedCategories, category]
      : selectedCategories.filter((c) => c !== category)
    setSelectedCategories(updatedCategories)
    onFilterChange({ categories: updatedCategories, startDate, endDate })
  }

  const handleDateChange = (start: Date | null, end: Date | null) => {
    setStartDate(start)
    setEndDate(end)
    onFilterChange({ categories: selectedCategories, startDate: start, endDate: end })
  }

  return (
    <div className="space-y-6">
      <div>
        <h3 className="mb-2 text-lg font-semibold">Categories</h3>
        {categories.map((category) => (
          <div key={category} className="flex items-center space-x-2">
            <Checkbox
              id={category}
              checked={selectedCategories.includes(category)}
              onCheckedChange={(checked) => handleCategoryChange(category, checked as boolean)}
            />
            <Label htmlFor={category}>{category}</Label>
          </div>
        ))}
      </div>
      <div>
        <h3 className="mb-2 text-lg font-semibold">Date Range</h3>
        <div className="space-y-2">
          <DatePicker
            selected={startDate}
            onChange={(date) => handleDateChange(date, endDate)}
            placeholderText="Start Date"
          />
          <DatePicker
            selected={endDate}
            onChange={(date) => handleDateChange(startDate, date)}
            placeholderText="End Date"
          />
        </div>
      </div>
    </div>
  )
}

