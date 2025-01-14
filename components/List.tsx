"use client"
import React, { useEffect, useState } from "react";
import { Button } from "./ui/button";
import Link from "next/link";
import { getPublications } from "@/lib/actions/pubs.actions";
import { constructDownloadUrl, constructFileUrl } from "@/lib/utils";
import mammoth from "mammoth";
import { TextAlignCenterIcon } from "@radix-ui/react-icons";

type Publication = {
  title: string;
  owner: Array<{
      fullName: string;
      email: string;
      avatar: string;
      accountId: string;
      role: string;
    }>;
    $collectionId: string;
  $createdAt: Date; 
  $databaseId: string;
  $id: string;
  $permissions: string[]; 
  $updatedAt: string;
  PubDownloadUrl: string;
  PubSize: number | null; 
  approvers: string[]; 
  citationCount: number; 
  description: string; 
  fileId: string;
  review: string[]; 
  status: string; 
  tags: string[]; 
};

const truncateString = (text: string, maxLength: number): string => {
  return text.length > maxLength ? text.slice(0, maxLength) + " . . ." : text;
};

const PublicationList = () => {

      const [publications, setpublications] = useState<Publication[]>([])
      const [ExtractedText, setExtractedText] = useState('');
      // const download = constructDownloadUrl()
      useEffect(() => {
            const handleGetPublications = async () => {
              try {
                const publication = await getPublications();
                console.log(publication);
                setpublications(publication);
              } catch (error) {
                console.error("Error fetching publications:", error);
              }
            };
        
            handleGetPublications();
          }, []); 
          useEffect(()=>{
            const handleExtractedData =   async()=>{
                  try {
                        const fileUrl = await constructFileUrl(publications[0].fileId);
                        const response = await fetch(fileUrl);
                        const arrayBuffer = await response.arrayBuffer();
                        const result = await mammoth.extractRawText({ arrayBuffer });
                        setExtractedText(result.value); // Extracted plain text
                        console.log(ExtractedText)
                      } catch (error) {
                        console.error("Error reading file:", error);
                      }
            }
            handleExtractedData();
          })


  return (
    <div className="max-w-6xl mx-auto p-4 sm:p-6 md:p-8">
      <h1 className="text-xl sm:text-2xl font-semibold mb-6 text-center md:text-left">
        Publications
      </h1>
      <ul className="space-y-6">
        {publications ? (publications.map((pub, index) => (
          <li
            key={index}
            className="border-b pb-6 last:border-none flex flex-col lg:flex-row lg:items-start lg:space-x-4"
          >
            <div className="flex-1">
              <h2 className="text-base sm:text-lg font-medium text-blue-600 hover:underline">
                {pub.$id ? (
                  <a href={pub.$id} target="_blank" rel="noopener noreferrer">
                    {pub.title}
                  </a>
                ) : (
                  pub.title
                )}
              </h2>

              <p className="text-sm text-gray-600 mb-1">
                Athour: {pub.owner.fullName} <span className="block md:inline px-6"> Created At: {new Date(pub.$createdAt).toLocaleDateString()}</span>
              </p>

              {pub.description && (
                <Link href={`home/${pub.title}`}>
                <p className="text-sm max-w-[800px] text-gray-700 hover:cursor-pointer mb-2">{pub.description}  {truncateString(ExtractedText, 225)}</p>
                </Link>

              )}

              {/* {pub.source && (
                <p className="text-xs italic text-gray-500">{pub.source}</p>
              )} */}

              <div className="text-xs text-gray-500 mt-2 flex flex-wrap gap-4">
                <span className="cursor-pointer hover:underline font-bold">Save</span>
                <span className="cursor-pointer hover:underline font-bold"> <TextAlignCenterIcon className="inline font-bold text-4xl"/> Cite</span>
                {(
                  <span className="hover:underline font-bold">
                    Cited by {pub.citationCount}
                  </span>
                )}
                { (
                  <a
                    href={""}
                    className="hover:underline text-blue-600"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    Related articles
                  </a>
                )}
              </div>
            </div>

            {(
              <div className="mt-4 lg:mt-0 lg:ml-auto">
                <a href={constructDownloadUrl(pub.fileId)} target="_blank" rel="noopener noreferrer">
                  <Button
                    variant="destructive"
                    className="text-sm text-white bg-rose-400 hover:bg-rose-500 px-4 py-1 rounded shadow-md w-full md:w-auto"
                  >
                    Download
                  </Button>
                </a>
              </div>
            )}
          </li>
        ))):(
            <div>
                  <h1>
                        No publications found
                  </h1>
            </div>
        )}
      </ul>
    </div>
  );
};

export default PublicationList;
