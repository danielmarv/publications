"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { Loader2, RowsIcon } from "lucide-react";
import { SearchBar } from "./search-bar";
import { DataTable } from "./deps-table";
import { columns } from "./column";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
// import {
//   Select,
//   SelectContent,
//   SelectItem,
//   SelectTrigger,
//   SelectValue,
// } from "@/components/ui/select";
// import { getPublications } from "@/lib/actions/pubs.actions";
import { getDepartments } from "@/lib/actions/department.actions";
import { Button } from "@/components/ui/button";

function Placeholder() {
  return (
    <div className="flex flex-col justify-center items-center w-full h-full mt-6">
      <Image
        alt="an image of a picture and directory icon"
        width="200"
        height="200"
        src="/empty.svg"
      />
      <div className="text-2xl mt-4 text-center">You have no publications, upload one now</div>
      <Button
      className="h4 h-[52px] items-center justify-center gap-4 lg:justify-center lg:w-[200px] lg:px-[30px] lg:rounded-full rounded-xl bg-red text-white hover:bg-amber-50 hover:text-black "
      >
        Write
      </Button>
    </div>
  );
}

export function DepartmentBrowser() {
  const [isLoading, setIsLoading] = useState(true);
  const [departments, setDepartments] = useState<Department[]>([]); 
  const [query, setQuery] = useState("");
  const [title] = useState("Departments");

  useEffect(() => {
    const fetchDepartments = async () => {
      setIsLoading(true);
      const departmentsData = await getDepartments({
        searchText: query,
        sort: "$createdAt-desc",
        limit: 20,
      });
      setDepartments(departmentsData);
      setIsLoading(false);
    };
  
    fetchDepartments();
    console.log(departments);
  }, [query]);


  return (
    <div>
      <div className="hidden md:flex justify-between items-center mb-8">
        <h1 className="text-4xl font-bold">{title}</h1>
        <SearchBar query={query} setQuery={setQuery} />
      </div>

      <div className="md:hidden flex flex-col gap-5 mb-8">
        <h1 className="text-4xl font-bold">{title}</h1>
        <SearchBar query={query} setQuery={setQuery} />
      </div>

      <Tabs defaultValue="table">
        <div className="flex flex-col-reverse gap-4 md:gap-0 md:flex-row md:justify-between md:items-center items-start">
          <TabsList className="mb-2">
            <TabsTrigger value="table" className="flex gap-2 items-center">
              <RowsIcon /> Table
            </TabsTrigger>
          </TabsList>

          {/* <div className="flex gap-2 items-center">
            <Label htmlFor="type-select">Type Filter</Label>
            <Select
              value={type}
              onValueChange={(newType) => {
                setType(newType);
              }}
            >
              <SelectTrigger id="type-select" className="w-[180px]">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All</SelectItem>
                <SelectItem value="image">Image</SelectItem>
                <SelectItem value="csv">CSV</SelectItem>
                <SelectItem value="pdf">PDF</SelectItem>
                <SelectItem value="ppt">PPT</SelectItem>
                <SelectItem value="pptx">PPTX</SelectItem>
                <SelectItem value="doc">DOCS</SelectItem>
                <SelectItem value="docx">DOCX</SelectItem>
                <SelectItem value="xlsx">EXCEL</SelectItem>
              </SelectContent>
            </Select>
          </div> */}
        </div>

        {isLoading && (
          <div className="flex flex-col gap-8 w-full items-center mt-12 md:mt-24">
            <Loader2 className="h-32 w-32 animate-spin text-gray-500" />
            <div className="text-2xl">Loading your publications...</div>
          </div>
        )}


        <TabsContent value="table">
          <DataTable columns={columns} data={departments} />
        </TabsContent>
      </Tabs>
      {departments.length === 0 && !isLoading && <Placeholder />}
    </div>
  );
}
