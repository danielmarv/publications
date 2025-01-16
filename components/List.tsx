'use client';

import React, { useEffect, useState } from 'react';
import { Button } from './ui/button';
import Link from 'next/link';
import { listPublications, UpdateCiteCount } from '@/lib/actions/pubs.actions';
import { constructDownloadUrl, constructFileUrl } from '@/lib/utils';
import mammoth from 'mammoth';
import { TextAlignCenterIcon } from '@radix-ui/react-icons';
import CiteModal from './CiteModal';

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
  extractedText:string;
};


const PublicationList = () => {
  const [publications, setpublications] = useState<Publication[]>([]);
  const [active, Setactive] = useState<string | null>(null);
  // const download = constructDownloadUrl()
  useEffect(() => {
    const handleGetPublications = async () => {
      try {
        const publication = await listPublications({
          searchText: '',
          limit: 10,
        });
        console.log(publication)
        setpublications(publication);
      } catch (error) {
        console.error('Error fetching publications:', error);
      }
    };

    handleGetPublications();
  }, []);
  useEffect(() => {
        const handleExtractedData = async () => {
          try {
            for (const publication of publications) {
              if (publication.fileId) {
                const fileUrl = constructFileUrl(publication.fileId);
                const response = await fetch(fileUrl);
                const arrayBuffer = await response.arrayBuffer();
                const result = await mammoth.extractRawText({ arrayBuffer });
                setpublications((prevPublications) =>
                  prevPublications.map((pub) =>
                    pub.fileId === publication.fileId
                      ? { ...pub, extractedText: result.value.slice(0,255)+" . . . " }
                      : pub
                  )
                );
                // console.log(result.value); 
              }
            }
          } catch (error) {
            console.error("Error reading file:", error);
          }
        };
        handleExtractedData();
      }, [publications]);

      const handleCiteModal = (pub_Id: string)=>{
        UpdateCiteCount(pub_Id)
        Setactive(pub_Id)
      }
      const handleClose = ()=>{
        Setactive(null)
      }
      
  return (
    <div className="mx-auto max-w-6xl p-4 sm:p-6 md:p-8">
      <h1 className="mb-6 text-center text-xl font-semibold sm:text-2xl md:text-left">
        Publications
      </h1>
      <ul className="space-y-6">
        {publications ? (
          publications.map((pub, index) => (
            <li
              key={index}
              className="flex flex-col border-b pb-6 last:border-none lg:flex-row lg:items-start lg:space-x-4"
            >
              <div className="flex-1">
                <h2 className="text-blue-600 text-base font-medium hover:underline sm:text-lg">
                  {pub.$id ? (
                    <a href={pub.$id} target="_blank" rel="noopener noreferrer">
                      {pub.title}
                    </a>
                  ) : (
                    pub.title
                  )}
                </h2>

                <p className="mb-1 text-sm text-gray-600">
                  Athour: {pub.owner.fullName}{' '}
                  <span className="block px-6 md:inline">
                    {' '}
                    Created At: {new Date(pub.$createdAt).toLocaleDateString()}
                  </span>
                </p>

                {pub.description && (
                  <Link href={`home/${pub.title}`}>
                    <p className="mb-2 max-w-[800px] text-sm text-gray-700 hover:cursor-pointer">
                      {pub.description} {truncateString(ExtractedText, 225)}
                    </p>
                  </Link>
                )}

                {
                        active && (<CiteModal handleClose={handleClose} pub_Id={active} />)
                }

                <div className="mt-2 flex flex-wrap gap-4 text-xs text-gray-500  ">
                  <span className="cursor-pointer font-bold hover:underline">
                    Save
                  </span>
                  <span className="cursor-pointer font-bold hover:underline">
                    {' '}
                    <TextAlignCenterIcon className="inline text-4xl font-bold" />{' '}
                    Cite
                  </span>
                  {
                    <span className="font-bold hover:underline">
                      Cited by {pub.citationCount}
                    </span>
                  }
                  {
                    <a
                      href={''}
                      className="text-blue-600 hover:underline"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      Related articles
                    </a>
                  }
                </div>
              </div>

              {
                <div className="mt-4 lg:ml-auto lg:mt-0">
                  <a
                    href={constructDownloadUrl(pub.fileId)}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <Button
                      variant="destructive"
                      className="w-full rounded bg-rose-400 px-4 py-1 text-sm text-white shadow-md hover:bg-rose-500 md:w-auto"
                    >
                      Download
                    </Button>
                  </a>
                </div>
              }
            </li>
          ))
        ) : (
          <div>
            <h1>No publications found</h1>
          </div>
        )}
      </ul>
    </div>
  );
};

export default PublicationList;
