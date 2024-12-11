"use client";

import { useState, useEffect } from "react";
import Card from "./pubs-card";
import Image from "next/image";
import { GridIcon, Loader2, RowsIcon } from "lucide-react";
import { SearchBar } from "./search-bar";
import { DataTable } from "./pubs-table";
import { columns } from "./columns";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { getPublications } from "@/lib/actions/pubs.actions";  // Assuming correct imports

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
    </div>
  );
}

const dummyPublications = [
  {
    $id: "1",
    $createdAt: "2024-01-01T12:00:00Z",
    url: "https://example.com/publication1.pdf",
    type: "pdf",
    extension: "pdf",
    name: "Sample Publication 1",
    size: 102400, // 100 KB
    owner: {
      fullName: "John Doe",
    },
  },

];

export function PublicationBrowser() {
  const [isLoading, setIsLoading] = useState(true);
  const [publications, setPublications] = useState<Publication[]>([]); 
  const [query, setQuery] = useState("");  // Search query for publications
  const [type, setType] = useState("all");  // Type filter for file types
  const [title] = useState("Publications");  // Title of the page

  useEffect(() => {
    const fetchPublications = async () => {
      try {
        const ownerId = "some-owner-id"; // Replace with actual owner ID
        const fetchedPublications = await getPublications({ ownerId, searchText: query, limit: 10 });
        setPublications(fetchedPublications || []);
      } catch (error) {
        console.error("Failed to fetch publications", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchPublications();
  }, [query]); // Re-fetch publications when the query changes

  const filteredPublications = publications.filter((publication) => {
    if (type === "all") return true;  // No filtering
    return publication.fileType.includes(type);  // Filter by file type
  });

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

      <Tabs defaultValue="grid">
        <div className="flex flex-col-reverse gap-4 md:gap-0 md:flex-row md:justify-between md:items-center items-start">
          <TabsList className="mb-2">
            <TabsTrigger value="grid" className="flex gap-2 items-center">
              <GridIcon />
              Grid
            </TabsTrigger>
            <TabsTrigger value="table" className="flex gap-2 items-center">
              <RowsIcon /> Table
            </TabsTrigger>
          </TabsList>

          <div className="flex gap-2 items-center">
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
          </div>
        </div>

        {isLoading && (
          <div className="flex flex-col gap-8 w-full items-center mt-12 md:mt-24">
            <Loader2 className="h-32 w-32 animate-spin text-gray-500" />
            <div className="text-2xl">Loading your publications...</div>
          </div>
        )}

        <TabsContent value="grid">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-2 md:gap-4">
          {filteredPublications.length > 0 ? (
              filteredPublications.map((publication) => (
                <Card key={publication.$id} publication={publication} />
              ))
            ) : (
              isLoading
            )}
          </div>
        </TabsContent>

        <TabsContent value="table">
          <DataTable columns={columns} data={filteredPublications} />
        </TabsContent>
      </Tabs>
      {filteredPublications.length === 0 && !isLoading && <Placeholder />}
    </div>
  );
}
