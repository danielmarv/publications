"use client";

import { useState, useEffect } from "react";
import Card from "./pubs-card";
import Image from "next/image";
import { GridIcon } from "lucide-react";
import { SearchBar } from "./search-bar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { getPublications } from "@/lib/actions/pubs.actions";
import { getCurrentUser } from "@/lib/actions/user.actions";

interface titleProps {
  title: string;
}

function Placeholder() {
  return (
    <div className="mt-6 flex size-full flex-col items-center justify-center">
      <Image
        alt="an image of a picture and directory icon"
        width="200"
        height="200"
        src="/empty.svg"
      />
      <div className="mt-4 text-center text-2xl">You have no publications, upload one now</div>
    </div>
  );
}

export function PublicationBrowser({ title }: titleProps) {
  const [role, setRole] = useState<string>("author");
  const [name, setName] = useState<string>("");
  const [isLoading, setIsLoading] = useState(true);
  const [publications, setPublications] = useState<Publication[]>([]); 
  const [query, setQuery] = useState("");
  const [type, setType] = useState("all");

  useEffect(() => {
    const fetchRoleAndPublications = async () => {
      const currentUser = await getCurrentUser();
      const fetchedRole = currentUser?.role || "author";
      const fetchedName = currentUser?.fullName || "";
      setRole(fetchedRole);
      setName(fetchedName);

      const fetchedPublications = await getPublications({
        ownerId: currentUser?.$id,
        role: fetchedRole,
        searchText: query,
        limit: 10,
      });

      setPublications(fetchedPublications || []);
    };

    fetchRoleAndPublications();
  }, [query]);

  const filteredPublications = publications.filter((publication) => {
    if (type === "all") return true;
    return publication.fileType.includes(type);
  });

  return (
    <div>
      <div className="mb-8 hidden items-center justify-between md:flex">
        <h1 className="text-4xl font-bold">{title}</h1>
        <SearchBar query={query} setQuery={setQuery} />
      </div>

      <div className="mb-8 flex flex-col gap-5 md:hidden">
        <h1 className="text-4xl font-bold">{title}</h1>
        <SearchBar query={query} setQuery={setQuery} />
      </div>

      <Tabs defaultValue="grid">
        <div className="flex flex-col-reverse items-start gap-4 md:flex-row md:items-center md:justify-between md:gap-0">
          <TabsList className="mb-2">
            <TabsTrigger value="grid" className="flex items-center gap-2">
              <GridIcon />
              Grid
            </TabsTrigger>
          </TabsList>

        </div>

        <TabsContent value="grid">
          <div className="grid grid-cols-1 gap-2 md:grid-cols-3 md:gap-4">
          {filteredPublications.length > 0 ? (
              filteredPublications.map((publication) => (
                <Card key={publication.$id} publication={publication} role={role} name={name}/>
              ))
            ) : (
              isLoading
            )}
          </div>
        </TabsContent>

      </Tabs>
      {filteredPublications.length === 0 && !isLoading && <Placeholder />}
    </div>
  );
}
